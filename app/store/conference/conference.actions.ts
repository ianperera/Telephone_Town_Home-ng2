import { Action } from '@ngrx/store';

import { ConferenceStatusEvent } from '../../models/events';
import { ConfControlAction, ConferenceSetup } from '../../models/conference';

export const CONF_INIT_START = '[Conference] Initialize conference start';
export const CONF_INIT_SUCCESS = '[Conference] Initialize conference success';
export const CONF_INIT_FAILURE = '[Conference] Initialize conference failure';
export const CONF_EXIT = '[Conference] Exit conference control';
export const CONF_STATUS_UPDATE = '[Conference] Status update';
export const CONF_CONTROL_START = '[Conference] Control call start';
export const CONF_CONTROL_SUCCESS = '[Conference] Control call success';
export const CONF_CONTROL_FAILURE = '[Conference] Control call failure';
export const CONF_GET_SETUP_START = '[Conference] Get conference setup start';
export const CONF_GET_SETUP_SUCCESS = '[Conference] Get conference setup success';
export const CONF_GET_SETUP_FAILURE = '[Conference] Get conference setup failure';

export class ConfExit implements Action {
  readonly type = CONF_EXIT;
}

export class ConfStatusUpdate implements Action {
  readonly type = CONF_STATUS_UPDATE;
  constructor(public payload: ConferenceStatusEvent) {}
}

export class ConfControlStart implements Action {
  readonly type = CONF_CONTROL_START;
  constructor(public payload: ConfControlAction) {}
}
export class ConfControlSuccess implements Action {
  readonly type = CONF_CONTROL_SUCCESS;
}
export class ConfControlFailure implements Action {
  readonly type = CONF_CONTROL_FAILURE;
  constructor(public payload: {action: ConfControlAction, error: Error}) {}
}

export class ConfGetSetupStart implements Action {
  readonly type = CONF_GET_SETUP_START;
}
export class ConfGetSetupSuccess implements Action {
  readonly type = CONF_GET_SETUP_SUCCESS;
  constructor(public payload: ConferenceSetup) {}
}
export class ConfGetSetupFailure implements Action {
  readonly type = CONF_GET_SETUP_FAILURE;
  constructor(public payload: {error: Error}) {}
}

// Discriminated Union of Conference Actions
export type Actions =
  ConfExit
  | ConfStatusUpdate
  | ConfControlStart
  | ConfControlSuccess
  | ConfControlFailure
  | ConfGetSetupStart
  | ConfGetSetupSuccess
  | ConfGetSetupFailure;