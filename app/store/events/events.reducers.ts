import { Action } from '@ngrx/store';

import { oa, ds } from '../helpers';
import * as events from './events.actions';

export interface State {
  polling: boolean;
};

const initialState: State = {
  polling: false
};

export function reducer(state = initialState, action: events.Actions): State {
  switch (action.type) {
  case events.POLLING_START:
    return {polling: true};
  case events.POLLING_END:
    return {polling: false};

  case events.POLL_START:
  case events.POLL_CANCEL:
  case events.POLL_SUCCESS:
  case events.POLL_FAILURE:
  case events.DISPATCH:
    default:
      return state;
  } 
}