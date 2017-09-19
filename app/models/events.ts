
/**
 * Base interfaces for streaming events.
 */
export interface StreamEvent {
  readonly timestamp: number;
  readonly count: number;
  readonly clientId: string;
  readonly type: string;
}

export interface StreamRequest {
  readonly sessionId: string;
  readonly sync: boolean;
  readonly streamId?: string;
  readonly features: StreamFeature[] 
}

export interface StreamFeature {
  readonly type: 'sfConf'; // Technically can also be sfStreamFeatureSessionStore
  readonly conferenceId: string;
  readonly participantEvents: boolean;
  readonly listenerEvents: boolean;
  readonly stateEvents: boolean;
  readonly questionEvents: boolean;
  readonly chatEvents: boolean;
  readonly screenerParticipantEvents: boolean;
  readonly campaignEvents: boolean;
}

/**
 * A default StreamRequest factory.
 */
export function genRequest(
    req: {sessionId: string} & Partial<StreamRequest>,
    feats: {conferenceId: string} & Partial<StreamFeature>
  ): StreamRequest {
  // Setup default features array
  const features = [Object.assign({
    type: 'sfConf',
    conferenceId: '',
    participantEvents: true,
    listenerEvents: true,
    stateEvents: true,
    questionEvents: true,
    chatEvents: true,
    screenerParticipantEvents: true,
    campaignEvents: true
  }, feats)];
  return Object.assign({sessionId: '', sync: false, features}, req);
}
 
/**
 * Participant Events
 */
export interface ParticipantUpdateEvent extends StreamEvent {
  readonly type: 'sdConfPartUpdateEvent';
  readonly conferenceId: string;
  readonly participant: ParticipantData;
}

export interface ParticipantAssignEvent extends StreamEvent {
  readonly type: 'sdConfPartAssignEvent';
  readonly conferenceId: string;
  readonly participant: ParticipantData;
}

export interface ParticipantChooseEvent extends StreamEvent {
  readonly type: 'sdConfPartChooseEvent';
  readonly conferenceId: string;
  readonly participants: ParticipantData[];
}

export interface ParticipantRemovedEvent extends StreamEvent {
  readonly type: 'sdConfPartRemovedEvent';
  readonly conferenceId: string;
  readonly participantId: number;
}

export interface ParticipantAudioEvent extends StreamEvent {
  readonly type: 'sdConfPartAudioEvent';
  readonly conferenceId: string;
  readonly audioLevel: ParticipantAudioLevel;
}

export type ParticipantEvent =
  ParticipantUpdateEvent
  | ParticipantAssignEvent
  | ParticipantChooseEvent
  | ParticipantRemovedEvent
  | ParticipantAudioEvent

/**
 * Question Events
 */
export interface QuestionUpdateEvent extends StreamEvent {
  readonly type: 'sdQuestionUpdate';
  readonly conferenceId: string;
  readonly question: QuestionData;
}

export interface QuestionRemovedEvent extends StreamEvent {
  readonly type: 'sdQuestionRemoved';
  readonly conferenceId: string;
  readonly questionId: number;
}

export interface QuestionStateGroupRemovedEvent extends StreamEvent {
  readonly type: 'sdQuestionStateGroupRemoved';
  readonly conferenceId: string;
}

export type QuestionEvents =
  QuestionUpdateEvent
  | QuestionRemovedEvent
  | QuestionStateGroupRemovedEvent;

/**
 * Conference Status Event
 */
export interface ConferenceStatusEvent extends StreamEvent {
  readonly type: 'sdConfState';
  readonly conferenceId: string;
  readonly status: number;
  readonly coordinatorLocation: string;
  readonly playerStatus: number;
  readonly playerVoxId: number;
  readonly playerVolume: number;
  readonly currentPollId: number;
  readonly pollRefreshCounter: number;
  readonly recorderStatus: number;
  readonly recordingId: string;
  readonly streamerStatus: number;
  readonly streamPlaybacks: ConferenceStreamPlayback[];
}

/**
 * Campaign Stats Event (Time Series Data)
 */
export interface CampaignStatsEvent extends StreamEvent {
  readonly type: 'sdCampaignStats';
  readonly conferenceId: string;
  readonly stats: CampaignSummaryStats;
  readonly hostCampaignStats: CampaignSummaryStats;
  readonly schedules: ScheduleStatBrief[];
  readonly hostCampaignSchedules: ScheduleStatBrief[];
  readonly donationSummary: number;
  readonly donations: Donation[];
}

/**
 * Listenener Summary Event (Time Series Data)
 */
export interface ListenerSummaryEvent extends StreamEvent {
  readonly type: 'sdListenerSummary';
  readonly handRaisedCount: number;
  readonly screeningCount: number;
  readonly screenedCount: number;
  readonly ondeckCount: number;
  readonly liveCount: number;
  readonly inboundCount: number;
  readonly outboundCount: number;
  readonly webCount: number;
  readonly listenerCount: number;
}

/**
 * Conversation Message Event (Time Series Data)
 */
export interface ConversationMessageEvent extends StreamEvent {
  readonly type: 'sdConversationMessage';
  readonly messageTimestamp: number;
  readonly fromUserSeqno: number;
  readonly fromUserName: string;
  readonly fromUserId: string;
  readonly fromUserSessionId: string;
  readonly text: string;
  readonly priority: number;
  readonly toParticipantId: number;
  readonly fromParticipantId: number;
}

export type StreamEvents =
  ParticipantUpdateEvent
  | ParticipantAssignEvent
  | ParticipantChooseEvent
  | ParticipantRemovedEvent
  | ParticipantAudioEvent
  | QuestionUpdateEvent
  | QuestionRemovedEvent
  | QuestionStateGroupRemovedEvent
  | ConferenceStatusEvent
  | CampaignStatsEvent
  | ListenerSummaryEvent
  | ConversationMessageEvent;

/**
 * Vanilla interfaces used by stream events
 */
export interface ConferenceStreamPlayback {
  readonly streamRtmpEndpoint: string;
}

export interface CampaignSummaryStats {
  readonly scheduledCnt: number;
  readonly dialedCnt: number;
  readonly liveCnt: number;
  readonly webCount: number;
  readonly amCnt: number;
  readonly problemCnt: number;
  readonly otherCnt: number;
  readonly callsInUseCnt: number;
  readonly maxChannelsInUseCnt: number;
  readonly confParticipants: number;
}

export interface ScheduleStatBrief {
  readonly scheduleSeqno: number;
  readonly campaignName: string;
  readonly description: string;
  readonly customerName: string;
  readonly progress: string;
  readonly dialerLoaded: boolean;
  readonly dialerActive: boolean;
  readonly info: string;
  readonly warn: string;
  readonly error: string;
  readonly confParticipants: number;
  readonly maxChannels: number;
  readonly minutesLeft: number;
  readonly plists: PhoneListSummary[];
}

export interface PhoneListSummary {
  readonly id: number;
  readonly customerId: number;
  readonly name: string;
  readonly timezone: string;
  readonly phoneEntryCount: number;
  readonly dialedCount: number;
  readonly type: string;
  readonly vip: boolean;
  readonly redialRunLevel: number;
}

export interface Donation {
  readonly ccNum: string;
  readonly ccv2: string;
  readonly ccType: string;
  readonly ccFirstName: string;
  readonly ccLastName: string;
  readonly addrLine1: string;
  readonly addrLine2: string;
  readonly city: string;
  readonly state: string;
  readonly zip: string;
  readonly ccExp: string;
  readonly donationAmount: number;
}

export interface ParticipantData {
  readonly id: number;
  readonly userId: number;
  readonly screenQuestionId: number;
  readonly type: number;
  readonly typeDesc: string;
  readonly name: string;
  readonly phoneNo: string;
  readonly dialerLocation: string;
  readonly status: number;
  readonly statusDesc: string;
  readonly callId: number;
  readonly megaCallId: number;
  readonly callProgressDesc: string;
  readonly audioStatus: number;
  readonly volume: number;
  readonly audioLevel: number;
  readonly coachedByParticipantId: number;
  readonly coachingParticipantId: number;
  readonly moderatorNotes: string;
  readonly assignedSID: string;
}

export interface ParticipantAudioLevel {
  readonly id: number;
  readonly audioLevel: number;
}

export interface QuestionData {
  readonly id: number;
  readonly participantId: number;
  readonly dataId: number;
  readonly status: number;
  readonly name: string;
  readonly phoneNo: string;
  readonly dialerLocation: string;
  readonly question: string;
  readonly screenerNotes: string;
  readonly addressState: string;
  readonly addressCity: string;
  readonly addressZip: string;
  readonly handRaisedTimestamp: number;
  readonly statusChangedTimestamp: number;
  readonly liveTimestamp: number;
  readonly rating: number;
  readonly donationIndicator: boolean;
  readonly screenerParticipantId: number;
  readonly screenerName: string;
  readonly listenerVolume: number;
}
