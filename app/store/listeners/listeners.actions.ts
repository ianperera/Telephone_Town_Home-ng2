import { Action } from '@ngrx/store';
import { ListenerSummaryEvent } from '../../models/events';

export const LISTENERS_UPDATE = '[Listeners] Listener summary';

export class ListenersUpdate implements Action {
  readonly type = LISTENERS_UPDATE;
  constructor(public payload: ListenerSummaryEvent) {}
}

export type Actions = ListenersUpdate;