import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Modal, BSModalContext} from 'angular2-modal/plugins/bootstrap';
import {overlayConfigFactory} from 'angular2-modal';

import {QuestionUpdate} from "../../../../store/question-update/question-update.reducers";
import {LiveQuestionEditModal} from "./live-questions-edit.modal";

@Component({
    selector: 'app-live-questions-edit',
    template: `
    <div class="panel-body">
        <div class="row">
            <div class="col-md-6">
            <div class="form-group">
                <label>Question:</label>
                 <div style="border: 1px solid black; height: 10%; width: 80%; text-decoration:underline;">
                   {{ question.question }}
                </div>
            </div>
            <div class="form-group">
                <label>Notes:</label>
                 <div style="border: 1px solid black; height: 10%; width: 80%; text-decoration:underline;">
                    {{ question.screenerNotes }}
                </div>
            </div>
        </div>
        <div class="col-md-5">
            <div class="form-group">
                <label>Name: {{ question.name }}</label>
            </div>
            <div class="form-group">
                <label>Address: {{ question.addressZip }} {{ question.addressCity  }} {{ question.addressState }}</label>
            </div>
            <div class="form-group">
                <label>Raised Hand: {{ question.handRaisedTimestamp }}</label>
            </div>

            <button type="button" class="btn btn-primary btn-sm" style="width: 80px"
                    (click)="showEditBox()">edit</button>
            <button type="button" class="btn btn-primary btn-sm" style="width: 80px"
                    (click)="mute.emit()">mute</button>
            <button type="button" class="btn btn-primary btn-sm" style="width: 80px"
                    (click)="unmute.emit()">unmute</button>
            <button type="button" class="btn btn-primary btn-sm" style="width: 80px"
                    (click)="hold.emit()">hold</button>
            <button type="button" class="btn btn-primary btn-sm" style="width: 80px"
                    (click)="unhold.emit()">unhold</button>
            <button type="button" class="btn btn-primary btn-sm" style="width: 80px"
                    (click)="hangup.emit()">hangup</button>
            <div>
            <input #volumeInput type="number" class="form-control" placehold="Volume" value="50"
                   (keyup.enter)="volume.emit({volume: volumeInput.value})">
            <span class="input-group-btn">
                    <button type="button" class="btn btn-default"
                            (click)="volume.emit({volume: 50})">Reset</button>
            </span>
            </div>
        </div>    
          <div class="col-md-1">
          <span style="color: darkred" class="glyphicon glyphicon-remove" (click)="cancel.emit()"></span>
          </div>
        </div>
    </div>
    `,
    styles: [`
        
    `]
})
export class LiveQuestionEditComponent {
    @Input() question: QuestionUpdate;
    @Output() mute = new EventEmitter();
    @Output() unmute = new EventEmitter();
    @Output() hold = new EventEmitter();
    @Output() unhold = new EventEmitter();
    @Output() hangup = new EventEmitter();
    @Output() cancel = new EventEmitter();
    @Output() volume = new EventEmitter();
    @Output() saveQuestion = new EventEmitter<QuestionUpdate>();

    constructor(private modal: Modal) {
    }

    ngOnInit() {

    }

    showEditBox() {
        console.log('this question to open ', this.question);
        this.modal.open(LiveQuestionEditModal, overlayConfigFactory(this.question, BSModalContext))
            .then(resultPromise => {
                resultPromise.result.then(question => {
                    if (question) {
                        this.saveQuestion.emit(question);
                    }
                });
            });
    }
}
