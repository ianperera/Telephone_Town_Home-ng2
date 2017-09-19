
export interface MinConversationMessage {
  readonly fromUserName: string;
  readonly text: string;
  readonly priority: number;
}

export interface ConversationMessage extends MinConversationMessage {
  readonly messageTimestamp: number;
  readonly fromUserSeqno: number;
  readonly fromUserId: string;
  readonly fromUserSessionId: string;
  readonly toParticipantId: number;
  readonly fromParticipantId: number;
}

export function genMessage(message: MinConversationMessage): ConversationMessage {
  return Object.assign({
    messageTimestamp: Date.now(),
    fromUserSeqno: -1,
    fromUserId: null,
    fromUserSessionId: null,
    toParticipantId: -1,
    fromParticipantId: -1,
  }, message);
}