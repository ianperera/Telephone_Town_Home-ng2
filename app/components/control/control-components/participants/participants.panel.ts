import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Participant } from '../../../../store/participants/participants.reducers';

@Component({
    selector: 'app-participants-panel',
    template: `
    <div style="overflow-x: scroll;">
        <div class="panel panel-default">
            <div class="panel-heading">Participants</div>
            <div id="tablePanelBody" class="panel-body">
                <table class="table table-striped table-condensed table-hover">
                    <thead>
                        <tr>
                            <td>Audio</td>
                            <td>Phone Number</td>
                            <td>Name</td>
                            <td>Call</td>
                            <td>Type</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr participantRow *ngFor="let participant of participants"
                            [class.info]="participant.id === selected?.id"
                            [class.warning]="participant.pending"
                            [class.danger]="participant.status === 128"
                            [participant]="participant"
                            (click)="toggle(participant)">
                        </tr>
                    </tbody>
                </table>
            </div>
            <ng-content></ng-content>
        </div>
    </div>
    `,
    styles: [`
    :host {
        min-width: 500px;
    }
    #tablePanelBody {
        padding: 0;
    }
    thead > tr > td {
        font-size: 0.8em;
        font-weight: bold;
    }
    `]
})
export class ParticipantsPanelComponent {
    @Input() participants: Participant[];
    @Input() selected: Participant;
    @Output() select = new EventEmitter();
    @Output() deselect = new EventEmitter();

    /**
     * Select participant logic.
     * - Deselect if the participant is already selected.
     * - Don't allow selecting of disconnected participants.
     * - Otherwise select.
     */
    toggle(participant: Participant): void {
        if (!!this.selected && this.selected.id === participant.id) {
            this.deselect.emit();
        } else if (participant.status !== 128) {
            this.select.emit(participant);
        }
    }
}
