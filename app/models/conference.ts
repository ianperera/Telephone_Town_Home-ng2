
export type ConfControlAction = 'start' | 'pause' | 'end';

export interface ConferenceSetup {
  eventName: string;
  customerName: string;
  customerId: number;
  conferenceId: number;
  aniMain: string;
  aniAlt: string;
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
  eventTimeZone: TimeZone;
  eventDate: string;
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
  phoneListsListener: ConferencePhoneList[];
  phoneListsVipListener: ConferencePhoneList[];
  pins: ConferencePin[];
  restrictedPins: string[];
  pollQuestions: Poll[];
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

export interface TimeZone {
  tzId: string;
  tzName: string;
  tzShortName: string;
  tzOffset: number;
}

export interface ConferencePhoneList {
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
  vip: boolean;
}

export interface Poll {
  id: number;
  campaignId: number;
  name: string;
  questionScript: string;
  answers: PollAnswer[];
  updateCount: number;
  deletable: boolean;
}

export interface PollAnswer {
  digit: string;
  answer: string;
}

export interface ConferencePin {
  userId: number;
  pin: string;
  firstName: string;
  lastName: string;
  role: string;
  phoneNo?: string;
  emailAddress?: string;
  webListener?: boolean;
  donationsAccepted?: boolean;
  listenerHandRaised?: boolean;
  profilePictureURL: string;
  nonInteractiveListener: boolean;
}
