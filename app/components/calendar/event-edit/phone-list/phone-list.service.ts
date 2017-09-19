import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share';

import {Http, Response, Headers, RequestOptions} from '@angular/http';

import 'rxjs/add/operator/toPromise';

import {AuthService} from '../../../../auth.service';
import {RequestHelperService} from '../../../../request-helper.service';

@Injectable()
export class PhoneListService {
    private apiUrl: string = API_BASE_URL + '/api_telapp_conference/rest/json';
    private apiUrlBase: string = API_BASE_URL + '/api_telapp_vb';
    private appSig: string = APP_SIG;

    private progress$: Observable<number>;
    private progress: number = 0;
    private progressObserver: any;
    private xhrObserver$: Observable<string>;
    private xhrObserver: any;

    private queryPageSize: number = 500;

    scrubWireless = null;

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

    public postFileContentToServer(hostScheduleId: number, listType: string, files: File[]): Promise<any> {
        return new Promise((resolve, reject) => {
            let formData: FormData = new FormData(),
                xhr: XMLHttpRequest = new XMLHttpRequest();

            for (let i = 0; i < files.length; i++) {
                formData.append("uploads[]", files[i], files[i].name);
            }

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(PhoneListService.parseError(xhr.response));
                    }
                }
            };

            xhr.upload.addEventListener('progress', (ev: any) => {
                if (ev.lengthComputable) {
                    var progress = Math.ceil(((ev.loaded) / ev.total) * 100);
                    this.progressObserver.next(progress);

                    if (progress === 100) {
                        this.progressObserver.complete();
                    }
                }
            });

            setInterval(() => {
            }, 500);

            let url = `${this.apiUrl}/conferencePhonelistUpload/${hostScheduleId}?appSig=${this.appSig}&sid=${this.authService.sessionId}&type=${listType}&importMode=0&scrubWireless=${this.scrubWireless}`;

            xhr.open('POST', url, true);
            xhr.send(formData);

            this.xhrObserver$.subscribe(type => {
                if (type === 'phone_list') {
                    xhr.abort();
                }
            });
        });
    }

    public stopPostFileContentToServer() {
        this.xhrObserver.next('phone_list');
        this.xhrObserver.complete();
    }

    public deletePhoneList(hostScheduleId: number, phoneLists: string): Promise<any> {
        return this.requestHelper.requestDelete(`${this.apiUrl}/conferencePhonelist/${hostScheduleId}?appSig=${this.appSig}&sid=${this.authService.sessionId}&phonelist=${phoneLists}`);
    }

    public getObserver(): Observable<number> {
        return this.progress$;
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
