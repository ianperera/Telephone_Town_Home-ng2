import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share';

import {ReplaySubject} from 'rxjs/Rx';

import {Http, Response, Headers, RequestOptions} from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {AuthService} from '../../../../auth.service';
import {RequestHelperService} from '../../../../request-helper.service';


@Injectable()
export class BasicControlService {
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

    //Control current conference event
    public startControlEvent(action: string): Promise<Response> {
        let url = `${this.apiUrl}/controlConference/${action}?appSig=${this.appSig}&sid=${this.authService.sessionId}`;

        return this.requestHelper.requestGet(url);
    }

    public pauseControlEvent(action: string): Promise<Response> {
        let url = `${this.apiUrl}/controlConference/${action}?appSig=${this.appSig}&sid=${this.authService.sessionId}`;

        return this.requestHelper.requestGet(url);
    }

    public endControlEvent(action: string): Promise<Response> {
        let url = `${this.apiUrl}/controlConference/${action}?appSig=${this.appSig}&sid=${this.authService.sessionId}`;

        return this.requestHelper.requestGet(url);
    }

    //Polling Method
    public endActivePoll(): Promise<Response> {
        let sessionId = this.authService.sessionId;
        return this.requestHelper.requestDelete(`${this.apiUrl}/livePoll?sid=${sessionId}&appSig=${this.appSig}`);
    }
}
