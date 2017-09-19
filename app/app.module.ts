import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {TextMaskModule} from 'angular2-text-mask';
import {SplitPaneModule} from 'ng2-split-pane/lib/ng2-split-pane';
import {NgxPaginationModule} from 'ngx-pagination';
import {TooltipModule} from "ngx-tooltip";
//import {PolymerElement} from '@vaadin/angular2-polymer';

// Ngrx Modules
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {EventsEffects} from './store/events/events.effects';
import {ParticipantEffects} from './store/participants/participants.effects';
import {ChatEffects} from './store/chat/chat.effects';
import {ConferenceEffects} from './store/conference/conference.effects';
import {PollsEffects} from './store/polls/polls.effects';
import {reducer} from './store';

// Modal Module
import {ModalModule} from 'angular2-modal';
import {VexModalModule} from 'angular2-modal/plugins/vex';
import {BootstrapModalModule} from 'angular2-modal/plugins/bootstrap';

// Calendar Module
import {CalendarModule} from 'angular-calendar';

import { StarRatingModule } from 'angular-star-rating';

// Routing Module
import {AppRoutingModule} from './app-routing.module';
import {ChartsModule} from 'ng2-charts';

// Services
import {AuthService} from './auth.service';
import {RequestHelperService} from './request-helper.service';
import {CalendarService} from './components/calendar/calendar.service';
import {RoleService} from './components/calendar/event-edit/role/role.service';
import {AudioService} from './components/calendar/event-edit/audio/audio.service';
import {AdvanceSettingService} from './components/calendar/event-edit/advance-setting/advance-setting.service';
import {CallIdService} from './components/calendar/event-edit/call-id/call-id.service';
import {DonationService} from './components/calendar/event-edit/donation/donation.service';
import {OtherSchedulesService} from './components/calendar/event-edit/other-schedules/other-schedules.service';
import {PhoneListService} from './components/calendar/event-edit/phone-list/phone-list.service';
import {PollService} from './components/calendar/event-edit/poll/poll.service';
import {SessionValidationService} from './sessionValidation.service';
import {EventService} from './shared/event-streamer/events.service';
import {ConfigService} from './services/config';
import {EndpointsService} from './services/endpoints';

// Setup Components
import {AppComponent} from './app.component';
import {LoginComponent} from './components/login/login.component';
import {HomeComponent} from './components/home/home.component';
import {AdminComponent} from './components/admin/admin.component';
import {CalendarComponent} from './components/calendar/calendar.component';
import {CalendarConferenceModal} from './components/calendar/calendar-conference-modal';
import {CalendarConferenceDuplicateModal} from './components/calendar/calendar-conference-duplicate-modal';
import {CalendarExitConfirmModal} from './components/calendar/calendar-exit-confirm-modal';
import {CalendarLoadingModal} from './components/calendar/calendar-loading-modal';
import {FileUploadProgressModal} from './components/calendar/event-edit/phone-list/file-upload-progress-modal';
import {TopnavComponent} from './shared/topnav/topnav.component';
import {EventEditComponent} from './components/calendar/event-edit/event-edit.component';
import {PhoneListComponent} from './components/calendar/event-edit/phone-list/phone-list.component';
import {CallIdComponent} from './components/calendar/event-edit/call-id/call-id.component';
import {AudioComponent} from './components/calendar/event-edit/audio/audio.component';
import {AudioModal} from './components/calendar/event-edit/audio/audio.modal';
import {PollComponent} from './components/calendar/event-edit/poll/poll.component';
import {AdvanceSettingComponent} from './components/calendar/event-edit/advance-setting/advance-setting.component';
import {DonationComponent} from './components/calendar/event-edit/donation/donation.component';
import {RoleComponent} from './components/calendar/event-edit/role/role.component';
import {RoleModal} from './components/calendar/event-edit/role/role-modal';
import {OtherSchedulesComponent} from './components/calendar/event-edit/other-schedules/other-schedules.component';
import {AudioFileUploadModal} from './components/calendar/event-edit/audio/audio-file-upload-modal';
import {TaskControlModal} from './components/calendar/event-edit/phone-list/task-control/task-control-modal';
import {TaskControlService} from './components/calendar/event-edit/phone-list/task-control/task-control.service';

//Control Components
import {HostControlBoardComponent} from './components/control/host/hostcontrolboard.component';
import {ModControlBoardComponent} from './components/control/moderator/modcontrolboard.component';
import {ScreenerControlBoardComponent} from './components/control/screener/screenercontrolboard.component';
import {MainControlBoardComponent} from './components/control/maincontrol.component';
import {EventStreamingComponent} from "./components/control/event-streaming.component";
import {BasicControlComponent} from "./components/control/control-components/basic-control/basic-control.component";
import {ChatComponent} from "./components/control/control-components/chat/chat.component";
import {AudioComponent as ControlAudioComponent} from "./components/control/control-components/audio/audio.component";
import {PollingComponent} from "./components/control/control-components/polling/polling.component";
import {ListenersComponent} from "./components/control/control-components/listeners/listeners.component";
import {CallListenerComponent} from "./components/control/control-components/call-listener/call-listener.component";
import {CallParticipantComponent} from "./components/control/control-components/call-participant/call-participant.component";
import {QueryComponent} from "./components/control/control-components/query/query.component";
import {CallProgressComponent} from "./components/control/control-components/call-progress/call-progress.component";
import {ParticipantsComponent} from './components/control/control-components/participants/participants.component';
import {ParticipantsPanelComponent} from './components/control/control-components/participants/participants.panel';
import {ParticipantsItemComponent} from './components/control/control-components/participants/participants.item';
import {ParticipantsEditComponent} from './components/control/control-components/participants/participants.edit';
import {LiveQuestionsComponent} from './components/control/control-components/live-questions/live-questions.component';
import {LiveTableQuestionsComponent} from './components/control/control-components/live-questions/live-questions-table.component';
import {RaisedHandComponent} from './components/control/control-components/raisedhand/raisedhand.component';
import {OnDeckComponent} from './components/control/control-components/ondeck/ondeck.component';
import {ScreenedComponent} from './components/control/control-components/screened/screened.component';

//Control Services
import {BasicControlService} from "./components/control/control-components/basic-control/basic-control.service";
import {ChatService} from "./components/control/control-components/chat/chat.service";
import {AudioService as ControlAudioService} from "./components/control/control-components/audio/audio.service";
import {PollingService} from "./components/control/control-components/polling/polling.service";
import {CallListenerService} from "./components/control/control-components/call-listener/call-listener.service";
import {CallParticipantService} from "./components/control/control-components/call-participant/call-participant.service";
import {QueryService} from "./components/control/control-components/query/query.service";
import {CallProgessService} from "./components/control/control-components/call-progress/call-progress.service";

// Component of Listener
import {ListenComponent} from './components/listen/listen.component';

// Component of Report
import {ReportComponent} from './components/report/report.component';
import {MainControlService} from './components/control/maincontrol.service';
import {LiveQuestionService} from "./components/control/control-components/live-questions/live-question.service";
import {LiveQuestionEditComponent} from "./components/control/control-components/live-questions/live-questions-edit.component";
import {LiveQuestionEditModal} from "./components/control/control-components/live-questions/live-questions-edit.modal";
import {QuestionUpdateEffects} from "./store/question-update/question-update.effects";
import {OnDeckEditComponent} from "./components/control/control-components/ondeck/ondeck-edit.component";
import {OnDeckEditModal} from "./components/control/control-components/ondeck/ondeck-edit.modal";
import {RaisedHandEditComponent} from "./components/control/control-components/raisedhand/raisedhand-edit.component";
import {RaisedHandEditModal} from "./components/control/control-components/raisedhand/raisedhand-edit.modal";
import {ScreenedEditModal} from "./components/control/control-components/screened/screened-edit.modal";
import {ScreenedEditComponent} from "./components/control/control-components/screened/screened-edit.component";


@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        HttpModule,
        FormsModule,
        AppRoutingModule,
        // Modal
        ModalModule.forRoot(),
        VexModalModule,
        BootstrapModalModule,
        // Calendar
        CalendarModule.forRoot(),
        ChartsModule,
        TextMaskModule,
        SplitPaneModule,
        // Redux Store
        StoreModule.provideStore(reducer),
        StoreDevtoolsModule.instrumentOnlyWithExtension(),
        EffectsModule.run(EventsEffects),
        EffectsModule.run(ParticipantEffects),
        EffectsModule.run(ChatEffects),
        EffectsModule.run(ConferenceEffects),
        EffectsModule.run(PollsEffects),
        EffectsModule.run(QuestionUpdateEffects),
        NgxPaginationModule,
        TooltipModule,
        StarRatingModule.forRoot(),
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        HomeComponent,
        AdminComponent,
        CalendarComponent,
        CalendarConferenceModal,
        CalendarConferenceDuplicateModal,
        CalendarExitConfirmModal,
        CalendarLoadingModal,
        FileUploadProgressModal,
        RoleComponent,
        RoleModal,
        TopnavComponent,
        EventEditComponent,
        PhoneListComponent,
        CallIdComponent,
        AudioComponent,
        AudioModal,
        AudioFileUploadModal,
        PollComponent,
        AdvanceSettingComponent,
        DonationComponent,
        OtherSchedulesComponent,
        HostControlBoardComponent,
        ModControlBoardComponent,
        ScreenerControlBoardComponent,
        MainControlBoardComponent,
        TaskControlModal,
        ListenComponent,
        ReportComponent,
        EventStreamingComponent,
        ChatComponent,
        ControlAudioComponent,
        BasicControlComponent,
        PollingComponent,
        ListenersComponent,
        CallListenerComponent,
        CallParticipantComponent,
        ParticipantsComponent,
        ParticipantsPanelComponent,
        ParticipantsItemComponent,
        ParticipantsEditComponent,
        QueryComponent,
        CallProgressComponent,
        LiveQuestionsComponent,
        LiveTableQuestionsComponent,
        RaisedHandComponent,
        RaisedHandEditComponent,
        RaisedHandEditModal,
        OnDeckComponent,
        OnDeckEditComponent,
        OnDeckEditModal,
        ScreenedComponent,
        ScreenedEditComponent,
        ScreenedEditModal,
        LiveQuestionEditComponent,
        LiveQuestionEditModal,
        //PolymerElement('vaadin-split-layout')
    ],
    bootstrap: [AppComponent],
    providers: [
        AuthService,
        RequestHelperService,
        CalendarService,
        RoleService,
        AudioService,
        AdvanceSettingService,
        CallIdService,
        DonationService,
        OtherSchedulesService,
        PhoneListService,
        PollService,
        TaskControlService,
        SessionValidationService,
        EventService,
        MainControlService,
        ChatService,
        ControlAudioService,
        BasicControlService,
        PollingService,
        CallListenerService,
        CallParticipantService,
        ConfigService,
        EndpointsService,
        QueryService,
        CallProgessService,
        LiveQuestionService,
    ],
    entryComponents: [
        CalendarConferenceModal,
        CalendarConferenceDuplicateModal,
        CalendarExitConfirmModal,
        CalendarLoadingModal,
        FileUploadProgressModal,
        RoleModal,
        AudioModal,
        AudioFileUploadModal,
        TaskControlModal,
        LiveQuestionEditModal,
        OnDeckEditModal,
        RaisedHandEditModal,
        ScreenedEditModal,
    ],
    //schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule {
}
