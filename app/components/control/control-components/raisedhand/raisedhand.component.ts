import {Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import * as fromRoot from '../../../../store';
import * as fromUi from '../../../../store/ui/ui.actions';
import * as fromQuestionUpdate from '../../../../store/question-update/question-update.actions';
import {LiveQuestionService} from "../live-questions/live-question.service";
import {QuestionData} from "../../../../models/events";

@Component({
    selector: 'app-raisedhand',
    template: `
<div class="panel panel-default" style="margin: 0 10px 10px 10px;">
    <div class="panel-body">
        <div class="table-responsive">
            <table class="table table-bordered" style="font-size: 10px;height: 10px" 
            [class.highlight_blue]="(questionUpdate$ | async)?.length > 0">
                <thead>
                    <tr>
                        <th>Phone#</th>
                        <th>Name</th>
                        <th>City</th>
                        <th>State</th>
                        <th>Status</th>
                        <th>Screener</th>
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
                        <td>un-screened: {{question.screenerNotes}}</td>                 
                        <td>{{question.screenerName}}</td>
                        <td>{{question.handRaisedTimestamp | date:'shortTime'}}</td>
                    </tr>
                </tbody>
            </table>
            </div>
            <app-raisedhand-edit *ngIf="(selectedQuestion$ | async)?.id"
                [question]="selectedQuestion$ | async"
                (ondeck)="ondeck($event)"
                (live)="live($event)"
                (remove)="remove($event)"       
                (edit)="edit($event)"
                (cancel)="deselect($event)">
            </app-raisedhand-edit>
         </div>
    </div>
    `,
    styleUrls: ['components/control/control-components/raisedhand/raisedhand.css'],
})
export class RaisedHandComponent {
    public questionUpdate$: Observable<QuestionData[]>;
    public selectedQuestion$: Observable<QuestionData | undefined>;
    public selectedQuestion: QuestionData;
    question: QuestionData;

    constructor(private store: Store<fromRoot.State>, private liveQuestion: LiveQuestionService) {
        this.questionUpdate$ = this.store.select(fromRoot.getRaisedHandQuestionUpdate);
        this.selectedQuestion$ = this.store.select(fromRoot.getRaisedHandSelectedQuestion)
            .do(this.deselectOnDisconnect.bind(this)); // Deselect if selection is disconnecting.
    }

    ngOnInit() {
        this.questionUpdate$.subscribe((qData) => {
            console.log('on raised hand q data ', qData);
        });

        this.selectedQuestion$.subscribe((selectedQuestion: {id: number}) => {
            console.log('on raised q selected ', selectedQuestion);
            if (selectedQuestion && selectedQuestion.id) {
                this.liveQuestion.lookUpQuestion(selectedQuestion.id)
                    .then((res: any) => {
                        this.selectedQuestion = res.data;
                    });
            } else {
                this.selectedQuestion = null;
            }
        });
    }

    private deselectOnDisconnect(question: QuestionData): void {
        if (!!question && (question.status === 1 || question.status === 2)) {
            // this.deselect();
        }
    }

    select(questionId: number): void {
        this.store.dispatch(new fromUi.SelectRaisedHandQuestion({id: questionId}));
    }

    deselect(): void {
        this.store.dispatch(new fromUi.DeselectRaisedHandQuestion());
    }

    edit(question: QuestionData): void {
        this.store.dispatch(new fromQuestionUpdate.UpdateStart(Object.assign({}, question)));
    }

    ondeck(): void {
        this.store.dispatch(new fromQuestionUpdate.OnDeckStart({id: this.selectedQuestion.id}));
        this.deselect();
    }

    live(): void {
        this.store.dispatch(new fromQuestionUpdate.BringLiveStart({id: this.selectedQuestion.id}));
        this.deselect();
    }

    remove(): void {
        this.store.dispatch(new fromQuestionUpdate.RemoveQuestionStart({id: this.selectedQuestion.id}));
    }
}
