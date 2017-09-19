import {Component} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import {QuestionData} from '../../../../models/events';
import {QuestionUpdate} from "../../../../store/question-update/question-update.reducers";
import * as fromRoot from '../../../../store/';
import * as fromUi from '../../../../store/ui/ui.actions';
import * as fromQuestionUpdate from '../../../../store/question-update/question-update.actions';
import {LiveQuestionService} from "./live-question.service";

@Component({
    selector: 'app-livequestions-table',
    template: `
<div class="panel panel-default" style="margin: 0 10px 10px 10px;">
    <div class="panel-heading">Live Questions ({{ (questionUpdate$ | async)?.length ? (questionUpdate$ | async)?.length : 0  }})</div>
    <div class="panel-body">
        <div class="table-responsive">
            <table class="table table-bordered" style="font-size: 10px;height: 10px">
                <thead>
                    <tr>
                        <th>Phone#</th>
                        <th>Name</th>
                        <th>City</th>
                        <th>State</th>
                        <th>Question</th>
                        <th>Notes</th>
                        <th>Rating</th>
                        <th>Raised</th>
                    </tr>
            </thead>
                <tbody>
                   <tr *ngFor="let question of questionUpdate$ | async"
                            [class.active]="question.id === (selectedQuestion$ | async)?.id"
                            (click)="select(question.id)">
                        <td>{{question.phoneNo}}</td>
                        <td>{{question.name}}</td>
                        <td>{{question.addressCity}}</td>
                        <td>{{question.addressState}}</td>  
                        <td>{{question.question}}</td>                 
                        <td>{{question.screenerNotes}}</td>            
                        <td>{{question.rating}}</td>
                        <td>{{question.handRaisedTimestamp | date:'shortTime'}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <app-live-questions-edit *ngIf="(selectedQuestion$ | async)?.id"
        [question]="selectedQuestion$ | async"
        (mute)="mute($event)"
        (saveQuestion)="updateQuestion($event)"
        (unmute)="unmute($event)"
        (volume)="volume($event)"
        (hold)="hold($event)"
        (unhold)="unhold($event)"
        (hangup)="hangup($event)"
        (cancel)="deselect($event)">
    </app-live-questions-edit>
    <!--app-livequestions *ngIf="(selectedQuestion$ | async)?.id"
    [questionUpdate$]="selectedQuestion$ | async"
    (mute)="mute($event)"
    (unmute)="unmute($event)"
    (hold)="hold($event)"
    (unhold)="unhold($event)"
    (hangup)="hangup($event)">    
</app-livequestions-->
    </div>
    `,
})
export class LiveTableQuestionsComponent {
    constructor(private store: Store<fromRoot.State>, private liveQuestion: LiveQuestionService) {
        this.questionUpdate$ = this.store.select(fromRoot.getQuestionUpdateArray);
        this.selectedQuestion$ = this.store.select(fromRoot.getSelectedQuestion)
            .do(this.deselectOnDisconnect.bind(this)); // Deselect if selection is disconnecting.
    }

    public questionUpdate$: Observable<QuestionUpdate[]>;
    public selectedQuestion$: Observable<QuestionUpdate | undefined>;
    public selectedQuestion: QuestionData;

    ngOnInit() {
        this.questionUpdate$.subscribe((qData) => {
            console.log('on live q table data ', qData);
        });

        this.selectedQuestion$.subscribe((selectedQuestion: {id: number}) => {
            console.log('on live q table selected ', selectedQuestion);

            if (selectedQuestion && selectedQuestion.id) {
                console.log('looking for live question ', this.selectedQuestion);
                this.liveQuestion.lookUpQuestion(selectedQuestion.id)
                    .then((res: any) => {
                        console.log('lookup success ', res.data);
                        this.selectedQuestion = res.data;
                    });
            } else {
                this.selectedQuestion = null;
            }
        });
    }

    private deselectOnDisconnect(question: QuestionData): void {
        if (!!question && question.status === 16) {
            //this.deselect();
        }
    }

    select(questionId: number): void {
        this.store.dispatch(new fromUi.SelectQuestion({id: questionId}));
    }

    deselect(): void {
        this.store.dispatch(new fromUi.DeselectQuestion());
    }

    mute(): void {
        this.store.dispatch(new fromQuestionUpdate.MuteStart(this.selectedQuestion));
    }

    unmute(): void {
        this.store.dispatch(new fromQuestionUpdate.UnmuteStart(this.selectedQuestion));
    }

    hold(): void {
        this.store.dispatch(new fromQuestionUpdate.HoldStart(this.selectedQuestion));
    }

    unhold(): void {
        this.store.dispatch(new fromQuestionUpdate.UnholdStart(this.selectedQuestion));
    }

    hangup(): void {
        this.store.dispatch(new fromQuestionUpdate.HangupStart(this.selectedQuestion));
    }

    volume({volume}: {volume: number}): void {
        this.store.dispatch(new fromQuestionUpdate.SetVolumeStart({data: this.selectedQuestion, volume: volume}));
    }

    doneQuestion(): void {
        this.store.dispatch(new fromQuestionUpdate.DoneStart(this.selectedQuestion));
    }

    updateQuestion(question: QuestionUpdate): void {
        this.store.dispatch(new fromQuestionUpdate.UpdateStart(Object.assign({}, question)));
    }

}
