import {Component, Input, OnInit, ViewChild, ElementRef} from '@angular/core';
import {ControlListener, querySearch} from "../../control.datatypes";
import {QueryService} from "./query.service";
import {Modal} from "angular2-modal/plugins/bootstrap";
import {PaginationInstance} from 'ngx-pagination';

@Component({
    selector: 'app-query',
    templateUrl: 'components/control/control-components/query/query.tmpl.html',
    styleUrls: ['components/control/control-components/query/query.css']
})
export class QueryComponent implements OnInit {

    @ViewChild('filterListener') elQuestionName: ElementRef;

    timestamp: number;
    queries: any [];
    querySearch: querySearch = {
        filter: '',
        hasQuestion: false,
        hasPrevious: false,
        state: 0,
        callType: 0
    };
    selectedUser: ControlListener;
    selectedUserIndex: number;

    constructor(private queryService: QueryService,
                private modal: Modal) {
    }

    ngOnInit() {
    }

    selectUser(user, index) {
        this.selectedUser = user;
        this.selectedUserIndex = index;
    }

    pagination: PaginationInstance = {
        itemsPerPage: this.queryService.queryPageSize,
        totalItems: 0,
        currentPage: 1
    };


    clearSelectedUser() {
        this.selectedUser = null;
        this.selectedUserIndex = null;
    }

    // Search events based on input supplied
    filterQuery(e): void {
        console.log('event val', e.target.value);
        this.querySearch.filter = e.target.value;

        setTimeout(() => {
            this.listenerLookupForm();
        }, 0);
    }

    clearData(): void {
        this.elQuestionName.nativeElement.focus();
        this.querySearch.filter = '';
        this.querySearch.callType = 0;
        this.querySearch.state = 0;
        this.timestamp = null;
        this.queries = null;
        //this.listenerLookupForm();
    }

    listenerLookupForm() {
        this.queryService.listenerLookupForm(this.querySearch, this.pagination.currentPage).then((res: any) => {
            this.queries = res.data;
            let queries = [];

            this.queries.forEach((val, index) => {
                let query: any = Object.assign({}, val);
                query.callerId = query.callerId.replace('+1', '');
                queries.push(query);
            });

            this.queries = queries;

            this.pagination.totalItems = res.totalRecordCount;
            this.clearSelectedUser();
            console.log(res.data);
        }).catch((msg) => {
            this.modal.alert().title('Error').body(`${msg}`)
                .open()
                .then(dialog => {
                });
        });
    }

    raiseHandData(): boolean {
        if (!this.selectedUser) return false;

        this.queryService.raisedHand(this.selectedUser).then((res) => {
            console.log(res);
        }).catch((msg) => {
            this.modal.alert().title('Error').body(`${msg}`)
                .open()
                .then(dialog => {
                });
        });

    }

    bringlive(): boolean {
        if (!this.selectedUser) return false;

        this.queryService.bringListenertoLive(this.selectedUser).then((res) => {
            console.log(res);
        }).catch((msg) => {
            this.modal.alert().title('Error').body(`${msg}`)
                .open()
                .then(dialog => {
                });
        });
    }

    timestampQuery(): void {
        this.timestamp = Date.now();
    }

    pageChanged(page: number) {
        this.pagination.currentPage = page;
        this.listenerLookupForm();
    }

}