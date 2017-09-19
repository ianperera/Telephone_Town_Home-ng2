import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import {overlayConfigFactory} from 'angular2-modal';
import {Modal, BSModalContext} from 'angular2-modal/plugins/bootstrap';
import {AudioModal, AudioModalContext} from './audio.modal';

import {AudioService} from './audio.service';
import {ConferenceSetup} from "../../conference.datatypes";

@Component({
    selector: 'app-event-audio',
    templateUrl: 'components/calendar/event-edit/audio/audio.tmpl.html'
})
export class AudioComponent implements OnInit {
    @Input() event: ConferenceSetup;
    @Output() notify: EventEmitter<string> = new EventEmitter<string>();
    @Output() change: EventEmitter<string> = new EventEmitter<string>();

    defaultAudioTitles: any = {
        voxAnsweringMachine: 'Answering Machine Prompt Not Set!',
        voxLive: 'Live Prompt Not Set!',
        voxHoldMusic: 'Hold Music Not Set!',
        option0: 'Option - 0 Not Set!',
        option1: 'Option - 1 Not Set!',
        option2: 'Option - 2 Not Set!',
        option3: 'Option - 3 Not Set!',
        option4: 'Option - 4 Not Set!',
        option5: 'Option - 5 Not Set!',
        option6: 'Option - 6 Not Set!',
        option7: 'Option - 7 Not Set!',
        option8: 'Option - 8 Not Set!',
        option9: 'Option - 9 Not Set!',
    };

    audioTypes: any = [
        'voxAnsweringMachine',
        'voxLive',
        'voxHoldMusic'
    ];

    optionList: Array<string> = [
        'option0',
        'option1',
        'option2',
        'option3',
        'option4',
        'option5',
        'option6',
        'option7',
        'option8',
        'option9',
    ];

    audioObj: any = {};
    voxLiveTitle: string = null;
    isXConference: boolean=false;

    constructor(private audioService: AudioService, private modal: Modal) {
    }

    ngOnInit() {
        this.audioTypes = this.audioTypes.concat(this.optionList);

        this.audioTypes.forEach(type => {
            this.initAudioObject(type);
            this.setAudioObject(type);
        });
    }

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

        //hide title
        if(type!=null && type.toLowerCase()=='voxlive'){
            if(this.audioObj[type].title!=null && this.audioObj[type].title.toLowerCase()=='x:conference temp'){
                this.isXConference = true;
            }
            else{
                this.isXConference = false;
            }
        }
    }

    showAudioManagement(type) {
        this.modal.open(AudioModal, overlayConfigFactory({'event': this.event, 'type': type}, BSModalContext))
            .then(resultPromise => {
                resultPromise.result.then(result => {
                    if (result) {
                        if (result.type !== 'doNothing') {
                            this.change.emit('audio');
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
        this.event[type] = null;
        this.change.emit('audio');
        this.setAudioObject(type);

        /*this.audioService.remove(this.event.hostScheduleId, audio.id).then((response: any) => {
            this.event[type] = null;
            this.change.emit('audio');
            this.setAudioObject(type);
        }).catch((response: any) => {
            console.log(response);
        });*/
    }

}
