/**
 * Created by thipaporn on 1/11/17.
 */
import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {DialogRef, ModalComponent} from 'angular2-modal';
import {BSModalContext} from 'angular2-modal/plugins/bootstrap';

export class FileUploadProgressModalContext extends BSModalContext {
    progressObserver: Observable<number>;
}

@Component({
    selector: 'app-file-upload-progress-modal',
    styles: [],
    template: `
    <div class="modal-header">         
        <h4 class="modal-title">File Upload</h4>
    </div>       
    <div class="panel mb-0">
        <div class="panel-body">
            <div>
                <div class="progress">
                    <div class="progress-bar progress-bar-success progress-bar-striped"
                         role="progressbar" [attr.aria-valuenow]="progressPercent"
                         aria-valuemin="0" aria-valuemax="100"
                         style="min-width: 2em;" [style.width]="(progressPercent/100)*100 + '%'">
                        {{progressPercent}}%
                    </div>
                </div>                
            </div>
        </div>
        <div class="panel-footer text-right">
            <button class="btn btn-danger" (click)="stopUpload()">Stop Upload</button>           
        </div>
    </div>
  `
})
export class FileUploadProgressModal implements OnInit, ModalComponent<FileUploadProgressModalContext> {
    context: FileUploadProgressModalContext;
    progressPercent: number = 0;

    constructor(public dialog: DialogRef<FileUploadProgressModalContext>) {
        this.context = this.dialog.context;
    }

    ngOnInit() {
        this.context.progressObserver.subscribe(value => {
            this.progressPercent = value;

            if (value === 100) {
                this.dialog.close('success');
            }
        });
    }

    stopUpload(): void {
        this.dialog.close('cancel');
    }
}
