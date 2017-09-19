import { Action } from '@ngrx/store';
import { concat, sortBy, filter, takeRight } from 'lodash';

import { ConversationMessage } from '../../models/chat';

import { oa, ds } from '../helpers';
import * as chat from './chat.actions';

export interface State {
  nickname: string;
  chat: ConversationMessage[];
  alerts: ConversationMessage[];
};

const initialState: State = {
  nickname: '',
  chat: [],
  alerts: []
};

export function reducer(state = initialState, action: chat.Actions): State {
  switch (action.type) {
    case chat.CHAT_ALERT:
      return {...state, alerts: concat(state.alerts, oa(action.payload))};
    
    case chat.CHAT_ALERT_ACK:
      const alerts = filter(state.alerts, msg => {
        return !(msg.messageTimestamp === action.payload.messageTimestamp
          && msg.fromUserId === action.payload.fromUserId);
      });
      return {...state, alerts}

    case chat.CHAT_RECEIVE_MESSAGE:
      return {...state, chat: concat(state.chat, oa(action.payload))};

    case chat.CHAT_GET_NICK_SUCCESS:
      return {...state, nickname: action.payload.nickname};

    case chat.CHAT_SEND_START:
    case chat.CHAT_SEND_SUCCESS:
    case chat.CHAT_SEND_FAILURE:
    default:
      return state;
  }
}

export function getLatestChat(count: number) {
  return (state: State) => takeRight(state.chat, count);
}