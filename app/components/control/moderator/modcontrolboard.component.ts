import {AfterViewInit, Component, OnInit, OnDestroy, ViewChild, EventEmitter, Output} from '@angular/core';
import {EventService} from "../../../shared/event-streamer/events.service";
import {Subscription} from "rxjs";
import {MainControlService} from '../maincontrol.service';
import {Modal} from 'angular2-modal/plugins/bootstrap';

import { Observable } from 'rxjs/Observable';
import { last } from 'lodash';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../../store/';
import { ConfGetSetupStart, ConfExit } from '../../../store/conference/conference.actions';
import { ConferenceSetup } from '../../../models/conference';
import { ListenerSummaryEvent, CampaignStatsEvent, ConferenceStatusEvent, QuestionData } from '../../../models/events';
import { Participant } from '../../../store/participants/participants.reducers';

import * as EventTypes from '../../../shared/event-streamer/event.interfaces';
//import {ConferenceSetup} from "../../calendar/conference.datatypes";
import {ChatComponent} from "../control-components/chat/chat.component";
import {BasicControlComponent} from "../control-components/basic-control/basic-control.component";
import {PollingComponent} from "../control-components/polling/polling.component";
import {ListenersComponent} from "../control-components/listeners/listeners.component";
import {CallParticipantComponent} from "../control-components/call-participant/call-participant.component";
import {CallProgressComponent} from "../control-components/call-progress/call-progress.component";
import {LiveQuestionsComponent} from "../control-components/live-questions/live-questions.component";
import {setTimeout} from "timers";
import { AuthService } from "../../../auth.service";

/**
 * Goals for using ngrx:
 * 1. Remove ViewChild references to make this component a little dumber
 * 2. Access store observables in this component
 * 3. Pass values to child components using 'asdf$ | async'
 * 4. Get rid of switch statement in this component
 */

@Component({
    selector: 'app-modcontrolboard',
    templateUrl: 'components/control/moderator/modControlBoardComponent.tmpl.html',
    styleUrls: ['components/control/moderator/modcontrolboard.css']
})
export class ModControlBoardComponent implements OnInit, OnDestroy {
    @ViewChild(ChatComponent) chatComponent: ChatComponent;
    @ViewChild(BasicControlComponent) basicControlComponent: BasicControlComponent;
    @ViewChild(PollingComponent) pollingComponent: PollingComponent;
    @ViewChild(ListenersComponent) listenersComponent: ListenersComponent;
    @ViewChild(CallParticipantComponent) callParticipantComponent: CallParticipantComponent;
    @ViewChild(CallProgressComponent) callProgressComponent: CallProgressComponent;
    @ViewChild(LiveQuestionsComponent) liveQuestionsComponent: LiveQuestionsComponent;
    @Output() refreshStream: EventEmitter<string> = new EventEmitter<string>();

    private eventSubscription: Subscription;
    apiEvents: any[] = []; // It's for data use
    private eventList: Array<EventTypes.IStreamEvent> = [];
    protected confData: ConferenceSetup;

    public confSetup$: Observable<ConferenceSetup>;
    public confStatus$: Observable<ConferenceStatusEvent>;
    public confInitialized$: Observable<boolean>;
    public participants$: Observable<Participant[]>;
    public minutesLeft$: Observable<number>;
    public listenerStats$: Observable<ListenerSummaryEvent[]>;
    public latestCampaignStats$: Observable<CampaignStatsEvent>;
    public pollStats$: Observable<any>;
    public raisedHandQuestions$: Observable<QuestionData[]>;
    public screenedQuestions$: Observable<QuestionData[]>;
    public ondeckQuestions$: Observable<QuestionData[]>;
    public liveQuestions$: Observable<QuestionData[]>;
    public authData;

    public listenerStatsLastTen$: Observable<ListenerSummaryEvent[]>;
    liveview: boolean = true;
    constructor(
        private eventService: EventService,
        private modal: Modal,
        private mainControlService: MainControlService,
        private authService: AuthService,
        private store: Store<fromRoot.State>
    ) {
        this.confSetup$ = this.store.select(fromRoot.getConfSetup);
        this.confStatus$ = this.store.select(fromRoot.getConfStatus);
        this.confInitialized$ = this.store.select(fromRoot.getConfInitialized);
        this.participants$ = this.store.select(fromRoot.getParticipantArray);
        this.minutesLeft$ = this.store.select(fromRoot.getMinutesLeft);
        this.listenerStats$ = this.store.select(fromRoot.getListenerStats)
        this.latestCampaignStats$ = this.store.select(fromRoot.getCampaignStats)
            .map(stats => last(stats)); // Last entry in stats array is latest campaign stats.

        this.listenerStatsLastTen$ = this.store.select(fromRoot.getListenerStats)
            .map(stats => stats.slice(-10));

        this.pollStats$ = this.store.select(fromRoot.getPollsState);
        this.raisedHandQuestions$ = this.store.select(fromRoot.getRaisedHandQuestionUpdate);
        this.screenedQuestions$ = this.store.select(fromRoot.getScreenedQuestionUpdate);
        this.ondeckQuestions$ = this.store.select(fromRoot.getOnDeckQuestionUpdate);
        this.liveQuestions$ = this.store.select(fromRoot.getQuestionUpdateArray);
        this.authData = this.authService.getAuthData();
    }

    ngOnInit() {
        /**
         * This initializes the conference.
         * Get's conference setup and on a success will start event polling
         */
        this.store.dispatch(new ConfGetSetupStart());
    }

    ngOnDestroy() {
        /**
         * This will exit the conference, clear out the conf state tree
         * and dispatch a polling end action
         */
        this.store.dispatch(new ConfExit());
    }

    toggleVisibility(event){
        this.liveview = event.target.checked;
    }

    unsubscribe(): void {
        if (this.eventSubscription) {
            this.eventSubscription.unsubscribe();
            this.eventList = [];
        }

        this.basicControlComponent.updateControlsForUnsubscribe();
    }

    subscribe(): void {
        if (this.eventSubscription) {
            this.eventSubscription.unsubscribe();
        }
        this.eventSubscription = this.eventService.eventStream.subscribe(
            (data: any) => {
                this.eventList.push(data);
                // console.log('event type: ', data.type);
                // console.log("data: ", data);
                // console.log("conferenceEvent: ", EventTypes.isConferenceEvent(data));

                switch (data.type) {
                    /*
                    case 'sdConversationMessage':
                        this.chatComponent.showMessage(data);
                        break;
                    case 'sdConfPartUpdateEvent':
                        this.basicControlComponent.UpdateParticipant(data);
                        break;
                    case 'sdCampaignStats':
                        this.basicControlComponent.minutesLeft(data);
                        this.callParticipantComponent.activeStartofParticipant(data);
                        this.callParticipantComponent.activeStoptofParticipant(data);
                        this.callParticipantComponent.activeAbortofParticipant(data);
                        this.callProgressComponent.callProgressData(data);
                        this.callProgressComponent.firstPassComplete(data);
                        break;
                    case 'sdConfState':
                        this.basicControlComponent.activePoll(data);
                        this.pollingComponent.activePoll(data);
                        this.basicControlComponent.currentButtonControls(data);
                        this.basicControlComponent.updateControlButtons(data);
                        this.callProgressComponent.liveEvent(data);
                        break;
                    */
                    case 'sdListenerSummary':
                        this.listenersComponent.updateGraphData(data);
                        break;
                }

                // console.log('after switch');
            },
            err => console.error("error: ", err),
            () => console.log("done")
        );

        this.basicControlComponent.updateControlsForSubscribe();
    }

    doRefreshStream(event) {
        this.refreshStream.emit(event);
    }
}
