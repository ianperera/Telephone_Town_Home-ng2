import { Action } from '@ngrx/store';

import { find } from 'lodash';
import { Maybe } from 'monet';

import { PollStats, defaultPollStats } from '../../models/polls';

import { oa, ds } from '../helpers';
import * as polls from './polls.actions';

export interface State {
  stats: PollStats[];
  openPollId: number;
  prevPollId: number;
  latestPollId: number;
};

const initialState: State = {
  stats: [],
  openPollId: -1,
  prevPollId: -1,
  latestPollId: -1,
};

export function reducer(state = initialState, action: polls.Actions): State {
  switch (action.type) {
    case polls.POLL_CHECK:
      return oa(state, // Start with current state
        {
          openPollId: action.payload.currentPollId, // Set newest poll id
          prevPollId: state.openPollId, // Populate prev poll id
        },
        compLatestPoll(action.payload.currentPollId, state.prevPollId) // Compute latest poll id
      );

    case polls.POLL_UPDATE_SUCCESS:
      return {...state, stats: action.payload.pollStats.stats};
    
    case polls.POLL_UPDATE_START:
    case polls.POLL_UPDATE_FAILURE:
    default:
      return state;
  }  
}

/**
 * According to my quick logic table, this should either return {prevPollId: number}
 * with the correct (non -1) pollId, otherwise an empty object so we don't squash
 * a good existing prevPollId.
 * @param curr Current poll id
 * @param prev Prev poll id
 */
function compLatestPoll(curr: number, prev: number): {latestPollId?: number} {
  if (curr !== -1) {
    return {latestPollId: curr};
  } else if (prev !== -1) {
    return {latestPollId: prev};
  } else {
    return {}
  }
}

export const getStats = (state: State) => state.stats;
export const getLatestPollStats = (state: State) =>
  Maybe.fromNull(find(state.stats, p => p.id === state.latestPollId))
    .orSome(defaultPollStats);
export const getPollStatsById = (id: number) => (state: State) =>
  Maybe.fromNull(find(state.stats, p => p.id === id))
    .orSome(defaultPollStats);