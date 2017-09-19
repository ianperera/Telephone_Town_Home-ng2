import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { EndpointsService } from '../../services/endpoints';
import * as p from './participants.actions';

@Injectable()
export class ParticipantEffects {

  @Effect()
  holdStart$: Observable<Action> = this.actions$
    .ofType(p.HOLD_START)
    .do(a => console.log('Participant start hold effect', a))
    .map((a: p.HoldStart) => a.payload.id)
    .mergeMap(id => this.endpoints.participantHold(id)
      .map(participant => new p.HoldSuccess(participant))
      .catch(error => of(new p.HoldFailure({id, error})))
    );
    
  @Effect()
  unholdStart$: Observable<Action> = this.actions$
    .ofType(p.UNHOLD_START)
    .map((a: p.UnholdStart) => a.payload.id)
    .mergeMap(id => this.endpoints.participantUnhold(id)
      .map(participant => new p.UnholdSuccess(participant))
      .catch(error => of(new p.UnholdFailure({id, error})))
    );

  @Effect()
  muteStart$: Observable<Action> = this.actions$
    .ofType(p.MUTE_START)
    .map((a: p.MuteStart) => a.payload.id)
    .mergeMap(id => this.endpoints.participantMute(id)
      .map(participant => new p.MuteSuccess(participant))
      .catch(error => of(new p.MuteFailure({id, error})))
    );

  @Effect()
  unmuteStart$: Observable<Action> = this.actions$
    .ofType(p.UNMUTE_START)
    .map((a: p.UnmuteStart) => a.payload.id)
    .mergeMap(id => this.endpoints.participantUnmute(id)
      .map(participant => new p.UnmuteSuccess(participant))
      .catch(error => of(new p.UnmuteFailure({id, error})))
    );

  @Effect()
  setVolumeStart$: Observable<Action> = this.actions$
    .ofType(p.SET_VOLUME_START)
    .map((a: p.SetVolumeStart) => a.payload)
    .mergeMap(({id, volume}) => this.endpoints.participantSetVolume(id, volume)
      .map(participant => new p.SetVolumeSuccess(participant))
      .catch(error => of(new p.SetVolumeFailure({id, volume, error})))
    );

  @Effect()
  hangupStart$: Observable<Action> = this.actions$
    .ofType(p.HANGUP_START)
    .map((a: p.HangupStart) => a.payload.id)
    .mergeMap(id => this.endpoints.participantHangup(id)
      .map(participant => new p.HangupSuccess(participant))
      .catch(error => of(new p.HangupFailure({id, error})))
    );

  @Effect()
  soloStart$: Observable<Action> = this.actions$
    .ofType(p.SOLO_START)
    .map((a: p.SoloStart) => a.payload.id)
    .mergeMap(id => this.endpoints.participantSolo(id)
      .map(participant => new p.SoloSuccess(participant))
      .catch(error => of(new p.SoloFailure({id, error})))
    );

  @Effect()
  renameStart$: Observable<Action> = this.actions$
    .ofType(p.RENAME_START)
    .map((a: p.RenameStart) => a.payload)
    .mergeMap(participant => this.endpoints.participantRename(participant)
      .map(participant => new p.RenameSuccess(participant))
      .catch(error => of(new p.RenameFailure({participant, error})))
    );

  constructor(
    private actions$: Actions,
    private endpoints: EndpointsService,
  ) { }
}
