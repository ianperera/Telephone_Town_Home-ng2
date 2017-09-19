import {Component, Input, OnInit} from '@angular/core';
import {AudioService} from "./audio.service";
import {Modal} from "angular2-modal/plugins/bootstrap";
import {ConferenceSetup, VoiceFile} from "../../../calendar/conference.datatypes";
import {MainControlService} from "../../maincontrol.service";

@Component({
    selector: 'app-control-audio',
    templateUrl: 'components/control/control-components/audio/audio.tmpl.html'
})
export class AudioComponent implements OnInit {
    @Input() confData: ConferenceSetup;

    protected selectedAudio = null;
    protected audioPlaying = false;
    protected defaultVolume = 0.5;
    protected currentPlayingAudObj = null;

    constructor(private audioService: AudioService, private modal: Modal,
                private mainControlService: MainControlService) {
    }

    ngOnInit() {

    }

    refreshAudio() {
        this.mainControlService.loadConference(this.confData.conferenceId).then((res: any) => {
            this.confData = res.data;
            this.resetAudio();
            this.resetVolume();
        }).catch((msg: string) => {
            this.modal.alert().title('Error to load conference').body(`${msg}`)
                .open().then(dialog => {
            });
        });
    }

    playAudio(file: VoiceFile) {
        this.resetAudio();

        setTimeout(() => {
            this.selectedAudio = file;
            this.selectedAudio.audioUrl =
                this.audioService.getAudio(this.confData.hostScheduleId, file.id);
        }, 0);
    }

    resetAudio() {
        this.selectedAudio = null;
    }

    resetVolume() {
        this.defaultVolume = 0.5;
        this.currentPlayingAudObj.volume = 0.5;
    }

    audioStarted(e) {
        // console.log('started playing', e);
        this.currentPlayingAudObj = e.target;
        this.audioPlaying = true;
        this.audioService.startVoicefilePlayback(this.selectedAudio.id).then((res) => {
            console.log(res);
        }).catch((res) => {
        });
    }

    audioEnded(e) {
        // console.log('finished playing');
        this.audioPlaying = false;
        this.audioService.stopVoicefilePlayback(this.selectedAudio.id).then((res) => {
            // console.log(res);
        }).catch((res) => {
        });
    }

    audioVolumeChanged(e) {
        if (!this.audioPlaying) return false;

        let volume = Math.round(e.target.volume * 100);

        // console.log('vol : ', volume);

        this.audioService.changeVoicefilePlaybackVolume(this.selectedAudio.id, volume).then((res) => {
            console.log(res);
        }).catch((res) => {
        });
    }
}
