import {Injectable} from '@angular/core';
import 'rxjs/add/operator/share';

import {Http, Response, Headers, RequestOptions} from '@angular/http';

import 'rxjs/add/operator/toPromise';

import {AuthService} from '../../../../../auth.service';
import {RequestHelperService} from '../../../../../request-helper.service';

@Injectable()
export class TaskControlService {

    private apiUrl: string = API_BASE_URL + '/api_telapp_vb/rest/json';
    private apiUrlBase: string = API_BASE_URL + '/api_telapp_vb';
    private appSig: string = APP_SIG;

    constructor(private authService: AuthService,
                private requestHelper: RequestHelperService,
                private http: Http) {

    }

    public taskProgress(taskId: number): Promise<Response> {
        let url = `${this.apiUrl}/taskProgress/${taskId}?appSig=${this.appSig}&sid=${this.authService.sessionId}`;

        return this.requestHelper.requestGet(url);
    }

    public resumeTask(taskId: number): Promise<Response> {
        let url = `${this.apiUrl}/resumeTask/${taskId}?appSig=${this.appSig}&sid=${this.authService.sessionId}`;

        return this.requestHelper.requestGet(url);
    }

    public cancelTask(taskId: number): Promise<Response> {
        let url = `${this.apiUrl}/cancelTask/${taskId}?appSig=${this.appSig}&sid=${this.authService.sessionId}`;

        return this.requestHelper.requestGet(url);
    }

    public runTaskNow(taskId: number): Promise<Response> {
        let url = `${this.apiUrl}/runTaskNow/${taskId}?appSig=${this.appSig}&sid=${this.authService.sessionId}`;

        return this.requestHelper.requestGet(url);
    }

    public suspendTask(taskId: number, waitTime: number): Promise<Response> {
        let url = `${this.apiUrl}/suspendTask/${taskId}?appSig=${this.appSig}&sid=${this.authService.sessionId}&waitTime=${waitTime}`;

        return this.requestHelper.requestGet(url);
    }

}
