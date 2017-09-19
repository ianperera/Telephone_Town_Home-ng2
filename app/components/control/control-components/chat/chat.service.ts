import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share';

import {ReplaySubject} from 'rxjs/Rx';

import {Http, Response, Headers, RequestOptions} from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {AuthService} from '../../../../auth.service';
import {RequestHelperService} from '../../../../request-helper.service';


@Injectable()
export class ChatService {
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

    // Chat: get your nickname
    public getNickname(): Promise<Response> {
        let sessionId = this.authService.sessionId;
        return this.requestHelper.requestGet(`${this.apiUrl}/sendChat?sid=${sessionId}&appSig=${this.appSig}`);
    }

    //ChatHistory
    public getchatHistory(): Promise<Response> {
        let sessionId = this.authService.sessionId;
        return this.requestHelper.requestGet(`${this.apiUrl}/chatHistory?sid=${sessionId}&appSig=${this.appSig}`);
    }

    public sendchat(fromUserName: string, msg: string, priority: number): Promise<Response> {
        let sessionId = this.authService.sessionId;
        let timeStamp = Math.floor(Date.now());

        let message = JSON.stringify(
            {
                "messageTimestamp": timeStamp,
                "fromUserName": fromUserName,
                "text": msg,
                "fromUserSeqno": -1,
                "fromUserId": null,
                "fromUserSessionId": null,
                "priority": priority,
                "toParticipantId": -1,
                "fromParticipantId": -1,
            });

        let requestData = JSON.stringify(message);
        return this.requestHelper.requestPost(`${this.apiUrl}/sendChat?sid=${sessionId}&appSig=${this.appSig}&message=${message}`, requestData);

    }
}
