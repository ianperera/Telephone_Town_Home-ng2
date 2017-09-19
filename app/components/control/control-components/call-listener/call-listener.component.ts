import {Component, Input, OnInit, ElementRef, ViewChild} from '@angular/core';
import {ControlListener, Phone} from "../../control.datatypes";
import {CallListenerService} from "./call-listener.service";
import {overlayConfigFactory} from 'angular2-modal';
import {Modal, BSModalContext} from "angular2-modal/plugins/bootstrap";
import {ConferenceSetup} from "../../../calendar/conference.datatypes";
import {CalendarLoadingModal} from "../../../calendar/calendar-loading-modal";

@Component({
    selector: 'app-calllistener',
    templateUrl: 'components/control/control-components/call-listener/call-listener.tmpl.html'
})
export class CallListenerComponent implements OnInit {
    @Input() confData: ConferenceSetup;
    @ViewChild('phoneno') elQuestionName: ElementRef;

    phone: Phone = {
        name: '',
        city: '',
        limited: false,
        phone: '',
        playWelcome: true,
        raiseHand: false,
        state: '',
        zip: ''
    };

    //Phone format while typing input
    resourceId: number;
    public mask: Array <string | RegExp>

    btncall: boolean = true;
    btnhangup: boolean = false;
    constructor(private callListenerService: CallListenerService, private modal: Modal) {
        this.mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
    }

    ngOnInit() {
        this.elQuestionName.nativeElement.focus();
    }


    call() {

        if (!this.phone.phone){
            this.modal.alert().title('Unable to call listener').body(`You must enter a valid phone no`).open();

            return;
        }

            this.modal.open(CalendarLoadingModal, overlayConfigFactory({message: "Calling Listener ..."}, BSModalContext))
                .then(dialog => {
                    this.callListenerService.calltoListener(this.phone).then((res: any) => {
                        this.resourceId = res.data;
                        console.log(res.data);
                        dialog.dismiss();
                        this.btncall = false;
                        this.btnhangup = true;
                    }).catch((msg) => {
                        this.clearData();
                        setTimeout(()=> {
                        this.modal.alert().title('Calling Listener').body(`${msg}`)
                            .open()
                            .then(dialog => {
                            });
                            dialog.dismiss();
                        }, 1000);
                    });
                });
    }

    hangup() {
        if (!this.resourceId) return false;
        this.callListenerService.hangupListenerCall(this.resourceId).then((res) => {
            this.resourceId = null;
            console.log(res);
            this.btncall = true;
            this.btnhangup = false;
        }).catch((msg) => {
            this.modal.alert().title('Error').body(`${msg}`)
                .open()
                .then(dialog => {
                });
        });
    }

    clearData(): void {
        this.elQuestionName.nativeElement.focus();
        this.phone.name = '';
        this.phone.city = '';
        this.phone.limited = false;
        this.phone.phone = '';
        this.phone.playWelcome = false;
        this.phone.raiseHand = false;
        this.phone.state = '';
        this.phone.zip = '';
    }
}
