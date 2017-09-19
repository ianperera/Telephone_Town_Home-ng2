/**
 * Created by Posh on 1/9/17.
 */
import {Component, OnInit} from '@angular/core';

import {DialogRef, ModalComponent} from 'angular2-modal';
import {Modal, BSModalContext} from 'angular2-modal/plugins/bootstrap';
import {overlayConfigFactory} from 'angular2-modal';
import {CalendarLoadingModalContext, CalendarLoadingModal} from './calendar-loading-modal';
import {FormsModule} from '@angular/forms';

import {CalendarService} from './calendar.service';

import {CalendarConferenceTimeZone} from './calendar-conference-modal';
import {ConferenceSetup} from "./conference.datatypes";

export class CalendarConferenceDuplicateModalContext extends BSModalContext {
    event: ConferenceSetup;
    eventDate: Date;
    eventName: string;
    startTimeHour: number;
    startTimeMinute: number;
    eventTimeZone: CalendarConferenceTimeZone;
    duration: number;
    dupAsTemplate: boolean;
    keepRoles: boolean;
    keepAni: boolean;
    keepPolls: boolean;
    keepLiveGreet: boolean;
    keepAnsMachine: boolean;
    keepHoldMusic: boolean;
}

@Component({
    selector: 'app-calendar-conference-duplicate-modal',
    styles: [
        '.mb-0 { margin-bottom: 0; }',
        '.input-group-btn { font-size: 12px; width: 8px; text-align: center; }',
        '.form-control { -webkit-box-shadow: none; box-shadow: none; }'
    ],
    template: `
    <div class="modal-header">          
        <h4 class="modal-title">Duplicate {{ context.event.eventName }}</h4>
    </div>
    <form class="mb-0" autocomplete="off" (submit)="formSubmit($event)">
        <div class="panel mb-0">
            <div class="panel-body">
                <div style="color:red;">{{ error }}</div>
                <div>
                    <div class="form-group">
                        <label for="date">Date</label>
                        <input type="date" class="form-control input-sm" id="date" required 
                                [ngModel]="context.eventDate | date: 'yyyy-MM-dd' " (ngModelChange)="updateDate($event)" name="date">                  
                    </div>
                    <div class="form-group">                        
                        <label for="startTimeHour">Time</label>
                        <div class="input-group">
                          <input type="text" class="form-control input-sm" id="startTimeHour" style="width: 200px;"
                                min="0" max="23" required [(ngModel)]="context.startTimeHour"
                                [ngModelOptions]="{standalone: true}" 
                                (change)="updateValue($event)">
                          <span class="input-group-btn">:</span>
                          <input type="text" class="form-control input-sm" id="startTimeMinute"  style="width: 200px;"
                                min="0" max="59" required [(ngModel)]="context.startTimeMinute"
                                [ngModelOptions]="{standalone: true}" (click)="updateValue($event)"
                                (change)="updateValue($event)">
                        </div>
                        <p style="color:red;">{{ getTimeWarning() }}</p>                       
                    </div>
                    <div class="form-group">
                        <label for="duration">Duration (Min.)</label>
                        <input style="width: 270px" type="number" 
                                class="form-control input-sm" id="duration" 
                                min="30" max="240" required [(ngModel)]="context.duration" 
                                [ngModelOptions]="{standalone: true}">
                    </div>
                    <div class="checkbox">
                        <label>
                            <input type="checkbox" [(ngModel)]="context.dupAsTemplate"
                                    [ngModelOptions]="{standalone: true}"> Duplicate as template
                        </label>
                    </div>                    
                </div>                
                <div *ngIf="context.dupAsTemplate">
                    <div class="form-group">
                        <label for="eventName">New Name</label>
                        <input type="text" class="form-control input-sm" id="eventName" 
                                required [(ngModel)]="context.eventName" [ngModelOptions]="{standalone: true}">
                    </div>                
                    <div class="checkbox">
                        <label>
                            <input type="checkbox" [(ngModel)]="context.keepRoles"
                                    [ngModelOptions]="{standalone: true}"> Keep Roles
                        </label>
                    </div>
                    <div class="checkbox">
                        <label>
                            <input type="checkbox" [(ngModel)]="context.keepAni"
                                    [ngModelOptions]="{standalone: true}"> Keep Caller ID
                        </label>
                    </div>
                    <div class="checkbox">
                        <label>
                            <input type="checkbox" [(ngModel)]="context.keepPolls"
                                    [ngModelOptions]="{standalone: true}"> Keep Polls
                        </label>
                    </div>
                    <div class="checkbox">
                        <label>
                            <input type="checkbox" [(ngModel)]="context.keepLiveGreet"
                                    [ngModelOptions]="{standalone: true}"> Keep Live Greeting
                        </label>
                    </div>
                    <div class="checkbox">
                        <label>
                            <input type="checkbox" [(ngModel)]="context.keepAnsMachine"
                                    [ngModelOptions]="{standalone: true}"> Keep Ans. Machine
                        </label>
                    </div>
                    <div class="checkbox">
                        <label>
                            <input type="checkbox" [(ngModel)]="context.keepHoldMusic"
                                    [ngModelOptions]="{standalone: true}"> Keep Hold Music
                        </label>
                    </div>
                </div>
            </div>
            <div class="panel-footer text-right">
              <button type="submit" class="btn btn-primary"
                      [disabled]="isCreating">Save</button>
              <button type="button" class="btn btn-default"
                      [disabled]="isCreating"
                      (click)="closeDialog($event)">Cancel</button>
            </div>
        </div>
    </form>
  `
})
export class CalendarConferenceDuplicateModal implements OnInit, ModalComponent<CalendarConferenceDuplicateModalContext> {
    context: CalendarConferenceDuplicateModalContext;
    isCreating: boolean = false;
    error: string;
    value: Date;

    constructor(public dialog: DialogRef<CalendarConferenceDuplicateModalContext>,
                private calendarService: CalendarService,
                private modal: Modal ) {
    }

    ngOnInit() {
        let updateValue = value => {
            return parseInt(value, 10) < 10 ? `0${value}` : value;
        };

        let event = this.dialog.context.event;

        let datetime = event.eventDate.split(' ');

        this.context = <CalendarConferenceDuplicateModalContext>{
            event: event,
            eventName: event.eventName,
            eventDate: new Date(datetime[0]),
            startTimeHour: updateValue(new Date(event.eventDate).getHours()),
            startTimeMinute: updateValue(new Date(event.eventDate).getMinutes()),
            duration: event.eventLengthMin,
            eventTimeZone: event.eventTimeZone,
            dupAsTemplate: false,
            keepAni: true,
            keepAnsMachine: true,
            keepRoles: true,
            keepHoldMusic: true,
            keepLiveGreet: true,
            keepPolls: true,
        };
    }

    updateDate(event){
        if(event != ''){
            let newDate: Date;
            newDate = new Date(event + " 00:00");
            this.context.eventDate = newDate;
        }
    }

    formSubmit(event): void {
        event.preventDefault();
        let d = this.context.eventDate;


        let update = d.getUTCMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();
        console.log("date string: ", update);
        let datetimepart = update.split("/");


        this.error = '';
        this.isCreating = true;

        if (!this.context.dupAsTemplate) {
            let conferenceEvent = {
                newDate: new Date(
                    parseInt(datetimepart[2]),
                    parseInt(datetimepart[0]) - 1,
                    parseInt(datetimepart[1]),
                    this.context.startTimeHour,
                    this.context.startTimeMinute
                ),
                duration: this.context.duration
            };

            this.modal.open(CalendarLoadingModal, overlayConfigFactory({message: "Duplicating Conference ..."}, BSModalContext))
                .then(dialog => {
                    this.calendarService.conferenceReschedule(conferenceEvent, this.context.event.hostScheduleId)
                        .then(response => {
                            dialog.dismiss();
                            setTimeout(()=>{
                                this.error = '';
                                this.dialog.close(response);
                            },200);
                        }, (msg) => {
                            dialog.dismiss();
                            setTimeout(()=>{
                                this.error = msg;
                                this.isCreating = false;
                            },200);
                        });
                });
        } else {
            let conferenceEvent = {
                newDate: new Date(
                    parseInt(datetimepart[2]),
                    parseInt(datetimepart[0]) - 1,
                    parseInt(datetimepart[1]),
                    this.context.startTimeHour,
                    this.context.startTimeMinute
                ),
                duration: this.context.duration,
                newName: this.context.eventName,
                keepRoles: this.context.keepRoles,
                keepPhone: this.context.keepAni,
                keepPolls: this.context.keepRoles,
                keepLiveGreeting: this.context.keepLiveGreet,
                keepAnsMachine: this.context.keepAnsMachine,
                keepHoldMusic: this.context.keepHoldMusic,
            };

            this.modal.open(CalendarLoadingModal, overlayConfigFactory({message: "Duplicating Conference ..."}, BSModalContext))
                .then(dialog => {

                    this.calendarService.conferenceFullDuplicate(conferenceEvent, this.context.event.hostScheduleId)
                        .then(response => {
                            dialog.dismiss();
                            setTimeout(()=>{
                                this.error = '';
                                this.dialog.close(response);
                            },200);
                        }, (msg) => {
                            dialog.dismiss();
                            setTimeout(()=>{
                                this.error = msg;
                                this.isCreating = false;
                            },200);
                        });
                });
        }
    }

    closeDialog(event): void {
        this.dialog.close();
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

        let timeHr: any = this.context.startTimeHour;
        let timeMin: any = this.context.startTimeMinute;

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

}
