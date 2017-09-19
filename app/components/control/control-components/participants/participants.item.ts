import { Component, Input } from '@angular/core';
import { Participant } from '../../../../store/participants/participants.reducers';

@Component({
    selector: '[participantRow]',
    template: `
    <td>{{participant.audioLevel}} {{participant.audioStatus}} {{participant.volume}}</td>
    <td>{{participant.phoneNo}}</td>
    <td>{{participant.name}}</td>
    <td>{{participant.statusDesc}}</td>
    <td>{{participant.typeDesc}}</td>
    `,
})
export class ParticipantsItemComponent {
    @Input() participant: Participant;
}

