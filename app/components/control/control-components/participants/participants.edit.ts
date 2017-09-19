import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Participant } from '../../../../store/participants/participants.reducers';

/**
 * This template is giant because of bootstrap verbosity.
 */

@Component({
    selector: 'app-participants-edit',
    template: `
    <div class="panel-body">
        <div class="row">
            <p class="col-md-12">Participant: {{participant.phoneNo}} - {{participant.name}} ({{participant.statusDesc}})</p>
        </div>
        <div class="row">
            <div class="col-md-10">
                <div class="input-group">
                    <input #nameEdit type="text" class="form-control" placeholder="Name..." 
                        [ngModel]="participant.name"
                        [disabled]="participant.pending"
                        [class.warning]="nameInit !== participant.name"
                        (keyup.enter)="renameWrap(nameEdit.value)">
                    <span class="input-group-btn">
                        <button class="btn btn-default" type="button"
                            [disabled]="participant.pending"
                            [class.warning]="nameInit !== participant.name"
                            (click)="renameWrap(nameEdit.value)">
                            Save
                        </button>
                    </span>
                </div>
            </div>
        </div>
        <div class="space-row"></div>
        <div class="row">
            <div class="col-md-6">
                <fieldset [disabled]="participant.pending">
                    <div class="input-group" role="group" aria-label="...">
                        <span class="input-group-btn">
                            <ng-container [ngSwitch]="participant.audioStatus">
                            <button *ngSwitchCase="1" type="button" class="btn btn-default"
                                (click)="mute.emit(participant)">Mute</button>
                            <button *ngSwitchCase="2" type="button" class="btn btn-default"
                                (click)="unmute.emit(participant)">Unmute</button>
                            </ng-container>
                        </span>
                        <input #volumeInput type="number" class="form-control" placehold="Volume" [ngModel]="participant.volume"
                            (keyup.enter)="volume.emit({participant: participant, volume: volumeInput.value})">
                        <span class="input-group-btn">
                            <button type="button" class="btn btn-default"
                                (click)="volume.emit({participant: participant, volume: 50})">Reset</button>
                        </span>
                    </div>
                </fieldset>
            </div>
            <div class="col-md-6">
                <fieldset [disabled]="participant.pending">
                    <div class="btn-group" role="group" aria-label="...">
                        <ng-container [ngSwitch]="participant.status">
                            <button *ngSwitchCase="16" type="button" class="btn btn-default"
                            (click)="hold.emit(participant)">Hold</button>
                            <button *ngSwitchCase="32" type="button" class="btn btn-default"
                            (click)="unhold.emit(participant)">Unhold</button>
                        </ng-container>
                        <button type="button" class="btn btn-default" (click)="hangup.emit(participant)">Hangup</button>
                    </div>
                </fieldset>
            </div>
        </div>
    </div>
    `,
    styles: [`
        fieldset {
            margin: 0;
            padding: 0;
            border: 0;
        }
        .space-row {
            height: 10px;
        }
    `]
})
export class ParticipantsEditComponent {
    @Input() participant: Participant;
    @Output() mute = new EventEmitter();
    @Output() unmute = new EventEmitter();
    @Output() volume = new EventEmitter();
    @Output() hold = new EventEmitter();
    @Output() unhold = new EventEmitter();
    @Output() hangup = new EventEmitter();
    @Output() rename = new EventEmitter<Participant>();

    renameWrap(name: string): void {
        this.rename.emit(Object.assign({}, this.participant, {name}));
    }
}

