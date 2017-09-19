import { Action } from '@ngrx/store';
import { QuestionData } from '../../models/events';

export const ONDECK_QUESTION_START = '[Question] Ondeck question start';
export const ONDECK_QUESTION_SUCCESS = '[Question] Ondeck question success';
export const ONDECK_QUESTION_FAILURE = '[Question] Ondeck question failure';
export const DONE_QUESTION_START = '[Question] Done question start';
export const DONE_QUESTION_SUCCESS = '[Question] Done question success';
export const DONE_QUESTION_FAILURE = '[Question] Done question failure';
export const BAN_QUESTION_START = '[Question] Ban question start';
export const BAN_QUESTION_SUCCESS = '[Question] Ban question success';
export const BAN_QUESTION_FAILURE = '[Question] Ban question failure';
export const DNC_QUESTION_START = '[Question] DNC question start';
export const DNC_QUESTION_SUCCESS = '[Question] DNC question success';
export const DNC_QUESTION_FAILURE = '[Question] DNC question failure';
export const EDIT_QUESTION_START = '[Question] Edit question start';
export const EDIT_QUESTION_SUCCESS = '[Question] Edit question success';
export const EDIT_QUESTION_FAILURE = '[Question] Edit question failure';
export const REJECT_QUESTION_START = '[Question] Reject question start';
export const REJECT_QUESTION_SUCCESS = '[Question] Reject question success';
export const REJECT_QUESTION_FAILURE = '[Question] Reject question failure';
export const LIVE_QUESTION_START = '[Question] Live question start';
export const LIVE_QUESTION_SUCCESS = '[Question] Live question success';
export const LIVE_QUESTION_FAILURE = '[Question] Live question failure';
export const UPDATE = '[Question] Update question in store';
export const REMOVE = '[Question] Remove question from store';


export class OndeckQuestionStart implements Action {
  readonly type = ONDECK_QUESTION_START;
  constructor(public payload: {id: number}) {}
}
export class OndeckQuestionSuccess implements Action {
  readonly type = ONDECK_QUESTION_SUCCESS;
  constructor(public payload: QuestionData) {}
}
export class OndeckQuestionFailure implements Action {
  readonly type = ONDECK_QUESTION_FAILURE;
  constructor(public payload: {id: number, error: Error}) {}
}

export class DoneQuestionStart implements Action {
  readonly type = DONE_QUESTION_START;
  constructor(public payload: {id: number}) {}
}
export class DoneQuestionSuccess implements Action {
  readonly type = DONE_QUESTION_SUCCESS;
  constructor(public payload: QuestionData) {}
}
export class DoneQuestionFailure implements Action {
  readonly type = DONE_QUESTION_FAILURE;
  constructor(public payload: {id: number, error: Error}) {}
}

export class BanQuestionStart implements Action {
  readonly type = BAN_QUESTION_START;
  constructor(public payload: {id: number}) {}
}
export class BanQuestionSuccess implements Action {
  readonly type = BAN_QUESTION_SUCCESS;
  constructor(public payload: QuestionData) {}
}
export class BanQuestionFailure implements Action {
  readonly type = BAN_QUESTION_FAILURE;
  constructor(public payload: {id: number, error: Error}) {}
}

export class DncQuestionStart implements Action {
  readonly type = DNC_QUESTION_START;
  constructor(public payload: {id: number}) {}
}
export class DncQuestionSuccess implements Action {
  readonly type = DNC_QUESTION_SUCCESS;
  constructor(public payload: QuestionData) {}
}
export class DncQuestionFailure implements Action {
  readonly type = DNC_QUESTION_FAILURE;
  constructor(public payload: {id: number, error: Error}) {}
}

export class EditQuestionStart implements Action {
  readonly type = EDIT_QUESTION_START;
  constructor(public payload: QuestionData) {}
}
export class EditQuestionSuccess implements Action {
  readonly type = EDIT_QUESTION_SUCCESS;
  constructor(public payload: QuestionData) {}
}
export class EditQuestionFailure implements Action {
  readonly type = EDIT_QUESTION_FAILURE;
  constructor(public payload: {question: QuestionData, error: Error}) {}
}

export class RejectQuestionStart implements Action {
  readonly type = REJECT_QUESTION_START;
  constructor(public payload: {id: number}) {}
}
export class RejectQuestionSuccess implements Action {
  readonly type = REJECT_QUESTION_SUCCESS;
  constructor(public payload: QuestionData) {}
}
export class RejectQuestionFailure implements Action {
  readonly type = REJECT_QUESTION_FAILURE;
  constructor(public payload: {id: number, error: Error}) {}
}

export class LiveQuestionStart implements Action {
  readonly type = LIVE_QUESTION_START;
  constructor(public payload: {id: number}) {}
}
export class LiveQuestionSuccess implements Action {
  readonly type = LIVE_QUESTION_SUCCESS;
  constructor(public payload: QuestionData) {}
}
export class LiveQuestionFailure implements Action {
  readonly type = LIVE_QUESTION_FAILURE;
  constructor(public payload: {id: number, error: Error}) {}
}

export class Update implements Action {
  readonly type = UPDATE;
  constructor(public payload: {id: number}) {}
}
export class Remove implements Action {
  readonly type = REMOVE;
  constructor(public payload: {id: number}) {}
}

export type Actions =
  OndeckQuestionStart
  | OndeckQuestionSuccess
  | OndeckQuestionFailure
  | DoneQuestionStart
  | DoneQuestionSuccess
  | DoneQuestionFailure
  | BanQuestionStart
  | BanQuestionSuccess
  | BanQuestionFailure
  | DncQuestionStart
  | DncQuestionSuccess
  | DncQuestionFailure
  | EditQuestionStart
  | EditQuestionSuccess
  | EditQuestionFailure
  | RejectQuestionStart
  | RejectQuestionSuccess
  | RejectQuestionFailure
  | LiveQuestionStart
  | LiveQuestionSuccess
  | LiveQuestionFailure
  | Update
  | Remove;
