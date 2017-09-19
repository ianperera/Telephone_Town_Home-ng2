import {IQuestion} from "../../shared/event-streamer/event.interfaces";

export interface Phone {
    name: string;
    city: string;
    state: string;
    zip: string;
    playWelcome: boolean;
    raiseHand: boolean;
    limited: boolean;
    phone: string;
}

export interface PhoneParticipant {
    name: string;
    mode: number;
    type: string;
    phone: string;
    pin: boolean;
}

export interface ControlListener {
    localId: number;
    dialerLocation: string;
    conferenceId: string;
    localParticipantId: string;
    sharedParticipantId: number;
    sharedQuestionId: number;
    name: string;
    phoneNo: string;
    addressState: string;
    addressCity: string;
    addressZip: string;
    callConnectTime: number;
    callType: number;
    callTypeDesc: string;
    callerId: string;
    state: number;
    stateDesc: string;
    currentQuestion: IQuestion;
    previousQuestions: Array<IQuestion>;
}

export interface querySearch {
    filter:      string;
    hasQuestion: boolean;
    hasPrevious: boolean;
    state:       number;
    callType:    number;
}

export interface callProgress {
    dialedCnt:      number;
    scheduledCnt:   number;
    callsInUseCnt:  number;
    liveCnt:        number;
    amCnt:          number;
    confParticipants:   number;
    scheduleSeqno:  number;
    description:    string;
    maxChannels:    number;
}

export interface CampaignStatsEvent {
    // the stats field is used by the call progress panel to display dial stats
    stats: CampaignSummaryStats;
    hostCampaignStats: CampaignSummaryStats;
    schedules: Array<ScheduleStatBrief>;
    hostCampaignSchedules: Array<ScheduleStatBrief>;
    donationSummary: number;
    donations: Array<Donation>;
}

export interface Donation {
    ccNum: string;
    ccv2: string;
    ccType: string;
    ccFirstName: string;
    ccLastName: string;
    addrLine1: string;
    addrLine2: string;
    city: string;
    state: string;
    zip: string;
    ccExp: string;
    donationAmount: number;
}

export interface CampaignSummaryStats {
    scheduledCnt: number;
    dialedCnt: number;
    liveCnt: number;
    webCount: number;
    amCnt: number;
    problemCnt: number;
    otherCnt: number;
    callsInUseCnt: number;
    maxChannelsInUseCnt: number;
    confParticipants: number;
}

export interface ScheduleStatBrief {
    scheduleSeqno: number;
    campaignName: string;
    description: string;
    customerName: string;
    progress: string;
    dialerLoaded: boolean;
    dialerActive: boolean;
    info: string;
    warn: string;
    error: string;
    confParticipants: number;
    maxChannels: number;
    minutesLeft: number;
    plists: Array<PhoneListSummary>;
}

export interface PhoneListSummary {
    id: number;
    customerId: number;
    name: string;
    timezone: string;
    phoneEntryCount: number;
    dialedCount: number;
    type: string;
    vip: boolean;
    redialRunLevel: number;
}

export interface FirstPassInfo {
    dialed:  number;
    total:   number;
    percent: number;
}
