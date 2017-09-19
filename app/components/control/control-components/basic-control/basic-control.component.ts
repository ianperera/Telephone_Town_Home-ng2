import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BasicControlService} from './basic-control.service';
import {Modal} from 'angular2-modal/plugins/bootstrap';

import { Participant } from '../../../../store/participants/participants.reducers';
import { ConferenceSetup } from '../../../../models/conference';
import { ConferenceStatusEvent } from '../../../../models/events';

//Setup EasyTimer library
declare var $: any;
declare var Timer: any;
declare var timer: any;
var timer = new Timer();
timer.addEventListener('secondsUpdated', function (e) {
    $('#timer').html(timer.getTimeValues().toString());
});
timer.addEventListener('started', function (e) {
    $('#timer').html(timer.getTimeValues().toString());
});

@Component({
    selector: 'app-basic-control',
    templateUrl: 'components/control/control-components/basic-control/basic-control.tmpl.html'
})
export class BasicControlComponent implements OnInit {
    // These inputs will always have the newest correct data
    @Input() confData: ConferenceSetup;
    @Input() confStatus: ConferenceStatusEvent; 
    @Input() participants: Participant[];
    @Input() minutesLeft: number;
    @Output() doSubscribe: EventEmitter<string> = new EventEmitter<string>();
    @Output() doUnsubscribe: EventEmitter<string> = new EventEmitter<string>();
    @Output() refreshStream: EventEmitter<string> = new EventEmitter<string>();

    showPause:      boolean = false;
    showResume:     boolean = false;
    showGolive:     boolean = true;
    disableGoLive:  boolean = true;
    showEnd:        boolean = true;
    showiconOnair:  boolean = false;
    showiconOffair: boolean = true;
    showREC:        boolean = false;
    showStopped:    boolean = false;
    showOnairstation:   boolean = false;
    showOffairstation:  boolean = true;
    showBorder:     boolean = true;
    showEndPoll:    boolean = false;

    txtminutesLeft: string;

    protected participantIds = [];
    protected modelInstance = null;
    protected countDownMinutes: number = null;
    protected timeoutInstance = null;
    protected minuteCounterStarted: boolean = false;

    constructor(private modal: Modal,
                private basicControlService: BasicControlService) {
    }

    ngOnInit() {

    }

    refreshStreaming(): void {
        this.refreshStream.emit('stream');
        this.doUnsubscribe.emit('');
        this.doSubscribe.emit('');
        this.showiconOnair = true;
        this.showiconOffair = false;
        this.showOnairstation = true;
        this.showOffairstation = false;
        this.showGolive = false;
        this.showPause = true;
        this.showREC = true;
    }

    //Check participants when joining conference
    UpdateParticipant(data): void {
        if ('participant' in data) {
            let participant = data.participant;

            switch (participant.statusDesc) {
                case 'hold':
                    break;
                case 'connected':
                    if (this.participantIds.indexOf(participant.id) === -1) {
                        this.participantIds.push(participant.id);
                    }
                    break;
                case 'disconnected':
                    let pIdPos = this.participantIds.indexOf(participant.id);

                    if (pIdPos !== -1) {
                        this.participantIds.splice(pIdPos, 1);
                    }
                    break;
            }
            
            this.updateParticipantControls();
        }
    }

    currentButtonControls(data){
        let statusBtn = data.status;
        if (statusBtn === 1) {
            this.showGolive = true;
            this.showPause = false;
            this.showEnd = true;
            this.showResume = false;
        }
        else if (statusBtn === 2) {
            this.showGolive = false;
            this.showPause = true;
            this.showEnd = true;
            this.showResume = false;
        }
        else if (statusBtn === 3) {
            this.showGolive = false;
            this.showPause = false;
            this.showEnd = false;
            this.showResume = true;
            this.showREC = false;

        }
    }

    updateParticipantControls() {
        let pIdLength = this.participantIds.length;

        if (pIdLength >= 2) {
            this.showGolive = true; //enabled , disabled by default
            this.disableGoLive = false;
        }
        else if (pIdLength === 1) {
            // all buttons on their color
        }
        else if (pIdLength === 0) {
            //this.basicControlService.endControlEvent("end");
            this.disableGoLive = true;
            // all buttons on grey color
        }
    }

    /*
    // Alert time minutes left when below 15 mins
    minutesLeft(data): void {
        let schedules = data.schedules;

        if (schedules.length > 0 && (schedules[0].minutesLeft) <= 15 && !this.minuteCounterStarted) {
            this.minuteCounterStarted = true;
            this.showGolive = false; //enabled , disabled by default
            this.basicControlService.endControlEvent("end");
            this.startMinuteCounter(schedules[0].minutesLeft);
        }
    }

    startMinuteCounter(minutes: number) {
        this.countDownMinutes = minutes;
        this.showMinuteLeftPopup(minutes);

        this.timeoutInstance = setInterval(() => {
            this.countDownMinutes--;
            this.showMinuteLeftPopup(this.countDownMinutes);

            if (this.countDownMinutes === 0) {
                console.log('clearing minute timer');
                clearInterval(this.timeoutInstance);
                this.timeoutInstance = null;
            }
        }, 1000 * 60);
    }
    */

    showMinuteLeftPopup(minute) {
        if (this.modelInstance) {
            this.modelInstance.close();
            this.modelInstance = null;
        }

        let txt = minute > 0 ? `There are ${minute} minutes left in your conference` : 'Conference Ended!';

        this.txtminutesLeft = txt;

        /*this.modal.alert()
         .title(`Time Alert`)
         .body(txt).open()
         .then(dialog => {
         this.modelInstance = dialog;
         });*/
    }

    //Active Poll and close poll
    activePoll(data): void {
        let currentPollId = data.currentPollId;

        if (currentPollId != -1) {
            this.showEnd = false;
            this.showEndPoll = true;
        }
        else if (currentPollId === -1) {
            this.showEnd = true;
            this.showEndPoll = false;
        }
    }

    endPoll(): void {
        this.basicControlService.endActivePoll();
        this.showEnd = true;
        this.showEndPoll = false;
    }

    goliveEvent(): void {
        this.basicControlService.startControlEvent("start");
        this.doSubscribe.emit('');
        timer.start();

        this.showGolive = false;
        this.showPause = true;
        this.showEnd = true;
        this.showResume = false;

        this.showiconOnair = true;
        this.showiconOffair = false;
        this.showREC = true;
        this.showBorder = true;
        this.showOnairstation = true;
        this.showOffairstation = false;
    }

    resumeEvent(): void {
        this.basicControlService.startControlEvent("start");
        this.doSubscribe.emit('');
        timer.start();

        this.showGolive = true;
        this.showPause = false;
        this.showEnd = true;
        this.showResume = false;

        this.showiconOnair = true;
        this.showiconOffair = false;
        this.showREC = true;
        this.showBorder = true;
        this.showOnairstation = true;
        this.showOffairstation = false;
    }

    endEvent(): void {
        this.basicControlService.endControlEvent("end");
        this.doUnsubscribe.emit('');
        timer.stop();

        this.showGolive = false;
        this.showPause = false;
        this.showEnd = false;
        this.showResume = true;


        this.showiconOnair = false;
        this.showiconOffair = true;
        this.showREC = false;
        this.showStopped = true;
        this.showBorder = false;
        this.showOnairstation = false;
        this.showOffairstation = true;
    }

    pauseEvent(): void {
        this.basicControlService.pauseControlEvent("pause");
        //this.unsubscribe();
        timer.pause();
        this.showGolive = true;
        this.showPause = false;
        this.showEnd = true;
        this.showResume = false;

        this.showiconOnair = false;
        this.showiconOffair = true;
        this.showREC = false;
        this.showStopped = true;
        this.showBorder = false;
        this.showOnairstation = false;
        this.showOffairstation = true;
    }

    updateControlsForUnsubscribe(): void {
        this.showPause = false;
        this.showResume = false;
        this.showGolive = true; //show but disabled
        this.showEnd = true;
        this.showREC = false;
    }

    updateControlsForSubscribe(): void {
        this.showStopped = false;
        this.showOnairstation = false;
        this.showOffairstation = true;
        this.showEnd = true;
        this.showBorder = false;
        this.showREC = true;
    }

    updateControlButtons(data) {
        let status = data.status;
        switch (status) {
            case '1':// STATUS_PAUSE
                this.showPause = false;
                this.showResume = true;
                this.showGolive = false;
                this.showEnd = false;
                this.showREC = false;
                break;
            case '2':// STATUS_LIVE
                // Todo: conference started, broadcasting to listeners
                break;
            case '3':// STATUS_STOP
                // Todo: conference stopped, hangup all listeners, no listeners allowed to dial in
                break;
            case '4':// STATUS_HOLD
                // Todo: all participants listening to hold music
                break;
            case '5':// STATUS_START
                // Todo: conference has started, but is not broadcasting yet
                break;
            case '6':// STATUS_END
                // Todo: conference has ended, remove all participants
                break;
        }
    }

}
