import {Component, OnInit} from '@angular/core';
import {DialogRef, ModalComponent} from 'angular2-modal';
import {BSModalContext} from 'angular2-modal/plugins/bootstrap';
import {TaskControlService} from "./task-control.service";

export class TaskControlModalContext extends BSModalContext {
    taskIds: number[];
    title: string;
}

@Component({
    selector: 'app-task-control-modal',
    styles: [],
    templateUrl: 'components/calendar/event-edit/phone-list/task-control/task-control.tmpl.html'
})
export class TaskControlModal implements OnInit, ModalComponent<TaskControlModalContext> {
    context: TaskControlModalContext;
    taskIds: number[];
    message: string;
    messagestatus: string;
    messagestate: string;
    completedTaskCount: number = 0;
    completedTasks: Array<any> = [];
    title: string;
    showLoadingImg = false;
    showPause = false;
    showResume = false;
    showDeferred = false;
    showCancel = false;
    showComplete = false;

    constructor(public dialog: DialogRef<TaskControlModalContext>,
                private taskControlService: TaskControlService) {
        this.context = this.dialog.context;
        this.taskIds = this.context.taskIds;
        this.title = this.context.title;
    }

    ngOnInit() {
        this.checkProgress(this.context.taskIds);
    }

    pauseUpload(taskId: number) {
        this.taskControlService.suspendTask(taskId, 10000);
    }

    resumeUpload(taskId: number) {
        this.taskControlService.resumeTask(taskId);
    }

    cancelUpload(taskId: number) {
        this.taskControlService.cancelTask(taskId);
    }

    startUpload(taskId: number) {
        this.taskControlService.runTaskNow(taskId);
    }

    checkProgress(taskIds: number[]) {
        console.log('checking progress..');

        if (this.completedTaskCount !== taskIds.length) {
            console.log('pending tasks...');

            for (var i: number = 0; i < taskIds.length; i++) {
                if (!this.completedTasks[taskIds[i]]) {
                    this.getProgress(taskIds[i]);
                }
            }
        } else {
            console.log('task completed');
        }
    }

    getProgress(taskId: number) {
        this.taskControlService.taskProgress(taskId).then((res: any) => {
            let progress: any = res.data;

            if (progress.stateCode !== 3) {
                // update progress
                this.message = progress.progressMessage;
                this.messagestatus = progress.status;
                this.messagestate = progress.state;
                this.showLoadingImg = true;

                //set show/hide buttons of control task
                if (progress.stateCode == 1) {
                    this.showPause      = false;
                    this.showResume     = false;
                    this.showDeferred   = true;
                    this.showCancel     = true;
                } else if (progress.stateCode == 2) {
                    this.showPause      = true;
                    this.showResume     = false;
                    this.showDeferred   = false;
                    this.showCancel     = true;
                } else if (progress.stateCode == 5) {
                    this.showPause      = false;
                    this.showResume     = true;
                    this.showDeferred   = false;
                    this.showCancel     = true;
                }

            } else {
                this.completedTasks[taskId] = true; // mark this task as done

                this.completedTaskCount++;
                this.showLoadingImg = false;

                this.showPause      = false;
                this.showResume     = false;
                this.showDeferred   = false;
                this.showCancel     = false;
                this.showComplete   = true;

                if (progress.status === "failed") { // the task failed.  notify the user.
                    this.message = progress.progressMessage;
                    this.messagestatus = progress.status;
                    this.messagestate = progress.state;
                } else {
                    this.message = progress.progressMessage;
                    this.messagestatus = progress.status;
                    this.messagestate = progress.state;
                }
            }

            setTimeout(()=> {
                console.log('timeout triggered..');
                this.checkProgress(this.taskIds);
            }, 1000); // wait a second before trying again.
        });
    }

    closeUpload() {
        this.dialog.close('cancel');
    }
}
