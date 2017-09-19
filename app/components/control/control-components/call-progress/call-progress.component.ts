import {Component, OnInit, Input} from '@angular/core';
//import {callProgress} from "../../control.datatypes";
import {CallProgessService} from "./call-progress.service";
import {ConferenceSetup} from "../../../calendar/conference.datatypes";
import {overlayConfigFactory} from 'angular2-modal';
import {Modal, BSModalContext} from "angular2-modal/plugins/bootstrap";
import {CalendarLoadingModal} from "../../../calendar/calendar-loading-modal";
import {PhoneListSummary, CampaignStatsEvent, ScheduleStatBrief, CampaignSummaryStats} from "../../control.datatypes";
import {stat} from "fs";

import { Store } from '@ngrx/store';
import * as fromRoot from '../../../../store/';
import { Observable } from 'rxjs/Observable';
import { CampaignStatsEvent as CampStatsEvent } from '../../../../models/events';

import { ConferenceStatusEvent } from '../../../../models/events';

@Component({
    selector: 'app-callprogress',
    templateUrl: 'components/control/control-components/call-progress/call-progress.tmpl.html'
})
export class CallProgressComponent implements OnInit {
    @Input() confData: ConferenceSetup;
    @Input() confStatus: ConferenceStatusEvent;
    @Input() campaignStats: CampaignStatsEvent;

    latestCampaignStats$: Observable<CampStatsEvent>; 
    latestSchedules$: Observable<any>;

    constructor(private callProgessService: CallProgessService,
                private modal: Modal,
                private store: Store<fromRoot.State>) {
        this.latestCampaignStats$ = this.store.select(fromRoot.getLatestCampaignStats);
        this.latestSchedules$ = this.latestCampaignStats$.map(stats => stats.schedules);
    }

    dialedCnt: number = 0;
    scheduledCnt: number = 0;
    callsInUseCnt: number = 0;
    liveCnt: number = 0;
    amCnt: number = 0;
    confParticipants: number = 0;
    scheduleSeqno: number;
    description: string;
    maxChannels: number;
    maxChannelsDD: number = null;
    txterror: string = 'error';
    txtinfo: string = 'info';
    txtwarn: string = 'warn';
    progressValue: number;
    livevent: number;

    btnStart: boolean = true;
    btnStop: boolean = false;
    btnSave: boolean = false;

    // Pie
    public pieChartLabels: string[];
    public pieChartData: number[];
    public pieChartType: string = 'pie';
    public pieOptions = {
        responsive: true
    };

    //First Pass Info
    dialed: number;
    total: number;
    percent: number = 0;
    tooltipHtml: string = '';
    schedules: Array<string> = [];
    schedulesList: Array<any> = [];
    selectedScheduleIndex = 0;

    ngOnInit() {
        /*this.setPieChartCallprogress({
         scheduledCnt: 5,
         dialedCnt: 2,
         liveCnt: 1,
         webCount: 8,
         amCnt: 3,
         problemCnt: 6,
         otherCnt: 3,
         callsInUseCnt: 5,
         maxChannelsInUseCnt: 8,
         confParticipants: 1,
         });// TODO: Remove after testing*/
    }

    callProgressData(data): void {

        this.dialedCnt = data.stats.dialedCnt;
        this.scheduledCnt = data.stats.scheduledCnt;
        this.callsInUseCnt = data.stats.callsInUseCnt;
        this.liveCnt = data.stats.liveCnt;
        this.amCnt = data.stats.amCnt;
        this.confParticipants = data.stats.confParticipants;
        this.scheduleSeqno = data.schedules[this.selectedScheduleIndex].scheduleSeqno;
        this.description = data.schedules[this.selectedScheduleIndex].description;
        this.maxChannels = data.schedules[this.selectedScheduleIndex].maxChannels;

        if (this.maxChannelsDD === null) {
            this.maxChannelsDD = this.maxChannels;
        }
        if (this.maxChannels === this.maxChannelsDD) {
            this.btnSave = false;
        }

        this.txterror = data.schedules[this.selectedScheduleIndex].error;
        this.txtinfo = data.schedules[this.selectedScheduleIndex].info;
        this.txtwarn = data.schedules[this.selectedScheduleIndex].warn;
        this.progressValue = ((this.dialedCnt / this.scheduledCnt) * 100);
        this.schedulesList = data.schedules;
    }

    liveEvent(data) {
        this.livevent = data.status;
        console.log('livevent', this.livevent);
    }

    protected getStartCall() {
        if (this.livevent === 2) {
            this.modal.open(CalendarLoadingModal, overlayConfigFactory({message: "Starting Schedule ..."}, BSModalContext))
                .then(dialog => {
                    this.callProgessService.startoutboundDial(this.scheduleSeqno).then((res: any) => {
                        console.log(res.data);
                        dialog.dismiss();
                        this.btnStop = true;
                        this.btnStart = false;
                    }).catch((msg) => {
                        setTimeout(() => {
                            this.modal.alert().title('Error').body(`${msg}`)
                                .open()
                                .then(dialog => {
                                });
                            dialog.dismiss();
                        }, 1000);
                    });
                });
        } else {
            this.modal.alert().title('Starting Schedule').body(`You cannot start the dial without a live host or moderator`).open();
            return;
        }
    }

    protected getStopCall() {
        this.modal.open(CalendarLoadingModal, overlayConfigFactory({message: "Stopping Schedule ..."}, BSModalContext))
            .then(dialog => {
                this.callProgessService.stoptoutboundDial(this.scheduleSeqno).then((res: any) => {
                    console.log(res.data);
                    this.btnStop = false;
                    this.btnStart = true;
                    dialog.dismiss();
                }).catch((msg) => {
                    setTimeout(() => {
                        this.modal.alert().title('Error').body(`${msg}`)
                            .open()
                            .then(dialog => {
                            });
                        dialog.dismiss();
                    }, 1000);
                });
            });
    }

    protected getMaxnumber() {
        this.modal.open(CalendarLoadingModal, overlayConfigFactory({message: "Updating Max Number ..."}, BSModalContext))
            .then(dialog => {
                this.callProgessService.updateMaxnumber(this.scheduleSeqno, this.maxChannelsDD).then((res: any) => {
                    console.log(res.data);
                    dialog.dismiss();
                    this.btnSave = false;
                    this.maxChannels = this.schedulesList[this.selectedScheduleIndex].maxChannels = this.maxChannelsDD;
                }).catch((msg) => {
                    setTimeout(() => {
                        this.modal.alert().title('Error').body(`${msg}`)
                            .open()
                            .then(dialog => {
                            });
                        dialog.dismiss();
                    }, 1000);
                });
            });

    }


    saveonChange(val) {
        val = parseInt(val);

        if (this.maxChannels !== val || !this.maxChannels) {
            this.btnSave = true;
            this.maxChannelsDD = val;
        }
    }

    firstPassComplete(data: CampaignStatsEvent): void {
        let schedules = data.schedules;

        let totalCount = 0;
        let dialedCount = 0;
        let tooltipHtml = '';
        let schedulesList: Array<string> = [];

        schedules.forEach((schedule) => {
            if (schedule.plists) {
                schedule.plists.forEach((plist: PhoneListSummary) => {
                    totalCount += plist.phoneEntryCount;
                    dialedCount += plist.dialedCount;
                    tooltipHtml += '<p>' + plist.name + ' ' + plist.timezone + ' schedule # ' + plist.id + '</p>';
                });
            }

            schedulesList.push(this.buildLabel(schedule));
        });

        if (dialedCount > totalCount) {
            totalCount = dialedCount;
        }

        this.total = totalCount;
        this.dialed = dialedCount;
        this.percent = Math.round((dialedCount / totalCount) * 100);
        this.tooltipHtml = tooltipHtml;
        this.schedules = schedulesList;

        this.setPieChartCallprogress(data.stats);
    }

    /**
     * tell if a schedule can be started
     */
    canStart(schedule: ScheduleStatBrief): boolean {
        return schedule.dialerLoaded && !schedule.dialerActive;
    }

    /**
     * tell if a schedule can be stopped
     */
    canStop(schedule: ScheduleStatBrief): boolean {
        return schedule.dialerLoaded && schedule.dialerActive;
    }

    buildLabel(schedule: ScheduleStatBrief): string {
        let result: string = "[";

        if (this.canStart(schedule) || this.canStop(schedule)) {
            if (this.canStart(schedule)) {
                result += " S ";
            } else {
                result += " R ";
            }
        } else {
            result += "...";
        }

        result += "] " + schedule.scheduleSeqno
            + (schedule.description != null && schedule.description !== "" ? (" - " + schedule.description) : "");

        return result;
    }

    protected setPieChartCallprogress(stats: CampaignSummaryStats) {
        let labels = [], data = [];

        labels = [
            //'Scheduled',
            //'Dialed',
            'Live',
            'Web',
            'AM',
            'Problem',
            'Other',
            'Calls In Use',
            'Max Channel In Use',
            'Conference Participants',
        ];

        data = [
            //stats.scheduledCnt,
            //stats.dialedCnt,
            stats.liveCnt,
            stats.webCount,
            stats.amCnt,
            stats.problemCnt,
            stats.otherCnt,
            stats.callsInUseCnt,
            stats.maxChannelsInUseCnt,
            stats.confParticipants,
        ];

        setTimeout(() => {
            this.pieChartLabels = labels;
            this.pieChartData = data;
        }, 0);
    }

    setSchedule(index) {
        this.selectedScheduleIndex = index;

        setTimeout(() => {
            this.setScheduleData();
        }, 0);
    }

    setScheduleData() {
        this.scheduleSeqno = this.schedulesList[this.selectedScheduleIndex].scheduleSeqno;
        this.description = this.schedulesList[this.selectedScheduleIndex].description;
        this.maxChannels = this.maxChannelsDD = this.schedulesList[this.selectedScheduleIndex].maxChannels;
        this.txterror = this.schedulesList[this.selectedScheduleIndex].error;
        this.txtinfo = this.schedulesList[this.selectedScheduleIndex].info;
        this.txtwarn = this.schedulesList[this.selectedScheduleIndex].warn;
    }
}

