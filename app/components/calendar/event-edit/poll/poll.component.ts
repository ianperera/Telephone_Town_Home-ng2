import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {RequestHelperService} from '../../../../request-helper.service';

import {ConferenceSetup} from "../../conference.datatypes";
import {PollService} from "./poll.service";
@Component({
    selector: 'app-event-poll',
    templateUrl: 'components/calendar/event-edit/poll/poll.tmpl.html',
	styleUrls: ['components/calendar/event-edit/poll/poll.css']
})
export class PollComponent implements OnInit {
	@Input() event: ConferenceSetup;
	@Output() notify: EventEmitter<string> = new EventEmitter<string>();
	@Output() notifyChange: EventEmitter<boolean> = new EventEmitter<boolean>();

	pollIndexSelected: 		number = 100000;
	answerIndexSelected: 	number = 100000;
	answerIndexSelectedNew: number = 100000;
	selectedRow : 			number = 100000;
	setClickedRow : 		Function;
	
	questionPoll = {
		name: null,
		questionScript: null,
        updateCount: 0,
		answers:[]
	};

	questionPollNew = {
		name: null,
		questionScript: null,
        updateCount: 0,
		answers:[]
	};

	savedPollIds: 		Array<number> = [];
	disButton : 		boolean = true;
	private isDupAns: 	boolean = false;
	private isBlankAns: boolean = false;

	constructor(private requestHelper:RequestHelperService, private pollService: PollService) {
		this.setClickedRow = function(index, poll){
			this.selectedRow = index;
			this.pollIndexSelected = index;
			this.disButton = !poll.deletable;
			console.log(JSON.stringify(poll));
			console.log("deleteable: " + poll.deletable);
		}
	}

    ngOnInit() {
        if (this.event.pollQuestions) {
            this.event.pollQuestions.forEach((question:any) => {
                this.savedPollIds.push(question.id);
            });
        }
    }

	trackByIndex(index, obj):void{
	
	
	}

	AddanswerclickedNew():void{
		this.questionPollNew.answers.push('');
		this.validateAnswer('new');
	}

	DeleteanswerclickedNew():void{
	
		this.questionPollNew.answers.splice(this.answerIndexSelectedNew,1);
		this.validateAnswer('new');
		this.notifyChange.emit(true);
	}

	Addanswerclicked():void{
	
		this.questionPoll.answers.push('');
		this.validateAnswer('edit');
	}
	
	Deleteanswerclicked():void{
	
		this.questionPoll.answers.splice(this.answerIndexSelected,1);
		this.validateAnswer('edit');
		this.notifyChange.emit(true);
	}
	
	answerIndexFocus(id):void{
	
		this.answerIndexSelected=id;
	}
	
	answerIndexFocusNew(id):void{
	
		this.answerIndexSelectedNew=id;
	}
	
	addShowMethod(event):void{
		this.pollIndexSelected = 100000;
		this.questionPollNew = {
			name:null,
			questionScript:null,
            updateCount: 0,
			answers:[]
		};
		this.validateAnswer('new');
	}
	
	editShowMethod(event) : void {
		var dataTemp = this.pollService.pollQuestions[this.pollIndexSelected];
		var arrayToWork = [];
		var len = dataTemp.answers.length;
		
		this.questionPoll = {
			name:null,
			questionScript:null,
            updateCount: 0,
			answers:[]
		};

		for(var ii = 0; ii < len; ii++){
			//alert(dataTemp.answers[ii].answer);
			arrayToWork.push(dataTemp.answers[ii].answer);	
		};
		
		this.questionPoll = {
			name: dataTemp.name,
			questionScript: dataTemp.questionScript,
            updateCount: dataTemp.updateCount,
			answers: arrayToWork
		};
		this.validateAnswer('edit');
	}
	
	addDataOfPopupToObject(event, form) : void {
		event.preventDefault();
						
		var arrayToWork = [];
		var len = this.questionPollNew.answers.length;
		var questionPollObject = {
			name: this.questionPollNew.name,
			questionScript: this.questionPollNew.questionScript,
            updateCount: this.questionPollNew.updateCount,
			answers: arrayToWork,
            deletable: true
		}
		
		for(var ii = 0; ii < len; ii++){
			arrayToWork.push({"digit":ii+1+"","answer":this.questionPollNew.answers[ii]+""});	
		}

		this.pollService.pollQuestions.push(questionPollObject);
	}
	
	deletePoll(event) : void {
        this.notifyChange.emit(true);
        this.notify.emit('event');

        this.pollService.pollQuestions.splice(this.pollIndexSelected, 1);
		this.pollIndexSelected = this.selectedRow = 100000;
	}
	
	saveEditedPoll(event, form) : void {

        event.preventDefault();

        var arrayToWork = [];
        var len = this.questionPoll.answers.length;
        var questionPollObject = {
            name: this.questionPoll.name,
            questionScript: this.questionPoll.questionScript,
            answers: arrayToWork,
            deletable: true
        }

        for (var ii = 0; ii < len; ii++) {
            arrayToWork.push({"digit": ii + 1 + "", "answer": this.questionPoll.answers[ii] + ""});
        }
        

        this.pollService.pollQuestions[this.pollIndexSelected] = questionPollObject;
        this.pollIndexSelected = this.selectedRow = 100000;
	}
	private checkDuplicateAnswer(answers): boolean {
		this.isDupAns = false;

		answers.forEach((val, key) => {
			val = val.trim().toLowerCase();

			answers.forEach((val1, key1) => {
				val1 = val1.trim().toLowerCase();

				if (key !== key1 && val === val1) {
					this.isDupAns = true;
				}
			});
		});

		return this.isDupAns;
	}

	private checkBlankAnswer(answers): boolean {
		this.isBlankAns = false;

		answers.forEach((val, key) => {
			val = val.trim();

			if (val.length === 0) this.isBlankAns = true;
		});

		return this.isBlankAns;
	}

	validateAnswer(type) {
		switch (type) {
			case 'new':
				this.checkDuplicateAnswer(this.questionPollNew.answers);
				this.checkBlankAnswer(this.questionPollNew.answers);
				break;
			case 'edit':
				this.checkDuplicateAnswer(this.questionPoll.answers);
				this.checkBlankAnswer(this.questionPoll.answers);
				break;
		}
	}
}
