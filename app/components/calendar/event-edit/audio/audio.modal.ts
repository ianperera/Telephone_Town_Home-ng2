declare var $: any;

import {Component, OnInit} from '@angular/core';

import {DialogRef, ModalComponent} from 'angular2-modal';
import {Modal, BSModalContext} from 'angular2-modal/plugins/bootstrap';
import {overlayConfigFactory} from 'angular2-modal';
import {ConferenceSetup, VoiceFile} from "../../conference.datatypes";

import {AudioService} from './audio.service';
import {AudioFileUploadModal} from "./audio-file-upload-modal";

export class AudioModalContext extends BSModalContext {
    event: ConferenceSetup;
    type: string;
}

@Component({
    selector: 'app-event-audio-modal',
    styleUrls: ['components/calendar/event-edit/audio/audio.css'],
    templateUrl: 'components/calendar/event-edit/audio/audio.modal.tmpl.html'
})
export class AudioModal implements OnInit, ModalComponent<AudioModalContext> {
    context: AudioModalContext;
    isCreating: boolean = false;
    progressModal: any;
    showLoadingImg: boolean;

    ttsObj: {
        name: string,
        script: string,
        update: boolean
    };

    audio: VoiceFile;
    audioList: [VoiceFile];

    audioFile: File;

    selectedAudio: VoiceFile;
    audioAlreadySet: boolean = false;
    selectedAudioUrl: string;

    recordAudio: any;

    errorMsg: string;
    TTSMsg: string;
    deleteTTSMsg: string;
    textMessageToSpeak: string;

    audioSet: boolean = false;
    enableAudio: boolean= true;
    showTTSBox: boolean = true;
    recordAudioCanceled: boolean = false;

    constructor(public dialog: DialogRef<AudioModalContext>,
                private modal: Modal,
                private audioService: AudioService) {
    }

    /* Initialization */
    ngOnInit() {
        this.context = Object.assign({}, this.dialog.context);
        this.enableAudio = true;

        // Initialize tts object based on type
        switch (this.context.type) {
            case 'voxAnsweringMachine':
                this.ttsObj = {
                    name: 'Answering machine message',
                    script: this.textMessageToSpeak,
                    update: false
                };
                break;
            case 'voxLive':
                this.ttsObj = {
                    name: 'Live person message',
                    script: this.textMessageToSpeak,
                    update: false
                };
                break;
            case 'voxHoldMusic':
                this.ttsObj = {
                    name: 'Hold message',
                    script: this.textMessageToSpeak,
                    update: false
                };
                break;
            case 'voxCustomHostGreeting':
                this.ttsObj = {
                    name: 'Host greeting message',
                    script: this.textMessageToSpeak,
                    update: false
                };
                break;
            case 'atLive':
                this.ttsObj = {
                    name: 'Voicemail Prompt',
                    script: this.textMessageToSpeak,
                    update: false
                };
                break;
            case 'atBye':
                this.ttsObj = {
                    name: 'Voicemail Goodbye',
                    script: this.textMessageToSpeak,
                    update: false
                };
                break;
            case 'atInvalid':
                this.ttsObj = {
                    name: 'Voicemail Error Message',
                    script: this.textMessageToSpeak,
                    update: false
                };
                break;
            case 'option0':
                this.ttsObj = {
                    name: 'Option 0 message',
                    script: this.textMessageToSpeak,
                    update: false
                };
                break;
            case 'option1':
                this.ttsObj = {
                    name: 'Option 1 message',
                    script: this.textMessageToSpeak,
                    update: false
                };
                break;
            case 'option2':
                this.ttsObj = {
                    name: 'Option 2 message',
                    script: this.textMessageToSpeak,
                    update: false
                };
                break;
            case 'option3':
                this.ttsObj = {
                    name: 'Option 3 message',
                    script: this.textMessageToSpeak,
                    update: false
                };
                break;
            case 'option4':
                this.ttsObj = {
                    name: 'Option 4 message',
                    script: this.textMessageToSpeak,
                    update: false
                };
                break;
            case 'option5':
                this.ttsObj = {
                    name: 'Option 5 message',
                    script: this.textMessageToSpeak,
                    update: false
                };
                break;
            case 'option6':
                this.ttsObj = {
                    name: 'Option 6 message',
                    script: this.textMessageToSpeak,
                    update: false
                };
                break;
            case 'option7':
                this.ttsObj = {
                    name: 'Option 7 message',
                    script: this.textMessageToSpeak,
                    update: false
                };
                break;
            case 'option8':
                this.ttsObj = {
                    name: 'Option 8 message',
                    script: this.textMessageToSpeak,
                    update: false
                };
                break;
            case 'option9':
                this.ttsObj = {
                    name: 'Option 9 message',
                    script: this.textMessageToSpeak,
                    update: false
                };
                break;
        }

        if (this.context.event[this.context.type]) {
            this.audioSet = true;
            this.audio = this.context.event[this.context.type];
            this.audioAlreadySet = true;
            this.setAudioUrl();

            if (this.audio.script && this.audio.script.length > 0) {
                this.ttsObj.update = true;
                this.ttsObj.name = this.audio.name;
                this.ttsObj.script = this.audio.script;
            }
            //Replace default values of (x:conference temp) file name
            if (this.ttsObj.name.toLowerCase() == 'x:conference temp') {
                this.ttsObj.name = 'Live person message';
                this.ttsObj.script;// = 'Replace this text with the message to speak!';
                this.audioSet = false;
                this.enableAudio = false;
            }
        }

        this.showTTSBox = this.ttsObj.update || !this.audio;
        this.getAudioList();
    }

    /* Text To Speech */
    setTTS(event) {
        event.preventDefault();

        if (this.audioSet) {
            if (this.ttsObj.name === this.audio.name) {
                this.updateTTS();
            } else {
                this.createTTS();
            }
        } else {
            this.createTTS();
        }

        this.TTSMsg = 'Creating TTS...';
    }

    createTTS() {
        let data = {
            id: -1,
            customerId: -1,
            name: this.ttsObj.name,
            active: true,
            script: this.ttsObj.script,
            ttsLanguage: null,
            ttsGender: null,
            ttsVoice: null,
            lastAccessed: null,
            lastModified: null,
            audioLengthInSeconds: -1,
        };

        this.showLoader();

        this.audioService.create(this.context.event.hostScheduleId, data).then((response: any) => {
            this.hideLoader();
            this.closeDialog(this.context.type, response.data);
        }).catch((response: any) => {
            this.hideLoader();
            this.errorMsg = response;
        });
    }

    updateTTS() {
        this.audio.name = this.ttsObj.name;
        this.audio.script = this.ttsObj.script;

        this.showLoader();

        this.audioService.update(this.context.event.hostScheduleId, this.audio.id, this.audio).then((response: any) => {
            this.hideLoader();
            this.closeDialog(this.context.type, response.data);
        }).catch((response: any) => {
            this.hideLoader();
            this.errorMsg = response;
        });
    }

    clearTTS(event) {
        event.preventDefault();
        this.ttsObj.name = this.ttsObj.script = '';
    }

    deleteTTS(event) {
        event.preventDefault();
        this.showLoader();
        this.deleteTTSMsg = 'Deleting Vox File...';

        if (this.audio && 'id' in this.audio) {
            this.audioService.remove(this.context.event.hostScheduleId, this.audio.id).then((response: any) => {
                this.hideLoader();
                this.closeDialog(this.context.type, null);
            }).catch((response: any) => {
            });
        }
    }

    /*Audio file*/
    setAudioFile(event) {
        console.log('Selected audio file ', event.target.files[0]);
        this.audioFile = event.target.files[0];
        this.uploadAudioFile();
    }

    uploadAudioFile() {
        if (!this.audioFile) return;

        this.modal.open(AudioFileUploadModal,
            overlayConfigFactory({audioFile: this.audioFile}, BSModalContext))
            .then(dialog => {
                dialog.result.then(value => {
                    switch (value) {
                        case 'success':
                            break;
                        case 'cancel':
                            this.stopUploadAudioFile();
                            break;
                    }
                });

                this.progressModal = dialog;

            });

        this.errorMsg = '';

        this.audioService.uploadAudioFile(this.context.event.hostScheduleId, this.audioFile)
            .then((res: any) => {
                this.progressModal.dismiss();
                this.closeDialog(this.context.type, res.data[0]);
            })
            .catch((response: string) => {
                this.progressModal.dismiss();
                this.errorMsg = response;
            });
    }

    stopUploadAudioFile() {
        this.audioService.stopUploadAudioFile();
    }

    uploadAudioFileTrigger() {
        $('#uploadAudioFileInput').trigger('click');
    }

    /* Record Audio */
    startRecordAudio() {
        // this.showLoader();

        this.audioService.startVoxRecordingSession(this.context.event.hostScheduleId)
            .then((response: any) => {
                //this.hideLoader();
                this.recordAudio = response.data;
                this.recordAudioCanceled = false;
                this.lookupRecordedAudio();
            });
    }

    cancelRecordAudio() {
        //this.showLoader();

        this.audioService.discardVoxRecordingSession(this.context.event.hostScheduleId)
            .then((response: any) => {
                this.hideLoader();
                this.recordAudio = null;
                this.recordAudioCanceled = true;
            });
    }

    lookupRecordedAudio() {
        if (this.recordAudioCanceled) {
            return false;
        }

        // this.showLoader();

        this.audioService.lookupRecordedVoxFile(this.context.event.hostScheduleId)
            .then((response: any) => {
                //this.hideLoader();
                console.log('look a file', response);
                this.closeDialog(this.context.type, response.data);
            })
            .catch((response)=> {
                //this.hideLoader();
                console.log('trying again in 2 sec : ', response);
                setTimeout(()=> {
                    this.lookupRecordedAudio();
                }, 2000);
            });
    }

    /* Library */
    getAudioList() {
        this.showLoader();

        this.audioService.get(this.context.event.hostScheduleId).then((response: any) => {
            this.hideLoader();
            let data: [VoiceFile];
            if (response.data != null) {
                data = response.data.filter(function (f) {
                    return f.name != null && f.name.toLowerCase() != 'x:conference temp';
                });
            }
            this.audioList = data;
            this.setAudioUrl();
        }).catch((response: any) => {
        });
    }

    setSelectedAudio(audio) {
        this.selectedAudio = audio;
        this.audioAlreadySet = (this.audio && this.audio.id === this.selectedAudio.id);
        this.setAudioUrl();
    }

    setEventAudio() {
        this.closeDialog(this.context.type, this.selectedAudio);
    }

    removeAudio() {
        if (!this.selectedAudio) return false;

        this.showLoader();

        this.deleteTTSMsg = 'Deleting Vox File...';

        this.audioService.remove(this.context.event.hostScheduleId, this.selectedAudio.id)
            .then((response: any) => {
                if (this.audio && this.audio.id === this.selectedAudio.id) {
                    this.closeDialog(this.context.type, null);
                } else {
                    this.selectedAudio = null;
                    this.getAudioList();
                }

                this.hideLoader();
            }).catch((response: any) => {
        });
    }

    setAudioUrl() {
        if (this.selectedAudio) {
            this.selectedAudioUrl = null;

            setTimeout(()=> {
                this.selectedAudioUrl =
                    this.audioService.getAudio(this.context.event.hostScheduleId, this.selectedAudio.id);
            }, 0);
        } else {
            this.selectedAudioUrl = null;

            setTimeout(()=> {
                this.selectedAudioUrl = null;
            }, 0);
        }
    }

    /* Loaders */
    showLoader() {
        this.showLoadingImg = true;
    }

    hideLoader() {
        this.showLoadingImg = false;
    }

    /**
     * Close dialog
     * @param type
     * @param data
     */
    closeDialog(type, data): void {
        this.dialog.close({type: type, data: data});
    }
}
