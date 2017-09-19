import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share';

import {Http, Response, Headers, RequestOptions} from '@angular/http';

import 'rxjs/add/operator/toPromise';

import {AuthService} from '../../../../auth.service';
import {RequestHelperService} from '../../../../request-helper.service';
import {ConferencePin} from "../../conference.datatypes";

@Injectable()
export class RoleService {

    private apiUrl: string = API_BASE_URL + '/api_telapp_conference/rest/json';
    private appSig: string = APP_SIG;

    private progress$: Observable<number>;
    private progress: number = 0;
    private progressObserver: any;

    private queryPageSize: number = 500;

    private apiUrlTelappSec: string = API_BASE_URL + '/api_telapp_sec/rest/json';

    constructor(private authService: AuthService,
                private requestHelper: RequestHelperService) {
            this.progress$ = new Observable(observer => {
            this.progressObserver = observer
        });
    }

    roleSetup = {
        hideListenerStats: null,
        hidePollStats: null,
        hostOutboundStartOffset: null
    };

    public getObserver(): Observable<number> {
        return this.progress$;
    }

    public userCreate(confId: string, user: ConferencePin): Promise<Response> {
        let pinObj = {
            "emailAddress": user.emailAddress,
            "firstName": user.firstName,
            "lastName": user.lastName,
            "phoneNo": user.phoneNo,
            "role": user.role,
            "webListener": user.webListener,
            "listenerHandRaised": user.listenerHandRaised,
            "nonInteractiveListener": user.nonInteractiveListener,
            "userId": user.userId,
            "profilePictureURL": user.profilePictureURL,
            "pin": user.pin,
            "donationsAccepted": user.donationsAccepted
        };

        let requestData = {'pin': JSON.stringify(pinObj)};

        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.appSig}.${this.authService.sessionId}`
        });

        let options = new RequestOptions({headers});

        return this.requestHelper.requestPut(`${this.apiUrl}/conferencePinEdit/${confId}?appSig=${this.appSig}&sid=${this.authService.sessionId}`, requestData, options);
    }

    public userUpdate(pin: string, confId: string, user: ConferencePin): Promise<Response> {
        let pinObj = {
            "emailAddress": user.emailAddress,
            "firstName": user.firstName,
            "lastName": user.lastName,
            "phoneNo": user.phoneNo,
            "role": user.role,
            "webListener": user.webListener,
            "listenerHandRaised": user.listenerHandRaised,
            "nonInteractiveListener": user.nonInteractiveListener,
            "userId": user.userId,
            "profilePictureURL": user.profilePictureURL,
            "pin": user.pin,
            "donationsAccepted": user.donationsAccepted
        };

        let requestData = {'pin': JSON.stringify(pinObj)};

        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.appSig}.${this.authService.sessionId}`
        });

        let options = new RequestOptions({headers});

        return this.requestHelper.requestPost(`${this.apiUrl}/conferencePinEdit/${pin}/${confId}?appSig=${this.appSig}&sid=${this.authService.sessionId}`, requestData, options);
    }

    public pinLookup(): Promise<Response> {
        return this.requestHelper.requestGet(`${this.apiUrl}/conferencePinEdit/-1?appSig=${this.appSig}&sid=${this.authService.sessionId}`);
    }

    public deleteUser(pin: string): Promise<Response> {
        return this.requestHelper.requestDelete(`${this.apiUrl}/conferencePinEdit/${pin}?appSig=${this.appSig}&sid=${this.authService.sessionId}`);
    }

    public lookupParticipantPhoneNumber(): Promise<Response> {
        return this.requestHelper.requestGet(`${this.apiUrlTelappSec}/lookupCodeSetups?appSig=${this.appSig}&sid=${this.authService.sessionId}&codeGroups=["IVRCONF"]`);
    }

}
