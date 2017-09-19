import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share';

import {Http, Response, Headers, RequestOptions} from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {AuthService} from '../../../../auth.service';
import {RequestHelperService} from '../../../../request-helper.service';
import {callProgress} from "../../control.datatypes";

@Injectable()
export class CallProgessService {
    private apiUrl: string = API_BASE_URL + '/api_telapp_conference/rest/json';
    private appSig: string = APP_SIG;

    private progress$: Observable<number>;
    private progress: number = 0;
    private progressObserver: any;
    private xhrObserver$: Observable<string>;
    private xhrObserver: any;

    public queryPageSize: number = 10;

    constructor(private authService: AuthService,
                private requestHelper: RequestHelperService) {
        this.progress$ = new Observable(observer => {
            this.progressObserver = observer
        });

        this.xhrObserver$ = new Observable(observer => {
            this.xhrObserver = observer
        });
    }

    //Start outbound dial
    public startoutboundDial(scheduleSeqno: number): Promise<Response> {
        let sessionId = this.authService.sessionId;
        return this.requestHelper.requestGet(`${this.apiUrl}/conferenceDialControl/${scheduleSeqno}?&appSig=${this.appSig}&sid=${sessionId}`);
    }

    //Stop outbound dial
    public stoptoutboundDial(scheduleSeqno: number): Promise<Response> {
        let sessionId = this.authService.sessionId;
        return this.requestHelper.requestDelete(`${this.apiUrl}/conferenceDialControl/${scheduleSeqno}?&appSig=${this.appSig}&sid=${sessionId}`);
    }

    //Update the max number of channels (listeners) on the dial
    public updateMaxnumber(scheduleSeqno: number, maxChannels: number): Promise<Response> {
        let sessionId = this.authService.sessionId;
        let requestData = JSON.stringify(maxChannels);
        return this.requestHelper.requestPut(`${this.apiUrl}/conferenceDialControl/${scheduleSeqno}/${maxChannels}?&appSig=${this.appSig}&sid=${sessionId}&abort=true`, requestData);
    }

}