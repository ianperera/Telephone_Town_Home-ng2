/**
 * Created by Posh on 1/30/17.
 */
import {Component, OnInit} from '@angular/core';

import {DialogRef, ModalComponent} from 'angular2-modal';
import {BSModalContext} from 'angular2-modal/plugins/bootstrap';

export class CalendarLoadingModalContext extends BSModalContext {
    message : string
}

@Component({
    selector: 'app-calendar-loading-modal',
    styles: [],
    template: `
    <div class="modal-header">         
        <h4 class="modal-title"><span class="glyphicon glyphicon-time">
                    </span> Please Wait</h4>
    </div>       
        <div class="panel mb-0">
            <div class="panel-body">
            <p>{{context.message}}</p>
            <div class="progress">
                <div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 100%">
                </div>
             </div>
        </div>
    </div>
  `
})
export class CalendarLoadingModal implements OnInit, ModalComponent<CalendarLoadingModalContext> {
    context: CalendarLoadingModalContext;

    constructor(public dialog: DialogRef<CalendarLoadingModalContext>) {
    }

    ngOnInit() {
        this.context = this.dialog.context;
    }
}
