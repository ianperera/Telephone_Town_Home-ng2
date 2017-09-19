import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {PollingService} from "./polling.service";
import {Modal} from "angular2-modal/plugins/bootstrap";
import {ConferenceSetup, Poll, PollAnswer} from "../../../calendar/conference.datatypes";
import {ChatService} from "../chat/chat.service";

import { ConferenceStatusEvent } from '../../../../models/events';

@Component({
    selector: 'app-control-polling',
    templateUrl: 'components/control/control-components/polling/polling.tmpl.html'
})
export class PollingComponent implements OnInit {
    @Input() confData: ConferenceSetup;
    @Input() confStatus: ConferenceStatusEvent;
    @ViewChild('questionName') elQuestionName: ElementRef;
    @Output() doSubscribe: EventEmitter<string> = new EventEmitter<string>();
    @Output() doUnsubscribe: EventEmitter<string> = new EventEmitter<string>();

    protected answerIndexSelected: number = 100000;
    protected isDupAns: boolean = false;
    protected isBlankAns: boolean = false;

    protected openbtn: boolean = true;
    protected closebtn: boolean = false;
    liveevent: number;
    enabledPollbuttons: boolean = true;

    constructor(private pollingService: PollingService,
                private chatService: ChatService,
                private modal: Modal) {
    }

    protected polls: Poll[];
    protected selected_poll_index: string = '-1';
    protected selected_poll: Poll;
    protected poll_changed: boolean = false;

    protected polls_stats: any[];
    protected selected_poll_stat_index: string = '0';
    protected selected_poll_stat;

    protected poll_delay = 0;
    public vote_count: number;

    // Pie
    public pieChartLabels: string[];
    public pieChartData: number[];
    public pieChartType: string = 'pie';
    public pieOptions = {
        responsive: true
    };

    ngOnInit() {
        this.setBlankPoll();
        this.getPolls();
        this.getPollsStats();
        this.doUnsubscribe.emit('');
        this.doSubscribe.emit('');

    }

    liveEvent(data) {
        this.liveevent = data.status;
        console.log('livevent', this.liveevent);

        if (this.liveevent === 2) {
            this.enabledPollbuttons = false;
        }
        else {
            this.enabledPollbuttons = true;
        }

    }

    protected setBlankPoll() {
        this.selected_poll = {
            id: -1,
            campaignId: -1,
            name: '',
            questionScript: '',
            deletable: true,
            updateCount: -1,
            answers: []
        };
    }

    protected getPolls() {
        this.doSubscribe.emit('');
        this.pollingService.lookUppolls().then((res: any) => {
            this.polls = res.data;
            this.selected_poll_index = '-1';
            this.setBlankPoll();
            console.log('suc : ', this.polls);
        }).catch((msg) => {
            console.log(msg);
        })
    }

    protected getPollsStats() {
        this.doSubscribe.emit('');
        this.pollingService.lookUppollsStats(this.confData.hostScheduleId).then((res: any) => {
            this.polls_stats = res.data.stats;
            this.selected_poll_stat_index = '0';
            this.selected_poll_stat = this.polls_stats[this.selected_poll_stat_index];
            this.setPieChartData();
            this.calculateVote();
            //console.log('suc m :', res);
        }).catch((res) => {
            console.error(res);
        });
    }

    protected sendPollPrepareChatNotification() {
        if (!this.selected_poll_stat) return false;

        let titlename: string = this.selected_poll_stat.questionName;
        let titlescript: string = this.selected_poll_stat.questionScript;
        let txt_ans: string = '';

        this.selected_poll_stat.answers.forEach((answer) => {
            txt_ans += '\n ' + answer.digit + ':' + answer.answer;
        });

        let message: string = titlename + ' - ' + titlescript + txt_ans ;

        this.chatService.sendchat(' ** Poll on Deck ** ', message, 1).then((res: any) => {
        });
    }

    protected sendPollWarnChatNotification(poll_delay: number) {
        if (!this.selected_poll_stat) return false;

        if (poll_delay > 0) {
            let header: string = 'The following poll will open in ' + poll_delay + ' seconds!\n';
            let titlename: string = this.selected_poll_stat.questionName;
            let titlescript: string = this.selected_poll_stat.questionScript;
            let txt_ans: string = '';
            let from: string = ' ** Poll opening in ' + poll_delay + ' seconds ** ';

            this.selected_poll_stat.answers.forEach((answer) => {
                txt_ans += '\n ' + answer.digit + ':' + answer.answer;
            });

            let message: string = header + titlename + ' - ' + titlescript + txt_ans;

            this.chatService.sendchat(from, message, 1).then((res: any) => {
            });
        } else {
            let header: string = 'The following poll is open!\n';
            let titlename: string = this.selected_poll_stat.questionName;
            let titlescript: string = this.selected_poll_stat.questionScript;
            let txt_ans: string = '';
            let from: string = ' ** Poll is Open ** ';

            this.selected_poll_stat.answers.forEach((answer) => {
                txt_ans += '\n ' + answer.digit + ':' + answer.answer;
            });

            let message: string = header + titlename + ' - ' + titlescript + txt_ans;

            this.chatService.sendchat(from, message, 1).then((res: any) => {
            });
        }
    }

    protected sendPollCloseChatNotification() {
        if (!this.selected_poll_stat) return false;

        let titlename: string = this.selected_poll_stat.questionName;

        let message: string = titlename + ' is now closed';

        this.chatService.sendchat(' ** Poll is Closed ** ', message, 1).then((res: any) => {
        });
    }

    protected setPieChartData() {
        let labels = [], data = [];

        this.selected_poll_stat.answers.forEach((answer) => {
            labels.push(answer.answer);
            data.push(answer.total + 1);// Todo: Remove +1 when testing completes.
        });

        this.pieChartLabels = [];
        this.pieChartData = [];

        setTimeout(() => {
            this.pieChartLabels = labels;
            this.pieChartData = data;
        }, 0);
    }

    protected calculateVote() {
        let count: number = 0;

        this.selected_poll_stat.answers.forEach((answer) => {
            count += answer.count + 1;// Todo: Remove +1 when testing completes.
        });

        this.vote_count = count;
    }

    // Validate Poll
    private checkDuplicateAnswer(answers: Array<PollAnswer>): boolean {
        this.isDupAns = false;

        answers.forEach((val, key) => {
            let ans1 = val.answer.trim().toLowerCase();

            answers.forEach((val1, key1) => {
                let ans2 = val1.answer.trim().toLowerCase();

                if (key !== key1 && ans1 === ans2) {
                    this.isDupAns = true;
                }
            });
        });

        return this.isDupAns;
    }

    private checkBlankAnswer(answers: Array<PollAnswer>): boolean {
        this.isBlankAns = false;

        answers.forEach((val) => {
            let ans = val.answer.trim();

            if (ans.length === 0) this.isBlankAns = true;
        });

        return this.isBlankAns;
    }

    protected validateAnswer() {
        this.checkDuplicateAnswer(this.selected_poll.answers);
        this.checkBlankAnswer(this.selected_poll.answers);
    }

    protected getDupPollObj(obj: Poll): Poll {
        let newObj: Poll = Object.assign({}, obj);
        newObj.answers = [];

        obj.answers.forEach((val) => {
            newObj.answers.push(Object.assign({}, val));
        });

        return newObj;
    }

    // Events
    onPollChange(index: string) {
        this.selected_poll_index = index;

        if (index !== '-1') {
            this.selected_poll = this.getDupPollObj(this.polls[index]);
            this.poll_changed = true;
        } else {
            this.setBlankPoll();

        }
        this.poll_changed = false;
        console.log('poll index', this.selected_poll_index, this.selected_poll);
    }

    onPollStatChange(index: string) {

        this.selected_poll_stat_index = index;
        this.selected_poll_stat = this.polls_stats[index];
        this.setPieChartData();
        this.calculateVote();

    }


    onAddAnswer(): boolean {
        if ((this.selected_poll && this.selected_poll.answers.length === 10) || this.isDupAns || this.isBlankAns) return false;

        this.selected_poll.answers.push({
            answer: '',
            digit: ''
        });
        this.validateAnswer();
        this.poll_changed = true;

        return true;
    }


    onDeleteAnswer(index): void {
        if (typeof index !== 'undefined') {
            this.answerIndexSelected = index;
        }

        this.selected_poll.answers.splice(this.answerIndexSelected, 1);
        this.validateAnswer();
        this.poll_changed = true;
    }

    onAnswerIndexFocus(id): void {
        this.answerIndexSelected = id;
    }

    onSavePoll(): boolean {
        if (this.selected_poll.answers.length === 0
            || this.isDupAns
            || this.isBlankAns
            || !this.selected_poll.questionScript
            || !this.selected_poll.name) {
            return false;
        }
        this.selected_poll.answers.forEach((val, key) => {
            val.digit = "" + (key + 1);
        });

        this.pollingService.savePoll(this.selected_poll).then((res: any) => {
            if (this.selected_poll_index === '-1') {
                this.polls.push(res.data);
                this.selected_poll_index = '' + (this.polls.length - 1);
            } else {
                this.polls[this.selected_poll_index] = res.data;
            }

            this.selected_poll = this.getDupPollObj(this.polls[this.selected_poll_index]);
            this.poll_changed = false;
        }).catch((msg) => {
            console.log(msg);
        });

        return true;
    }

    onRevertPoll() {
        if (this.selected_poll_index === '-1') {
            this.setBlankPoll();
        } else {
            this.selected_poll = this.getDupPollObj(this.polls[this.selected_poll_index]);
        }

        this.validateAnswer();
        this.poll_changed = false;
    }

    onDeletePoll() {
        this.pollingService.deletePoll(this.selected_poll.id).then((res) => {
            this.polls.splice(parseInt(this.selected_poll_index), 1);
            this.selected_poll_index = '-1';
            this.setBlankPoll();
            this.poll_changed = false;
        }).catch((msg) => {
            setTimeout(() => {
                console.log(msg);
                this.modal.alert().title('Error').body('Poll has summary data attached, delete poll question is not allowed').open();
            }, 200);
        });
    }

    //Active Poll and close poll
    activePoll(data): void {
        let currentPollId = data.currentPollId;

        if (currentPollId !== -1) {
            this.openbtn = false;
            this.closebtn = true;
        }
        else {
            this.openbtn = true;
            this.closebtn = false;
        }
    }

    onPollOpen() {
        this.pollingService.openActivePoll(this.selected_poll_stat.id, this.poll_delay).then((res) => {
            console.log('suc open : ', res);
            this.sendPollWarnChatNotification(this.poll_delay);
            this.openbtn = false;
            this.closebtn = true;
        }).catch((msg) => {
            setTimeout(() => {
            this.modal.alert().title('Error').body('Failed to open poll: conference state not found').open();
            console.error(msg);
        },200);
        });
    }

    onPollClose() {
        this.pollingService.endActivePoll()
            .then(() => {
                    this.sendPollCloseChatNotification();
                    this.openbtn = true;
                    this.closebtn = false;
                    console.log("Poll is closed");
                },
                () => {
                    setTimeout(() => {
                        this.modal.alert().title('Error').body('There is not a poll open currently').open();
                    }, 200);
                });
    }

    onRefreshPollsStats() {
        this.getPollsStats();
    }

    onRefreshPolls() {
        this.getPolls();
    }

    onClearAllFields() {
        this.setBlankPoll();
        this.selected_poll_index = '-1';
        this.elQuestionName.nativeElement.focus();
        this.poll_changed = false;
    }
}