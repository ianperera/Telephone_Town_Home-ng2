import {Action} from '@ngrx/store';
import {filter, orderBy, omit, values} from 'lodash';

import {QuestionData} from '../../models/events';
import {oa, ds} from '../helpers';
import * as questionUpdate from './question-update.actions';

export interface QuestionUpdate extends QuestionData {
}

export interface State {
    [index: number]: QuestionUpdate
}

const initialState: State = {};

export function reducer(state = initialState, action: questionUpdate.Actions): State {
    switch (action.type) {
        case questionUpdate.HOLD_START:
        case questionUpdate.UNHOLD_START:
        case questionUpdate.MUTE_START:
        case questionUpdate.UNMUTE_START:
        case questionUpdate.HANGUP_START:
        case questionUpdate.DONE_START:
        case questionUpdate.RESCREEN_START:
        case questionUpdate.ONDECK_START:
        case questionUpdate.BRINGLIVE_START:
        case questionUpdate.REMOVEQUESTION_START:
        case questionUpdate.RESCREEN_FAILURE:
        case questionUpdate.ONDECK_FAILURE:
        case questionUpdate.BRINGLIVE_FAILURE:
        case questionUpdate.REMOVEQUESTION_FAILURE:
            return ds(state, action.payload.id, {}); // See helpers.ts for ds() documentation

        case questionUpdate.SET_VOLUME_START:
        case questionUpdate.SET_VOLUME_FAILURE:
            return ds(state, action.payload.data.id, {}); // See helpers.ts for ds() documentation

        case questionUpdate.HOLD_FAILURE:
        case questionUpdate.UNHOLD_FAILURE:
        case questionUpdate.MUTE_FAILURE:
        case questionUpdate.UNMUTE_FAILURE:
        case questionUpdate.HANGUP_FAILURE:
        case questionUpdate.DONE_FAILURE:
        case questionUpdate.UPDATE_FAIL:
            return ds(state, action.payload.data.id, {});

        case questionUpdate.HOLD_SUCCESS:
        case questionUpdate.UNHOLD_SUCCESS:
        case questionUpdate.MUTE_SUCCESS:
        case questionUpdate.UNMUTE_SUCCESS:
        case questionUpdate.SET_VOLUME_SUCCESS:
        case questionUpdate.HANGUP_SUCCESS:
        case questionUpdate.DONE_SUCCESS:
        case questionUpdate.RESCREEN_SUCCESS:
        case questionUpdate.ONDECK_SUCCESS:
        case questionUpdate.BRINGLIVE_SUCCESS:
        case questionUpdate.REMOVEQUESTION_SUCCESS:
            return ds(state, action.payload.id, oa(action.payload, {}));

        case questionUpdate.UPDATE:
            if (!!state[action.payload.id]) { // If this is a new question, just add it to state.
                return oa(state, {[action.payload.id]: {...action.payload}});
            } else { // Otherwise update the existing question in state
                return ds(state, action.payload.id, action.payload);
            }

        case questionUpdate.UPDATE_START:
            return ds(state, action.payload.id, action.payload);

        case questionUpdate.REMOVE:
            return omit<State, State>(state, action.payload.id);

        default:
            return state;
    }

}

/**
 * Export the sortFactory so createSelector can memoize sorted lists.
 * Defaults to sort on id.
 */
export function sortFactory(iteratee: string | string[] = 'id', order?) {
    return (state: State) => orderBy(values(state), iteratee, order);
}

/**
 * Export the filterFactory so createSelector can memoize filtered lists.
 * This guy can also sort.. defaults to sort on id.
 */
export function filterFactory(predicate: (p: QuestionUpdate) => boolean,
                              iteratee: string | string[] = 'id',
                              order?) {
    return (state: State) => orderBy(filter(values(state), predicate), iteratee, order);
}
