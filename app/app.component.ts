import {Component, OnInit} from '@angular/core';
import {AuthService} from './auth.service';

@Component({
    selector: 'my-app',
    template: '<router-outlet></router-outlet>'
})
export class AppComponent  implements OnInit {

    constructor(private authService: AuthService) {
        if (this.authService.sessionId) {
            this.authService.startSessionExpireTimer(this.authService.sessionId);
        }

    }

    ngOnInit() {

    }
}
