import {Component, OnInit} from '@angular/core';

import {DialogRef, ModalComponent} from 'angular2-modal';
import {BSModalContext} from 'angular2-modal/plugins/bootstrap';

export class ScreenedModalContext extends BSModalContext {
    id: number;
    participantId: number;
    dataId: number;
    status: number;
    name: string;
    phoneNo: string;
    dialerLocation: string;
    question: string;
    screenerNotes: string;
    addressState: string;
    addressCity: string;
    addressZip: string;
    handRaisedTimestamp: number;
    statusChangedTimestamp: number;
    liveTimestamp: number;
    rating: number;
    donationIndicator: boolean;
    screenerParticipantId: number;
    screenerName: string;
    listenerVolume: number;
}

@Component({
    selector: 'app-screened-edit-modal',
    styles: [
        '.mb-0 { margin-bottom: 0; }',
        '.input-group-btn { font-size: 12px; width: 8px; text-align: center; }',
        '.form-control { -webkit-box-shadow: none; box-shadow: none; }'
    ],
    template: `
    <div class="modal-header">         
      <h4 class="modal-title">Edit Question</h4>
    </div>  
    <form class="mb-0" autocomplete="off" (submit)="formSubmit($event)">
       <div class="panel mb-0">
        <div class="panel-body">
        <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label for="firstName">Question:</label>
                <textarea class="form-control input-sm" id="question" [(ngModel)]="context.question" [ngModelOptions]="{standalone: true}"></textarea>
              </div>
              <div class="form-group">
                <label for="firstName">Notes:</label>
                <textarea class="form-control input-sm" id="screenerNotes" [(ngModel)]="context.screenerNotes" [ngModelOptions]="{standalone: true}"></textarea>
              </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label>Name: {{ context.name }}</label>
                </div>
                <div class="form-group">
                    <label>Address: {{ context.addressZip }} {{ context.addressCity }} {{ context.addressState }}</label>
                </div>
                <div class="form-group">
                    <label>Raised Hand: {{ context.handRaisedTimestamp }}</label>
                </div>            
            </div>
        </div>
        </div>
        <div class="panel-footer text-right">          
            <button type="submit" class="btn btn-primary">Done</button>
            <button type="button" class="btn btn-default" (click)="reset()">Reset</button>
            <button type="button" class="btn btn-default" (click)="closeDialog($event)">Cancel</button>
        </div>
      </div>
    </form>
  `
})
export class ScreenedEditModal implements OnInit, ModalComponent<ScreenedModalContext> {
    context: ScreenedModalContext;

    constructor(public dialog: DialogRef<ScreenedModalContext>) {
    }

    ngOnInit() {
        this.context = Object.assign({}, this.dialog.context);
    }

    formSubmit(event): void {
        event.preventDefault();
        this.dialog.close(this.context);
    }

    closeDialog(event): void {
        this.dialog.close(null);
    }

    reset(): void {
        this.context.question = this.dialog.context.question;
        this.context.screenerNotes = this.dialog.context.screenerNotes;
    }
}