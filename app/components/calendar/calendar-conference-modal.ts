import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from "@angular/router";

import { DialogRef, ModalComponent, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { CalendarLoadingModalContext, CalendarLoadingModal } from './calendar-loading-modal';

import { CalendarService } from './calendar.service';

export class CalendarConferenceTimeZone {
    tzId: string;
    tzName: string;
    tzOffset: number;
    tzShortName: string;
}

export class CalendarConferenceModalContext extends BSModalContext {
    eventDate: Date;
    eventName: string;
    startTimeHour: number;
    startTimeMinute: number;
    eventTimeZone: CalendarConferenceTimeZone;
    duration: number;
    createEventCustomer: boolean;
    simpleConference: boolean;
}

@Component({
    selector: 'app-calendar-conference-modal',
    styles: [
        '.mb-0 { margin-bottom: 0; }',
        '.input-group-btn { font-size: 12px; width: 8px; text-align: center; }',
        '.form-control { -webkit-box-shadow: none; box-shadow: none; }'
    ],
    template: `
    <div class="modal-header">
          
          <h4 class="modal-title">Create New Conference</h4>
        </div>
        <form class="mb-0"
          autocomplete="off"
          (submit)="formSubmit($event)">
      <div class="panel mb-0">
        <div class="panel-body">
        <div style="color: red;margin: 5px 0;">{{ errorMsg }}</div>
          <div class="form-group">
            <label for="eventName">Conference Name</label>
            <input type="text" class="form-control input-sm" id="eventName" required
                   [(ngModel)]="context.eventName"
                   [ngModelOptions]="{standalone: true}">
          </div>
          
          <div class="container">
          <a href="#more" data-toggle="collapse">Advanced Settings</a>         
          <div id="more" class="collapse">   
            <div class="row">           
              <div class="form-group">
                <br>
                <label for="startTimeHour">Start Time</label>
                  <div class="input-group">
                  <input style="width: 100px" type="text" class="form-control input-sm" id="startTimeHour" min="0" max="23" required
                         [(ngModel)]="context.startTimeHour"
                         [ngModelOptions]="{standalone: true}" (click)="format($event)"
                         (change)="format($event)">
                  <span class="input-group-btn">:</span>
                  <input style="width: 100px" type="text" class="form-control input-sm" id="startTimeMinute" min="0" max="59" required
                         [(ngModel)]="context.startTimeMinute"
                         [ngModelOptions]="{standalone: true}" (click)="format($event)"
                         (change)="format($event)">
                </div>
                <p style="color:red;">{{ getTimeWarning() }}</p>
                 <div class="form-group">
            <label for="eventTimeZone">Time Zone</label>
            <select style="width: 270px" class="form-control input-sm" id="eventTimeZone"
                    [(ngModel)]="context.eventTimeZone"
                    [ngModelOptions]="{standalone: true}">
              <option [ngValue]="timeZone"
                      [selected]="context.eventTimeZone.tzId === timeZone.tzId"
                      *ngFor="let timeZone of timeZones">{{timeZone.tzName}} ({{timeZone.tzShortName}})</option>
            </select>
          </div>
          
                <div class="form-group">
                <label for="duration">Duration (Min.)</label>
                <input style="width: 270px" type="number" class="form-control input-sm" id="duration" min="30" max="240" required
                       [(ngModel)]="context.duration"
                       [ngModelOptions]="{standalone: true}">
                <!--<p class="help-block">Minutes</p>-->
              </div>
              
          <div class="checkbox">
            <label>
              <input type="checkbox"
                     [(ngModel)]="context.createEventCustomer"
                     [ngModelOptions]="{standalone: true}"> Create event customer
            </label>
          </div>
          <div class="checkbox">
            <label>
              <input type="checkbox"
                     [(ngModel)]="context.simpleConference"
                     [ngModelOptions]="{standalone: true}"> Simple conference
            </label>
          </div>
            </div>          
              
          </div>     
         
       </div>
       
  </div>
</div>
          <div class="panel-footer text-right">
          <button type="submit" class="btn btn-primary"
                  [disabled]="isCreating">Create</button>
          <button type="button" class="btn btn-default"
                  [disabled]="isCreating"
                  (click)="closeDialog($event)">Cancel</button>
          
        </div> 
      </div>
    </form>
  `
})
export class CalendarConferenceModal implements OnInit, ModalComponent<CalendarConferenceModalContext> {

    context: CalendarConferenceModalContext;
    timeZones: CalendarConferenceTimeZone[] = [];
    isCreating: boolean = false;
    errorMsg: string;

    private shouldCreateEventCustomer: boolean = true;

    constructor(public dialog: DialogRef<CalendarConferenceModalContext>,
                private calendarService: CalendarService,
                private modal: Modal,
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe((params: Params) => {
            let noCreateEventCustomer: boolean = params["noCreateEventCustomer"] === "true";
            console.log("noCreateEventCustomer=", noCreateEventCustomer, params["noCreateEventCustomer"]);

            if (noCreateEventCustomer) {
                this.shouldCreateEventCustomer = false;
            }

        });


        let updateValue = value => {
            return parseInt(value, 10) < 10 ? `0${value}` : value;
        };

        let date = new Date();
        this.context = Object.assign({
            startTimeHour: updateValue(date.getHours()),
            startTimeMinute: updateValue(date.getMinutes()),
            eventTimeZone: null,
            duration: 30,
            createEventCustomer: this.shouldCreateEventCustomer,
            simpleConference: false
        }, this.dialog.context);

        this.calendarService.lookupCodeSetups()
            .then((response: any) => {
                let timeZones = response.data.TIMEZONE.map(tz => ({
                    tzId: tz.options,
                    tzName: tz.value,
                    tzOffset: -25200000,
                    tzShortName: tz.key
                }));

                let userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

                let options = {
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                    timeZoneName: 'short'
                };

                let userLang = navigator.language;
                let f_date = new Intl.DateTimeFormat(userLang, options).format(date);
                let timeZoneShort = f_date.split(' ')[2];

                //Remove tz.tzShortName == 'PST' and set default to the user's local time zone
                if (timeZones.length > 0) {
                    this.context.eventTimeZone = timeZones.find((tz: CalendarConferenceTimeZone) => tz.tzShortName == timeZoneShort);

                    if (!this.context.eventTimeZone) {
                        var localTZ = {
                            tzId: userTimezone,
                            tzName: userTimezone,
                            tzOffset: -25200000,
                            tzShortName: timeZoneShort
                        };

                        timeZones.push(localTZ);

                        this.context.eventTimeZone = localTZ;
                    }
                }

                this.timeZones = timeZones;
            });
    }

    formSubmit(event): void {
        event.preventDefault();

        let conferenceEvent = {
            eventName: this.context.eventName,
            createEventCustomer: this.context.createEventCustomer,
            eventTimeZone: this.context.eventTimeZone,
            eventPhoneListSize: 0,
            phoneListsListener: null,
            eventLengthMin: this.context.duration,
            simpleConference: this.context.simpleConference,
            eventDate: new Date(
                this.context.eventDate.getFullYear(),
                this.context.eventDate.getMonth(),
                this.context.eventDate.getDate(),
                this.context.startTimeHour,
                this.context.startTimeMinute
            )
        };

        this.isCreating = true;

        this.modal.open(CalendarLoadingModal, overlayConfigFactory({message: "Saving Conference ..."}, BSModalContext))
            .then(dialog => {

                this.calendarService.conferenceEdit(conferenceEvent)
                    .then(response => {
                        this.errorMsg = '';
                        dialog.dismiss();
                        setTimeout(() => {
                            this.dialog.close(response);
                        }, 200);
                    }, (response) => {
                        this.errorMsg = response;
                        dialog.dismiss();
                        setTimeout(() => {
                            this.isCreating = false;
                        }, 200);
                    });
            });
    }

    closeDialog(event): void {
        this.dialog.close();
    }

    updateValue(e): void {
        if (parseInt(e, 10) < 10) e = parseInt('01');
        console.log(parseInt('01'));
    }

    format(input) {
        console.log(input.target.value);
        if (input.target.value < 10 && input.target.value > 0) {
            input.target.value = "0" + parseInt(input.target.value);
        }
        else if (input.target.value == 0) {
            input.target.value = "00";
        }
        else if (input.target.value == "00") {
            input.target.value = "";
        }

    }

    SetMint(input) {
        if (input < 10 && input > 0) {
            input = "0" + parseInt(input);
        }
        else if (input == 0) {
            input = "00";
        }
        else if (input == "00") {
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
