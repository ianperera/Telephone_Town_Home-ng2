export function isConferenceEvent(event: IStreamEvent): event is IConferenceEvent {
    return (<IConferenceEvent>event).conferenceId !== undefined;
}

// General Event Interfaces
export interface IStreamEvent {
    readonly timestamp: number;
    readonly count: number;
    readonly clientId: string;
    readonly type: string;
}

export interface IConferenceEvent extends IStreamEvent {
    readonly conferenceId: string;
}


// Extensions of Conference Events (also Stream Events)
export interface ICampaignStatsEvent extends IConferenceEvent {
    readonly stats: ICampaignSummaryStats;
    readonly hostCampaignStats: ICampaignSummaryStats;
    readonly schedules: IScheduleStatBrief[];
    readonly hostCampaignSchedules: IScheduleStatBrief[];
    readonly donationSummary: number;
    readonly donations: IDonation[];
}

export interface IParticipantAssignEvent extends IConferenceEvent {
    readonly participant: IParticipant;
}

export interface IParticipantUpdateEvent extends IConferenceEvent {
    readonly participant: IParticipant;
}

export interface IParticipantChooseEvent extends IConferenceEvent {
    readonly participants: IParticipant[];
}

export interface IParticipantRemovedEvent extends IConferenceEvent {
    readonly participantId: number;
}

export interface IParticipantAudioEvent extends IConferenceEvent {
    readonly audioLevel: IParticipantAudioLevel;
}

export interface IQuestionRemovedEvent extends IConferenceEvent {
    readonly questionId: number;
}

export interface IQuestionUpdateEvent extends IConferenceEvent {
    readonly question: IQuestion;
}

export interface IQuestionStateGroupRemovedEvent extends IConferenceEvent {

}

export interface IConferenceStatusEvent extends IConferenceEvent {
    readonly status: number;
    readonly coordinatorLocation: string;
    readonly playerStatus: number;
    readonly playerVoxId: number;
    readonly playerVolume: number;
    readonly currentPollId: number;
    readonly pollRefreshCounter: number;
    readonly recorderStatus: number;
    readonly recordingId: String;
    readonly streamerStatus: number;
    readonly streamPlaybacks: IConferenceStreamPlayback[];
}

// Extensions of Stream Events
export interface IListenerSummaryEvent extends IStreamEvent {
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

export interface IConversationMessageEvent extends IStreamEvent {
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

// Vanilla interfaces used as parameters of Stream Events
export interface IConferenceStreamPlayback {
    readonly streamRtmpEndpoint: string;
}

export interface ICampaignSummaryStats {
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

export interface IScheduleStatBrief {
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
    readonly plists: IPhoneListSummary[];
}

export interface IPhoneListSummary {
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

export interface IDonation {
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

export interface IParticipant {
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

export interface IParticipantAudioLevel {
    readonly id: number;
    readonly audioLevel: number;
}

export interface IQuestion {
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