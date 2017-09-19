import {Injectable} from '@angular/core';
import {Http, Response, RequestOptionsArgs} from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class RequestHelperService {

    constructor(private http: Http) {
    }

    private extractData(res: Response) {
        let body;
        if (res.text()) body = res.json();
        return body || {};
    }

    private handleError(error: any) {
        try {
            let resJson = error.json();
            let msg = '';

            if ('fieldValidationMessages' in resJson.data && resJson.data.fieldValidationMessages) {
                for (let key in resJson.data.fieldValidationMessages) {
                    if (resJson.data.fieldValidationMessages.hasOwnProperty(key)) {
                        msg += resJson.data.fieldValidationMessages[key] + ' ';
                    }
                }
            } else {
                msg = resJson.data.message;
            }

            return Promise.reject(msg);
        } catch (e) {
        }

        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        // console.error(errMsg); // log to console instead
        return Promise.reject(errMsg);
    }

    public request(url: string,
                   options?: RequestOptionsArgs): Promise<Response> {
        return this.http.request(url, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    public requestGet(url: string): Promise<Response> {
        return this.http.get(url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    public requestPost(url: string,
                       data: any,
                       options?: RequestOptionsArgs): Promise<Response> {
        return this.http.post(url, data, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    public requestPut(url: string,
                      data: any,
                      options?: RequestOptionsArgs): Promise<Response> {
        return this.http.put(url, data, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    public requestDelete(url: string): Promise<Response> {
        return this.http.delete(url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

}
