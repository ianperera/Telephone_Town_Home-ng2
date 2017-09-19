import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions, toPayload } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { EndpointsService } from '../../services/endpoints';
import { ConferenceSetup } from '../../models/conference';
import * as conference from './conference.actions';
import * as fromEvents from '../events/events.actions';

@Injectable()
export class ConferenceEffects {
  @Effect() // API call to start, stop, or pause a conference
  conferenceControl$: Observable<Action> = this.actions$
    .ofType(conference.CONF_CONTROL_START)
    .map((a: conference.ConfControlStart) => a.payload)
    .concatMap(action => this.endpoints.confControl(action)
      .map(() => new conference.ConfControlSuccess())
      .catch(error => of(new conference.ConfControlFailure({action, error})))
    );

  @Effect() // API call to get conference setup
  getConferenceSetup$: Observable<Action> = this.actions$
    .ofType(conference.CONF_GET_SETUP_START)
    .switchMap(() => this.endpoints.getConfSetup()
      .map(conferenceSetup => new conference.ConfGetSetupSuccess(conferenceSetup))
      .catch(error => of(new conference.ConfGetSetupFailure({error})))
    );

  @Effect() // Map successful get conf setup to a start poll so we can dispatch one action to init conf
  startPolling$: Observable<Action> = this.actions$
    .ofType(conference.CONF_GET_SETUP_SUCCESS) // Should only happen once
    .map(toPayload) // Grab Payload
    .map((setup: ConferenceSetup) => setup.eventStreamId) // Extract eventStreamId
    .map(conferenceId => new fromEvents.PollingStart({conferenceId})); // Start polling

  @Effect() // Stop polling on conference exit
  conferenceExit$: Observable<Action> = this.actions$
    .ofType(conference.CONF_EXIT)
    .map(() => new fromEvents.PollingEnd());

  constructor(
    private actions$: Actions,
    private endpoints: EndpointsService,
  ) { }
}
