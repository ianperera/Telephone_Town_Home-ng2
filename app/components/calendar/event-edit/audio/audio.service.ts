import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share';

import {Http, Response, Headers, RequestOptions} from '@angular/http';

import 'rxjs/add/operator/toPromise';

import {AuthService} from '../../../../auth.service';
import {RequestHelperService} from '../../../../request-helper.service';
import {VoiceFile} from "../../conference.datatypes";
//import * as AppConfig from '../../../../AppConfig';

@Injectable()
export class AudioService {

    private apiUrl: string = API_BASE_URL + '/api_telapp_vb/rest/json';
    private apiUrlBase: string = API_BASE_URL + '/api_telapp_vb';
    private appSig: string = APP_SIG;

    private progress$: Observable<number>;
    private progress: number = 0;
    private progressObserver: any;
    private xhrObserver$: Observable<string>;
    private xhrObserver: any;

    private queryPageSize: number = 500;

    constructor(private authService: AuthService,
                private requestHelper: RequestHelperService,
                private http: Http) {
        this.progress$ = new Observable(observer => {
            this.progressObserver = observer
        });

        this.xhrObserver$ = new Observable(observer => {
            this.xhrObserver = observer
        });
    }

    public getObserver(): Observable<number> {
        return this.progress$;
    }

    public create(confId: number, audio: VoiceFile): Promise<Response> {
        let requestData = {
            voiceFile: JSON.stringify(audio)
        };
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.appSig}.${this.authService.sessionId}`
        });
        let options = new RequestOptions({headers});
        let url = `${this.apiUrl}/voiceFileEdit?appSig=${this.appSig}&sid=${this.authService.sessionId}&conferenceId=${confId}`;

        return this.requestHelper.requestPut(url, requestData, options);
    }

    public update(confId: number, audioId: number, audio: VoiceFile): Promise<Response> {
        let requestData = {
            voiceFile: JSON.stringify(audio)
        };
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.appSig}.${this.authService.sessionId}`
        });

        let options = new RequestOptions({headers});
        let url = `${this.apiUrl}/voiceFileEdit/${audioId}?appSig=${this.appSig}&sid=${this.authService.sessionId}&conferenceId=${confId}`;

        return this.requestHelper.requestPost(url, requestData, options);
    }

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

    public remove(confId: number, audioId: number): Promise<Response> {
        let url = `${this.apiUrl}/voiceFileEdit/${audioId}?appSig=${this.appSig}&sid=${this.authService.sessionId}&conferenceId=${confId}`;

        return this.requestHelper.requestDelete(url);
    }

    public getAudio(confId: number, audioId: number) {
        return `${this.apiUrlBase}/listenVoiceFile?appSig=${this.appSig}&sid=${this.authService.sessionId}&conferenceId=${confId}&voxId=${audioId}&audioFormat=mp3`;
    }

    public uploadAudioFile(confId: number, file: File): Promise<any> {
        return new Promise((resolve, reject) => {
            let formData: FormData = new FormData(),
                xhr: XMLHttpRequest = new XMLHttpRequest();

            formData.append("form-data", file, file.name);

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(AudioService.parseError(xhr.response));
                    }
                }
            };

            let url = `${this.apiUrl}/voiceFileUpload?appSig=${this.appSig}&sid=${this.authService.sessionId}&conferenceId=${confId}`;

            xhr.open('POST', url, true);
            xhr.send(formData);

            this.xhrObserver$.subscribe(type => {
                if (type === 'audio_file') {
                    xhr.abort();
                }
            });
        });
    }

    public stopUploadAudioFile() {
        this.xhrObserver.next('audio_file');
        this.xhrObserver.complete();
    }

    public startVoxRecordingSession(confId: number) {
        let url = `${this.apiUrl}/startVoxRecordingSession?appSig=${this.appSig}&sid=${this.authService.sessionId}&conferenceId=${confId}`;

        return this.requestHelper.requestGet(url);
    }

    public lookupRecordedVoxFile(confId: number) {
        let url = `${this.apiUrl}/lookupRecordedVoxFile?appSig=${this.appSig}&sid=${this.authService.sessionId}&conferenceId=${confId}`;

        return this.requestHelper.requestGet(url);
    }

    public discardVoxRecordingSession(confId: number) {
        let url = `${this.apiUrl}/discardVoxRecordingSession?appSig=${this.appSig}&sid=${this.authService.sessionId}&conferenceId=${confId}`;

        return this.requestHelper.requestGet(url);
    }

    public static parseError(data) {
        let resJson = JSON.parse(data), msg = '';

        try {
            if ('fieldValidationMessages' in resJson.data && resJson.data.fieldValidationMessages) {
                for (let key in resJson.data.fieldValidationMessages) {
                    if (resJson.data.fieldValidationMessages.hasOwnProperty(key)) {
                        msg += resJson.data.fieldValidationMessages[key] + ' ';

                    }
                }
            } else {
                msg = resJson.data.message;
            }
        } catch (e) {
            msg = 'Something wrong happened!';
        }

        return msg;
    }

}