import {AfterViewInit, Component, OnInit, OnDestroy, ViewChild, EventEmitter, Output, Input} from '@angular/core';
import {EventService} from "../../../../shared/event-streamer/events.service";
import {Subscription} from "rxjs";
import {Modal} from 'angular2-modal/plugins/bootstrap';

import {Observable} from 'rxjs/Observable';
import {last} from 'lodash';

import {Store} from '@ngrx/store';
import * as fromRoot from '../../../../store/';
import {ConfGetSetupStart, ConfExit} from '../../../../store/conference/conference.actions';
import {ConferenceSetup} from '../../../../models/conference';
import {ListenerSummaryEvent, CampaignStatsEvent, ConferenceStatusEvent, QuestionData} from '../../../../models/events';
import {QuestionUpdate} from "../../../../store/question-update/question-update.reducers";
import * as fromUi from '../../../../store/ui/ui.actions';
import * as fromQuestionUpdate from '../../../../store/question-update/question-update.actions';
import {LiveQuestionService} from "./live-question.service";

@Component({
    selector: 'app-livequestions',
    templateUrl: 'components/control/control-components/live-questions/live-questions.tmpl.html'
})
export class LiveQuestionsComponent implements OnInit {
    public questionUpdate$: Observable<QuestionUpdate[]>;
    public selectedQuestion$: Observable<QuestionUpdate | undefined>;
    public confSetup$: Observable<ConferenceSetup>;
    public confStatus$: Observable<ConferenceStatusEvent>;
    public confInitialized$: Observable<boolean>;
    public minutesLeft$: Observable<number>;
    public listenerStats$: Observable<ListenerSummaryEvent[]>;
    public latestCampaignStats$: Observable<CampaignStatsEvent>;
    public pollStats$: Observable<any>;
    public listenerStatsLastTen$: Observable<ListenerSummaryEvent[]>;
    public selectedQuestion: QuestionData;

    constructor(private eventService: EventService,
                private modal: Modal,
                private liveQuestion: LiveQuestionService,
                private store: Store<fromRoot.State>) {
        this.confSetup$ = this.store.select(fromRoot.getConfSetup);
        this.confStatus$ = this.store.select(fromRoot.getConfStatus);
        this.confInitialized$ = this.store.select(fromRoot.getConfInitialized);
        this.minutesLeft$ = this.store.select(fromRoot.getMinutesLeft);
        this.listenerStats$ = this.store.select(fromRoot.getListenerStats)
        this.latestCampaignStats$ = this.store.select(fromRoot.getCampaignStats)
            .map(stats => last(stats)); // Last entry in stats array is latest campaign stats.

        this.listenerStatsLastTen$ = this.store.select(fromRoot.getListenerStats)
            .map(stats => stats.slice(-10));

        this.pollStats$ = this.store.select(fromRoot.getPollsState);
        this.questionUpdate$ = this.store.select(fromRoot.getQuestionUpdateArray);
        this.selectedQuestion$ = this.store.select(fromRoot.getSelectedQuestion)
            .do(this.deselectOnDisconnect.bind(this)); // Deselect if selection is disconnecting.
        console.log('MinuteLeft: ', this.minutesLeft$);
    }

    ngOnInit() {
        this.questionUpdate$.subscribe((qData) => {
            console.log('on live q main data ', qData);
        });

        this.selectedQuestion$.subscribe((selectedQuestion: {id: number}) => {
            console.log('on live q main selected ', selectedQuestion);

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
        if (!!question && question.status === 16) {
            // this.deselect();
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

}
