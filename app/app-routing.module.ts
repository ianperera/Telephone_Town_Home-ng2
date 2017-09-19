import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AuthService} from './auth.service';

import {HomeComponent} from './components/home/home.component';
import {LoginComponent} from './components/login/login.component';
import {AdminComponent} from './components/admin/admin.component';
import {CalendarComponent} from './components/calendar/calendar.component';
import {MainControlBoardComponent} from './components/control/maincontrol.component';
//import {EventStreamingComponent} from './components/control/event-streaming.component';
import {ListenComponent} from './components/listen/listen.component';
import {ReportComponent} from './components/report/report.component';

const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full', canActivate: [AuthService]},
    {path: 'home', component: HomeComponent},
    {path: 'login/:board', component: LoginComponent},
    {path: 'login', component: LoginComponent},
    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AuthService],
        children: [
            {path: 'calendar', component: CalendarComponent, canActivate: [AuthService]},
            {path: 'calendar/:view/:month/:day/:year', component: CalendarComponent, canActivate: [AuthService]},
        ]
    },
    {
        path: 'control/maincontrol',
        canActivate: [AuthService],
        //children: [{path: 'event-streaming', component: MainControlBoardComponent}]
        component: MainControlBoardComponent
    },
    {
        path:'listen',
        component: ListenComponent,
        canActivate: [AuthService]
    },
    {
        path:'report',
        component: ReportComponent,
        canActivate: [AuthService]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
