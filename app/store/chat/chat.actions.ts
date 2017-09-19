import { Action } from '@ngrx/store';
//import { Chat } from './chat.reducers';
import { ConversationMessageEvent } from '../../models/events';
import { MinConversationMessage, ConversationMessage } from '../../models/chat';

export const CHAT_SEND_START = '[Chat] Send message start';
export const CHAT_SEND_SUCCESS = '[Chat] Send message success';
export const CHAT_SEND_FAILURE = '[Chat] Send message failure';
export const CHAT_RECEIVE_MESSAGE = '[Chat] Received message';
export const CHAT_ALERT = '[Chat] Received priority message';
export const CHAT_ALERT_ACK = '[Chat] Acknowledge priority message';
export const CHAT_GET_NICK_START = '[Chat] Get nickname start';
export const CHAT_GET_NICK_SUCCESS = '[Chat] Get nickname success';
export const CHAT_GET_NICK_FAILURE = '[Chat] Get nickname failure';

export class ChatSendStart implements Action {
  readonly type = CHAT_SEND_START;
  constructor(public payload: MinConversationMessage) {}
}
export class ChatSendSuccess implements Action {
  readonly type = CHAT_SEND_SUCCESS;
}
export class ChatSendFailure implements Action {
  readonly type = CHAT_SEND_FAILURE;
  constructor(public payload: {message: ConversationMessage, error: Error}) {}
}

export class ChatReceiveMessage implements Action {
  readonly type = CHAT_RECEIVE_MESSAGE;
  constructor(public payload: ConversationMessageEvent) {}
}
export class ChatAlert implements Action {
  readonly type = CHAT_ALERT;
  constructor(public payload: ConversationMessageEvent) {}
}
export class ChatAlertAck implements Action {
  readonly type = CHAT_ALERT_ACK;
  constructor(public payload: ConversationMessage) {}
}

export class ChatGetNickStart implements Action {
  readonly type = CHAT_GET_NICK_START;
}
export class ChatGetNickSuccess implements Action {
  readonly type = CHAT_GET_NICK_SUCCESS;
  constructor(public payload: {nickname: string}) {}
}
export class ChatGetNickFailure implements Action {
  readonly type = CHAT_GET_NICK_FAILURE;
  constructor(public payload: {error: Error}) {}
}

export type Actions =
  ChatSendStart
  | ChatSendSuccess
  | ChatSendFailure
  | ChatReceiveMessage
  | ChatAlert
  | ChatAlertAck
  | ChatGetNickStart
  | ChatGetNickSuccess
  | ChatGetNickFailure;