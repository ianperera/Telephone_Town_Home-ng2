import {Action} from '@ngrx/store';

export const SELECT_PARTICIPANT = '[UI] Select participant in participants panel';
export const DESELECT_PARTICIPANT = '[UI] Deselect participant in participants panel';
export const SELECT_QUESTION = '[UI] Select question in live questions';
export const DESELECT_QUESTION = '[UI] Deselect question in live questions';
export const SELECT_ONDECK_QUESTION = '[UI] Select on deck question';
export const DESELECT_ONDECK_QUESTION = '[UI] Deselect on deck question';
export const SELECT_RAISED_HAND_QUESTION = '[UI] Select raised hand question';
export const DESELECT_RAISED_HAND_QUESTION = '[UI] Deselect raised hand question';
export const SELECT_SCREENED_QUESTION = '[UI] Select screened question';
export const DESELECT_SCREENED_QUESTION = '[UI] Deselect screened question';
export const SET_SCREENED_QUESTION_ORDER = '[UI] Set order for screened question';
export const SET_ONDECK_QUESTION_ORDER = '[UI] Set order for ondeck question';

export class SelectParticipant implements Action {
    readonly type = SELECT_PARTICIPANT;

    constructor(public payload: {id: number}) {
    }
}
export class DeselectParticipant implements Action {
    readonly type = DESELECT_PARTICIPANT;
}
export class SelectQuestion implements Action {
    readonly type = SELECT_QUESTION;

    constructor(public payload: {id: number}) {
    }
}
export class DeselectQuestion implements Action {
    readonly type = DESELECT_QUESTION;
}
export class SelectOnDeckQuestion implements Action {
    readonly type = SELECT_ONDECK_QUESTION;

    constructor(public payload: {id: number}) {
    }
}
export class DeselectOnDeckQuestion implements Action {
    readonly type = DESELECT_ONDECK_QUESTION;
}
export class SelectRaisedHandQuestion implements Action {
    readonly type = SELECT_RAISED_HAND_QUESTION;

    constructor(public payload: {id: number}) {
    }
}
export class DeselectRaisedHandQuestion implements Action {
    readonly type = DESELECT_RAISED_HAND_QUESTION;
}
export class SelectScreenedQuestion implements Action {
    readonly type = SELECT_SCREENED_QUESTION;

    constructor(public payload: {id: number}) {
    }
}
export class SetScreenedQuestionOrder implements Action {
    readonly type = SET_SCREENED_QUESTION_ORDER;

    constructor(public payload: {order: string}) {
    }
}

export class SetOnDeckQuestionOrder implements Action {
    readonly type = SET_ONDECK_QUESTION_ORDER;

    constructor(public payload: {order: string}) {
    }
}
export class DeselectScreenedQuestion implements Action {
    readonly type = DESELECT_SCREENED_QUESTION;
}
// Discriminated Union of Participant & Question Actions
export type Actions =
    SelectParticipant
        | DeselectParticipant
        | SelectOnDeckQuestion
        | DeselectOnDeckQuestion
        | SelectRaisedHandQuestion
        | DeselectRaisedHandQuestion
        | SelectScreenedQuestion
        | DeselectScreenedQuestion
        | SelectQuestion
        | SetScreenedQuestionOrder
        | SetOnDeckQuestionOrder
        | DeselectQuestion;
