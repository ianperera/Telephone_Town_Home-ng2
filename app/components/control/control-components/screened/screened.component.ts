import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import * as fromRoot from '../../../../store';
import * as fromUi from '../../../../store/ui/ui.actions';
import * as fromQuestionUpdate from '../../../../store/question-update/question-update.actions';
import {QuestionData} from "../../../../models/events";
import {LiveQuestionService} from "../live-questions/live-question.service";

@Component({
    selector: 'app-screened',
    template: `
    <div class="panel panel-default" style="margin: 0 10px 10px 10px;">
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
                            <th (click)="toggleRatingOrder()" style="cursor: pointer;">Rating {{ (screenedQuestionOrder$ | async) === 'desc' ? "&#x2193;" : "&#x2191;" }}</th>
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
                            <td>
                            <star-rating-comp [starType]="'icon'" 
                                [hoverEnabled]="true"                               
                                (onClick)="onRatingClick($event, question)" 
                                [rating]="getRatingToDisplay(question.rating)"></star-rating-comp>
                            </td>
                            <td>{{question.handRaisedTimestamp | date:'shortTime'}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <app-screened-edit *ngIf="(selectedQuestion$ | async)?.id"
                [question]="selectedQuestion$ | async"
                (ondeck)="ondeck($event)"
                (live)="live($event)"
                (remove)="remove($event)"       
                (edit)="edit($event)"
                (cancel)="deselect($event)">
            </app-screened-edit>
        </div>
     </div>
    `,
})
export class ScreenedComponent {
    public questionUpdate$: Observable<QuestionData[]>;
    public selectedQuestion$: Observable<QuestionData | undefined>;
    public screenedQuestionOrder$: Observable<string>;
    public screenedQuestionOrder: string;
    public selectedQuestion: QuestionData;
    question: QuestionData;

    constructor(private store: Store<fromRoot.State>, private liveQuestion: LiveQuestionService) {
        this.questionUpdate$ = this.store.select(fromRoot.getScreenedQuestionUpdate);
        this.selectedQuestion$ = this.store.select(fromRoot.getScreenedSelectedQuestion)
            .do(this.deselectOnDisconnect.bind(this)); // Deselect if selection is disconnecting.
        this.screenedQuestionOrder$ = this.store.select(fromRoot.getScreenedQuestionOrder);
    }

    ngOnInit() {
        this.screenedQuestionOrder$.subscribe((order) => {
            console.log('screened order ', order);
            this.screenedQuestionOrder = order;
        });

        this.questionUpdate$.subscribe((qData) => {
            console.log('on screened q data ', qData);
        });

        this.selectedQuestion$.subscribe((selectedQuestion: {id: number}) => {
            console.log('on screened q selected ', selectedQuestion);

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
        if (!!question && question.status === 4) {
            // this.deselect();
        }
    }

    select(questionId: number): void {
        this.store.dispatch(new fromUi.SelectScreenedQuestion({id: questionId}));
    }

    deselect(): void {
        this.store.dispatch(new fromUi.DeselectScreenedQuestion());
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

    getRatingToDisplay(rating) {
        if (rating && rating > 99) {
            rating = rating - 100;
        } else if (!rating) {
            rating = 0;
        }

        return rating;
    }

    onRatingClick(event, question: QuestionData) {
        this.store.dispatch(new fromQuestionUpdate.UpdateStart(Object.assign(question, {rating: event.rating + 100})));
    }

    toggleRatingOrder() {
        let order = this.screenedQuestionOrder;
        order = order === 'desc' ? 'asc' : 'desc';
        this.store.dispatch(new fromUi.SetScreenedQuestionOrder({order: order}));
    }
}
