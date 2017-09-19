import {Injectable} from '@angular/core';
import 'rxjs/add/operator/share';

import {Http, Response, Headers, RequestOptions} from '@angular/http';

import 'rxjs/add/operator/toPromise';

import {AuthService} from '../../../../auth.service';
import {RequestHelperService} from '../../../../request-helper.service';
// import * as AppConfig from '../../../../AppConfig';

@Injectable()
export class CallIdService {
    private apiUrl: string = API_BASE_URL + '/api_telapp_vb/rest/json';
    private apiUrlBase: string = API_BASE_URL + '/api_telapp_vb';
    private appSig: string = APP_SIG;

    private queryPageSize: number = 500;

    constructor(private authService: AuthService,
                private requestHelper: RequestHelperService,
                private http: Http) {

    }

    phoneLookup = {
        aniRouted: null,
        inboundListeners: null,
        parkInbound: null,
        parkInboundDisabled: null,
    };
}
