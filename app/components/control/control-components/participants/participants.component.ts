import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import * as fromRoot from '../../../../store';
import * as fromUi from '../../../../store/ui/ui.actions';
import * as fromParticipants from '../../../../store/participants/participants.actions';
import { Participant } from '../../../../store/participants/participants.reducers';

/**
 * Angular 2.3.1 has an issue where it automatically inserts the required parent of
 * an attribute selected html tag. For example, <tbody> is a required parent of <tr>.
 * This is fixed in 4. So the below code will break when we upgrade. To fix, add
 * the <tbody></tbody> tags to participants.panel.
 */

@Component({
    //changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-participants',
    template: `
    <app-participants-panel [participants]="participants$ | async"
        [selected]="selectedParticipant$ | async"
        (select)="select($event)"
        (deselect)="deselect()">
        <app-participants-edit *ngIf="(selectedParticipant$ | async)?.id"
            [participant]="selectedParticipant$ | async"
            (mute)="mute($event)"
            (unmute)="unmute($event)"
            (hold)="hold($event)"
            (unhold)="unhold($event)"
            (hangup)="hangup($event)"
            (volume)="volume($event)"
            (rename)="rename($event)">
        </app-participants-edit>
    </app-participants-panel>
    `,
    styles: [`
        :host {
            height: 100%;
        }
    `]
})
export class ParticipantsComponent {
    public participants$: Observable<Participant[]>;
    public selectedParticipant$: Observable<Participant | undefined>;

    select(participant: Participant): void {
        this.store.dispatch(new fromUi.SelectParticipant({id: participant.id}));
    }
    deselect(): void {
        this.store.dispatch(new fromUi.DeselectParticipant());
    }
    mute(participant: Participant): void {
        this.store.dispatch(new fromParticipants.MuteStart({id: participant.id}));
    }
    unmute(participant: Participant): void {
        this.store.dispatch(new fromParticipants.UnmuteStart({id: participant.id}));
    }
    hold(participant: Participant): void {
        this.store.dispatch(new fromParticipants.HoldStart({id: participant.id}));
    }
    unhold(participant: Participant): void {
        this.store.dispatch(new fromParticipants.UnholdStart({id: participant.id}));
    }
    hangup(participant: Participant): void {
        this.store.dispatch(new fromParticipants.HangupStart({id: participant.id}));
    }
    volume({participant, volume}: {participant: Participant, volume: number}): void {
        this.store.dispatch(new fromParticipants.SetVolumeStart({id: participant.id, volume}));
    }
    rename(participant: Participant): void {
       this.store.dispatch(new fromParticipants.RenameStart(participant));
    }

    private deselectOnDisconnect(participant: Participant): void {
        if (!!participant && participant.status === 128) {
            this.deselect();
        }
    }

    constructor(private store: Store<fromRoot.State>) {
        this.participants$ = this.store.select(fromRoot.getParticipantArray);
        this.selectedParticipant$ = this.store.select(fromRoot.getSelectedParticipant)
            .do(this.deselectOnDisconnect.bind(this)); // Deselect if selection is disconnecting.
    }
}

