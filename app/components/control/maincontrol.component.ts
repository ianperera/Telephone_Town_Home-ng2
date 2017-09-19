import {Component, OnInit, OnDestroy} from '@angular/core';
import {EventService} from "../../shared/event-streamer/events.service";
import {Subscription} from "rxjs";
import {MainControlService} from './maincontrol.service';
import {Modal} from 'angular2-modal/plugins/bootstrap';
import * as EventTypes from '../../shared/event-streamer/event.interfaces';
import {Router} from "@angular/router";
import {AuthService} from "../../auth.service";
import {ConferenceModules} from "../calendar/conference.datatypes";

@Component({
    selector: 'app-maincontrol',
    templateUrl: 'components/control/mainControlComponent.tmpl.html'
})
export class MainControlBoardComponent implements OnInit, OnDestroy {

    renderHost: boolean     =   false;
    renderMod: boolean      =   false;
    renderScreener: boolean =   false;

    pin;

    private eventSubscription: Subscription;
    private eventList: Array<EventTypes.IStreamEvent> = [];

    constructor(private mainControlService: MainControlService,
                private eventService: EventService,
                private authService: AuthService,
                private router: Router,
                private modal: Modal) {
    }

    ngOnInit() {
        // In here is where I'll dispatch the start polling


        this.mainControlService.getMyPin().then((pin:any) => {
            console.log(pin);
            this.pin = pin;
            this.mainControlService.getCurrentConference().then((res: any) => {

                //If there is no error then going to UI by PIN
                switch(pin.data.role){
                    case "HOST":
                        this.renderHost=true;
                        break;
                    case "MOD":
                        this.renderMod=true;
                        break;
                    case "SCREENER":
                        this.renderScreener=true;
                        break;
                    default:
                        this.renderHost=true;
                        break;
                }

            }).catch((msg: string) => {
                sessionStorage.setItem('flash_msg', msg);
                this.authService.logout()
                    .then(() => {
                        this.router.navigateByUrl('/login/' + ConferenceModules[ConferenceModules.control]);
                    });
            });


        }).catch(err => {  });
    }

    ngOnDestroy() {
        // Here is where I'll dispatch the polling end
    }

    doRefreshStream(event) {
        console.log('refreshing stream!');
        console.log(this.pin);
        this.renderHost = this.renderMod = this.renderScreener = false;

        setTimeout(() => {
            switch (this.pin.data.role) {
                case "HOST":
                    this.renderHost = true;
                    break;
                case "MOD":
                    this.renderMod = true;
                    break;
                case "SCREENER":
                    this.renderScreener = true;
                    break;
                default:
                    this.renderHost = true;
                    break;
            }

        }, 0);

    }
}