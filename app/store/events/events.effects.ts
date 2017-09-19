import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { from } from 'rxjs/observable/from';
import { timer } from 'rxjs/observable/timer';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { uniqBy, groupBy } from 'lodash';

import { EndpointsService } from '../../services/endpoints';
import { ConfigService } from '../../services/config';

import * as events from '../../models/events';
import * as fromRoot from '../';
import * as fromEvents from './events.actions';
import * as fromParticipants from '../participants/participants.actions';
import * as fromChat from '../chat/chat.actions';
import * as fromConf from '../conference/conference.actions';
import * as fromCampaign from '../campaign/campaign.actions';
import * as fromListeners from '../listeners/listeners.actions';
import * as fromQuestionUpdate from '../question-update/question-update.actions';

/**
 * A mapping function that maps a StreamEvent to an appropriate Action.
 * There is probably a better way to do this, but for now this is
 * clean enough. This could be pulled into a separate file.
 * @param event StreamEvent
 */
function eventMap(event: events.StreamEvents): Action {
    switch (event.type) {
        case 'sdConfPartUpdateEvent':
            return new fromParticipants.Update(event.participant);
        case 'sdConfPartRemovedEvent':
            return new fromParticipants.Remove({id: event.participantId});
        case 'sdConfPartAudioEvent':
            return new fromParticipants.Audio(event.audioLevel);

        case 'sdConversationMessage':
            return new fromChat.ChatReceiveMessage(event);

        case 'sdConfState':
            return new fromConf.ConfStatusUpdate(event);

        case 'sdCampaignStats':
            return new fromCampaign.CampaignStatsUpdate(event);

        case 'sdListenerSummary':
            return new fromListeners.ListenersUpdate(event);

        case 'sdQuestionUpdate':
            let question = event.question;
            return new fromQuestionUpdate.Update(question);

        default:
            return new fromEvents.Unknown(event);
    }
}

@Injectable()
export class EventsEffects {
    @Effect() // Start polling by initiating an undelayed http call
    startPolling$: Observable<Action> = this.actions$
        .ofType(fromEvents.POLLING_START)
        .map((a: fromEvents.PollStart) => a.payload.conferenceId) // Grab the conference id from payload
        .switchMap(conferenceId => this.endpoints.pollEvents(conferenceId, true) // Start http call
            .map(events => new fromEvents.PollSuccess({conferenceId, events})) // Map events to success action
            .catch(error => of(new fromEvents.PollFailure({conferenceId, error})))); // Catch the failure

    @Effect() // Map POLLING_END to a PollCancel to stop inflight polling
    cancelPolling$: Observable<Action> = this.actions$
        .ofType(fromEvents.POLLING_END)
        .map(a => new fromEvents.PollCancel());

    @Effect() // Map POLL_SUCCESS and POLL_FAILURE to new POLL_STARTs
    startPollAggregator$: Observable<Action> = this.actions$
        .ofType(fromEvents.POLL_SUCCESS, fromEvents.POLL_FAILURE)
        .map(a => new fromEvents.PollStart({conferenceId: a.payload.conferenceId}));

    @Effect() // Start an event poll
    pollStart$: Observable<Action> = this.actions$
        .ofType(fromEvents.POLL_START)
        .map((a: fromEvents.PollStart) => a.payload.conferenceId) // Grab the conference id from our payload
        .switchMap(conferenceId => timer(this.config.polling.heartbeat) // Wait a tick
            .takeUntil(this.actions$.ofType(fromEvents.POLL_CANCEL)) // Cancel inflight or timer if we cancel polling
            .switchMap(() => this.endpoints.pollEvents(conferenceId) // Start the http call
                .map(events => new fromEvents.PollSuccess({conferenceId, events})) // Kick out a success action
                .catch(e => of(new fromEvents.PollFailure({conferenceId, error: e}))))); // Kick out an error action

    @Effect() // Dispatch events retrieved from a successful poll
    dispatchEvents$: Observable<Action> = this.actions$
        .ofType(fromEvents.POLL_SUCCESS)
        .map((a: fromEvents.PollSuccess) => a.payload.events) // Grab StreamEvent[]
        .map(e => e.map(eventMap)) // Map StreamEvent[] to Action[]
        .mergeMap(e => from(e)); // Lift Action[] into Observable<Action>

    constructor(private actions$: Actions,
                private endpoints: EndpointsService,
                private config: ConfigService,) {
    }
}
