import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import {overlayConfigFactory} from 'angular2-modal';
import {Modal, BSModalContext} from 'angular2-modal/plugins/bootstrap';
import {AudioModal} from './../audio/audio.modal';

import {RequestHelperService} from '../../../../request-helper.service';
import {CalendarService} from '../../../calendar/calendar.service';
import {AdvanceSettingService}from './advance-setting.service' ;

import {AudioService} from './../audio/audio.service';
import {ConferenceSetup} from "../../conference.datatypes";

@Component({
    selector: 'app-event-advance-setting',
    templateUrl: 'components/calendar/event-edit/advance-setting/advance-setting.tmpl.html'
})
export class AdvanceSettingComponent implements OnInit {
    @Input() event: ConferenceSetup;
    @Output() notify: EventEmitter<string> = new EventEmitter<string>();

    private showNotShow = false;

    defaultAudioTitles: any = {
        voxCustomHostGreeting: "Custom Host Greetings Not Set!",
        atLive:                "Voicemail Prompt Not Set!",
        atBye:                 "Voicemail Goodbye Not Set!",
        atInvalid:             "Voicemail Error Message Not Set!"
    };

    audioTypes: any = [
        'voxCustomHostGreeting',
        'atLive',
        'atBye',
        'atInvalid'
    ];

    audioObj: any = {};

    selectedPinsRight: any[] = [];
    selectedPinsLeft: any[] = [];
    pinsRight: any[] = [];

    constructor(private requestHelper: RequestHelperService,
                private calendarService: CalendarService,
                private audioService: AudioService,
                private advanceSettingService: AdvanceSettingService,
                private modal: Modal) {
    }

    ngOnInit() {
        this.audioTypes.forEach(type => {
            this.initAudioObject(type);
            this.setAudioObject(type);
        });

        this.event.restrictedPins = this.event.restrictedPins ? this.event.restrictedPins : [];
        this.initRightPins();
        this.advanceSettingService.formValues.outboundDialMax = this.event.outboundDialMax > 0;
    }

    // Manage Audio
    initAudioObject(type) {
        this.audioObj[type] = {
            title: null,
            audioUrl: null
        };
    }

    setAudioObject(type) {
        if (this.event[type]) {
            this.audioObj[type].title = this.event[type].name;
            this.audioObj[type].audioUrl = null;

            setTimeout(()=> {
                this.audioObj[type].audioUrl =
                    this.audioService.getAudio(this.event.hostScheduleId, this.event[type].id);
            }, 0);
        } else {
            this.audioObj[type].title = this.defaultAudioTitles[type];
            this.audioObj[type].audioUrl = null;
        }
    }

    showAudioManagement(type) {
        this.modal.open(AudioModal, overlayConfigFactory({'event': this.event, 'type': type}, BSModalContext))
            .then(resultPromise => {
                resultPromise.result.then(result => {
                    if (result) {
                        if (result.type !== 'doNothing') {
                            this.event[result.type] = result.data;
                            this.setAudioObject(result.type);
                        }
                    }
                });
            });

    }

    deleteAudio(type) {
        let audio = this.event[type];

        if (!audio) return false;

        this.audioService.remove(this.event.hostScheduleId, audio.id).then((response: any) => {
            this.event[type] = null;
            this.setAudioObject(type);
        }).catch((response: any) => {
            console.log(response);
        });
    }

    initRightPins() {
        this.pinsRight = [];
        this.event.pins.forEach((pin) => {
            if (!(this.event.restrictedPins && this.event.restrictedPins.indexOf(pin.pin) !== -1)) {
                this.pinsRight.push(pin);
            }
        });
    }

    shiftLeftPins() {
        // console.log('selected left pin', this.selectedPinsLeft);

        if (this.selectedPinsLeft && this.selectedPinsLeft.length > 0) {
            // console.log('restricted pin before ', this.event.restrictedPins);

            this.pinsRight = [];

            this.event.pins.forEach((pin) => {
                if (this.selectedPinsLeft.indexOf(pin.pin) !== -1) {
                    // console.log('removing pin ', pin.pin);
                    this.event.restrictedPins.splice(this.event.restrictedPins.indexOf(pin.pin), 1);
                    this.pinsRight.push(pin);
                } else if (!(this.event.restrictedPins && this.event.restrictedPins.indexOf(pin.pin) !== -1)) {
                    // console.log('adding pin', pin.pin);
                    this.pinsRight.push(pin);
                }
            });

            this.selectedPinsLeft = [];
            // console.log('restricted pin after ', this.event.restrictedPins);
        }
    }

    shiftRightPins() {
        // console.log('selected right pins ', this.selectedPinsRight);

        if (this.selectedPinsRight && this.selectedPinsRight.length > 0) {
            // console.log('restricted pins before', this.event.restrictedPins);

            this.pinsRight = [];

            this.event.pins.forEach((pin) => {
                if (this.selectedPinsRight.indexOf(pin.pin) === -1
                    && !(this.event.restrictedPins && this.event.restrictedPins.indexOf(pin.pin) !== -1)) {
                    this.pinsRight.push(pin);
                } else if (!(this.event.restrictedPins && this.event.restrictedPins.indexOf(pin.pin) !== -1)) {
                    this.event.restrictedPins.push(pin.pin);
                }
            });

            this.selectedPinsRight = [];
            // console.log('restricted pins after ', this.event.restrictedPins);
        }
    }
}
