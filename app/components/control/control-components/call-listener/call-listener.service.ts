import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share';

import {ReplaySubject} from 'rxjs/Rx';

import {Http, Response, Headers, RequestOptions} from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {AuthService} from '../../../../auth.service';
import {RequestHelperService} from '../../../../request-helper.service';
import {Phone} from "../../control.datatypes";

@Injectable()
export class CallListenerService {
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

    //Call a listener
    public calltoListener(phone: Phone): Promise<Response> {
        let sessionId = this.authService.sessionId;
        let listenerData = JSON.stringify(phone);
        let requestData = JSON.stringify(phone);
        return this.requestHelper.requestPut(`${this.apiUrl}/callListener?sid=${sessionId}&appSig=${this.appSig}&listenerData=${listenerData}&phone=${phone.phone}`, requestData);
    }

    //Hangup a listener call
    public hangupListenerCall(resourceId: number): Promise<Response> {
        let sessionId = this.authService.sessionId;
        return this.requestHelper.requestDelete(`${this.apiUrl}/callListener/${resourceId}?sid=${sessionId}&appSig=${this.appSig}`);
    }


}