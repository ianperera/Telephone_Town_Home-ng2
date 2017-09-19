import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share';

import {ReplaySubject} from 'rxjs/Rx';

import {Http, Response, Headers, RequestOptions} from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {AuthService} from '../../../../auth.service';
import {RequestHelperService} from '../../../../request-helper.service';
import {Poll} from "../../../calendar/conference.datatypes";


@Injectable()
export class PollingService {
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

    //Lookup polls for current conference
    public lookUppolls(): Promise<Response> {
        let sessionId = this.authService.sessionId;
        return this.requestHelper.requestGet(`${this.apiUrl}/polls?sid=${sessionId}&appSig=${this.appSig}`);
    }

    //Open poll
    public openActivePoll(pollId: number, delay: number): Promise<Response> {
        let sessionId = this.authService.sessionId;
        let requestData = JSON.stringify({});
        return this.requestHelper.requestPost(`${this.apiUrl}/livePoll/${pollId}/${delay}?sid=${sessionId}&appSig=${this.appSig}`, requestData);
    }

    //Close the open poll
    public endActivePoll(): Promise<Response> {
        let sessionId = this.authService.sessionId;
        return this.requestHelper.requestDelete(`${this.apiUrl}/livePoll?sid=${sessionId}&appSig=${this.appSig}`);

    }

    //Create or modify a poll: The id of the conference affiliated with this poll. For a live conference use -1
    public savePoll(poll: Poll): Promise<Response> {
        let sessionId = this.authService.sessionId;
        let poll_data = JSON.stringify(poll);

        let requestData = JSON.stringify(poll);
        return this.requestHelper.requestPost(`${this.apiUrl}/poll/-1/?sid=${sessionId}&appSig=${this.appSig}&poll=${poll_data}`, requestData);
    }

    //Delete a poll
    public deletePoll(pollId: number): Promise<Response> {
        let sessionId = this.authService.sessionId;
        return this.requestHelper.requestDelete(`${this.apiUrl}/poll/${pollId}?sid=${sessionId}&appSig=${this.appSig}`);
    }

    //Lookup all poll stats. If a schedule is specified, only poll stats will be returned, current open poll will not be specified
    public lookUppollsStats(hostScheduleId: number): Promise<Response> {
        let sessionId = this.authService.sessionId;
        return this.requestHelper.requestGet(`${this.apiUrl}/livePolls/${hostScheduleId}?sid=${sessionId}&appSig=${this.appSig}`);
    }
}