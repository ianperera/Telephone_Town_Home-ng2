import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Response} from '@angular/http';

import 'rxjs/add/operator/toPromise';

import {overlayConfigFactory} from 'angular2-modal';
import {Modal, BSModalContext} from 'angular2-modal/plugins/bootstrap';
import {RoleModal, RoleModalContext, UserRole} from './role-modal';
import {CalendarService} from '../../calendar.service';

import {RoleService} from './role.service';

import * as _ from 'lodash';
import {ConferenceSetup, ConferencePin} from "../../conference.datatypes";

@Component({
    selector: 'app-event-role',
    templateUrl: 'components/calendar/event-edit/role/role.tmpl.html',
    styleUrls: ['components/calendar/event-edit/role/role.css']
})
export class RoleComponent implements OnInit {
    constructor(private modal: Modal,
                private calendarService: CalendarService,
                private roleService: RoleService) {
        this.mapRoleItem = this.mapRoleItem.bind(this);
    }

    @Input() event: ConferenceSetup;
    @Output() change: EventEmitter<string> = new EventEmitter<string>();
    selectedUser: ConferencePin;
    selectedUserIndex: number;
    summaryData: any[];
    disablePreDial: boolean = false;
    preDialValue: boolean = false;
    IVRCONFnumber: any [];

    ngOnInit() {
        console.log('event inside user comp', this.event);
        this.performRoleOperation();
        this.ConfPhonenumber();
    }

    // Inbound participant dial-in number
    private ConfPhonenumber(): void {
        this.roleService.lookupParticipantPhoneNumber()
            .then((response: any) => {
                this.IVRCONFnumber = response.data["IVRCONF"];

            });
    }

    // set default value
    onPreDialChange(){
        this.roleService.roleSetup.hostOutboundStartOffset = 15;

     if (!this.preDialValue){
            this.roleService.roleSetup.hostOutboundStartOffset = -1;
        }

    }

    // perform operation based on role data
    performRoleOperation(): void {
        if (this.event.pins.length == 0) {
            this.summaryData = [];
            return;
        }

        // group role summary with available counts
        this.summaryData = _.chain(this.event.pins)
            .groupBy("role")
            .toPairs()
            .map(this.mapRoleItem)
            .value();

        // disable pre-dial when there is no phone number
        this.disablePreDial = _.filter(this.event.pins, function(i:any){
                return i.phoneNo != null && i.phoneNo != '' && i.phoneNo.length > 0;
            }).length == 0;

        this.preDialValue = this.roleService.roleSetup.hostOutboundStartOffset !== -1;

    }

    // concat no.of user and role name
    mapRoleItem(item:any) {

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


    // convert any string value to title case
    toTitleCase(word: string): string {
        return word.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    editUser(pin: ConferencePin, index: number) {
        this.selectedUser = pin;
        this.selectedUserIndex = index;
        console.log(this.selectedUserIndex, this.selectedUser);
    }

    showCreateUser() {
        this.modal.open(RoleModal, overlayConfigFactory({role: '-1','hostScheduleId': this.event.hostScheduleId}, BSModalContext))
            .then(resultPromise => {
                resultPromise.result.then(result => {
                    if (result) {
                        console.log('user result', result);
                        this.event.pins.push(result);
                        this.change.emit('role');
                        this.selectedUser = this.selectedUserIndex = null;
                        this.performRoleOperation();
                    }
                });
            });
    }

    showEditUser() {
        if (!this.selectedUser) return;

        this.modal.open(RoleModal, overlayConfigFactory(Object.assign({'hostScheduleId': this.event.hostScheduleId}, this.selectedUser), BSModalContext))
            .then(resultPromise => {
                resultPromise.result.then(result => {
                    if (result) {
                        console.log('user result', result);
                        this.event.pins[this.selectedUserIndex] = result;
                        this.change.emit('role');
                        this.selectedUser = this.selectedUserIndex = null;
                        this.performRoleOperation();
                    }
                });
            });
    }

    deleteUser() {
        if (!this.selectedUser) return;

        this.roleService.deleteUser(this.selectedUser.pin).then(response => {
            let removedItem = this.event.pins.splice(this.selectedUserIndex, 1);
            this.change.emit('role');
            console.log(removedItem);
            this.selectedUser = this.selectedUserIndex = null;
            this.performRoleOperation();
        }, (msg) => {
            alert(msg);
        });

    }


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
}