import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share';

import {ReplaySubject} from 'rxjs/Rx';

import {Http, Response, Headers, RequestOptions} from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {AuthService} from '../../auth.service';
import {RequestHelperService} from '../../request-helper.service';


@Injectable()
export class MainControlService {
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

    //Get the pin of the active user
    public getMyPin(): Promise<Response> {
        let sessionId = this.authService.sessionId;
        return this.requestHelper.requestGet(`${this.apiUrl}/getMyPin?sid=${sessionId}&appSig=${this.appSig}`);
    }

    //Get current conference event
    public getCurrentConference(): Promise<Response> {
        let sessionId = this.authService.sessionId;
        return this.requestHelper.requestGet(`${this.apiUrl}/currentConference?sid=${sessionId}&appSig=${this.appSig}&lite=true`);
    }

    //Get current conference data
    public loadConference(hostScheduleId: number): Promise<any> {
        let sessionId = this.authService.sessionId;
        return this.requestHelper.requestGet(`${this.apiUrl}/conferenceEdit/${hostScheduleId}?appSig=${this.appSig}&sid=${this.authService.sessionId}`);
    }
}
