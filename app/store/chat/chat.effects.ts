import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { EndpointsService } from '../../services/endpoints';
import { MinConversationMessage, ConversationMessage, genMessage } from '../../models/chat';
import * as chat from './chat.actions';

@Injectable()
export class ChatEffects {
  @Effect()
  chatSend$: Observable<Action> = this.actions$
    .ofType(chat.CHAT_SEND_START)
    .map((a: chat.ChatSendStart) => genMessage(a.payload))
    .mergeMap(message => this.endpoints.chatSend(message)
      .map(() => new chat.ChatSendSuccess())
      .catch(error => of(new chat.ChatSendFailure({message, error}))));

  @Effect()
  chatAlert$: Observable<Action> = this.actions$
    .ofType(chat.CHAT_RECEIVE_MESSAGE)
    .filter((a: chat.ChatReceiveMessage) => a.payload.priority === 2)
    .map(a => new chat.ChatAlert(a.payload));

  @Effect()
  getNickname$: Observable<Action> = this.actions$
    .ofType(chat.CHAT_GET_NICK_START)
    .mergeMap(() => this.endpoints.getNickname()
      .map(nickname => new chat.ChatGetNickSuccess({nickname}))
      .catch(error => of(new chat.ChatGetNickFailure({error}))));

  constructor(
    private actions$: Actions,
    private endpoints: EndpointsService,
  ) { }
}
