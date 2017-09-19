import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import 'rxjs/add/operator/toPromise';

import {overlayConfigFactory} from 'angular2-modal';
import {Modal, BSModalContext} from 'angular2-modal/plugins/bootstrap';
import {CalendarConferenceModal} from './calendar-conference-modal';

import {
    startOfDay,
    subDays,
    addDays,
    addMinutes,
    startOfMonth,
    endOfMonth,
    isSameDay,
    isSameMonth,
    isSameYear,
    isBefore,
    addWeeks,
    subWeeks,
    addMonths,
    subMonths,
    isAfter
} from 'date-fns';

import {getMonthView, WeekDay} from 'calendar-utils';

import {CalendarEvent, CalendarMonthViewDay, CalendarEventAction} from 'angular-calendar';

import {CalendarService} from './calendar.service';
import {AuthService} from '../../auth.service';
import {RequestHelperService} from '../../request-helper.service';

import {CalendarConferenceTimeZone, ConferenceSetup} from './conference.datatypes';
import {CalendarConferenceDuplicateModal} from "./calendar-conference-duplicate-modal";
import {CalendarLoadingModal} from "./calendar-loading-modal";

const colors: any = {
    red: {
        primary: '#AD2121',
        secondary: '#FAE3E3'
    },
    blue: {
        primary: '#1E90FF',
        secondary: '#D1E8FF'
    },
    yellow: {
        primary: '#E3BC08',
        secondary: '#FDF1BA'
    },
    green: {
        primary: '#44AA44',
        secondary: '#D1E8FF',
    }
};

@Component({
    selector: 'app-calendar',
    templateUrl: 'components/calendar/calendar.tmpl.html'
})
export class CalendarComponent implements OnInit {
    @Input() event: ConferenceSetup;
    @Output() notify: EventEmitter<string> = new EventEmitter<string>();

    version: string = APP_NAME;
    view: string = 'month';
    switchView: string = 'calendarView';
    showLoadingImg = false;
    viewDate: Date = new Date();

    timeZones: CalendarConferenceTimeZone[] = [];

    activeDayIsOpen: boolean = false;

    apiEvents: any[] = []; // It's for late use

    events: CalendarEvent[] = [];

    //for edit form data initialize object
    eventObject: ConferenceSetup;

    viewDateEvents: any[] = [];
    openActiveDay: boolean = false;

    filterValue: string = null;
    eventToDelete: ConferenceSetup;

    hideNavigation: boolean = false;

    actions: CalendarEventAction[] = [{
        label: '<i class="fa fa-fw fa-pencil"></i>',
        onClick: ({event}: {event: CalendarEvent}): void => {
            //switch to edit form and set the conference data into edit form fields
            console.log("edit clicked: ", event);
            this.switchView = 'editForm';
            this.showEditDataFromMonthView(event);
        }
    }];


    newEventActions: CalendarEventAction[] = [{
        label: '<i class="fa fa-fw fa-plus-circle"></i>',
        onClick: ({event}: {event: CalendarEvent}): void => {
            //switch to edit form and set the conference data into edit form fields
            console.log("new clicked: ", event);
            this.addButtonClicked(event.start);
            // this.switchView = 'editForm';
            // this.showEditDataFromMonthView(event);
        }
    }];


    constructor(private modal: Modal,
                private calendarService: CalendarService,
                private activatedRoute: ActivatedRoute,
                private router: Router) {
        this.activatedRoute.params.subscribe(
            (data: any) => {
                //console.log('param data ', data);

                if (data.view && data.year && data.month && data.day) {
                    this.openActiveDay = true;
                    this.view = data.view;
                    this.viewDate = new Date(parseInt(data.year), parseInt(data.month) - 1, parseInt(data.day));
                }

                // Load api event data
                this.loadEvents();
            }
        );
        this.activatedRoute.queryParams.subscribe((params:Params) => {
            this.hideNavigation = params["hideNav"] === "true";
        });

    }

    ngOnInit() {
        this.calendarService.loadevent(false);
        this.calendarService.emitter.subscribe(
            data => {
                if(data){
                    this.loadEvents();
                }
            }
        )

    }

    public eventClicked({event}: {event: CalendarEvent}) {
        console.log("event clicked: ", event);
        // this is a new conference, so do something different
        if (event.color == colors.green) {
            this.addButtonClicked(event.start);
        } else {
            //switch to edit form and set the conference data into edit form fields
            this.switchView = 'editForm';
            this.showEditDataFromMonthView(event);
        }
    }

    backToCalendarView(event): void {
        console.log('callback from child ', event);

        this.switchView = 'calendarView';
        //this.view = 'month';
        this.loadEvents();
    }

    switchToConf(event: ConferenceSetup): void {
        this.eventObject = null;
        setTimeout(()=> {
            this.eventObject = event;
        }, 0);
    }

    loadEvents(): void {
        this.events = [];
        this.viewDateEvents = [];
        this.activeDayIsOpen = false;
        console.log("loadEvents is trigger");

        let monthView = getMonthView({
            events: [],
            viewDate: this.viewDate
        });

        let dateFrom:Date = monthView.days[0].date;
        let dateUntil:Date = monthView.days[monthView.days.length - 1].date;
        let eventName = this.filterValue;

        dateUntil.setHours(23);
        dateUntil.setMinutes(59);

        this.calendarService.conferenceCalendarLookupForm(dateFrom, dateUntil, eventName) // startOfMonth(this.viewDate), endOfMonth(this.viewDate)
            .then((response: any) => {
                this.apiEvents = response.data;

                let updateValue = value => {
                    return parseInt(value, 10) < 10 ? `0${value}` : value;
                }

                this.viewDateEvents = this.apiEvents.filter(event => isSameDay(new Date(event.eventDate), this.viewDate));

                this.events = this.apiEvents.map(event => (
                    {
                        title: updateValue(new Date(event.eventDate).getHours()) + ":" +
                        updateValue(new Date(event.eventDate).getMinutes()) + " (" +
                        event.eventTimeZone.tzShortName + ") - " +
                        event.eventName + " (" +
                        (event.customerName ? event.customerName.substr(event.customerName.indexOf(':') + 1) : '') +
                        " )",
                        tzShortName: event.eventTimeZone.tzShortName,
                        hostScheduleId: event.hostScheduleId,
                        start: new Date(event.eventDate),
                        color: colors.blue,
                        actions: this.actions,
                        eventObject: event
                    }
                ));

                let eventsList:Array<CalendarEvent> = this._createPsuedoEvents(monthView.days);

                this.events = this.events.concat(eventsList);

                if (this.viewDateEvents && this.viewDateEvents.length > 0) {
                    this.activeDayIsOpen = this.openActiveDay;
                } else {
                    this.activeDayIsOpen = false;
                }
            });
    }

    increment(): void {
        const addFn: any = {
            day: addDays,
            week: addWeeks,
            month: addMonths
        }[this.view];

        this.viewDate = addFn(this.viewDate, 1);
        // this.loadEvents();
        this.updateUrl();
    }

    //function to show the conference data on edit form from day view
    showEditDataFromDayView(event: ConferenceSetup): void {
        this.eventObject = event;
    }

    //function to show the conference data on edit form from month view
    showEditDataFromMonthView(event): void {
        this.eventObject = event.eventObject;
    }

    isPastEvent(event): boolean {
        return isBefore(event.eventDate, new Date());
    }

    isCurrentEvent(event): boolean {
        return isSameDay(event.eventDate, new Date());
    }

    isFutureEvent(event): boolean {
        return isAfter(event.eventDate, new Date());
    }

    isTodayOrFutureDate(date: Date): boolean {
        var today = new Date();
        return isAfter(date, today) || (isSameDay(date, today) && isSameMonth(date, today) && isSameYear(date, today));
    }

    decrement(): void {
        const subFn: any = {
            day: subDays,
            week: subWeeks,
            month: subMonths
        }[this.view];

        this.viewDate = subFn(this.viewDate, 1);
        // this.loadEvents();
        this.updateUrl();
    }

    today(): void {
        this.viewDate = new Date();
        //this.loadEvents();
        this.updateUrl();
    }

    // Search events based on input supplied
    filterChange(e):void{
        this.loadEvents();
    }

    // Clear search criteria and refresh calender
    clearFilter(): void{
        this.filterValue=null;
        this.loadEvents();
    }

    updateUrl(): void {
        let vd_day = this.viewDate.getDate();
        let vd_month = this.viewDate.getMonth() + 1;
        let vd_year = this.viewDate.getFullYear();
        let hide = '';
        if (this.hideNavigation) {
            hide = '?hideNav=true';
        }
        this.router.navigateByUrl(`/admin/calendar/${this.view}/${vd_month}/${vd_day}/${vd_year}${hide}`);
    }

    switchTo(view: string): void {
        let vd_day = this.viewDate.getDate();
        let vd_month = this.viewDate.getMonth() + 1;
        let vd_year = this.viewDate.getFullYear();
        let hide = '';
        if (this.hideNavigation) {
            hide = '?hideNav=true';
        }

        this.router.navigateByUrl(`/admin/calendar/${view}/${vd_month}/${vd_day}/${vd_year}${hide}`);
    }

    dayClicked({date, events}: {date: Date, events: CalendarEvent[]}): void {

        if (isSameMonth(date, this.viewDate)) {
            if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
                this.activeDayIsOpen = false;
            } else {
                this.activeDayIsOpen = true;
                this.viewDate = date;
                // load events on day click
                this.viewDateEvents = this.apiEvents.filter(event => isSameDay(new Date(event.eventDate), this.viewDate));
            }
        }
    }

    addButtonClicked(date: Date) {
        console.log("add button clicked! date:", date);
        console.log("this.viewDate", this.viewDate);
        if (isSameDay(date, this.viewDate) || isAfter(date, this.viewDate)) {
            this.modal.open(CalendarConferenceModal, overlayConfigFactory({eventDate: date}, BSModalContext))
                .then(resultPromise => {
                    resultPromise.result.then(result => {
                        if (result) {
                            console.log("result: ", result);
                            this.switchView = 'editForm';
                            this.showEditDataFromDayView(result.data);
                            this.loadEvents();
                        }
                    });
                });
        }
    }

    addBadgeTotal(day: CalendarMonthViewDay): void {
        day.badgeTotal = day.events.filter(event => event.color !== colors.green).length;
    }

    private _createPsuedoEvents(days:WeekDay[]):Array<CalendarEvent> {
        let result:Array<CalendarEvent> = [];
        let today:Date = new Date();

        for (var i:number = 0; i < days.length; i++) {
            if (!days[i].isPast) {
                let event: CalendarEvent = {
                    start: days[i].date,
                    title: 'Create New Event',
                    color: colors.green,
                    actions: this.newEventActions,
                }
                result.push(event);
            }
        }

        return result;
    }

    exportCalendar(): void {
        let date = this.viewDate, y = date.getFullYear(), m = date.getMonth();
        var fromDate = new Date(y, m, 1);
        var toDate = new Date(y, m + 1, 0, 23, 59);

        window.location.href = this.calendarService.generateCalendarFileUrlByDateRange(fromDate, toDate);
    }

    duplicateConference(event: ConferenceSetup): void {
        this.modal.open(CalendarConferenceDuplicateModal,
            overlayConfigFactory({event: event}, BSModalContext))
            .then(resultPromise => {
                resultPromise.result.then(result => {
                    if (result) this.loadEvents();
                });
            });
    }

    deleteConference(event: ConferenceSetup): void {
        if (!event) {
            event = this.eventToDelete;
        }

        this.modal.open(CalendarLoadingModal, overlayConfigFactory({message: "Deleting Conference ..."}, BSModalContext))
            .then(dialog => {
                let hostScheduleId: number = event.hostScheduleId;

                this.calendarService.conferenceDelete(hostScheduleId)
                    .then(response => {
                        dialog.dismiss();
                        this.loadEvents();
                        setTimeout(()=> {
                            this.modal.alert().title('Success').body('Conference deleted successfully!').open();
                        }, 200);
                    }, () => {
                        dialog.dismiss();
                        setTimeout(()=> {
                            this.modal.alert().title('Error').body('Unable to delete conference. Please try again later!').open();
                        }, 200);
                        //this.backToCalendarView();
                    });
            });

    }

    setEventToDelete(event: ConferenceSetup): void {
        this.eventToDelete = event;
    }

}
