import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Modal, BSModalContext} from 'angular2-modal/plugins/bootstrap';
import {overlayConfigFactory} from 'angular2-modal';
import {ScreenedEditModal} from "./screened-edit.modal";
import {QuestionData} from "../../../../models/events";

@Component({
    selector: 'app-screened-edit',
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
                    (click)="ondeck.emit()">on deck</button>
            <button type="button" class="btn btn-primary btn-sm" style="width: 80px"
                    (click)="live.emit()">live</button>
            <button type="button" class="btn btn-primary btn-sm" style="width: 80px"
                    (click)="remove.emit()">remove</button>
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
export class ScreenedEditComponent {
    @Input() question: QuestionData;
    @Output() ondeck = new EventEmitter();
    @Output() live = new EventEmitter();
    @Output() remove = new EventEmitter();
    @Output() cancel = new EventEmitter();
    @Output() edit = new EventEmitter<QuestionData>();

    constructor(private modal: Modal) {
    }

    ngOnInit() {

    }

    showEditBox() {
        this.modal.open(ScreenedEditModal, overlayConfigFactory(this.question, BSModalContext))
            .then(resultPromise => {
                resultPromise.result.then(question => {
                    if (question) {
                        this.edit.emit(question);
                    }
                });
            });
    }
}
