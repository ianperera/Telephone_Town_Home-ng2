import {Injectable} from '@angular/core';
import {Http, Response, RequestOptionsArgs} from '@angular/http';
import {AuthService} from '../../auth.service';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';

import 'rxjs/add/observable/of';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/throttle';
import 'rxjs/add/operator/filter';

import {
    IStreamEvent,
    ICampaignStatsEvent,
    IParticipantAssignEvent,
    IParticipantUpdateEvent,
    IParticipantChooseEvent,
    IParticipantRemovedEvent,
    IParticipantAudioEvent,
    IQuestionRemovedEvent,
    IQuestionUpdateEvent,
    IQuestionStateGroupRemovedEvent,
    IConferenceStatusEvent,
    IListenerSummaryEvent,
    IConversationMessageEvent,
} from './event.interfaces';

@Injectable()
export class EventService {

    private apiUrl: string = API_BASE_URL + '/api_telapp_ns/';
    private appSig: string = APP_SIG;

    private conferenceId: string;
    private sync: boolean = true;

    private _eventStream: Observable<any>;
    private dispatcher: Subscription;

    constructor(
        private authService: AuthService,
        private http: Http,
    ) {}



    public startEventService(conferenceId: string) {
        this.conferenceId = conferenceId;

        let savedResponse:Response = null;
        this._eventStream = Observable
            .interval(50)
            .throttle(() => this._buildStreamRequest().map((res:Response) => savedResponse = res))
            
            .mergeMap(() => Observable.of(savedResponse))
            .concatMap(this.extractData)
            .map(this.fixTypes)
            .filter((x) => x ? true : false)
            .share();
    }

    getEvents(): Observable<IStreamEvent> {
        return this._eventStream;
    }

    get eventStream():Observable<IStreamEvent> {
        return this._eventStream;
    }


    private extractData(res: Response):Observable<IStreamEvent> {
        // console.log("response: ", res);
        let body = res && res.json ? res.json() : null;

        let data:Observable<IStreamEvent> = null;

        if (body && body.length) {
            let events:Array<IStreamEvent> = body;
            data = Observable.from(events);
        } else {
            data = Observable.from([]);
        }

        return data;
    }


    private fixTypes(data: IStreamEvent):IStreamEvent {
        let result: IStreamEvent = null;
        if (data) {
            let type: string = data.type;

            if (type === "sdSpecial") {
                result = data;
            } else if (type === "sdConfPartUpdateEvent") {
                result = <IParticipantUpdateEvent>data;
            } else if (type === "sdConfPartAssignEvent") {
                result = <IParticipantAssignEvent>data;
            } else if (type === "sdConfPartChooseEvent") {
                result = <IParticipantChooseEvent>data;
            } else if (type === "sdConfPartAudioEvent") {
                result = <IParticipantAudioEvent>data;
            } else if (type === "sdConfPartRemovedEvent") {
                result = <IParticipantRemovedEvent>data;
            } else if (type === "sdListenerSummary") {
                result = <IListenerSummaryEvent>data;
            } else if (type === "sdConfState") {
                result = <IConferenceStatusEvent>data;
            } else if (type === "sdCampaignStats") {
                result = <ICampaignStatsEvent>data;
            } else if (type === "sdQuestionUpdate") {
                result = <IQuestionUpdateEvent>data;
            } else if (type === "sdQuestionRemoved") {
                result = <IQuestionRemovedEvent>data;
            } else if (type === "sdQuestionStateGroupRemoved") {
                result = <IQuestionStateGroupRemovedEvent>data;
            } else if (type === "sdConversationMessage") {
                result = <IConversationMessageEvent>data;
            }

        }
        return result;
    }

    private _buildStreamRequest():Observable<any> {
        let streamRequest:StreamFeatureRequest = new StreamFeatureRequest(this.authService.sessionId);
        streamRequest.sync = this.sync;
        streamRequest.addFeature(new ConferenceFeatureRequest(this.conferenceId));
        this.sync = false;
        let params:RequestOptionsArgs = {
            search: "request=" + JSON.stringify(streamRequest) + "&batchData=true"
        };

        return this.http.get(`${this.apiUrl}eventStreamServlet/json/`, params);
    }
}


class StreamFeatureRequest {
    public sessionId: string;
    public sync: boolean;
    public features: Array<ConferenceFeatureRequest>;

    constructor(sid: string) {
        this.sessionId = sid;
        this.features = [];
        this.sync = true;
    }

    public addFeature(feature: ConferenceFeatureRequest) {
        this.features.push(feature);
    }
}

class ConferenceFeatureRequest {
    public type: string = "sfConf";

    public conferenceId: string;
    public participantEvents: boolean = true;
    public listenerEvents: boolean = true;
    public stateEvents: boolean = true;
    public questionEvents: boolean = true;
    public chatEvents: boolean = true;
    public screenerParticipantEvents: boolean = false;
    public campaignEvents: boolean = true;

    constructor(confId: string) {
        this.conferenceId = confId;
    }
}
