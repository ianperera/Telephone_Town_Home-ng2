import { Action } from '@ngrx/store';
import { StreamEvent } from '../../models/events';

export const POLLING_START = '[Events] Start polling loop';
export const POLLING_END = '[Events] End polling loop';
export const POLL_START = '[Events] Poll events start';
export const POLL_CANCEL = '[Events] Poll events cancel';
export const POLL_SUCCESS = '[Events] Poll events success';
export const POLL_FAILURE = '[Events] Poll events failure';
export const DISPATCH = '[Events] Dispatch received events';
export const UNKNOWN = '[Events] Dispatch for unknown events';


export class PollingStart implements Action {
  readonly type = POLLING_START;
  constructor(public payload: {conferenceId: string}) {}
}
export class PollingEnd implements Action {
  readonly type = POLLING_END;
}

export class PollStart implements Action {
  readonly type = POLL_START;
  constructor(public payload: {conferenceId: string}) {}
}
export class PollCancel implements Action {
  readonly type = POLL_CANCEL;
}
export class PollSuccess implements Action {
  readonly type = POLL_SUCCESS;
  constructor(public payload: {conferenceId: string, events: StreamEvent[]}) {}
}
export class PollFailure implements Action {
  readonly type = POLL_FAILURE;
  constructor(public payload: {conferenceId: string, error: Error}) {}
}

export class Dispatch implements Action {
  readonly type = DISPATCH;
  constructor(public payload: {events: StreamEvent[]}) {}
}

export class Unknown implements Action {
  readonly type = UNKNOWN;
  constructor(public payload: any) {}
}

export type Actions = 
  PollingStart
  | PollingEnd
  | PollStart
  | PollCancel
  | PollSuccess
  | PollFailure
  | Dispatch;

export type PollStartActions = 
  PollingStart
  | PollSuccess
  | PollFailure;