import {Component, OnInit} from '@angular/core';

import {DialogRef, ModalComponent} from 'angular2-modal';
import {BSModalContext} from 'angular2-modal/plugins/bootstrap';

import {RoleService} from './role.service';

export class UserRole {
    id: string;
    name: string;
}

export class RoleModalContext extends BSModalContext {
    emailAddress: string;
    firstName: string;
    lastName: string;
    phoneNo: string;
    role: string;
    hasPin: boolean;
    pin: string;
    userId: number;
    hostScheduleId:string;
    webListener: boolean;
    listenerHandRaised: boolean;
    donationsAccepted: boolean;
    nonInteractiveListener: boolean;
}

@Component({
    selector: 'app-event-role-modal',
    styles: [
        '.mb-0 { margin-bottom: 0; }',
        '.input-group-btn { font-size: 12px; width: 8px; text-align: center; }',
        '.form-control { -webkit-box-shadow: none; box-shadow: none; }'
    ],
    template: `
    <div class="modal-header">         
          <h4 class="modal-title">{{ context.pin ? 'Edit User' : 'Create New User' }}</h4>
        </div>
        
        
        <form class="mb-0"
          autocomplete="off"
          (submit)="formSubmit($event)">
             
    <!--other form when Role name = Listener-->
       <div class="panel mb-0">
        <div class="panel-body">
          <p style="color:red">{{errorMsg}}</p>
           <div *ngIf="!context.hasPin && !context.phoneNo" >
           <p style="color: darkred">Users must have an Inbound PIN generated or a phone number specified (or both)</p>
           </div>
          <div class="form-group">
            <label for="firstName">First Name</label>
            <input type="text" class="form-control input-sm" id="firstName" required
                   [(ngModel)]="context.firstName"
                   [ngModelOptions]="{standalone: true}">
          </div>
          <div class="form-group">
            <label for="lastName">Last Name</label>
            <input type="text" class="form-control input-sm" id="lastName" required
                   [(ngModel)]="context.lastName"
                   [ngModelOptions]="{standalone: true}">
          </div> 
          <div class="form-group" *ngIf="context.role != 'LISTENER', 'Listener'">
            <label for="phoneNo">Phone Number</label>
            <input type="text" class="form-control input-sm" id="phoneNo"
                   [(ngModel)]="context.phoneNo"
                   [ngModelOptions]="{standalone: true}">
          </div>
          <div class="form-group" *ngIf="context.role === 'LISTENER', 'Listener'">
            <label for="phoneNo">Phone Number</label>
            <p>To add a listener to be called, please add them to a phone list. Listeners added here are inbound only.</p>
          </div>
          <div class="form-group">
            <label for="role">Role Name</label>
            <select class="form-control input-sm" id="role" 
                    [(ngModel)]="context.role" required
                    [ngModelOptions]="{standalone: true}">                   
              <option [value]="role.id"                     
                      *ngFor="let role of userRoles" >{{role.name}}</option>
            </select>            
            <div>
			  <span *ngIf="!context.role || context.role === '-1'" style="color: darkred; margin-left: 15px;">You must assign a role</span>
			</div>  
          </div>
          <div class="checkbox" *ngIf="context.role != 'LISTENER', 'Listener'">
            <label>
              <input type="checkbox"
                     [(ngModel)]="context.hasPin"
                     [ngModelOptions]="{standalone: true}"> User Has Inbound PIN
            </label>
          </div>
          <div class="form-group" *ngIf="context.role != 'LISTENER', 'Listener'">
            <label for="emailAddress">Reporting Email Address</label>
            <input type="text" class="form-control input-sm" id="emailAddress"
                   [(ngModel)]="context.emailAddress"
                   [ngModelOptions]="{standalone: true}">
          </div>
          <div class="checkbox" *ngIf="context.role === 'LISTENER', 'Listener'">
            <label>
              <input type="checkbox"
                     [(ngModel)]="context.hasPin"
                     [disabled]=true
                     [ngModelOptions]="{standalone: true}"> User Has Inbound PIN
            </label>
          </div>
          <div class="checkbox" *ngIf="context.role === 'LISTENER', 'Listener'">
            <label>
              <input type="checkbox"
                     [(ngModel)]="context.webListener"
                     [ngModelOptions]="{standalone: true}"> Create web listener
            </label>
          </div>
          <div class="checkbox" *ngIf="context.role === 'LISTENER', 'Listener'">
            <label>
              <input type="checkbox"
                     [(ngModel)]="context.listenerHandRaised"
                     [ngModelOptions]="{standalone: true}"> Hand raised listener
            </label>
          </div>
          <div *ngIf="context.listenerHandRaised && context.nonInteractiveListener" >
          <p style="color: darkred">A non-interactive listener cannot raise their hand!</p>
          </div>
          <div class="checkbox" *ngIf="context.role === 'LISTENER', 'Listener'">
            <label>
              <input type="checkbox"
                     [(ngModel)]="context.nonInteractiveListener"
                     [ngModelOptions]="{standalone: true}"> Non-interactive listener
            </label>
          </div>
        </div>
        <div class="panel-footer text-right">          
          <button type="submit" class="btn btn-primary"
                  [disabled]="isCreating"
                  [disabled]="(context.listenerHandRaised && context.nonInteractiveListener) || (!context.role || context.role == '-1')">Done</button>
          <button type="button" class="btn btn-default"
                  [disabled]="isCreating"
                  (click)="clear()">Clear</button>
           <button type="button" class="btn btn-default"
                  [disabled]="isCreating"
                  (click)="closeDialog($event)">Cancel</button>
        </div>
      </div>
    </form>
  `
})
export class RoleModal implements OnInit, ModalComponent<RoleModalContext> {

    context: RoleModalContext;
    userRoles: UserRole[] = [];
    isCreating: boolean = false;
    errorMsg: string;

    constructor(public dialog: DialogRef<RoleModalContext>,
                private roleService: RoleService) {
    }

    ngOnInit() {
        this.userRoles = [
            {id: "-1",          name: "--Select Role--"},
            {id: "MOD",         name: "Moderator"},
            {id: "HOST",        name: "Host"},
            {id: "SCREENER",    name: "Screener"},
            {id: "SCRNMGR",     name: "Screener Manager"},
            {id: "LISTENER",    name: "Listener"},
        ];

        this.context = Object.assign({hasPin: true}, this.dialog.context);

    }

    formSubmit(event): void {
        event.preventDefault();

        if (this.context.role) {
            this.isCreating = true;

            if (this.context.pin) {
                this.updateRole();
            } else {
                this.createRole();
            }
        }
    }

    private createRole(): void {
        this.roleService.pinLookup().then(response => {
            let user = {
                userId: -1,
                pin: response['data']['pin'],
                firstName: this.context.firstName,
                lastName: this.context.lastName,
                role: this.context.role,
                phoneNo: this.context.phoneNo,
                emailAddress: this.context.emailAddress,
                webListener: this.context.webListener,
                listenerHandRaised: this.context.listenerHandRaised,
                nonInteractiveListener: this.context.nonInteractiveListener,
                profilePictureURL: null,
                donationsAccepted: this.context.donationsAccepted,
            };

            this.dialog.close(user);

            /*this.roleService.userCreate(this.context.hostScheduleId, user)
                .then(response => {
                    this.dialog.close(response);
                }, () => {
                    this.isCreating = false;
                });*/
        }, (msg) => {
            this.isCreating = false;
            this.errorMsg = msg;
        });
    }

    private updateRole(): void {
        let user = {
            userId: this.context.userId,
            pin: this.context.pin,
            firstName: this.context.firstName,
            lastName: this.context.lastName,
            role: this.context.role,
            phoneNo: this.context.phoneNo,
            emailAddress: this.context.emailAddress,
            webListener: this.context.webListener,
            listenerHandRaised: this.context.listenerHandRaised,
            nonInteractiveListener: this.context.nonInteractiveListener,
            profilePictureURL: null,
            donationsAccepted: this.context.donationsAccepted,

        };

        this.dialog.close(user);

        /*this.roleService.userUpdate(this.context.pin, this.context.hostScheduleId,user).then(response => {
            this.dialog.close(response);
        }, (msg) => {
            this.isCreating = false;
            this.errorMsg = msg;
        });*/
    }

    closeDialog(event): void {
        this.dialog.close();
    }

    clear(): void {
        this.context.firstName = '';
        this.context.lastName = '';
        this.context.emailAddress = '';
        this.context.phoneNo = '';
        this.context.hasPin = true;
        this.context.role = '-1';
        this.context.webListener = false;
        this.context.listenerHandRaised = false;
        this.context.nonInteractiveListener = false;
        this.context.donationsAccepted = false;

    }
}
