/**
 * Created by Posh on 3/9/17.
 */
import {Component, OnInit} from '@angular/core';
import {EventService} from "../../shared/event-streamer/events.service";
import {Subscription} from "rxjs";

import * as EventTypes from '../../shared/event-streamer/event.interfaces';

@Component({
    selector: 'app-event-streaming',
    templateUrl: 'components/control/event-streaming.tmpl.html'
})
export class EventStreamingComponent implements OnInit {
    private eventSubscription: Subscription;

    private eventList: Array<EventTypes.IStreamEvent> = [];

    constructor(private eventService: EventService) {
    }

    ngOnInit() {
        this.eventService.startEventService("camp_108");
        this.subscribe();
    }

    unsubscribe(): void {
        if (this.eventSubscription) {
            this.eventSubscription.unsubscribe();
            this.eventList = [];
        }
    }

    subscribe(): void {
        if (this.eventSubscription) {
            this.eventSubscription.unsubscribe();
        }
        this.eventSubscription = this.eventService.eventStream.subscribe(
            data => {
                this.eventList.push(data);
                console.log("data: ", data);
                console.log("conferenceEvent: ", EventTypes.isConferenceEvent(data));
            },
            err => console.error("error: ", err),
            () => console.log("done")
        );
    }

}

