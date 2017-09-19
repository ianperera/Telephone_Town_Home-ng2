import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { EndpointsService } from '../../services/endpoints';
import * as qu from './question-update.actions';

@Injectable()
export class QuestionUpdateEffects {

    // Hold Effects
    @Effect()
    holdStart$: Observable<Action> = this.actions$
        .ofType(qu.HOLD_START)
        .do(a => console.log('QuestionUpdate start hold effect', a))
        .map((a: qu.HoldStart) => a.payload)
        .mergeMap(question => this.endpoints.questionUpdateHold(question.participantId)
            .map(res => new qu.HoldSuccess(question))
            .catch(error => of(new qu.HoldFailure({data: question, error})))
        );

    @Effect()
    unholdStart$: Observable<Action> = this.actions$
        .ofType(qu.UNHOLD_START)
        .map((a: qu.UnholdStart) => a.payload)
        .mergeMap(question => this.endpoints.questionUpdateUnhold(question.participantId)
            .map(res => new qu.UnholdSuccess(question))
            .catch(error => of(new qu.UnholdFailure({data: question, error})))
        );

    // Mute Effects
    @Effect()
    muteStart$: Observable<Action> = this.actions$
        .ofType(qu.MUTE_START)
        .map((a: qu.MuteStart) => a.payload)
        .mergeMap(question => this.endpoints.questionUpdateMute(question.participantId)
            .map(res => new qu.MuteSuccess(question))
            .catch(error => of(new qu.MuteFailure({data: question, error})))
        );

    @Effect()
    unmuteStart$: Observable<Action> = this.actions$
        .ofType(qu.UNMUTE_START)
        .map((a: qu.UnmuteStart) => a.payload)
        .mergeMap(question => this.endpoints.questionUpdateUnmute(question.participantId)
            .map(res => new qu.UnmuteSuccess(question))
            .catch(error => of(new qu.UnmuteFailure({data: question, error})))
        );

    // Volume Effects
    @Effect()
    setVolumeStart$: Observable<Action> = this.actions$
        .ofType(qu.SET_VOLUME_START)
        .map((a: qu.SetVolumeStart) => a.payload)
        .mergeMap(({data, volume}) => this.endpoints.questionUpdateSetVolume(data.participantId, volume)
            .map(res => new qu.SetVolumeSuccess(data))
            .catch(error => of(new qu.SetVolumeFailure({data: data, volume, error})))
        );

    // Hangup Effects
    @Effect()
    hangupStart$: Observable<Action> = this.actions$
        .ofType(qu.HANGUP_START)
        .map((a: qu.HangupStart) => a.payload)
        .mergeMap(question => this.endpoints.questionUpdateHangup(question.participantId)
            .map(res => new qu.HangupSuccess(question))
            .catch(error => of(new qu.HangupFailure({data: question, error})))
        );

    @Effect()
    hangupSuccess$: Observable<Action> = this.actions$
        .ofType(qu.HANGUP_SUCCESS)
        .map((a: qu.HangupSuccess) => a.payload)
        .map(question => new qu.Remove(question));

    // Update Effects
    @Effect()
    updateStart$: Observable<Action> = this.actions$
        .ofType(qu.UPDATE_START)
        .map((a: qu.UpdateStart) => a.payload)
        .mergeMap(question => this.endpoints.questionUpdateEdit(question)
            .map(res => new qu.Update(question))
            .catch(error => of(new qu.UpdateFail({data: question, error})))
        );

    // Done Effects
    @Effect()
    doneStart$: Observable<Action> = this.actions$
        .ofType(qu.DONE_START)
        .map((a: qu.DoneStart) => a.payload)
        .mergeMap(question => this.endpoints.questionUpdateDone(question.id, 1)
            .map(res => new qu.DoneSuccess(question))
            .catch(error => of(new qu.DoneFailure({data: question, error})))
        );

    @Effect()//but all live data don't removed from lables.
    doneSuccess$: Observable<Action> = this.actions$
        .ofType(qu.DONE_SUCCESS)
        .map((a: qu.DoneSuccess) => a.payload)
        .map(question => new qu.Remove(question));

    // Rescreen Effects
    @Effect()
    RescreenStart$: Observable<Action> = this.actions$
        .ofType(qu.RESCREEN_START)
        .map((a: qu.RescreenStart) => a.payload.id)
        .mergeMap(id => this.endpoints.questionRescreen(id)
            .map(res => new qu.RescreenSuccess({id}))
            .catch(error => of(new qu.RescreenFailure({id, error})))
        );

    @Effect()
    RescreenSuccess$: Observable<Action> = this.actions$
        .ofType(qu.RESCREEN_SUCCESS)
        .map((a: qu.RescreenSuccess) => a.payload.id)
        .map(id => new qu.Remove({id}));

    // OnDeck Effects
    @Effect()
    OnDeckStart$: Observable<Action> = this.actions$
        .ofType(qu.ONDECK_START)
        .map((a: qu.OnDeckStart) => a.payload.id)
        .mergeMap(id => this.endpoints.questionOndeck(id)
            .map(res => new qu.OnDeckSuccess({id}))
            .catch(error => of(new qu.OnDeckFailure({id, error})))
        );

    @Effect()
    OnDeckSuccess$: Observable<Action> = this.actions$
        .ofType(qu.ONDECK_SUCCESS)
        .map((a: qu.OnDeckSuccess) => a.payload.id)
        .map(id => new qu.Remove({id}));

    // Bring Live Effects
    @Effect()
    BringLiveStart$: Observable<Action> = this.actions$
        .ofType(qu.BRINGLIVE_START)
        .map((a: qu.BringLiveStart) => a.payload.id)
        .mergeMap(id => this.endpoints.questionLive(id)
            .map(res => new qu.BringLiveSuccess({id}))
            .catch(error => of(new qu.BringLiveFailure({id, error})))
        );

    @Effect()
    BringLiveSuccess$: Observable<Action> = this.actions$
        .ofType(qu.BRINGLIVE_SUCCESS)
        .map((a: qu.BringLiveSuccess) => a.payload.id)
        .map(id => new qu.Remove({id}));

    // Remove Questions Effects
    @Effect()
    RemoveQuestionStart$: Observable<Action> = this.actions$
        .ofType(qu.REMOVEQUESTION_START)
        .map((a: qu.RemoveQuestionStart) => a.payload.id)
        .mergeMap(id => this.endpoints.questionRemove(id)
            .map(res => new qu.RemoveQuestionSuccess({id}))
            .catch(error => of(new qu.RemoveQuestionFailure({id, error})))
        );

    @Effect()
    RemoveQuestionSuccess$: Observable<Action> = this.actions$
        .ofType(qu.REMOVEQUESTION_SUCCESS)
        .map((a: qu.RemoveQuestionSuccess) => a.payload.id)
        .map(id => new qu.Remove({id}));

    constructor(private actions$: Actions,
                private endpoints: EndpointsService,) {
    }
}
