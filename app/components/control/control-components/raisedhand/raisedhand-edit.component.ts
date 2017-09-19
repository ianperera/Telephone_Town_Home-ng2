import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Modal, BSModalContext} from 'angular2-modal/plugins/bootstrap';
import {overlayConfigFactory} from 'angular2-modal';
import {RaisedHandEditModal} from "./raisedhand-edit.modal";
import {QuestionData} from "../../../../models/events";

@Component({
    selector: 'app-raisedhand-edit',
    template: `
    <div class="panel-body">
        <div class="row">
            <div class="col-md-6">
            <div class="form-group">
                <label>Question:</label>
                 <div style="border: 1px solid black; height: 10%; width: 80%; text-decoration:underline;">
                   {{ question.question }}
                </div>
            </div>
            <div class="form-group">
                <label>Notes:</label>
                 <div style="border: 1px solid black; height: 10%; width: 80%; text-decoration:underline;">
                    {{ question.screenerNotes }}
                </div>
            </div>
        </div>
        <div class="col-md-5">
            <div class="form-group">
                <label>Name: {{ question.name }}</label>
            </div>
            <div class="form-group">
                <label>Address: {{ question.addressZip }} {{ question.addressCity  }} {{ question.addressState }}</label>
            </div>
            <div class="form-group">
                <label>Raised Hand: {{ question.handRaisedTimestamp }}</label>
            </div>

            <button type="button" class="btn btn-primary btn-sm" style="width: 80px"
                    (click)="showEditBox()">edit</button>
            <button type="button" class="btn btn-primary btn-sm" style="width: 100px;"
                    data-toggle="modal" data-target="#OnDeck">on deck
            </button>
            <button type="button" class="btn btn-primary btn-sm" style="width: 100px;"
                    data-toggle="modal" data-target="#Bringlive">live
            </button>
            <button type="button" class="btn btn-primary btn-sm" style="width: 100px;"
                    data-toggle="modal" data-target="#Remove">remove
            </button>
        </div>    
          <div class="col-md-1">
          <span style="color: darkred" class="glyphicon glyphicon-remove" (click)="cancel.emit()"></span>
          </div>
        </div>
    </div>
    <!-- modal OnDeck confirmation -->
    <div class="modal fade" id="OnDeck" role="dialog">
        <div class="modal-dialog " style="max-width:450px">
            <!-- Modal content-->
            <form>
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">Please Confirm Un-screened Question</h4>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="form-group">
                                <div class="col-md-12">
                                    <p>Do you really to bring this UN-SCREENED listener on deck?</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" (click)="ondeck.emit()" class="btn btn-primary" data-dismiss="modal">Yes</button>
                        <button type="button" class="btn btn-default" data-dismiss="modal">No</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
    
    <!-- modal Live confirmation -->
    <div class="modal fade" id="Bringlive" role="dialog">
        <div class="modal-dialog " style="max-width:450px">
            <!-- Modal content-->
            <form>
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">Please Confirm Un-screened Question</h4>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="form-group">
                                <div class="col-md-12">
                                    <p>Do you really want to go live with this UN-SCREENED listener?</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" (click)="live.emit()" class="btn btn-primary" data-dismiss="modal">Yes</button>
                        <button type="button" class="btn btn-default" data-dismiss="modal">No</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
    
    <!-- modal Remove confirmation -->
    <div class="modal fade" id="Remove" role="dialog">
        <div class="modal-dialog " style="max-width:450px">
            <!-- Modal content-->
            <form>
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">Please Confirm Un-screened Question</h4>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="form-group">
                                <div class="col-md-12">
                                    <p>Do you want to remove this question and send the listener back to the conference?</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" (click)="remove.emit()" class="btn btn-primary" data-dismiss="modal">Yes</button>
                        <button type="button" class="btn btn-default" data-dismiss="modal">No</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
    `,
    styles: [`
        
    `]
})
export class RaisedHandEditComponent {
    @Input() question: QuestionData;
    @Output() ondeck = new EventEmitter();
    @Output() live = new EventEmitter();
    @Output() remove = new EventEmitter();
    @Output() cancel = new EventEmitter();
    @Output() edit = new EventEmitter<QuestionData>();

    constructor(private modal: Modal) {
    }

    ngOnInit() {

    }

    showEditBox() {
        this.modal.open(RaisedHandEditModal, overlayConfigFactory(this.question, BSModalContext))
            .then(resultPromise => {
                resultPromise.result.then(question => {
                    if (question) {
                        this.edit.emit(question);
                    }
                });
            });
    }
}
