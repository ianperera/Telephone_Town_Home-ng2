import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/filter';

import { EndpointsService } from '../../services/endpoints';
import { ConfigService } from '../../services/config';

import * as fromRoot from '../';
import * as fromPolls from './polls.actions';
import { CONF_STATUS_UPDATE, ConfStatusUpdate } from '../conference/conference.actions';

@Injectable()
export class PollsEffects {
  @Effect() // Kickoff a PollCheck whenever confStatusUpdates come through
  redirectConfStatus$: Observable<Action> = this.actions$
    .ofType(CONF_STATUS_UPDATE)
    .map((action: ConfStatusUpdate) => new fromPolls.PollCheck(action.payload))

  @Effect() // Kickoff a PollUpdateStart if we have new data to get
  pollCheck$: Observable<Action> = this.actions$
    .ofType(fromPolls.POLL_CHECK)
    .withLatestFrom(this.store.select(fromRoot.getPollsState), (_, s) => s) // We need the current pollState
    .filter(pollState => pollState.openPollId !== -1 && pollState.prevPollId !== -1) // If cur & prev are -1 there is no new data
    .map(() => new fromPolls.PollUpdateStart()); // Map to the update start action

  @Effect() // Make an http call to get poll stats
  pollUpdate$: Observable<Action> = this.actions$
    .ofType(fromPolls.POLL_UPDATE_START)
    .switchMap(() => this.endpoints.getPollStats()
      .map(pollStats => new fromPolls.PollUpdateSuccess({pollStats}))
      .catch(error => of(new fromPolls.PollUpdateFailure({error})))
    );

  @Effect()
  pollOpen$: Observable<Action> = this.actions$
    .ofType(fromPolls.POLL_OPEN_START)
    .mergeMap((action: fromPolls.PollOpenStart) => this.endpoints.openPoll(action.payload)
      .map(pollStats => new fromPolls.PollOpenSuccess(pollStats))
      .catch(error => of(new fromPolls.PollOpenFailure({params: action.payload, error})))
    );

  @Effect()
  pollCloseActive$: Observable<Action> = this.actions$
    .ofType(fromPolls.POLL_CLOSE_ACTIVE_START)
    .mergeMap((action: fromPolls.PollCloseActiveStart) => this.endpoints.closePoll()
      .map(pollStats => new fromPolls.PollCloseActiveSuccess(pollStats))
      .catch(error => of(new fromPolls.PollCloseActiveFailure({error})))
    );

  @Effect()
  pollSave$: Observable<Action> = this.actions$
    .ofType(fromPolls.POLL_SAVE_START)
    .map((action: fromPolls.PollSaveStart) => action.payload)
    .mergeMap(({poll, conferenceId}) => this.endpoints.savePoll(poll, conferenceId)
      .map(poll => new fromPolls.PollSaveSuccess())
      .catch(error => of(new fromPolls.PollSaveFailure({poll, conferenceId, error})))
    );

  @Effect()
  pollDelete$: Observable<Action> = this.actions$
    .ofType(fromPolls.POLL_DELETE_START)
    .map((action: fromPolls.PollDeleteStart) => action.payload.pollId)
    .mergeMap(pollId => this.endpoints.deletePoll(pollId)
      .map(() => new fromPolls.PollDeleteSuccess({pollId}))
      .catch(error => of(new fromPolls.PollDeleteFailure({pollId, error})))
    );

  constructor(
    private actions$: Actions,
    private endpoints: EndpointsService,
    private config: ConfigService,
    private store: Store<fromRoot.State>,
  ) {}
}
