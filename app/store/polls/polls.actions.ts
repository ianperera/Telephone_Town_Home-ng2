import { Action } from '@ngrx/store';
import { ConferenceStatusEvent } from '../../models/events';
import { PollStatsResponse, PollStats, PollOpenParams, Poll, ReqPollParams } from '../../models/polls';

export const POLL_UPDATE_START = '[Polls] Get newest poll stats start';
export const POLL_UPDATE_SUCCESS = '[Polls] Get newest poll stats success';
export const POLL_UPDATE_FAILURE = '[Polls] Get newest poll stats failure';
export const POLL_UPDATE = '[Polls] Update poll stats from other source';
export const POLL_OPEN_START = '[Polls] Open active poll start';
export const POLL_OPEN_SUCCESS = '[Polls] Open active poll success';
export const POLL_OPEN_FAILURE = '[Polls] Open active poll failure';
export const POLL_CLOSE_ACTIVE_START = '[Polls] Close active poll start';
export const POLL_CLOSE_ACTIVE_SUCCESS = '[Polls] Close active poll success';
export const POLL_CLOSE_ACTIVE_FAILURE = '[Polls] Close active poll failure';
export const POLL_SAVE_START = '[Polls] Save poll start';
export const POLL_SAVE_SUCCESS = '[Polls] Save poll success';
export const POLL_SAVE_FAILURE = '[Polls] Save poll failure';
export const POLL_DELETE_START = '[Polls] Delete poll start';
export const POLL_DELETE_SUCCESS = '[Polls] Delete poll success';
export const POLL_DELETE_FAILURE = '[Polls] Delete poll failure';
export const POLL_CHECK = '[Polls] Check for poll change';

export class PollUpdateStart implements Action {
  readonly type = POLL_UPDATE_START;
}
export class PollUpdateSuccess implements Action {
  readonly type = POLL_UPDATE_SUCCESS;
  constructor(public payload: {pollStats: PollStatsResponse}) {}
}
export class PollUpdateFailure implements Action {
  readonly type = POLL_UPDATE_FAILURE;
  constructor(public payload: {error: Error}) {}
}
export class PollUpdate implements Action {
  readonly type = POLL_UPDATE;
  constructor(public payload: PollStats) {}
}

export class PollOpenStart implements Action {
  readonly type = POLL_OPEN_START;
  constructor(public payload: PollOpenParams) {}
}
export class PollOpenSuccess implements Action {
  readonly type = POLL_OPEN_SUCCESS;
  constructor(public payload: PollStats) {}
}
export class PollOpenFailure implements Action {
  readonly type = POLL_OPEN_FAILURE;
  constructor(public payload: {params: PollOpenParams, error: Error}) {}
}

export class PollCloseActiveStart implements Action {
  readonly type = POLL_CLOSE_ACTIVE_START;
  constructor(public payload: any) {} // Fix this later..
}
export class PollCloseActiveSuccess implements Action {
  readonly type = POLL_CLOSE_ACTIVE_SUCCESS;
  constructor(public payload: PollStats) {}
}
export class PollCloseActiveFailure implements Action {
  readonly type = POLL_CLOSE_ACTIVE_FAILURE;
  constructor(public payload: {error: Error}) {}
}

export class PollSaveStart implements Action {
  readonly type = POLL_SAVE_START;
  constructor(public payload: {poll: ReqPollParams, conferenceId: number}) {}
}
export class PollSaveSuccess implements Action {
  readonly type = POLL_SAVE_SUCCESS;
}
export class PollSaveFailure implements Action {
  readonly type = POLL_SAVE_FAILURE;
  constructor(public payload: {poll: ReqPollParams, conferenceId: number, error: Error}) {}
}

export class PollDeleteStart implements Action {
  readonly type = POLL_DELETE_START;
  constructor(public payload: {pollId: number}) {}
}
export class PollDeleteSuccess implements Action {
  readonly type = POLL_DELETE_SUCCESS;
  constructor(public payload: {pollId: number}) {}
}
export class PollDeleteFailure implements Action {
  readonly type = POLL_DELETE_FAILURE;
  constructor(public payload: {pollId: number, error: Error}) {}
}

export class PollCheck implements Action {
  readonly type = POLL_CHECK;
  constructor(public payload: ConferenceStatusEvent) {}
}

export type Actions =
  PollUpdateStart
  | PollUpdateSuccess
  | PollUpdateFailure
  | PollUpdate
  | PollOpenStart
  | PollOpenSuccess
  | PollOpenFailure
  | PollCloseActiveStart
  | PollCloseActiveSuccess
  | PollCloseActiveFailure
  | PollSaveStart
  | PollSaveSuccess
  | PollSaveFailure
  | PollDeleteStart
  | PollDeleteSuccess
  | PollDeleteFailure
  | PollCheck;
