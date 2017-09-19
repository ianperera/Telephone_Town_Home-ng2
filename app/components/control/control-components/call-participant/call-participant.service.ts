import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share';
import {ReplaySubject} from 'rxjs/Rx';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {AuthService} from '../../../../auth.service';
import {RequestHelperService} from '../../../../request-helper.service';
import {ConferencePin} from "../../../calendar/conference.datatypes";

@Injectable()
export class CallParticipantService {
    private apiUrl: string = API_BASE_URL + '/api_telapp_conference/rest/json';
    private appSig: string = APP_SIG;

    private progress$: Observable<number>;
    private progress: number = 0;
    private progressObserver: any;
    private xhrObserver$: Observable<string>;
    private xhrObserver: any;

    private queryPageSize: number = 500;

    constructor(private authService: AuthService,
                private requestHelper: RequestHelperService) {
        this.progress$ = new Observable(observer => {
            this.progressObserver = observer
        });

        this.xhrObserver$ = new Observable(observer => {
            this.xhrObserver = observer
        });
    }

    //Call a participant by Form
    public calltoParticipantbyForm(PhoneParticipant:{
        name: string,
        phone: string,
        mode: number
    }): Promise<Response> {
        let sessionId = this.authService.sessionId;
        let requestData = JSON.stringify(PhoneParticipant);
        return this.requestHelper.requestPut(`${this.apiUrl}/callParticipant?sid=${sessionId}&appSig=${this.appSig}&mode=${PhoneParticipant.mode}&name=${PhoneParticipant.name}&phone=${PhoneParticipant.phone}`, requestData);
    }

    //Call a participant by Role
    public calltoParticipantbyRole(data: ConferencePin, mode: number): Promise<Response> {
     let sessionId = this.authService.sessionId;
     let participantData = JSON.stringify(data);
     return this.requestHelper.requestPost(`${this.apiUrl}/callParticipant?sid=${sessionId}&appSig=${this.appSig}&mode=${mode}&pin=${participantData}`, participantData);
    }

    //Hangup a participant
    public hangupParticipantCall(megaCallId: number): Promise<Response> {
        let sessionId = this.authService.sessionId;
        return this.requestHelper.requestDelete(`${this.apiUrl}/callParticipant/${megaCallId}?sid=${sessionId}&appSig=${this.appSig}`);
    }

    //Lookup a participant
    public lookUpParticipant(megaCallId: number): Promise<Response> {
        let sessionId = this.authService.sessionId;
        return this.requestHelper.requestGet(`${this.apiUrl}/callParticipant/${megaCallId}?sid=${sessionId}&appSig=${this.appSig}`);
    }

    public pinLookup(): Promise<Response> {
        let sessionId = this.authService.sessionId;
        return this.requestHelper.requestGet(`${this.apiUrl}/conferencePinEdit/-1?sid=${sessionId}&appSig=${this.appSig}`);
    }

    /**Other Dialing Methods
     ** Start/Stop/Abort
     ** Parameter scheduleId is scheduleSeqno in hostCampaignSchedules list.
     ****/

    public startOutboundDial(scheduleSeqno: number): Promise<Response> {
        let sessionId = this.authService.sessionId;
        return this.requestHelper.requestGet(`${this.apiUrl}/conferenceParticipantDialControl/${scheduleSeqno}?sid=${sessionId}&appSig=${this.appSig}`);
    }

    public stopOutboundDial(scheduleSeqno: number): Promise<Response> {
        let sessionId = this.authService.sessionId;
        return this.requestHelper.requestDelete(`${this.apiUrl}/conferenceParticipantDialControl/${scheduleSeqno}?sid=${sessionId}&appSig=${this.appSig}`);
    }

    public abortOutboundDial(scheduleSeqno: number): Promise<Response> {
        let sessionId = this.authService.sessionId;
        return this.requestHelper.requestDelete(`${this.apiUrl}/conferenceParticipantDialControl/${scheduleSeqno}?sid=${sessionId}&appSig=${this.appSig}&abort=true`);
    }
}