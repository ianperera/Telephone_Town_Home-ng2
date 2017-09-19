import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {AuthService} from '../../auth.service';
import {ConferenceModules} from './../../components/calendar/conference.datatypes';

@Component({
    styles:[`a:hover{cursor: pointer}`],
    selector: 'app-topnav',
    templateUrl: 'shared/topnav/topnav.tmpl.html'
})
export class TopnavComponent implements OnInit {

    authUser: any = null;
    showTopLinks: boolean;
    isSetupActive: boolean = false;
    isControlActive: boolean = false;
    isListenActive: boolean = false;
    isReportActive: boolean = false;

    constructor(private router: Router,
                private authService: AuthService) {
    }

    ngOnInit() {
        if (this.authService.sessionId) {
            this.authService.validateSession()
                .then(() => {
                    this.authService.getAuthUser()
                        .then(response => {
                            this.authUser = response
                        });
                })
                .catch(() => {
                    this.authService.logout()
                        .then(() => {
                            this.authUser = null;
                            this.router.navigateByUrl('/login');
                        });
                });
        }

        this.showTopLinks = true;
        this.setNavbarActive();
    }

    setNavbarActive() {
        this.isSetupActive = false;
        this.isControlActive = false;
        this.isListenActive = false;
        this.isReportActive = false;

        if (this.router.url.indexOf('/admin') > -1) {
            this.isSetupActive = true;
        }
        else if (this.router.url.indexOf('/control') > -1) {
            this.isControlActive = true;
        }
        else if (this.router.url.indexOf('/listen') > -1) {
            this.isListenActive = true;
        }
        else if (this.router.url.indexOf('/report') > -1) {
            this.isReportActive = true;
        }
    }

    navigate(module): void{
        if(module=='')
            return;

        if(module==ConferenceModules[ConferenceModules.setup]){
            this.router.navigateByUrl('/admin/calendar');
            return;
        }
        if(module==ConferenceModules[ConferenceModules.control]){
            this.router.navigateByUrl('/control/maincontrol');
            return;
        }
        if(module==ConferenceModules[ConferenceModules.listen]){
            this.router.navigateByUrl('/listen');
            return;
        }
        if(module==ConferenceModules[ConferenceModules.report]){
            this.router.navigateByUrl('/report');
            return;
        }
    }

    logout(event: Event): void {
        event.preventDefault();

        this.authService.logout()
            .then(() => {
                this.authUser = null;
                var module = null;
                if (this.isSetupActive) {
                    module = ConferenceModules[ConferenceModules.setup];
                }
                if (this.isControlActive) {
                    module = ConferenceModules[ConferenceModules.control];
                }
                if (this.isListenActive) {
                    module = ConferenceModules[ConferenceModules.listen];
                }
                if (this.isReportActive) {
                    module = ConferenceModules[ConferenceModules.report];
                }

                this.router.navigateByUrl('/login/' + module);
            });
    }

}
