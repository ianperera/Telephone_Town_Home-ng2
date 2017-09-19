/**
 * Created by Posh on 1/25/17.
 */
import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import 'rxjs/add/operator/toPromise';

import {CalendarService} from '../../../calendar/calendar.service';
import {ConferenceSetup} from "../../conference.datatypes";

@Component({
    selector: 'app-event-other-schedules',
    templateUrl: 'components/calendar/event-edit/other-schedules/other-schedules.tmpl.html'
})
export class OtherSchedulesComponent implements OnInit {
    @Input() event: ConferenceSetup;
    @Output() notify: EventEmitter<any> = new EventEmitter<any>();
    @Output() notifyCount: EventEmitter<number> = new EventEmitter<number>();

    relatedConf: any = [];

    constructor(private calendarService: CalendarService) {
    }

    ngOnInit() {
        this.calendarService.relatedConferences(this.event.hostScheduleId).then((response: any)=> {
            let confData = [];

            response.data.forEach((conf)=> {
                if (this.event.hostScheduleId !== conf.hostScheduleId) confData.push(conf);
            });

            this.relatedConf = confData;

            if (this.relatedConf.length > 0) {
                this.notifyCount.emit(this.relatedConf.length);
            }
        }).catch((response) => {

        });
    }

    setConfTo(conf) {
        this.notify.emit(conf);
    }
}
