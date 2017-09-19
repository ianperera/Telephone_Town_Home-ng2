import { Action } from '@ngrx/store';
import { filter, orderBy, omit, values } from 'lodash';

import { ParticipantData, ParticipantAudioLevel } from '../../models/events';
import { oa, ds } from '../helpers';
import * as participant from './participants.actions';

export interface Participant extends ParticipantData {
  pending: boolean;
}

export interface State {
  [index: number]: Participant
};

const initialState: State = {};

export function reducer(state = initialState, action: participant.Actions): State {
  switch (action.type) {
    /**
     * These reducers set participant state to pending so the view can halt other actions.
     * These actions are picked up by effects and the backend calls are run, which result in either
     * success or failure actions, which update the store appropriately.
     */
    case participant.HOLD_START:
    case participant.UNHOLD_START:
    case participant.MUTE_START:
    case participant.UNMUTE_START:
    case participant.SET_VOLUME_START:
    case participant.HANGUP_START:
    case participant.SOLO_START:
    case participant.RENAME_START:
      return ds(state, action.payload.id, {pending: true}); // See helpers.ts for ds() documentation

    case participant.HOLD_FAILURE:
    case participant.UNHOLD_FAILURE:
    case participant.MUTE_FAILURE:
    case participant.UNMUTE_FAILURE:
    case participant.SET_VOLUME_FAILURE:
    case participant.HANGUP_FAILURE:
    case participant.SOLO_FAILURE:
      return ds(state, action.payload.id, {pending: false});
    case participant.RENAME_FAILURE:
      return ds(state, action.payload.participant.id, {pending: false});

    case participant.HOLD_SUCCESS:
    case participant.UNHOLD_SUCCESS:
    case participant.MUTE_SUCCESS:
    case participant.UNMUTE_SUCCESS:
    case participant.SET_VOLUME_SUCCESS:
    case participant.HANGUP_SUCCESS:
    case participant.SOLO_SUCCESS:
    case participant.RENAME_SUCCESS:
      return ds(state, action.payload.id, oa(action.payload, {pending: false}));

    case participant.UPDATE:
      if (!!state[action.payload.id]) { // If this is a new participant, just add it to state.
        return oa(state, {[action.payload.id]: {...action.payload, pending: false}});
      } else { // Otherwise update the existing participant in state
        return ds(state, action.payload.id, action.payload);
      }
      
    case participant.REMOVE:
      return omit<State, State>(state, action.payload.id);

    case participant.AUDIO:
      return ds(state, action.payload.id, action.payload);

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
export function filterFactory(
    predicate: (p: Participant) => boolean,
    iteratee: string | string[] = 'id',
    order?) {
  return (state: State) => orderBy(filter(values(state), predicate), iteratee, order);
}
