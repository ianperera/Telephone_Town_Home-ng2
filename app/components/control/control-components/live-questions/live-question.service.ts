import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share';

import {Http, Response, Headers, RequestOptions} from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {AuthService} from '../../../../auth.service';
import {RequestHelperService} from '../../../../request-helper.service';

@Injectable()
export class LiveQuestionService {
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

    public lookUpQuestion(questionId: number): Promise<Response> {
        let sessionId = this.authService.sessionId;
        return this.requestHelper.requestGet(`${this.apiUrl}/question/${questionId}?&appSig=${this.appSig}&sid=${sessionId}`);
    }

    public doneQuestion(questionId: number): Promise<Response> {
        let sessionId = this.authService.sessionId;
        return this.requestHelper.requestDelete(`${this.apiUrl}/question/${questionId}?&appSig=${this.appSig}&sid=${sessionId}&action=1`);
    }

    public editQuestion(questionData: any): Promise<Response> {
        let sessionId = this.authService.sessionId;
        return this.requestHelper.requestDelete(`${this.apiUrl}/question/?sid=${sessionId}&appSig=${this.appSig}&${questionData}`);
    }
}
