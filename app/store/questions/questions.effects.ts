import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { EndpointsService } from '../../services/endpoints';
import * as q from './questions.actions';

@Injectable()
export class QuestionEffects {
  @Effect()
  ondeckQuestionStart$: Observable<Action> = this.actions$
    .ofType(q.ONDECK_QUESTION_START)
    .map((a: q.OndeckQuestionStart) => a.payload.id)
    .mergeMap(id => this.endpoints.questionOndeck(id)
      .map(question => new q.OndeckQuestionSuccess(question))
      .catch(error => of(new q.OndeckQuestionFailure({id, error})))
  );

  @Effect()
  doneQuestionStart$: Observable<Action> = this.actions$
    .ofType(q.DONE_QUESTION_START)
    .map((a: q.DoneQuestionStart) => a.payload.id)
    .mergeMap(id => this.endpoints.questionDone(id)
      .map(question => new q.DoneQuestionSuccess(question))
      .catch(error => of(new q.DoneQuestionFailure({id, error})))
  );

  @Effect()
  banQuestionStart$: Observable<Action> = this.actions$
    .ofType(q.BAN_QUESTION_START)
    .map((a: q.BanQuestionStart) => a.payload.id)
    .mergeMap(id => this.endpoints.questionBan(id)
      .map(question => new q.BanQuestionSuccess(question))
      .catch(error => of(new q.BanQuestionFailure({id, error})))
  );

  @Effect()
  dncQuestionStart$: Observable<Action> = this.actions$
    .ofType(q.DNC_QUESTION_START)
    .map((a: q.DncQuestionStart) => a.payload.id)
    .mergeMap(id => this.endpoints.questionKick(id)
      .map(question => new q.DncQuestionSuccess(question))
      .catch(error => of(new q.DncQuestionFailure({id, error})))
  );

  @Effect()
  rejectQuestionStart$: Observable<Action> = this.actions$
    .ofType(q.REJECT_QUESTION_START)
    .map((a: q.RejectQuestionStart) => a.payload.id)
    .mergeMap(id => this.endpoints.questionBan(id)
      .map(question => new q.RejectQuestionSuccess(question))
      .catch(error => of(new q.RejectQuestionFailure({id, error})))
  );

  @Effect()
  liveQuestionStart$: Observable<Action> = this.actions$
    .ofType(q.LIVE_QUESTION_START)
    .map((a: q.LiveQuestionStart) => a.payload.id)
    .mergeMap(id => this.endpoints.questionBan(id)
      .map(question => new q.LiveQuestionSuccess(question))
      .catch(error => of(new q.LiveQuestionFailure({id, error})))
  );

  @Effect()
  editQuestionStart$: Observable<Action> = this.actions$
    .ofType(q.EDIT_QUESTION_START)
    .map((a: q.EditQuestionStart) => a.payload)
    .mergeMap(question => this.endpoints.questionEdit(question)
      .map(question => new q.EditQuestionSuccess(question))
      .catch(error => of(new q.EditQuestionFailure({question, error})))
  );

  constructor(
    private actions$: Actions,
    private endpoints: EndpointsService,
  ) { }
}
