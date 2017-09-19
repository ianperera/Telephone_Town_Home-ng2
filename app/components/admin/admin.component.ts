import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {AuthService} from '../../auth.service';

@Component({
    selector: 'app-admin',
    styles: [`
        .navbar { border-radius: 0; }
    `],
    templateUrl: 'components/admin/adminCompenent.tmpl.html'
})
export class AdminComponent implements OnInit {

    authUser: any = null;

    constructor(private router: Router,
                private authService: AuthService) {
    }

    ngOnInit() {
        this.authService.validateSession()
            .then(() => {
                this.authService.getAuthUser()
                    .then(response => {
                        this.authUser = response
                    });
            });
    }
}
