import { Action } from '@ngrx/store';
import { Participant } from './participants.reducers';
import { ParticipantData, ParticipantAudioLevel } from '../../models/events';

export const HOLD_START = '[Participant] Hold start';
export const HOLD_SUCCESS = '[Participant] Hold success';
export const HOLD_FAILURE = '[Participant] Hold failure';
export const UNHOLD_START = '[Participant] Unhold start';
export const UNHOLD_SUCCESS = '[Participant] Unhold success';
export const UNHOLD_FAILURE = '[Participant] Unhold failure';
export const MUTE_START = '[Participant] Mute start';
export const MUTE_SUCCESS = '[Participant] Mute success';
export const MUTE_FAILURE = '[Participant] Mute failure';
export const UNMUTE_START = '[Participant] Unmute start';
export const UNMUTE_SUCCESS = '[Participant] Unmute success';
export const UNMUTE_FAILURE = '[Participant] Unmute failure';
export const SET_VOLUME_START = '[Participant] Set volume start';
export const SET_VOLUME_SUCCESS = '[Participant] Set volume success';
export const SET_VOLUME_FAILURE = '[Participant] Set volume failure';
export const HANGUP_START = '[Participant] Hangup start';
export const HANGUP_SUCCESS = '[Participant] Hangup success';
export const HANGUP_FAILURE = '[Participant] Hangup failure';
export const SOLO_START = '[Participant] Solo start';
export const SOLO_SUCCESS = '[Participant] Solo success';
export const SOLO_FAILURE = '[Participant] Solo failure';
export const RENAME_START = '[Participant] Rename start';
export const RENAME_SUCCESS = '[Participant] Rename success';
export const RENAME_FAILURE = '[Participant] Rename failure';
export const UPDATE = '[Participant] Update';
export const REMOVE = '[Participant] Remove';
export const AUDIO = '[Participant] Audio';

export class HoldStart implements Action {
  readonly type = HOLD_START;
  constructor(public payload: {id: number}) { }
}
export class HoldSuccess implements Action {
  readonly type = HOLD_SUCCESS;
  constructor(public payload: ParticipantData) { }
}
export class HoldFailure implements Action {
  readonly type = HOLD_FAILURE;
  constructor(public payload: {id: number, error: Error}) { }
}

export class UnholdStart implements Action {
  readonly type = UNHOLD_START;
  constructor(public payload: {id: number}) { }
}
export class UnholdSuccess implements Action {
  readonly type = UNHOLD_SUCCESS;
  constructor(public payload: ParticipantData) { }
}
export class UnholdFailure implements Action {
  readonly type = UNHOLD_FAILURE;
  constructor(public payload: {id: number, error: Error}) { }
}

export class MuteStart implements Action {
  readonly type = MUTE_START;
  constructor(public payload: {id: number}) { }
}
export class MuteSuccess implements Action {
  readonly type = MUTE_SUCCESS;
  constructor(public payload: ParticipantData) { }
}
export class MuteFailure implements Action {
  readonly type = MUTE_FAILURE;
  constructor(public payload: {id: number, error: Error}) { }
}

export class UnmuteStart implements Action {
  readonly type = UNMUTE_START;
  constructor(public payload: {id: number}) { }
}
export class UnmuteSuccess implements Action {
  readonly type = UNMUTE_SUCCESS;
  constructor(public payload: ParticipantData) { }
}
export class UnmuteFailure implements Action {
  readonly type = UNMUTE_FAILURE;
  constructor(public payload: {id: number, error: Error}) { }
}

export class SetVolumeStart implements Action {
  readonly type = SET_VOLUME_START;
  constructor(public payload: {id: number, volume: number}) { }
}
export class SetVolumeSuccess implements Action {
  readonly type = SET_VOLUME_SUCCESS;
  constructor(public payload: ParticipantData) { }
}
export class SetVolumeFailure implements Action {
  readonly type = SET_VOLUME_FAILURE;
  constructor(public payload: {id: number, volume: number, error: Error}) { }
}

export class HangupStart implements Action {
  readonly type = HANGUP_START;
  constructor(public payload: {id: number}) { }
}
export class HangupSuccess implements Action {
  readonly type = HANGUP_SUCCESS;
  constructor(public payload: ParticipantData) { }
}
export class HangupFailure implements Action {
  readonly type = HANGUP_FAILURE;
  constructor(public payload: {id: number, error: Error}) { }
}

export class SoloStart implements Action {
  readonly type = SOLO_START;
  constructor(public payload: {id: number}) { }
}
export class SoloSuccess implements Action {
  readonly type = SOLO_SUCCESS;
  constructor(public payload: ParticipantData) { }
}
export class SoloFailure implements Action {
  readonly type = SOLO_FAILURE;
  constructor(public payload: {id: number, error: Error}) { }
}

export class RenameStart implements Action {
  readonly type = RENAME_START;
  constructor(public payload: Participant) { }
}
export class RenameSuccess implements Action {
  readonly type = RENAME_SUCCESS;
  constructor(public payload: ParticipantData) { }
}
export class RenameFailure implements Action {
  readonly type = RENAME_FAILURE;
  constructor(public payload: {participant: Participant, error: Error}) { }
}

export class Update implements Action {
  readonly type = UPDATE;
  constructor(public payload: ParticipantData) { }
}
export class Remove implements Action {
  readonly type = REMOVE;
  constructor(public payload: {id: number}) { }
}
export class Audio implements Action {
  readonly type = AUDIO;
  constructor(public payload: ParticipantAudioLevel) { }
}

export type Actions = 
  HoldStart | HoldSuccess | HoldFailure
  | UnholdStart | UnholdSuccess | UnholdFailure
  | MuteStart | MuteSuccess | MuteFailure
  | UnmuteStart | UnmuteSuccess | UnmuteFailure
  | SetVolumeStart | SetVolumeSuccess | SetVolumeFailure
  | HangupStart | HangupSuccess | HangupFailure
  | SoloStart | SoloSuccess | SoloFailure
  | RenameStart | RenameSuccess | RenameFailure
  | Update
  | Remove
  | Audio;