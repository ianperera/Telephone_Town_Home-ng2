declare var Clipboard: any;

import {Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef} from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {Modal, BSModalContext} from 'angular2-modal/plugins/bootstrap';
import {overlayConfigFactory} from 'angular2-modal';

import {Router} from '@angular/router';
import {AuthService} from '../../../auth.service';

import {CalendarConferenceTimeZone, ValidationMessage, ConferenceSetup} from '../conference.datatypes';
import {CalendarService} from '../calendar.service';
import {AdvanceSettingService} from './advance-setting/advance-setting.service';
import {CalendarExitConfirmModal} from '../calendar-exit-confirm-modal';
import {CalendarLoadingModal} from '../calendar-loading-modal';
import {CalendarConferenceDuplicateModal} from '../calendar-conference-duplicate-modal';

import {
    isAfter,
    isBefore,
    isSameDay
} from 'date-fns';
import {CallIdService} from "./call-id/call-id.service";
import {DonationService} from "./donation/donation.service";
import {PhoneListService} from "./phone-list/phone-list.service";
import {PollService} from "./poll/poll.service";
import {RoleService} from "./role/role.service";

@Component({
    selector: 'app-event-edit',
    styles: [
        '.red-border { border: 2px solid red}',
    ],
    templateUrl: 'components/calendar/event-edit/event-edit.tmpl.html'
})

export class EventEditComponent implements OnInit {
    @Input() event: any;
    @Output() changeViewTo: EventEmitter<string> = new EventEmitter<string>();
    @Output() setConfTo: EventEmitter<ConferenceSetup> = new EventEmitter<ConferenceSetup>();

    deletingImg = false;
    timeZones: CalendarConferenceTimeZone[] = [];
    version: string = APP_NAME;

    changedFields: any = {};
    isFieldsChanged: boolean = false;

    phoneListObject: any[] = [];
    eventCopyData: string = '';
    otherScheduleCount: number = 0;
    showOption: boolean = false;

    //for edit form data initialize object
    editForm = {
        conferenceName:         null,
        conferenceDate:         null,
        conferencestartTimeHr:  null,
        conferencestartTimeMin: null,
        conferenceTimeDuration: null,
        createEventCustomer:    null,
        conferenceTimeZone:     null,
        hostScheduleId:         null,
        bcScheduleId:           null,
        eventObject:            null,
        eternal:                null,
        hostOnly:               null
    };

    private selectedTab: Number = 1;

    private error_messages: ValidationMessage[];

    constructor(private modal: Modal,
                private calendarService: CalendarService,
                private authService: AuthService,
                private callIdService: CallIdService,
                private donationService: DonationService,
                private phoneListService: PhoneListService,
                private pollService: PollService,
                private roleService: RoleService,
                private advanceSettingService: AdvanceSettingService,
                private router: Router,
                private changeDetector: ChangeDetectorRef) {

        this.setActiveTab(1);
    }

    public setActiveTab(tab: Number):void {
        console.log("setting active tab to: " + tab);
        this.selectedTab = tab;
    }


    public isActiveTab(tab: Number):boolean {
        return this.selectedTab == tab;
    }


    public logout(event: Event):void {
        event.preventDefault();

        this.authService.logout()
            .then(() => {
                this.router.navigateByUrl('/login');
            });
    }


    ngOnInit() {
        this.lookupCodeSetups();
        this.refreshEventData();
        this.initCopyEventDataToClipboard();
    }

    refreshEventData(): void {
        this.setEditConferenceDataToForm(this.event);
    }

    isPastEvent(event): boolean {
        return isBefore(event.eventDate, new Date());
    }

    isFutureEvent(event): boolean {
        return isAfter(event.eventDate, new Date());
    }

    isCurrentEvent(event): boolean {
        return isSameDay(event.eventDate, new Date());
    }

    phoneListChanged(event) {
        console.log('phone list changed from', this.phoneListObject, "to", event);
        this.phoneListObject = event;
//        this.changeDetector.detectChanges();

        setTimeout(() => {
            this.validateEvent();
        }, 0);
    }

    private timeZoneChange(tzId): void {
        this.setChangedFields('conferenceTimeZone');
        this.editForm.conferenceTimeZone = this.timeZones.filter(timeZone => timeZone.tzId === tzId);
    }

    private lookupCodeSetups(): void {
        this.calendarService.lookupCodeSetups()
            .then((response: any) => {
                let timeZones = response.data.TIMEZONE.map(tz => ({
                    tzId: tz.options,
                    tzName: tz.value,
                    tzOffset: -25200000,
                    tzShortName: tz.key
                }));

                this.timeZones = timeZones;
            });

    }

    copyEventDataToForm(response: any):void {
        let event: any = response.data;
        console.log('full event', event);

        event.phoneListsVipListener = event.phoneListsVipListener ? event.phoneListsVipListener : [];
        event.phoneListsListener    = event.phoneListsListener ? event.phoneListsListener : [];
        event.pins                  = event.pins ? event.pins : [];

        let updateValue = value => {
            return parseInt(value, 10) < 10 ? `0${value}` : value;
        };

        this.editForm.eventObject = null;

        setTimeout(() => {

        this.editForm.eventObject              = event;
        this.editForm.conferenceName           = event.eventName;
        this.editForm.conferenceDate           = event.eventDate;
        this.editForm.conferencestartTimeHr    = updateValue(new Date(event.eventDate).getHours());
        this.editForm.conferencestartTimeMin   = updateValue(new Date(event.eventDate).getMinutes());
        this.editForm.conferenceTimeDuration   = event.eventLengthMin;
        this.editForm.createEventCustomer      = false;
        this.editForm.conferenceTimeZone       = event.eventTimeZone;
        this.editForm.hostScheduleId           = event.hostScheduleId;
        this.editForm.bcScheduleId             = event.bcScheduleId;
        this.editForm.eternal                  = event.eternal;
        this.editForm.hostOnly                 = event.hostOnly;

        // Donation
        Object.keys(this.donationService.donationSetup).length      = 0;
        Object.keys(this.advanceSettingService.formValues).length   = 0;

        this.donationService.donationSetup = {
            paypal3rdPartyEmail:    event.paypal3rdPartyEmail,
            paypalUsername:         event.paypalUsername,
            paypalPassword:         event.paypalPassword,
            paypalApiKey:           event.paypalApiKey
        };

        // Advance setting
            this.advanceSettingService.formValues = {
            sharedParentDNC:        event.sharedParentDNC,
            announceHostJoined:     event.announceHostJoined,
            announceHostLeft:       event.announceHostLeft,
            recordAudio:            event.recordAudio,
            whisperPrompts:         event.whisperPrompts,
            screeningRequired:      event.screeningRequired,
            inboundHandRaised:      event.inboundHandRaised,
            hostAnnounceTypeValue:  event.announceType,
            joinDigitValue:         event.joinDigit ? event.joinDigit : "",
            callTransferDigitValue: event.callTransferDigit ? event.callTransferDigit : "",
            raiseHandValue:         event.raiseHandDigit ? event.raiseHandDigit : "",
            donateDigitValue:       event.donateDigit ? event.donateDigit : "",
            callTransferNumber:     event.callTransferNumber,
            outboundDialMax:        event.outboundDialMax > 0,
            useAudioTestimonial:    event.useAudioTestimonial,
            eternal:                event.eternal,
            hostOnly:               event. hostOnly
        };

        // Poll
        this.pollService.pollQuestions              = event.pollQuestions;
        this.pollService.listenerShowPollResults    = event.listenerShowPollResults;

        //Phone list : scrubWireless
        this.phoneListService.scrubWireless         = event.scrubWireless;

        // Role Management
        this.roleService.roleSetup.hideListenerStats       = event.hideListenerStats;
        this.roleService.roleSetup.hidePollStats           = event.hidePollStats;
        this.roleService.roleSetup.hostOutboundStartOffset = event.hostOutboundStartOffset;

        //call-id
        this.callIdService.phoneLookup.aniRouted           = event.aniRouted;
        this.callIdService.phoneLookup.inboundListeners    = event.inboundListeners;
        this.callIdService.phoneLookup.parkInbound         = event.parkInbound;
        this.callIdService.phoneLookup.parkInboundDisabled = event.parkInboundDisabled;

        this.calendarService.restSettings = {
            updateCount: event.updateCount,
            userstamp: event.userstamp
        };

        // Clear change
        this.clearChangedFields();
        this.validateEvent();
        this.setCopyEventDataToClipboard();
        }, 0);
    }

    setEditConferenceDataToForm(event): void {
        setTimeout(()=>{
        console.log('event inside edit ', event);

        this.modal.open(CalendarLoadingModal, overlayConfigFactory({message: "Getting Conference Setup..."}, BSModalContext))
            .then(dialog => {
                this.calendarService.getConferenceEvent(event.hostScheduleId)
                    .then((response: any) => {
                        dialog.dismiss();
                        setTimeout(()=>{
                            this.copyEventDataToForm(response)
                        },100);
                    });

            });
        }, 100);
    }

    deleteConference(): void {
            this.modal.open(CalendarLoadingModal, overlayConfigFactory({message: "Deleting Conference ..."}, BSModalContext))
                .then(dialog => {
                    let hostScheduleId = this.event.hostScheduleId;

                    this.calendarService.conferenceDelete(hostScheduleId)
                        .then(response => {
                            dialog.dismiss();
                            setTimeout(()=>{
                                this.modal.alert().title('Success').body('Conference deleted successfully!').open();
                                this.clearChangedFields();
                                this.backToCalendarView();
                            },200);
                        }, () => {
                            dialog.dismiss();
                            setTimeout(()=>{
                                this.modal.alert().title('Error').body('Unable to delete conference. Please try again later!').open();
                                this.clearChangedFields();
                            },200);
                            //this.backToCalendarView();
                        });
                });
    }

    updateConferenceData(): void {
        this.modal.open(CalendarLoadingModal, overlayConfigFactory({message: "Saving Conference ..."}, BSModalContext))
            .then(dialog => {
                let formatDate = (date: Date): string => {
                        return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                            .toISOString()
                            .slice(0, 16)
                            .replace(/(\d{4})\-(\d{2})\-(\d{2})T(\d{2}):(\d{2})/, '$2\/$3\/$1 $4:$5')
                    }, date = new Date(this.editForm.conferenceDate),
                    eventDate = new Date(
                        date.getFullYear(),
                        date.getMonth(),
                        date.getDate(),
                        this.editForm.conferencestartTimeHr,
                        this.editForm.conferencestartTimeMin
                    );

                let conferenceEvent = {
                    eventName:               this.editForm.conferenceName,
                    customerName:            null,
                    customerId:              -1,
                    conferenceId:            this.editForm.eventObject.conferenceId,
                    aniMain:                 this.editForm.eventObject.aniMain,
                    aniAlt:                  null,
                    aniMainSelect:           null,
                    parkInbound:             this.editForm.eventObject.parkInbound,
                    parkInboundDisabled:     this.editForm.eventObject.parkInboundDisabled,
                    inboundListeners:        this.editForm.eventObject.inboundListeners,
                    inboundDisabled:         this.editForm.eventObject.inboundDisabled,
                    announceHostAnonymous:   false,
                    sharedParentDNC:         this.advanceSettingService.formValues.sharedParentDNC,
                    recordAudio:             this.advanceSettingService.formValues.recordAudio,
                    announceHostJoined:      this.advanceSettingService.formValues.announceHostJoined,
                    announceHostLeft:        this.advanceSettingService.formValues.announceHostLeft,
                    announceType:            this.advanceSettingService.formValues.hostAnnounceTypeValue,
                    whisperPrompts:          this.advanceSettingService.formValues.whisperPrompts,
                    screeningRequired:       this.advanceSettingService.formValues.screeningRequired,
                    joinDigit:               this.advanceSettingService.formValues.joinDigitValue,
                    raiseHandDigit:          this.advanceSettingService.formValues.raiseHandValue,
                    donateDigit:             this.advanceSettingService.formValues.donateDigitValue,
                    inboundHandRaised:       this.advanceSettingService.formValues.inboundHandRaised,
                    callTransferDigit:       this.advanceSettingService.formValues.callTransferDigitValue,
                    callTransferNumber:      this.advanceSettingService.formValues.callTransferNumber,
                    useAudioTestimonial:     this.advanceSettingService.formValues.useAudioTestimonial,
                    atLive:                  this.editForm.eventObject.atLive,
                    atInvalid:               this.editForm.eventObject.atInvalid,
                    atBye:                   this.editForm.eventObject.atBye,
                    audioTestimonialId:      this.editForm.eventObject.audioTestimonialId,
                    voxAnsweringMachine:     this.editForm.eventObject.voxAnsweringMachine,
                    voxLive:                 this.editForm.eventObject.voxLive,
                    voxHoldMusic:            this.editForm.eventObject.voxHoldMusic,
                    option0:                 this.editForm.eventObject.option0,
                    option1:                 this.editForm.eventObject.option1,
                    option2:                 this.editForm.eventObject.option2,
                    option3:                 this.editForm.eventObject.option3,
                    option4:                 this.editForm.eventObject.option4,
                    option5:                 this.editForm.eventObject.option5,
                    option6:                 this.editForm.eventObject.option6,
                    option7:                 this.editForm.eventObject.option7,
                    option8:                 this.editForm.eventObject.option8,
                    option9:                 this.editForm.eventObject.option9,
                    optionOther:             this.editForm.eventObject.optionOther,
                    eventTimeZone:           this.editForm.conferenceTimeZone,
                    eventDate:               formatDate(eventDate),
                    eventLengthMS:           -1,
                    eventLengthMin:          this.editForm.conferenceTimeDuration,
                    eventPhoneListSize:      this.editForm.eventObject.eventPhoneListSize,
                    hostStartOffset:         this.editForm.eventObject.hostStartOffset,
                    hostEndOffset:           this.editForm.eventObject.hostEndOffset,
                    hostScheduleId:          this.editForm.hostScheduleId,
                    hostOutboundScheduleId:  this.editForm.eventObject.hostOutboundScheduleId,
                    bcScheduleId:            this.editForm.bcScheduleId,
                    vipScheduleId:           this.editForm.eventObject.vipScheduleId,
                    hostActiveFrom:          this.editForm.eventObject.hostActiveFrom,
                    hostActiveUntil:         this.editForm.eventObject.hostActiveUntil,
                    scrubWireless:           this.phoneListService.scrubWireless,
                    phoneListsListener:      this.editForm.eventObject.phoneListsListener,
                    phoneListsVipListener:   this.editForm.eventObject.phoneListsVipListener,
                    pins:                    this.editForm.eventObject.pins,
                    restrictedPins:          this.editForm.eventObject.restrictedPins,
                    pollQuestions:           this.pollService.pollQuestions,
                    listenerShowPollResults: this.pollService.listenerShowPollResults,
                    complete:                false,
                    paypalUsername:          this.donationService.donationSetup.paypalUsername,
                    paypalPassword:          this.donationService.donationSetup.paypalPassword,
                    paypalApiKey:            this.donationService.donationSetup.paypalApiKey,
                    paypal3rdPartyEmail:     this.donationService.donationSetup.paypal3rdPartyEmail,
                    hostOnly:                this.editForm.eventObject.hostOnly,
                    createEventCustomer:     this.editForm.eventObject.createEventCustomer,
                    updateCount:             this.calendarService.restSettings.updateCount,
                    userstamp:               this.calendarService.restSettings.userstamp,
                    hostCampaignId:          this.editForm.eventObject.hostCampaignId,
                    dialerErrorMessage:      null,
                    aniRouted:               this.editForm.eventObject.aniRouted,
                    active:                  false,
                    eventStreamId:           null,
                    agenda:                  APP_NAME,
                    hideListenerStats:       this.roleService.roleSetup.hideListenerStats,
                    hidePollStats:           this.roleService.roleSetup.hidePollStats,
                    hostOutboundStartOffset: this.roleService.roleSetup.hostOutboundStartOffset,
                    eternal:                 this.editForm.eventObject.eternal,
                    createDefaultPins:       this.editForm.eventObject.createDefaultPins,
                    outboundDialMax:         this.editForm.eventObject.outboundDialMax,
                    routeMeError:            null,
                    voxCustomHostGreeting:   this.editForm.eventObject.voxCustomHostGreeting,
                };


        this.calendarService.conferenceUpdate(conferenceEvent)
            .then((response:any) => {

                dialog.dismiss();
                setTimeout(()=> {
                    this.modal.alert().title('Success').body('Conference updated successfully!').open();
                    this.clearChangedFields();
                    this.validateEvent();
                    this.copyEventDataToForm(response);
                    console.log("Save response: ", response);
                }, 200);
                //this.backToCalendarView();
            }, (response: any) => {
                console.log("error response: ", response);

                dialog.dismiss();
                setTimeout(()=> {
                    //this.clearChangedFields();
                    if (response && response.data) {
                        this.modal.alert().title('Error').body(response).open();
                    } else {
                        this.modal.alert().title('Error').body(response).open();
                    }
                }, 200);
                //this.backToCalendarView();
                });
            });
    }


    backToCalendarView(): void {
        if (this.isFieldsChanged) {
            this.modal.open(CalendarExitConfirmModal, overlayConfigFactory({fields: this.changedFields}, BSModalContext))
                .then(resultPromise => {
                    resultPromise.result.then(result => {
                        console.log('back 2 view', result);

                        switch (result.answer) {
                            case 'yes':
                                this.updateConferenceData();
                                this.changeViewTo.emit('calendar');
                                break;
                            case 'no':
                                this.changeViewTo.emit('calendar');
                                break;
                            case 'cancel':
                                break;
                        }
                    });
                });
        } else {
            this.changeViewTo.emit('calendar');
        }
    }

    setChangedFields(field): void {
        this.changedFields[field] = true;
        this.isFieldsChanged = true;
        console.log('f changed ', this.changedFields);
    }

    switchToConf(conf: ConferenceSetup): void {
        this.setConfTo.emit(conf);
    }

    setOtherScheduleCount(count): void {
        this.otherScheduleCount = count;
    }

    clearChangedFields(): void {
        this.isFieldsChanged = false;
        this.changedFields = {};
    }

    updateValue(input): void {
        //if (parseInt(e.target.value, 10) < 10) e.target.value = `0${e.target.value}`;
        if(input.target.value < 10 && input.target.value > 0){
            input.target.value = "0" + parseInt(input.target.value);
        }
        else if(input.target.value == 0){
            input.target.value = "00";
        }
        else if(input.target.value == "00"){
            input.target.value = "";
        }
    }

    SetMint(input) {
        if(input < 10 && input > 0){
            input = "0" + parseInt(input);
        }
        else if(input == 0){
            input = "00";
        }
        else if(input == "00"){
            input = "";
        }
        return input;
    }

    getTimeWarning(): string {
        let str = '';

        let timeHr: any = parseInt(this.editForm.conferencestartTimeHr);
        let timeMin: any = parseInt(this.editForm.conferencestartTimeMin);

        if ((timeHr >= 1 && timeHr <= 7) || (timeHr >= 22 && timeHr <= 23) || timeHr === 0) {
            timeHr = timeHr < 10 ? '0' + timeHr : timeHr;
            timeMin = timeMin < 10 ? '0' + timeMin : timeMin;

            str = 'Warning, this conference is scheduled for '
            + this.timeConvertTo12Hr(this.SetMint(timeHr) + ':' + this.SetMint(timeMin)) + '!';
        }

        return str;
    }

    timeConvertTo12Hr(time): string {
        // Check correct time format and split into components
        time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

        if (time.length > 1) { // If time format correct
            time = time.slice(1);  // Remove full string match value
            time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
            time[0] = +time[0] % 12 || 12; // Adjust hours
        }
        return time.join(''); // return adjusted time or original string
    }

    duplicate(): void {
        this.modal.open(CalendarConferenceDuplicateModal,
            overlayConfigFactory({event: this.editForm.eventObject}, BSModalContext))
            .then(resultPromise => {
                resultPromise.result.then(result => {
                    console.log('duplicate done ', result);
                    this.switchToConf(result['data']);
                });
            });
    }

    validateEvent(): void {
        let event = this.editForm.eventObject;
        console.log("validating event: " , this.editForm.eventObject);
        this.calendarService.conferenceValidate(event).then((response:any) => {
            this.error_messages = response.data;
            console.log("ok response:", response);
        }, (response: any) => {
            console.log("error response: ", response);
        });
    }

    exportCalendar(): void {
        window.location.href = this.calendarService.generateCalendarFileUrl(this.event.hostScheduleId);
    }

    setCopyEventDataToClipboard() {
        //console.log('event obj for ced ', this.editForm.eventObject);

        let pins_txt = '';

        this.editForm.eventObject.pins.forEach((pin) => {
            let role_name = this.roleLabeler(pin.role);
            pins_txt += `${pin.firstName} ${pin.lastName} (${role_name}) PIN:${pin.pin}
        `;
        });

        let inbound_txt=``;
        let phone_txt: string = this.editForm.eventObject.aniMain;

        if (phone_txt == "(800) 788-9173"){
            inbound_txt = `
        Inbound Participant (or listener with PIN) Call-ID: ${this.editForm.eventObject.aniMain}
        Inbound Listener (no PIN) phone number is not enabled`;
        }
        else inbound_txt = `
        Inbound Participant (or listener with PIN) Call-ID: (800) 788-9173
        Inbound Listener (no PIN) Call-ID: ${this.editForm.eventObject.aniMain}`;

        //Clipboard format
        let txt = `
        Conference: ${this.editForm.eventObject.eventName}
        ${this.editForm.eventObject.eventDate} (${this.editForm.conferenceTimeZone.tzName}) -  ${this.editForm.eventObject.eventLengthMin} min.
        
        ${inbound_txt}

        User Information:
        ${pins_txt}
        
        Schedule information:
        Host Schedule Id: ${this.editForm.eventObject.hostScheduleId}
        Broadcast Schedule Id: ${this.editForm.eventObject.bcScheduleId}`;
        this.eventCopyData = txt;
    }

    //role names in parentheses are in fully written out"
    public roleLabeler(role:string):string {
        let result:string = "Unknown";
        if (role === 'MOD') {
            result = "Moderator";
        } else if (role === 'HOST') {
            result = "Host";
        } else if (role === 'SCREENER') {
            result = "Screener";
        } else if (role === 'SCRNMGR') {
            result = "Screener Manager";
        } else if (role === 'LISTENER') {
            result = "Listener";
        }
        return result;
    }

    initCopyEventDataToClipboard() {
        var clipboard = new Clipboard('#eventCopyDataBtn', {
            text: (trigger) => {
                return this.eventCopyData;
            }
        });

        clipboard.on('success', function (e) {
            console.info('Action:', e.action);
            console.info('Text:', e.text);
            console.info('Trigger:', e.trigger);

            e.clearSelection();
        });

        clipboard.on('error', function (e) {
            console.error('Action:', e.action);
            console.error('Trigger:', e.trigger);
        });
    }


    public hoursChange(event: any): void {
        let value: number = event.target.value;
        if (event.target.value === "") {
            value = 0;
        }
        if (value > 23) {
            value = 0;
        } else if (value < 0) {
            value  = 23;
        }
        this.editForm.conferencestartTimeHr = value;
        this.setChangedFields('conferencestartTimeHr');
    }


    public minutesChange(event: any): void {
        let value: number = event.target.value;
        if (event.target.value === "") {
            value = 0;
        }
        if (value > 59) {
            value = 0;
        } else if (value < 0) {
            value  = 59;
        }
        this.editForm.conferencestartTimeMin = value;
        this.setChangedFields('conferencestartTimeMin');
    }


    public keyDown(event:KeyboardEvent, minutes: boolean) {
        console.log("event: ", event);
        if (event.key === "ArrowUp") {
            this.incrementValue(minutes);
        } else if (event.key === "ArrowDown") {
            this.decrementValue(minutes);
        } else {
            let key:string = event.key;
            if (key.match(/^[^0-9]$/)) {
                console.log("key: ", key);
                event.preventDefault();
            }
        }
    }

    public incrementValue(minutes:boolean) {
        if (minutes) {
            this.editForm.conferencestartTimeMin++;
            if (this.editForm.conferencestartTimeMin > 59) {
                this.editForm.conferencestartTimeMin = 0;
            }
            this.setChangedFields('conferencestartTimeMin');
        } else {
            this.editForm.conferencestartTimeHr++;
            if (this.editForm.conferencestartTimeHr > 23) {
                this.editForm.conferencestartTimeHr = 0;
            }
            this.setChangedFields('conferencestartTimeHr');
        }
    }

    public decrementValue(minutes:boolean) {
        if (minutes) {
            this.editForm.conferencestartTimeMin--;
            if (this.editForm.conferencestartTimeMin < 0) {
                this.editForm.conferencestartTimeMin = 59;
            }
            this.setChangedFields('conferencestartTimeMin');
        } else {
            this.editForm.conferencestartTimeHr--;
            if (this.editForm.conferencestartTimeHr < 0) {
                this.editForm.conferencestartTimeHr = 23;
            }
            this.setChangedFields('conferencestartTimeHr');
        }
    }

}
