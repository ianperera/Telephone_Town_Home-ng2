import {Component, Input, Output, OnInit, ElementRef, EventEmitter, ViewChild} from '@angular/core';
import {CallParticipantService} from "./call-participant.service";
import {PhoneParticipant} from "../../control.datatypes";
import 'rxjs/add/operator/toPromise';
import {overlayConfigFactory} from 'angular2-modal';
import {Modal, BSModalContext} from "angular2-modal/plugins/bootstrap";
import {RoleService} from '../../../calendar/event-edit/role/role.service';
import {ConferenceSetup, ConferencePin} from "../../../calendar/conference.datatypes";
import {CalendarLoadingModal} from "../../../calendar/calendar-loading-modal";

import { CampaignStatsEvent } from '../../../../models/events';

import * as _ from 'lodash';

@Component({
    selector: 'app-callparticipant',
    templateUrl: 'components/control/control-components/call-participant/call-participant.tmpl.html',
    styleUrls: ['components/control/control-components/call-participant/call-participant.css']
})
export class CallParticipantComponent implements OnInit {

    constructor(private modal: Modal,
                private callParticipantService: CallParticipantService,
                private roleService: RoleService) {
        this.mapRoleItem = this.mapRoleItem.bind(this);
    }

    @Input() campaignStats: CampaignStatsEvent;

    @Input() confData: ConferenceSetup;
    @Input() event: PhoneParticipant;
    @Output() notify: EventEmitter<string> = new EventEmitter<string>();
    @Output() notifyChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    @ViewChild('phoneParticipant') elQuestionName: ElementRef;
    selectedUser: ConferencePin;

    selectedUserIndex: number;
    summaryData: any[];
    disablePreDial: boolean = false;
    preDialValue: boolean = false;
    megaCallId: number;
    clear1: boolean = true;
    clear2: boolean = false;
    mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    callStatus: string;
    callStateTimer;
    marked: boolean = false;
    markedPIN: boolean = false;
    theCheckbox: boolean = false;
    theRadio: boolean = false;
    activeStartbtn: boolean = true;
    activeAbortbtn: boolean = true;
    btnStart: boolean = true;
    btnStop: boolean = false;
    btnAbort: boolean = true;
    scheduleSeqno: number;
    dialActive: boolean;
    dialLoaded: boolean;
    CallsInUse: string;
    dialingout: boolean = false;
    participantCall: PhoneParticipant = {
        name:  '',
        mode: 1,
        type: 'HOST',
        phone: '',
        pin: false
    };

    currentCallingPhone: string;
    livevent: number;

    ngOnInit() {
        this.performRoleOperation();
    }

    toggleVisibilityofcheck(event){
        this.marked = event.target.checked;
    }

    toggleVisibilityofradio(event){
        this.markedPIN = event.target.checked;
    }

    toggleVisibilityofHost(event){
        this.markedPIN = event.target.disabled;
    }

    editUser(pin: ConferencePin, index: number) {
        //console.log(this.selectedUserIndex, this.selectedUser);

        let selectable: boolean = false;

        if ((pin.role === 'HOST' || pin.role === 'MOD') && pin.phoneNo) {
            this.participantCall.type = 'HOST';
            selectable = true;
        } else if (pin.role === 'SCREENER' || pin.role === 'SCRNMGR') {
            this.participantCall.type = 'SCREENER';
            selectable = true;
        }

        if (selectable) {
            this.elQuestionName.nativeElement.focus();
            this.selectedUser = pin;
            this.selectedUserIndex = index;
            this.participantCall.name = pin.firstName + ' ' + pin.lastName;
            this.participantCall.phone = pin.phoneNo;
        }

    }

    // concat no.of user and role name
    mapRoleItem(item: any) {

        let itemLength = item[1].length,
            plural = itemLength > 1 ? 's' : '';
        if (item[0].toLowerCase() == "mod") {
            return item[1].length + ' ' + "Moderator" + plural;
        }
        else if (item[0].toLowerCase() == "scrnmgr") {
            return item[1].length + ' ' + "Screener Manager" + plural;
        }
        else {
            return item[1].length + ' ' + this.toTitleCase(item[0]) + plural;
        }
    }

    // perform operation based on role data
    performRoleOperation(): void {
        if (this.confData.pins.length == 0) {
            this.summaryData = [];
            return;
        }

        // group role summary with available counts
        this.summaryData = _.chain(this.confData.pins)
            .groupBy("role")
            .toPairs()
            .map(this.mapRoleItem)
            .value();

        // disable pre-dial when there is no phone number
        this.disablePreDial = _.filter(this.confData.pins, function (i: any) {
                return i.phoneNo != null && i.phoneNo != '' && i.phoneNo.length > 0;
            }).length == 0;

        this.preDialValue = this.roleService.roleSetup.hostOutboundStartOffset !== -1;
    }

    // convert any string value to title case
    toTitleCase(word: string): string {
        return word.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    public roleLabeler(role: string): string {
        let result: string = "Unknown";
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

    callParticipant() {

        if (!this.participantCall.phone) {
            this.modal.alert().title('Unable to call participant').body(`You must enter a valid phone no`).open();

            return;
        }

        let newUser: ConferencePin;

        if (this.participantCall.pin) {
            if (!this.participantCall.name) {
                this.modal.alert().title('Dial screener').body(`When create PIN is specified, dialed screeners must have a name`).open();

                return;
            }
        }

        if (!this.selectedUser) {
            newUser = {
                userId: -1,
                pin: '',
                firstName: this.participantCall.name,
                lastName: '',
                role: this.participantCall.type,
                phoneNo: this.participantCall.phone,
                emailAddress: '',
                webListener: false,
                donationsAccepted: false,
                listenerHandRaised: false,
                profilePictureURL: '',
                nonInteractiveListener: false,
            };

            if (this.participantCall.pin) {
                this.callParticipantService.pinLookup().then((res: any) => {
                    let data = res.data;
                    newUser.pin = data.pin;
                }).catch((res) => {
                });
            }

            this.confData.pins.push(newUser);
            this.selectedUser = newUser;
        } else {
            if (!this.selectedUser.phoneNo) {
                this.selectedUser.phoneNo = this.participantCall.phone;
            }
        }

        if (this.selectedUser.userId > 0 && this.participantCall.phone === this.selectedUser.phoneNo) {
            this.modal.open(CalendarLoadingModal, overlayConfigFactory({message: "Calling Participant ..."}, BSModalContext))
                .then(dialog => {
                    this.callParticipantService.calltoParticipantbyRole(this.selectedUser, this.participantCall.mode).then((res: any) => {
                        //Call this function to get Call Status
                        this.megaCallId = res.data.megaCallId;
                        this.startWatchForCallStatus();
                        console.log(res.data.megaCallId);
                        dialog.dismiss();
                    }).catch((msg) => {
                        this.clearParticipantData();
                        setTimeout(() => {
                            this.modal.alert().title('Calling Participant').body(`${msg}`)
                                .open()
                                .then(dialog => {
                                });
                            dialog.dismiss();
                        }, 2000);
                    });
                });
        }
        else {
            this.selectedUser.firstName = this.participantCall.name;

            this.modal.open(CalendarLoadingModal, overlayConfigFactory({message: "Calling Participant ..."}, BSModalContext))
                .then(dialog => {
                    this.callParticipantService.calltoParticipantbyForm(this.participantCall).then((res: any) => {
                        //Call this function to get Call Status
                        this.megaCallId = res.data.megaCallId;
                        this.startWatchForCallStatus();
                        console.log(res.data.megaCallId);
                        dialog.dismiss();
                    }).catch((msg) => {
                        this.clearParticipantData();
                        setTimeout(() => {
                            this.modal.alert().title('Calling Participant').body(`${msg}`)
                                .open()
                                .then(dialog => {
                                });
                            dialog.dismiss();
                        }, 2000);
                    });
                });
        }
        this.dialingout = true;
        this.currentCallingPhone = this.participantCall.phone;
    }

    lookupParticipant() {
        if (!this.megaCallId) return false;

        this.callParticipantService.lookUpParticipant(this.megaCallId).then((res: any) => {
            this.callStatus = res.data.statusDesc;

            if (this.callStatus === 'disconnected') {
                this.megaCallId = null;
            }
        }).catch((msg) => {
            this.modal.alert().title('Error').body(`${msg}`)
                .open()
                .then(dialog => {
                });
        });
    }

    //Other Dialing Methods
    activeStartofParticipant(data): void {
        let schedules = data.schedules;
        this.scheduleSeqno = data.hostCampaignSchedules[0].scheduleSeqno;
        this.dialActive = data.hostCampaignSchedules[0].dialerActive;
        this.dialLoaded =data.hostCampaignSchedules[0].dialerLoaded;

        //console.log(this.scheduleSeqno);

        if (schedules[0].plists !== null && schedules[0].dialerLoaded == true ) {
            this.activeStartbtn = false;
            this.btnStart = true;
            this.btnStop = false;
        }
        else {
            this.activeStartbtn = true;
            this.btnStart = true;
            this.btnStop = false;
        }
    }

    activeStoptofParticipant(data): void {
        this.scheduleSeqno = data.hostCampaignSchedules[0].scheduleSeqno;
        this.dialActive = data.hostCampaignSchedules[0].dialerActive;
        this.dialLoaded =data.hostCampaignSchedules[0].dialerLoaded;

        if (this.dialActive == true && this.dialLoaded == true){
            this.btnStart = false;
            this.btnStop = true;
        }
        else {
            this.activeStartofParticipant(data);
        }
    }

    activeAbortofParticipant(data): void {
        let CampaignStats = data.hostCampaignStats;
        this.CallsInUse = data.hostCampaignStats.callsInUseCnt;
        //console.log(this.CallsInUse);

        if (CampaignStats.callsInUseCnt > 0) {
            this.activeAbortbtn = false;
            this.btnAbort = true;
        }
        else {
            this.activeAbortbtn = true;
            this.btnAbort = true;
        }
    }

    liveEvent(data) {
        this.livevent = data.status;
        //console.log('livevent', this.livevent);
    }

    StartofParticipantDialOut(): void {
        if (!this.scheduleSeqno) return;

        if (this.livevent === 2) {

            this.callParticipantService.startOutboundDial(this.scheduleSeqno).then((res) => {
                this.btnStart = false;
                this.btnStop = true;
            }).catch((msg) => {
                this.modal.alert().title('Error').body(`${msg}`)
                    .open()
                    .then(dialog => {
                    });
            });
        } else {
            this.modal.alert().title('Starting Schedule').body(`You cannot start the dial without a live host or moderator`).open();
            return;
        }
    }

    StopofParticipantDialOut(): void {
        if (!this.scheduleSeqno) return;

        this.callParticipantService.stopOutboundDial(this.scheduleSeqno).then((res) => {
            this.btnStart = true;
            this.btnStop = false;
        }).catch((msg) => {
            this.modal.alert().title('Error').body(`${msg}`)
                .open()
                .then(dialog => {
                });
        });
    }

    AbortofParticipantDialOut(): void {
        if (!this.scheduleSeqno) return;

        this.callParticipantService.abortOutboundDial(this.scheduleSeqno).then((res) => {
        }).catch((msg) => {
            this.modal.alert().title('Error').body(`${msg}`)
                .open()
                .then(dialog => {
                });
        });
    }


    startWatchForCallStatus() {
        if (!this.megaCallId) return;

        this.callStateTimer = setInterval(() => {
            if (this.megaCallId) {
                this.lookupParticipant();
            } else {
                clearInterval(this.callStateTimer);
                this.callStateTimer = null;
            }
        }, 1000);
    }

    hangupParticipant() {
        if (!this.megaCallId) return false;

        this.callParticipantService.hangupParticipantCall(this.megaCallId).then((res) => {
            //this.megaCallId = null;
        }).catch((msg) => {
            this.modal.alert().title('Error').body(`${msg}`)
                .open()
                .then(dialog => {
                });
        });
        this.dialingout = false;
    }

    clearParticipantData() {
        this.elQuestionName.nativeElement.focus();

        this.participantCall.phone = '';
        this.participantCall.name = '';
        this.participantCall.mode = 1;
        this.participantCall.type = this.participantCall.type === 'HOST' ? 'SCREENER' : 'HOST';

        this.markedPIN = this.participantCall.type === 'SCREENER';

        this.callStatus = '';
        this.selectedUser = null;
        this.selectedUserIndex = null;
        this.currentCallingPhone = '';
    }

}
