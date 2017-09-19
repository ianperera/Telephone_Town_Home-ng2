import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import 'rxjs/add/operator/toPromise';
import {Modal, BSModalContext} from 'angular2-modal/plugins/bootstrap';
import {overlayConfigFactory} from 'angular2-modal';
import {CalendarLoadingModalContext, CalendarLoadingModal} from '../../calendar-loading-modal';

import {AuthService} from '../../../../auth.service';
import {RequestHelperService} from '../../../../request-helper.service';
import {ConferenceSetup} from "../../conference.datatypes";
//import * as AppConfig from '../../../../AppConfig';

@Component({
    selector: 'app-event-call-id',
    templateUrl: 'components/calendar/event-edit/call-id/call-id.tmpl.html'
})
export class CallIdComponent implements OnInit {
    @Input() event: ConferenceSetup;
    @Output() notify: EventEmitter<string> = new EventEmitter<string>();

    called_ids: any[] = [];
    called_ids_dp: any[] = [];
    lookup_results: any[] = [];
    states: any[] = [];
    inbound_routing: string = '';
    selected_called_id: string = '';
    prefixes: string = "";
    selected_state: string = "";
    tollFree: boolean = false;

    constructor(private authService: AuthService,
                private requestHelperService: RequestHelperService,
                private modal: Modal) {
    }

    ngOnInit() {
        this.setRoutingVal();

        var appSig = APP_SIG;
        var sessionId = this.authService.sessionId;
        var hostId = this.event['hostScheduleId'];
        console.log(sessionId);

        var api_url = API_BASE_URL + "/api_telapp_conference/rest/json/aniList/" + hostId + "?appSig=" + appSig + "&sid=" + sessionId;
        this.requestHelperService.requestGet(api_url)
            .then((response: any) => {
                this.called_ids = response.data;
                this.setCallIdDp();
                // if (response.data.length > 0) {
                //     this.event.aniMain = this.selected_called_id = this.called_ids[0];
                // }
            });

        var state_api = API_BASE_URL + '/api_telapp_sec/rest/json/lookupCodeSetups?appSig=' + appSig + '&sid=' + sessionId + '&codeGroups=["USSTATES"]';
        this.requestHelperService.requestGet(state_api)
            .then((response: any) => {
                var state_list = [];
                var states = response.data["USSTATES"];
                // window.states = states;
                for (var state in states) {
                    // var options = states[state]["options"];
                    // var option_list = options.split(" ");
                    var key = states[state]["key"];
                    var value = states[state]["value"];
                    state_list.push({"key": key, "value": value});
                    // break;

                }
                this.states = state_list;
            });
    }

    private onLookupChange(lookup_value): void {
        var called_ids = this.called_ids;
        this.called_ids = [];
        var lookup_value_list = lookup_value.split();
        var all_values = lookup_value_list.concat(called_ids);
        this.called_ids = all_values;
        this.event.aniMain = lookup_value;
        this.setCallIdDp();
        // this.called_ids = lookup_value.split().concat(this.called_ids);

    }

    setCallerId(e): void {
//        this.event.aniMain = e.target.value;
        this.event.aniMain = e;
        this.triggerChange();
    }

    private loadTableWithPrefix(): void {
        if (this.prefixes.length == 0 && this.selected_state == "" && this.tollFree == false) {
            alert("You must specify a search parameter");
            return;
        }

        var prefixe_list = this.prefixes.split(",");
        var passing_prefix_value = "[" + prefixe_list.toLocaleString() + "]";
        var appSig = APP_SIG;
        var sessionId = this.authService.sessionId;

        // For conferencing, we currently only support looking up by state, toll free, or prefix
        var api_url = API_BASE_URL + '/api_telapp_vb/rest/json/lookupRoutableNumberByQueryPar?appSig=' + appSig + '&sid=' + sessionId + '&queryParam={"prefixes":' + passing_prefix_value + ',"maxResults":10}';
        if (this.selected_state != "") {
            api_url = API_BASE_URL + '/api_telapp_vb/rest/json/lookupRoutableNumberByQueryPar?appSig=' + appSig + '&sid=' + sessionId + '&queryParam={"state":"' + this.selected_state + '","maxResults":10}';
        }

        if (this.tollFree == true) {
            api_url = API_BASE_URL + '/api_telapp_vb/rest/json/lookupRoutableNumberByQueryPar?appSig=' + appSig + '&sid=' + sessionId + '&queryParam={"tollFree":"' + this.tollFree + '","maxResults":10}';
        }

        this.modal.open(CalendarLoadingModal, overlayConfigFactory({message: "Getting Routable Number..."}, BSModalContext))
            .then(dialog => {
                this.requestHelperService.requestGet(api_url)
                    .then((response: any) => {
                        dialog.dismiss();
                        setTimeout(()=>{
                            this.lookup_results = response.data;
                        },200);
                    });
            });
    }

    setCallIdDp() {
        let dp_vals = [];
            this.called_ids.forEach((val)=>{
                dp_vals.push({label: val, value: val});
            });
        this.called_ids_dp = dp_vals;
    }

    triggerChange() {
            this.notify.emit('eventObject');
       }

    SetRouted(): void{
        this.updateRoutingVal('routed');
        this.setRoutingVal();
    }

    SetToll(): void{
        this.prefixes = '';
        this.selected_state = '';
    }

    SetPrefixes(): void{
        this.tollFree = false;
        this.selected_state = '';
    }

    SetStates(): void{
        this.prefixes = '';
        this.tollFree = false;
    }

    clearCallId(): void {
        this.prefixes = '';
        this.selected_state = '';
        this.lookup_results = [''];
        this.tollFree = false;
    }


    setRoutingVal(): void {
        console.log("Call-Id component event: ", this.event);
        if (this.event.aniRouted === true &&
            this.event.parkInbound === false &&
            this.event.parkInboundDisabled === false &&
            this.event.inboundListeners === true) {
            this.inbound_routing = 'routed';
        } else if (this.event.aniRouted === false &&
                   this.event.parkInbound === false &&
                   this.event.parkInboundDisabled === false &&
                   this.event.inboundListeners === false) {
            this.inbound_routing = 'not_routed';
        } else if (this.event.aniRouted === false &&
                   this.event.parkInbound === true &&
                   this.event.parkInboundDisabled === false) {
            this.inbound_routing = 'parked';
        } else if (this.event.aniRouted === false &&
                   this.event.parkInbound === true &&
                   this.event.parkInboundDisabled === true) {
            this.inbound_routing = 'parked_disconnected';
        }
    }

    updateRoutingVal(val): void {
        switch (val) {
            case 'routed':
                this.event.aniRouted = true;
                this.event.parkInbound = false;
                this.event.parkInboundDisabled = false;
                this.event.inboundListeners = true;
                break;
            case 'not_routed':
                this.event.aniRouted = false;
                this.event.parkInbound = false;
                this.event.parkInboundDisabled = false;
                this.event.inboundListeners = false;
                break;
            case 'parked':
                this.event.aniRouted = false;
                this.event.parkInbound = true;
                this.event.parkInboundDisabled = false;
                break;
            case 'parked_disconnected':
                this.event.aniRouted = false;
                this.event.parkInbound = true;
                this.event.parkInboundDisabled = true;
                break;
        }
    }
}

