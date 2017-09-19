import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import {RequestHelperService} from '../../../../request-helper.service';

import {CalendarService} from '../../../calendar/calendar.service';
import {ConferenceSetup} from "../../conference.datatypes";

@Component({
    selector: 'app-event-donation',
    templateUrl: 'components/calendar/event-edit/donation/donation.tmpl.html'
})
export class DonationComponent implements OnInit {
    @Input() event: ConferenceSetup;
    @Output() notify: EventEmitter<string> = new EventEmitter<string>();

    constructor(private requestHelper:RequestHelperService,private calendarService:CalendarService) {
    }

    ngOnInit() {

    }

}
