export interface ValidationMessage {
    message: string;
    fieldName: string;
    decorator: string;
}


export interface ConferenceSetup {
    eventName: string;
    customerName: string;
    customerId: number;
    conferenceId: number;
    aniMain: string;
    aniAlt: string;
    aniMainSelect: string;          //for editable field on Caller ID
    parkInbound: boolean;
    parkInboundDisabled: boolean;
    inboundListeners: boolean;
    inboundDisabled: boolean;
    recordAudio: boolean;
    announceHostJoined: boolean;
    announceHostLeft: boolean;
    announceHostAnonymous: boolean;
    announceType: string;
    hideListenerStats: boolean;
    whisperPrompts: boolean;
    screeningRequired: boolean;
    joinDigit: string;
    raiseHandDigit: string;
    donateDigit: string;
    inboundHandRaised: boolean;
    callTransferDigit: string;
    callTransferNumber: string;
    useAudioTestimonial: boolean;
    atLive: VoiceFile;
    atInvalid: VoiceFile;
    atBye: VoiceFile;
    audioTestimonialId: number;
    voxAnsweringMachine: VoiceFile;
    voxLive: VoiceFile;
    voxHoldMusic: VoiceFile;
    option0: VoiceFile;
    option1: VoiceFile;
    option2: VoiceFile;
    option3: VoiceFile;
    option4: VoiceFile;
    option5: VoiceFile;
    option6: VoiceFile;
    option7: VoiceFile;
    option8: VoiceFile;
    option9: VoiceFile;
    optionOther: VoiceFile;
    eventTimeZone: CalendarConferenceTimeZone;
    eventDate: string;
    eventLengthMS: number;
    eventLengthMin: number;
    eventPhoneListSize: number;
    hostStartOffset: number;
    hostEndOffset: number;
    hostOutboundStartOffset: number;
    hostScheduleId: number;
    hostOutboundScheduleId: number;
    bcScheduleId: number;
    vipScheduleId: number;
    hostActiveFrom: string;
    hostActiveUntil: string;
    scrubWireless: boolean;
    phoneListsListener: Array<ConferencePhoneList>;
    phoneListsVipListener: Array<ConferencePhoneList>;
    pins: Array<ConferencePin>;
    restrictedPins: Array<string>;
    pollQuestions: Array<Poll>;
    listenerShowPollResults: boolean;
    complete: boolean;
    paypalUsername: string;
    paypalPassword: string;
    paypalApiKey: string;
    paypal3rdPartyEmail: string;
    hostOnly: boolean;
    createEventCustomer: boolean;
    updateCount: number;
    userstamp: string;
    hostCampaignId: number;
    dialerErrorMessage: string;
    aniRouted: boolean;
    active: boolean;
    eventStreamId: string;
    agenda: string;
    hidePollStats: boolean;
    eternal: boolean;
    createDefaultPins: boolean;
    sharedParentDNC: boolean;
    outboundDialMax: number;
    routeMeError: string;
    voxCustomHostGreeting: VoiceFile;
}


export interface ConferencePhoneList {
    vip: boolean;
    id: number;
    customerId: number;
    name: string;
    timezone: string;
    phoneEntryCount: number;
    dialedCount: number;
    availableCount: number;
    big: boolean;
    type: string;
    exportDate: string;
    agentConnectCount: number;
    dncNationalCount: number;
    userstamp: string;
    timestamp: string;
}

export interface CalendarConferenceTimeZone {
    tzId: string;
    tzName: string;
    tzShortName: string;
    tzOffset: number;
}


export interface Poll {
    id: number;
    campaignId: number;
    name: string;
    questionScript: string;
    deletable: boolean;
    updateCount: number;
    answers: Array<PollAnswer>;
}


export interface PollAnswer {
    digit: string;
    answer: string;
}


export interface VoiceFile {
    id: number;
    customerId: number;
    name: string;
    active: boolean;
    script: string;
    ttsLanguage: string;
    ttsGender: string;
    ttsVoice: string;
    lastAccessed: string;
    lastModified: string;
    audioLengthInSeconds: number;
}


export interface ConferencePin {
    userId: number;
    pin: string;
    firstName: string;
    lastName: string;
    role: string;
    phoneNo: string;
    emailAddress: string;
    webListener: boolean;
    donationsAccepted: boolean;
    listenerHandRaised: boolean;
    profilePictureURL: string;
    nonInteractiveListener: boolean;
}


export interface ConferenceEventSchedule {
    parentCustomerId: number;
    customerId: number;
    customerName: string;
    hostCampaignId: number;
    hostScheduleId: number;
    eventName: string;
    eventDate: string;
    eventLengthMin: number;
    deleted: boolean;
    activeFrom: string;
    activeUntil: string;
    setup: ConferenceSetup;
    onAirTime: number;
    offAirTime: number;
    eventTimeZone: CalendarConferenceTimeZone;
    active: boolean;
    aniMain: string;
    agenda: string;
}

export interface ConferenceReschedule {
    newDate: Date;
    duration: number;
}

export interface ConferenceFullDuplicate {
    newDate: Date;
    duration: number;
    newName: string;
    keepRoles: boolean;
    keepPhone: boolean;
    keepPolls: boolean;
    keepLiveGreeting: boolean;
    keepAnsMachine: boolean;
    keepHoldMusic: boolean;
}

export enum ConferenceModules {
    setup,
    control,
    listen,
    report
}