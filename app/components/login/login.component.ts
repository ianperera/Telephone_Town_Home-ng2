import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {Modal} from 'angular2-modal/plugins/bootstrap';

import {AuthService} from '../../auth.service';
import {
    ConferenceModules
} from './../calendar/conference.datatypes';

@Component({
    selector: 'app-login',
    styleUrls: ['css/style.css'],
    templateUrl: 'components/login/loginComponent.tmpl.html'

})
export class LoginComponent implements OnInit {

    constructor(private router: Router,
                private authService: AuthService,
                private modal: Modal,
                private activatedRoute: ActivatedRoute) {
    }

    private showUsernamePassword: boolean = true;
    private board: string=null;

    ngOnInit() {
        console.log('Opening login');
        this.activatedRoute
            .params
            .subscribe((param:any) => {

                if(param && param.board) {
                    this.board = param.board.toLowerCase();

                    switch(this.board){
                        case ConferenceModules[ConferenceModules.setup]:
                            this.showUsernamePassword=true;
                            break;
                        case ConferenceModules[ConferenceModules.control]:
                            this.showUsernamePassword=false;
                            break;
                        case ConferenceModules[ConferenceModules.listen]:
                            this.showUsernamePassword=false;
                            break;
                        case ConferenceModules[ConferenceModules.report]:
                            this.showUsernamePassword=true;
                            break;
                        default:
                            this.showUsernamePassword=true;
                            break;
                    }
                }
            });
    }

    ngAfterViewInit() {
        this.activatedRoute.queryParams.subscribe(
            (data: any) => {
                if (data && 'event' in data && data.event === 'session') {
                    this.modal.alert().title('Session Event').body(`
                    <p>Disconnected due to session timeout</p>            
                    `).open().then(dialog => {
                    });
                }
            }
        );

        let flash_msg = sessionStorage.getItem('flash_msg');
        if (flash_msg) {
            this.modal.alert()
                .title('Error')
                .body(flash_msg)
                .open()
                .then(dialog => {
                    sessionStorage.removeItem('flash_msg');
                });
        }
    }


    togglePin() {
        this.showUsernamePassword = !this.showUsernamePassword;
        console.log("toggling pin: ", this.showUsernamePassword);
    }

    login(event: Event,
          username: string,
          password: string,
          pin: string): void {
        event.preventDefault();

        this.authService.login(username, password, pin)
            .then(response => {
                if(this.board==ConferenceModules[ConferenceModules.control]){
                    this.router.navigateByUrl('/control/maincontrol');
                }
                else if (this.board == ConferenceModules[ConferenceModules.listen]){
                    this.router.navigateByUrl('/listen');
                         }
                else if (this.board == ConferenceModules[ConferenceModules.report]){
                    this.router.navigateByUrl('/report');
                         }
                else {
                    this.router.navigateByUrl('/admin/calendar');
                }
            }).catch(msg => {
            this.modal.alert().title('Logging In').body(`
                    <p>${msg}</p>`).open().then(dialog => {
            });
        });
    }

}
