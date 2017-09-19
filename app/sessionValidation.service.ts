/**
 * Created by thipaporn on 3/20/17.
 */
import {Injectable} from '@angular/core';
import {Http, Response, RequestOptionsArgs} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/observable/of';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/throttle';
import 'rxjs/add/operator/filter';

@Injectable()
export class SessionValidationService {

    private apiUrl: string = API_BASE_URL + '/api_telapp_sec/rest/json/validateSession';

    private sessionId:string;

    private _sessionEvents: Observable<any>;

    constructor(private http:Http) {

    }


    public startSessionValidatorService(sessionId: string) {
        this.sessionId = sessionId;

        let savedResponse: Response = null;
        this._sessionEvents = Observable
            .interval(30000) // 30 seconds
            .throttle(() => this._buildValidationRequest().map((res:Response) => savedResponse = res))
            .mergeMap(() => Observable.of(savedResponse))
            .map(this.extractData)
            .filter((x) => x ? true : false)
            .share();
    }


    get sessionEvents():Observable<boolean> {
        return this._sessionEvents;
    }


    private extractData(res: Response):boolean {
        let result: boolean = false;

        if (res) {
            result = true;
        }
        return result;
    }


    private _buildValidationRequest():Observable<any> {
        let params:RequestOptionsArgs = {
            search: "sid=" + this.sessionId
        };

        return this.http.get(`${this.apiUrl}`, params);
    }

}
