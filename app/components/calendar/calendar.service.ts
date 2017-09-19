import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share';
import { ReplaySubject } from 'rxjs/Rx';

import {Http, Response, Headers, RequestOptions} from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { AdvanceSettingService} from './event-edit/advance-setting/advance-setting.service';

import {AuthService} from '../../auth.service';
import {RequestHelperService} from '../../request-helper.service';
import {
    CalendarConferenceTimeZone,
    ConferenceSetup,
    ConferenceFullDuplicate,
    ConferenceReschedule
} from './conference.datatypes';


@Injectable()
export class CalendarService {
    emitter: ReplaySubject<any> = new ReplaySubject(1);
    private apiUrl: string = API_BASE_URL + '/api_telapp_conference/rest/json';
    private appSig: string = APP_SIG;

    private progress$: Observable<number>;
    private progress: number = 0;
    private progressObserver: any;
    private xhrObserver$: Observable<string>;
    private xhrObserver: any;

    private queryPageSize: number = 500;

    private apiUrlTelappSec: string = API_BASE_URL + '/api_telapp_sec/rest/json';

    restSettings = {
        updateCount: null,
        userstamp: null
    };

    // Global events
    loadevent(value){
        this.emitter.next(value);
    }

    constructor(private authService: AuthService,
                private advanceSettingService: AdvanceSettingService,
                private requestHelper: RequestHelperService) {
        this.progress$ = new Observable(observer => {
            this.progressObserver = observer
        });

        this.xhrObserver$ = new Observable(observer => {
            this.xhrObserver = observer
        });
    }


    deleteConference(hostScheduleId: string): Promise<any> {
        if (confirm('Are you sure to delete this user?')) {
            return this.requestHelper.requestDelete(`${this.apiUrl}/conferenceEdit/${hostScheduleId}?appSig=${this.appSig}&sid=${this.authService.sessionId}`);
        }
    }


    /**
     * create a new conference.  consider renaming to newConference.
     * @param conferenceEvent
     * @returns {Promise<Response>}
     */
    conferenceEdit(conferenceEvent: {
        eventName: string,
        createEventCustomer: boolean,
        eventDate: Date,
        eventTimeZone: CalendarConferenceTimeZone,
        phoneListsListener: any[],
        eventPhoneListSize: number,
        eventLengthMin: number
        simpleConference: boolean,

    }): Promise<Response> {
        let formatDate = (date: Date) => new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16).replace(/(\d{4})\-(\d{2})\-(\d{2})T(\d{2}):(\d{2})/, '$2\/$3\/$1 $4:$5'),
            requestData = JSON.stringify({
                "eventDate": formatDate(conferenceEvent.eventDate),
                "hostScheduleId": -1,
                "eventLengthMin": conferenceEvent.eventLengthMin,                                                             // need to read this from the advanced settings in the dialog
                "eventName": conferenceEvent.eventName,
                "eventTimeZone": conferenceEvent.eventTimeZone,
                "eventPhoneListSize": conferenceEvent.eventPhoneListSize,
                "phoneListsListener": conferenceEvent.phoneListsListener,
                "createEventCustomer": conferenceEvent.createEventCustomer,
                "aniMain": null,
                "aniAlt": null,
                "voxAnsweringMachine": null,
                "voxLive": null,
                "voxHoldMusic": null,
                "pins": null,
                "recordAudio": true,
                "hideListenerStats": false,
                "hidePollStats": false,
                "customerName": null,
                "complete": false,
                "hostActiveFrom": null,
                "hostActiveUntil": null,
                "announceHostJoined": false,
                "announceHostLeft": false,
                "announceHostAnonymous": false,
                "whisperPrompts": false,
                "screeningRequired": true,
                "joinDigit": null,
                "raiseHandDigit": "0",
                "pollQuestions": [],
                "eternal": conferenceEvent.simpleConference,
                "hostOnly": conferenceEvent.simpleConference,                                                                // this needs to come from the advanced settings dialog box also
                "hostEndOffset": -1,
                "hostStartOffset": -1,
                "hostOutboundScheduleId": -1,
                "hostOutboundStartOffset": -1,
                "callTransferDigit": null,
                "callTransferNumber": null,
                "option0": null,
                "option1": null,
                "option2": null,
                "option3": null,
                "option4": null,
                "option5": null,
                "option6": null,
                "option7": null,
                "option8": null,
                "option9": null,
                "optionOther": null,
                "updateCount": 0,
                "userstamp": null,
                "paypalUsername": null,
                "paypalPassword": null,
                "paypalApiKey": null,
                "paypal3rdPartyEmail": null,
                "listenerShowPollResults": false,
                "aniRouted": false,
                "inboundListeners": false,
                "parkInbound": false,
                "parkInboundDisabled": false,
                "phoneListsVipListener": null,
                "vipScheduleId": -1,
                "sharedParentDNC": false,
                "useAudioTestimonial": false,
                "atLive": null,
                "atInvalid": null,
                "atBye": null,
                "audioTestimonialId": -1,
                "inboundHandRaised": false,
                "scrubWireless": false,
                "inboundDisabled": false,
                "bcScheduleId": -1,
                "hostCampaignId": -1,
                "customerId": -1,
                "dialerErrorMessage": null,
                "donateDigit": null,
                "restrictedPins": null,
                "active": false,
                "eventStreamId": null,
                "agenda": APP_NAME,
                "announceType": "CID"
            });
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.appSig}.${this.authService.sessionId}`
        });
        let options = new RequestOptions({headers});
        return this.requestHelper.requestPost(`${this.apiUrl}/conferenceEdit?appSig=${this.appSig}&sid=${this.authService.sessionId}`, requestData, options);
    }


    /**
     * search for events in the conference calendar
     * @param dateFrom
     * @param dateUntil
     * @param eventName
     * @returns {Promise<Response>}
     */
    conferenceCalendarLookupForm(dateFrom: Date,
                                 dateUntil: Date,
                                 eventName: string = null): Promise<Response> {
        let formatDate = (date: Date) => new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16).replace(/(\d{4})\-(\d{2})\-(\d{2})T(\d{2}):(\d{2})/, '$2\/$3\/$1\+$4:$5'),
            queryParams = JSON.stringify({
                "eventName": eventName,
                "customerName": null,
                "hostScheduleId": -1,
                "hostCampaignId": -1,
                "dateFrom": formatDate(dateFrom), // "10/1/2016+00:00"
                "dateUntil": formatDate(dateUntil), // "10/31/2016+23:59"
                "includeSubcustomers": true,
                "includeOffAirOverThreshold": false,
                "minOnAirFilter": 0,
                "minOffAirFilter": -1,
                "currentCustomerId": -1,
                "clientTZOffset": 0
            });
        return this.requestHelper.requestGet(`${this.apiUrl}/conferenceCalendarLookupForm?appSig=${this.appSig}&sid=${this.authService.sessionId}&queryParam=${queryParams}&loadRuntimeStats=true&loadCustomerPath=true&queryPageSize=${this.queryPageSize}`);
    }


    lookupCodeSetups(): Promise<Response> {
        return this.requestHelper.requestGet(`${this.apiUrlTelappSec}/lookupCodeSetups?appSig=${this.appSig}&sid=${this.authService.sessionId}&codeGroups=["TIMEZONE"]`);
    }

    public getObserver(): Observable<number> {
        return this.progress$;
    }


    public conferenceDelete(hostScheduleId: number): Promise<any> {
        return this.requestHelper.requestDelete(`${this.apiUrl}/conferenceEdit/${hostScheduleId}?appSig=${this.appSig}&sid=${this.authService.sessionId}`);
    }

    /**
     * update the conference event passed in.
     * @param conferenceEvent
     * @returns {Promise<Response>}
     */
    public conferenceUpdate(conferenceEvent: ConferenceSetup): Promise<Response> {
        if (!this.advanceSettingService.formValues.outboundDialMax) {
            conferenceEvent.outboundDialMax = -1;
        }

        let requestData = JSON.stringify(conferenceEvent);
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.appSig}.${this.authService.sessionId}`
        });
        let options = new RequestOptions({headers});
        return this.requestHelper.requestPut(`${this.apiUrl}/conferenceEdit`, requestData, options);
    }


    /**
     * validate the fields in this conference, returning missing/invalid fieldss
     * @param conferenceEvent
     * @returns {Promise<Response>}
     */
    public conferenceValidate(conferenceEvent: ConferenceSetup): Promise<Response> {

        if (!this.advanceSettingService.formValues.outboundDialMax) {
            conferenceEvent.outboundDialMax = -1;
        }

        let requestData = JSON.stringify(conferenceEvent);
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.appSig}.${this.authService.sessionId}`
        });
        let options = new RequestOptions({headers});
        return this.requestHelper.requestPost(`${this.apiUrl}/validateConference`, requestData, options);
    }


    /**
     * load a conference setup
     * @param id
     * @returns {Promise<Response>}
     */
    getConferenceEvent(id: string, refreshData:boolean = true): Promise<Response> {
        if (refreshData) {
            this.loadDropDownsData(id);
        }
        return this.requestHelper.requestGet(`${this.apiUrl}/conferenceEdit/${id}?appSig=${this.appSig}&sid=${this.authService.sessionId}`);
    }


    /**
     * load the code setups used to populate assorted dropdown lists
     * @param id
     */
    loadDropDownsData(id) {
        this.fetchDataUsingCommonMehtod("CONFANNO", id);
        this.fetchDataUsingCommonMehtod("PHONEDIG", id);
        this.fetchDataUsingCommonMehtod("HANDRAIS", id);

    }

    private fetchDataUsingCommonMehtod(groupName, id): void {

        var appSig = APP_SIG;
        var sessionId = this.authService.sessionId;

        var state_api = API_BASE_URL + '/api_telapp_sec/rest/json/lookupCodeSetups?appSig=' + appSig + '&sid=' + sessionId + '&codeGroups=["' + groupName + '"]';

        this.requestHelper.requestGet(state_api).then((response) => {
            var dataListCommon = [];
            console.log("response to chech here");
            console.log(response);
            var states = response["data"][groupName];

            var state_list = [];
            for (var state in states) {
                var key = states[state]["key"];
                var value = states[state]["value"];
                state_list.push({"key": key, "value": value});
            }
            if (groupName == "CONFANNO") {
                this.advanceSettingService.dropdowns.hostAnnounceType = state_list;
            } else if (groupName == "PHONEDIG") {
                this.advanceSettingService.dropdowns.joinDigitValues = state_list;
                this.advanceSettingService.dropdowns.callTransferDigitValues = state_list;
            } else if (groupName == "HANDRAIS") {
                this.advanceSettingService.dropdowns.raiseHandValues = state_list;
                this.advanceSettingService.dropdowns.donateDigitValues = state_list;
            }

        });
    }


    /**
     * Conference Duplicate that related on Other Schedules
     * Create by Posh on 01/24/17
     */
    conferenceReschedule(conferenceEvent: ConferenceReschedule, confId: number): Promise<Response> {
        let formatDate = (date: Date) => new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16).replace(/(\d{4})\-(\d{2})\-(\d{2})T(\d{2}):(\d{2})/, '$2\/$3\/$1 $4:$5'),
            newDate = formatDate(conferenceEvent.newDate),
            duration = conferenceEvent.duration;
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.appSig}.${this.authService.sessionId}`
        });
        let options = new RequestOptions({headers});
        return this.requestHelper.requestPost(`${this.apiUrl}/conferenceReschedule/${confId}?appSig=${this.appSig}&sid=${this.authService.sessionId}&newDate=${newDate}&duration=${duration}`, '', options);
    }


    /**
     * Full Conference Duplicate as a template (new conference)
     * Create by Posh on 01/24/17
     */
    conferenceFullDuplicate(conferenceEvent: ConferenceFullDuplicate, confId: number): Promise<Response> {
        let formatDate = (date: Date) => new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16).replace(/(\d{4})\-(\d{2})\-(\d{2})T(\d{2}):(\d{2})/, '$2\/$3\/$1 $4:$5'),
            newDate = formatDate(conferenceEvent.newDate),
            duration = conferenceEvent.duration;

        let objConferenceEvent:any;
        objConferenceEvent= Object.assign({},conferenceEvent);
        objConferenceEvent.newDate = newDate;
        let requestData = JSON.stringify(objConferenceEvent);

        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.appSig}.${this.authService.sessionId}`
        });
        let options = new RequestOptions({headers});
        return this.requestHelper.requestPost(`${this.apiUrl}/conferenceFullDuplicate/${confId}?appSig=${this.appSig}&sid=${this.authService.sessionId}&newDate=${newDate}&duration=${duration}`, requestData, options);
    }


    /**
     * Export Calendar by date select and during a month
     * Create by Posh on 01/13/17
     */
    public generateCalendarFileUrl(hostScheduleId: string): string {
        let url = `${this.apiUrl}/conferenceCalendar/${hostScheduleId}?appSig=${this.appSig}&sid=${this.authService.sessionId}`;
        return encodeURI(url);
    }


    public generateCalendarFileUrlByDateRange(dateFrom: Date, dateTo: Date): string {
        let formatDate = (date: Date) => new Date(date.getTime() - date.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16)
            .replace(/(\d{4})\-(\d{2})\-(\d{2})T(\d{2}):(\d{2})/, '$2\/$3\/$1\+$4:$5');

        let url = `${this.apiUrl}/conferenceCalendar?appSig=${this.appSig}&sid=${this.authService.sessionId}`;

        if (dateFrom) {
            url += '&from=' + formatDate(dateFrom);
        }

        if (dateTo) {
            url += '&to=' + formatDate(dateTo);
        }

        return encodeURI(url);
    }


    relatedConferences(confId): Promise<Response> {
        return this.requestHelper.requestGet(`${this.apiUrl}/relatedConferences/${confId}?appSig=${this.appSig}&sid=${this.authService.sessionId}`);
    }


    getMyPin(): Promise<Response> {
        var sessionId = this.authService.sessionId;
        return this.requestHelper.requestGet(`${this.apiUrl}/getMyPin?sid=${sessionId}&appSig=${this.appSig}`);
    }
}
