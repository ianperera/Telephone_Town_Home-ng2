/**
 * Created by Posh on 2/8/17.
 */
import {Component, OnInit} from '@angular/core';
import {DialogRef, ModalComponent} from 'angular2-modal';
import {BSModalContext} from 'angular2-modal/plugins/bootstrap';

export class AudioFileUploadModalContext extends BSModalContext {
    audioFile: File;
}

@Component({
    selector: 'app-audio-file-upload-modal',
    styles: [],
    template: `
    <div class="modal-header">         
        <h4 class="modal-title">File Upload</h4>
    </div>       
    <div class="panel mb-0">
        <div class="panel-body">
            <div>
                <p>Upload file {{ context.audioFile.name }} size (bytes): {{context.audioFile.size}}</p>
            </div>
            <p style="color: darkred">Please wait until the upload is complete...</p>
            <div class="progress">
                <div class="progress-bar progress-bar-striped active" role="progressbar" 
                aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 100%">
                LOADING...
                </div>                
             </div>
        </div>
        <div class="panel-footer text-right">
            <button class="btn btn-danger" (click)="stopUpload()">Stop Upload</button>           
        </div>
    </div>
  `
})
export class AudioFileUploadModal implements OnInit, ModalComponent<AudioFileUploadModalContext> {
    context: AudioFileUploadModalContext;

    constructor(public dialog: DialogRef<AudioFileUploadModalContext>) {
        this.context = this.dialog.context;
    }

    ngOnInit() {
    }

    close(): void {
        this.dialog.close('success');
    }

    stopUpload(): void {
        this.dialog.close('cancel');
    }
}
