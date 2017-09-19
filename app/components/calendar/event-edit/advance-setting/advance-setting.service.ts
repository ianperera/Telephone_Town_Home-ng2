import {Injectable} from '@angular/core';

@Injectable()
export class AdvanceSettingService {

    formValues = {
        sharedParentDNC: null,
        announceHostJoined: null,
        announceHostLeft: null,
        whisperPrompts: null,
        screeningRequired: null,
        inboundHandRaised: null,
        hostAnnounceTypeValue: null,
        joinDigitValue: null,
        callTransferDigitValue: null,
        raiseHandValue: null,
        donateDigitValue: null,
        recordAudio: null,
        callTransferNumber: null,
        outboundDialMax: null,
        useAudioTestimonial: null,
        eternal: null,
        hostOnly: null
    };

    dropdowns = {
        hostAnnounceType: [],
        joinDigitValues: [],
        callTransferDigitValues: [],
        raiseHandValues: [],
        donateDigitValues: []
    };
}
