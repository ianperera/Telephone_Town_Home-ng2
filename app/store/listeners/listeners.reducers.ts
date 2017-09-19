import { Action } from '@ngrx/store';

import { concat } from 'lodash';

import { ListenerSummaryEvent } from '../../models/events';
import { oa, ds } from '../helpers';
import * as listeners from './listeners.actions';

export interface State {
  stats: ListenerSummaryEvent[];
};

const initialState: State = {
  stats: [],
};

export function reducer(state = initialState, action: listeners.Actions): State {
  switch (action.type) {
    case listeners.LISTENERS_UPDATE:
      return {...state, stats: concat(state.stats, oa(action.payload))};

    default:
      return state;
  }  
}

export const getStats = (state: State) => state.stats;