import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share';

import {ReplaySubject} from 'rxjs/Rx';

import {Http, Response, Headers, RequestOptions} from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {AuthService} from '../../../../auth.service';
import {RequestHelperService} from '../../../../request-helper.service';


@Injectable()
export class AudioService {
    private apiUrl: string = API_BASE_URL + '/api_telapp_conference/rest/json';
    private apiUrlBase: string = API_BASE_URL + '/api_telapp_vb';
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

    //Get VoxFile API TTS, MP3 and Files Over the Phone
    public get(confId: number): Promise<Response> {
        let param = {
            id: -1,
            customerId: -1,
            active: true
        };

        let queryParam = JSON.stringify(param);
        let url = `${this.apiUrl}/voiceFileLookupForm?appSig=${this.appSig}&sid=${this.authService.sessionId}&conferenceId=${confId}&queryParam=${queryParam}&queryPageSize=${this.queryPageSize}`;

        return this.requestHelper.requestGet(url);
    }

    public getAudio(confId: number, audioId: number) {
        return `${this.apiUrlBase}/listenVoiceFile?appSig=${this.appSig}&sid=${this.authService.sessionId}&conferenceId=${confId}&voxId=${audioId}&audioFormat=mp3`;
    }

    public lookupRecordedVoxFile(confId: number) {
        let url = `${this.apiUrl}/lookupRecordedVoxFile?appSig=${this.appSig}&sid=${this.authService.sessionId}&conferenceId=${confId}`;

        return this.requestHelper.requestGet(url);
    }

    public startVoicefilePlayback(voicefileId: number): Promise<Response> {
        let sessionId = this.authService.sessionId;
        let requestData = JSON.stringify({});
        return this.requestHelper.requestPost(`${this.apiUrl}/voicefilePlayback/${voicefileId}?sid=${sessionId}&appSig=${this.appSig}`, requestData);
    }

    public stopVoicefilePlayback(voicefileId: number): Promise<Response> {
        let sessionId = this.authService.sessionId;
        return this.requestHelper.requestDelete(`${this.apiUrl}/voicefilePlayback?sid=${sessionId}&appSig=${this.appSig}`);
    }

    public changeVoicefilePlaybackVolume(voicefileId: number, volume: number): Promise<Response> {
        let sessionId = this.authService.sessionId;
        let requestData = JSON.stringify({volume: volume});
        return this.requestHelper.requestPut(`${this.apiUrl}/voicefilePlayback/${volume}?sid=${sessionId}&appSig=${this.appSig}`, requestData);
    }
}
