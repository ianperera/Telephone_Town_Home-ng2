/**
 * Created by thipaporn on 1/4/17.
 */
import {Component, OnInit} from '@angular/core';

import {DialogRef, ModalComponent} from 'angular2-modal';
import {BSModalContext} from 'angular2-modal/plugins/bootstrap';

export class CalendarExitConfirmModalContext extends BSModalContext {
    fields: any[];
}

@Component({
    selector: 'app-calendar-exit-confirm-modal',
    styles: [],
    template: `
    <div class="modal-header">         
        <h4 class="modal-title">Confirm Close</h4>
    </div>       
    <div class="panel mb-0">
    <div class="panel-body">
       <p>Save conference before closing?</p>
    </div>
      <div class="panel-footer text-right">
      <button type="submit" class="btn btn-primary"
                (click)="closeDialog($event, 'yes')">Ok</button>
      <button type="submit" class="btn btn-primary"
                (click)="closeDialog($event, 'no')">No</button>
      <button type="button" class="btn btn-default"                 
              (click)="closeDialog($event, 'cancel')">Cancel</button>
      
    </div> 
    </div>
  `
})
export class CalendarExitConfirmModal implements OnInit, ModalComponent<CalendarExitConfirmModalContext> {
    context: CalendarExitConfirmModalContext;

    constructor(public dialog: DialogRef<CalendarExitConfirmModalContext>) {
    }

    ngOnInit() {
        this.context = this.dialog.context;
    }


    closeDialog(event, answer): void {
        this.dialog.close({answer: answer});
    }


}
