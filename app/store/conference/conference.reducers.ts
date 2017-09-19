import { Action } from '@ngrx/store';

import { ConfControlAction, ConferenceSetup } from '../../models/conference';
import { ConferenceStatusEvent } from '../../models/events';

import { oa, ds } from '../helpers';
import * as conf from './conference.actions';

export interface State {
  setup: ConferenceSetup;
  status: ConferenceStatusEvent;
  pending: boolean; // Pending during conf control actions
  initialized: boolean; // Initialized false until get setup returns true
}

const initialState: State = {
  setup: undefined,
  status: undefined,
  pending: false,
  initialized: false,
};

export function reducer(state = initialState, action: conf.Actions): State {
  switch (action.type) {
    case conf.CONF_STATUS_UPDATE:
      return {...state, status: oa(action.payload)};

    case conf.CONF_EXIT:
      return {...initialState};

    case conf.CONF_CONTROL_START:
      return {...state, pending: true};
    case conf.CONF_CONTROL_SUCCESS:
    case conf.CONF_CONTROL_FAILURE:
      return {...state, pending: false};
    
    case conf.CONF_GET_SETUP_SUCCESS:
      return {...state, initialized: true, setup: oa(action.payload)};

    case conf.CONF_GET_SETUP_START:
    case conf.CONF_GET_SETUP_FAILURE:
    default:
      return state;
  }
}

export const getSetup = (state: State) => state.setup;
export const getStatus = (state: State) => state.status;
export const getPending = (state: State) => state.pending;
export const getInitialized = (state: State) => state.initialized;