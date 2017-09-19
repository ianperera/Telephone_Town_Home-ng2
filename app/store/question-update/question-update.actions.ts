import { Action } from '@ngrx/store';
import { QuestionData } from '../../models/events';

export const HOLD_START = '[QuestionUpdate] Hold start';
export const HOLD_SUCCESS = '[QuestionUpdate] Hold success';
export const HOLD_FAILURE = '[QuestionUpdate] Hold failure';

export const UNHOLD_START = '[QuestionUpdate] Unhold start';
export const UNHOLD_SUCCESS = '[QuestionUpdate] Unhold success';
export const UNHOLD_FAILURE = '[QuestionUpdate] Unhold failure';

export const MUTE_START = '[QuestionUpdate] Mute start';
export const MUTE_SUCCESS = '[QuestionUpdate] Mute success';
export const MUTE_FAILURE = '[QuestionUpdate] Mute failure';

export const UNMUTE_START = '[QuestionUpdate] Unmute start';
export const UNMUTE_SUCCESS = '[QuestionUpdate] Unmute success';
export const UNMUTE_FAILURE = '[QuestionUpdate] Unmute failure';

export const SET_VOLUME_START = '[QuestionUpdate] Set volume start';
export const SET_VOLUME_SUCCESS = '[QuestionUpdate] Set volume success';
export const SET_VOLUME_FAILURE = '[QuestionUpdate] Set volume failure';

export const HANGUP_START = '[QuestionUpdate] Hangup start';
export const HANGUP_SUCCESS = '[QuestionUpdate] Hangup success';
export const HANGUP_FAILURE = '[QuestionUpdate] Hangup failure';

export const UPDATE_START = '[QuestionUpdate] Update start';
export const UPDATE_FAIL = '[QuestionUpdate] Update failure';
export const UPDATE = '[QuestionUpdate] Update';

export const REMOVEQUESTION_START = '[QuestionUpdate] Remove start';
export const REMOVEQUESTION_SUCCESS = '[QuestionUpdate] Remove success';
export const REMOVEQUESTION_FAILURE = '[QuestionUpdate] Remove failure';
export const REMOVE = '[QuestionUpdate] Remove';

export const DONE_START = '[QuestionUpdate] Done start';
export const DONE_SUCCESS = '[QuestionUpdate] Done success';
export const DONE_FAILURE = '[QuestionUpdate] Done failure';

export const ONDECK_START = '[QuestionUpdate] OnDeck start';
export const ONDECK_SUCCESS = '[QuestionUpdate] OnDeck success';
export const ONDECK_FAILURE = '[QuestionUpdate] OnDeck failure';

export const BRINGLIVE_START = '[QuestionUpdate] Live start';
export const BRINGLIVE_SUCCESS = '[QuestionUpdate] Live success';
export const BRINGLIVE_FAILURE = '[QuestionUpdate] Live failure';

export const RESCREEN_START = '[QuestionUpdate] Rescreen start';
export const RESCREEN_SUCCESS = '[QuestionUpdate] Rescreen success';
export const RESCREEN_FAILURE = '[QuestionUpdate] Rescreen failure';

// Hold Actions
export class HoldStart implements Action {
    readonly type = HOLD_START;

    constructor(public payload: QuestionData) {
    }
}
export class HoldSuccess implements Action {
    readonly type = HOLD_SUCCESS;

    constructor(public payload: QuestionData) {
    }
}
export class HoldFailure implements Action {
    readonly type = HOLD_FAILURE;

    constructor(public payload: {data: QuestionData, error: Error}) {
    }
}

// Unhold Actions
export class UnholdStart implements Action {
    readonly type = UNHOLD_START;

    constructor(public payload: QuestionData) {
    }
}
export class UnholdSuccess implements Action {
    readonly type = UNHOLD_SUCCESS;

    constructor(public payload: QuestionData) {
    }
}
export class UnholdFailure implements Action {
    readonly type = UNHOLD_FAILURE;

    constructor(public payload: {data: QuestionData, error: Error}) {
    }
}

// Mute Actions
export class MuteStart implements Action {
    readonly type = MUTE_START;

    constructor(public payload: QuestionData) {
    }
}
export class MuteSuccess implements Action {
    readonly type = MUTE_SUCCESS;

    constructor(public payload: QuestionData) {
    }
}
export class MuteFailure implements Action {
    readonly type = MUTE_FAILURE;

    constructor(public payload: {data: QuestionData, error: Error}) {
    }
}

// Unmute Actions
export class UnmuteStart implements Action {
    readonly type = UNMUTE_START;

    constructor(public payload: QuestionData) {
    }
}
export class UnmuteSuccess implements Action {
    readonly type = UNMUTE_SUCCESS;

    constructor(public payload: QuestionData) {
    }
}
export class UnmuteFailure implements Action {
    readonly type = UNMUTE_FAILURE;

    constructor(public payload: {data: QuestionData, error: Error}) {
    }
}

// Volume Actions
export class SetVolumeStart implements Action {
    readonly type = SET_VOLUME_START;

    constructor(public payload: {data: QuestionData, volume: number}) {
    }
}
export class SetVolumeSuccess implements Action {
    readonly type = SET_VOLUME_SUCCESS;

    constructor(public payload: QuestionData) {
    }
}
export class SetVolumeFailure implements Action {
    readonly type = SET_VOLUME_FAILURE;

    constructor(public payload: {data: QuestionData, volume: number, error: Error}) {
    }
}

// Hangup Actions
export class HangupStart implements Action {
    readonly type = HANGUP_START;

    constructor(public payload: QuestionData) {
    }
}
export class HangupSuccess implements Action {
    readonly type = HANGUP_SUCCESS;

    constructor(public payload: QuestionData) {
    }
}
export class HangupFailure implements Action {
    readonly type = HANGUP_FAILURE;

    constructor(public payload: {data: QuestionData, error: Error}) {
    }
}

// Update Actions
export class UpdateStart implements Action {
    readonly type = UPDATE_START;

    constructor(public payload: QuestionData) {
    }
}
export class UpdateFail implements Action {
    readonly type = UPDATE_FAIL;

    constructor(public payload: {data: QuestionData, error: Error}) {
    }
}
export class Update implements Action {
    readonly type = UPDATE;

    constructor(public payload: QuestionData) {
    }
}

// Remove Actions
export class RemoveQuestionStart implements Action {
    readonly type = REMOVEQUESTION_START;

    constructor(public payload: {id: number}) {
    }
}
export class RemoveQuestionSuccess implements Action {
    readonly type = REMOVEQUESTION_SUCCESS;

    constructor(public payload: {id: number}) {
    }
}
export class RemoveQuestionFailure implements Action {
    readonly type = REMOVEQUESTION_FAILURE;

    constructor(public payload: {id: number, error: Error}) {
    }
}
export class Remove implements Action {
    readonly type = REMOVE;

    constructor(public payload: {id: number}) {
    }
}

// Done Actions
export class DoneStart implements Action {
    readonly type = DONE_START;

    constructor(public payload: QuestionData) {
    }
}
export class DoneSuccess implements Action {
    readonly type = DONE_SUCCESS;

    constructor(public payload: QuestionData) {
    }
}
export class DoneFailure implements Action {
    readonly type = DONE_FAILURE;

    constructor(public payload: {data: QuestionData, error: Error}) {
    }
}

// Ondeck Actions
export class OnDeckStart implements Action {
    readonly type = ONDECK_START;

    constructor(public payload: {id: number}) {
    }
}
export class OnDeckSuccess implements Action {
    readonly type = ONDECK_SUCCESS;

    constructor(public payload: {id: number}) {
    }
}
export class OnDeckFailure implements Action {
    readonly type = ONDECK_FAILURE;

    constructor(public payload: {id: number, error: Error}) {
    }
}

// Bringlive Actions
export class BringLiveStart implements Action {
    readonly type = BRINGLIVE_START;

    constructor(public payload: {id: number}) {
    }
}
export class BringLiveSuccess implements Action {
    readonly type = BRINGLIVE_SUCCESS;

    constructor(public payload: {id: number}) {
    }
}
export class BringLiveFailure implements Action {
    readonly type = BRINGLIVE_FAILURE;

    constructor(public payload: {id: number, error: Error}) {
    }
}

// Rescreen Actions
export class RescreenStart implements Action {
    readonly type = RESCREEN_START;

    constructor(public payload: {id: number}) {
    }
}
export class RescreenSuccess implements Action {
    readonly type = RESCREEN_SUCCESS;

    constructor(public payload: {id: number}) {
    }
}
export class RescreenFailure implements Action {
    readonly type = RESCREEN_FAILURE;

    constructor(public payload: {id: number, error: Error}) {
    }
}

export type Actions =
    HoldStart | HoldSuccess | HoldFailure
        | UnholdStart | UnholdSuccess | UnholdFailure
        | MuteStart | MuteSuccess | MuteFailure
        | UnmuteStart | UnmuteSuccess | UnmuteFailure
        | SetVolumeStart | SetVolumeSuccess | SetVolumeFailure
        | HangupStart | HangupSuccess | HangupFailure
        | UpdateStart | UpdateFail | Update
        | RemoveQuestionStart | RemoveQuestionSuccess | RemoveQuestionFailure | Remove
        | DoneStart | DoneSuccess | DoneFailure
        | OnDeckStart | OnDeckSuccess | OnDeckFailure
        | BringLiveStart | BringLiveSuccess | BringLiveFailure
        | RescreenStart | RescreenSuccess | RescreenFailure
    ;