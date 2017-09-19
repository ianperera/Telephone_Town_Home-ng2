import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import 'rxjs/add/operator/toPromise';

import {Modal, BSModalContext} from 'angular2-modal/plugins/bootstrap';
import {overlayConfigFactory} from 'angular2-modal';
import {CalendarLoadingModalContext, CalendarLoadingModal} from '../../calendar-loading-modal';

import {CalendarService} from '../../calendar.service';
import {FileUploadProgressModal} from './file-upload-progress-modal';
import {ConferenceSetup, ConferencePhoneList} from "../../conference.datatypes";
import {PhoneListService} from "./phone-list.service";
import {TaskControlModal} from "../../event-edit/phone-list/task-control/task-control-modal";

@Component({
    selector: 'app-event-phone-list',
    templateUrl: 'components/calendar/event-edit/phone-list/phone-list.tmpl.html',
    styleUrls: ['components/calendar/event-edit/phone-list/phone-list.css']
})
export class PhoneListComponent implements OnInit {
    @Input() event: ConferenceSetup;
    @Output() notify: EventEmitter<Array<any>> = new EventEmitter<Array<any>>();
    @Output() notifyChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    showLoadingImg = false;
    errorMsg: string;

    progressModal;
    progressPercent: number = 0;
    showProgress: boolean   = false;
    deleteModal;

    showPhoneList: boolean  = false;
    phoneListObject: any[]  = [];
    phoneListFormat: string = "";
    cbCheckedArray: any[]   = [];
    toggle: boolean         = false;
    //scrubWirelessValue: boolean = false;

    selectedRow : number = 100000;
    setClickedRow : Function;
    deletedIds: any[] = [];
    edited = false;

    constructor(private modal: Modal,
                private phoneListService: PhoneListService,
                private calendarService: CalendarService) {

        this.setClickedRow   = function(index){
            this.selectedRow = index;
        }
    }

    ngOnInit() {
        this.setPhoneListData(this.event, false);
    }

    uploadPhoneList(listType, event): void {
        console.log("event: ", event);
        console.log("event.target: ", event.target);
        if (event.target) {
            console.log("event.target.files: ", event.target.files);
        } else {
            console.log("event.target appears to be null");
        }

        this.checkFileFormat(event.target.files);
        if (this.phoneListFormat == "CSV" || this.phoneListFormat == "TXT" || this.phoneListFormat == "XLSX" || this.phoneListFormat == "XLS") {
            this.showProgress = true;
            let progress = this.phoneListService.getObserver();

            this.modal.open(FileUploadProgressModal,
                overlayConfigFactory({progressObserver: progress}, BSModalContext))
                .then(resultPromise => {
                    resultPromise.result.then(value => {
                        switch (value) {
                            case 'success':
                                this.modal.open(CalendarLoadingModal, overlayConfigFactory({message: "Uploading Phone List..."}, BSModalContext))
                                    .then(dialog => {
                                        //dialog.dismiss();
                                        setTimeout(()=> {
                                            //this.modal.alert().title('Upload complete')
                                            //.body('Please wait while server process your request!').open()
                                            //.then(dialog => {
                                            this.progressModal = dialog;
                                        },200);
                                    });
                                break;
                            case 'cancel':
                                this.stopUpload();
                                break;
                        }
                    });
                });

            this.errorMsg ='';
            let hostScheduleId = this.event.hostScheduleId;

            try {
                this.phoneListService.postFileContentToServer(hostScheduleId, listType, event.target.files).then(response => {
                    this.showProgress = false;

                    if (response.data.taskIds && response.data.taskIds.length > 0) {
                        this.progressModal.dismiss();
                        this.modal.open(TaskControlModal,
                            overlayConfigFactory({taskIds: response.data.taskIds, 'title': 'Phone List'}, BSModalContext))
                            .then(resultPromise => {
                                resultPromise.result.then(value => {
                                    console.log("value from result: ", value);
                                    // merge the values!
                                    this.calendarService.getConferenceEvent(String(hostScheduleId), false).then((response: any) => {
                                        console.log('task control done : refreshing setup object');
                                        this.setPhoneListData(response.data);
                                    });
                                });
                            });
                    } else {
                        //store the phone list read data in object and show it in modal
                        let fileInfo = response.data.importResult;

                        let conferenceSetup: ConferenceSetup = response.data.conferenceSetup;

                        conferenceSetup.phoneListsVipListener = conferenceSetup.phoneListsVipListener ? conferenceSetup.phoneListsVipListener : [];
                        conferenceSetup.phoneListsListener = conferenceSetup.phoneListsListener ? conferenceSetup.phoneListsListener : [];

                        //close the progress modal
                        this.progressModal.dismiss();
                        this.progressModal = null;

                        console.log("at modal event: ", event);
                        console.log("at modal event.target: ", event.target);
                        if (event.target) {
                            console.log("at modal event.target.files: ", event.target.files);
                        } else {
                            console.log("at modal event.target appears to be null");
                        }

                        //open the success modal and show the phone list entries details
                        this.modal.alert().title('File Upload').body('Upload File ' +
                            event.target.files[0].name + ' size (bytes):' +
                            event.target.files[0].size + ' - complete<br>' +
                            fileInfo.readCount + ' phone list entries read<br>' +
                            fileInfo.invalidCount + ' invalid phone list entries read<br>' +
                            fileInfo.duplicateCount + ' duplicate phone list entries read<br>' +
                            fileInfo.importCount + ' phone list entries imported').open();

                        this.setPhoneListData(conferenceSetup);

                        //set show phone list entries in form true.
                        this.showPhoneList = true;
                    }

                }, (response: string) => {
                    this.showProgress = false;

                    //close the progress modal
                    if (this.progressModal) {
                        this.progressModal.dismiss();
                        this.progressModal = null;
                        this.errorMsg = response;
                        this.modal.alert().title('Information').body('<p style="red;">'+this.errorMsg+'</p>').open();
                    }

                });
            } catch (error) {
                this.showProgress = false;

                //close the progress modal
                if (this.progressModal) {
                    this.progressModal.dismiss();
                    this.progressModal = null;
                    this.modal.alert().title('Error').body('Internal Server Error. Please try again later').open();
                }
            }

        /*} else if (this.phoneListFormat == "NO_FILE") {
            this.showProgress = false;
            this.modal.alert().title('File Upload').body('No File Selected!!').open();*/
        } else {
            this.showProgress = false;
            this.modal.alert().title('File Upload').body('Only csv, txt, xls or xlsx format files are accepted.').open();
        }
    }

    stopUpload(): void {
        this.phoneListService.stopPostFileContentToServer();
    }

    /**
     * Prepare phoneListObject to show data in table
     */
    setPhoneListData(event: ConferenceSetup, updateEvent:boolean = true) {
        console.log("setting phonelist data");

        // ensure that the event passed in at least has a list (even if it's empty)
        if (!event.phoneListsListener) {
            event.phoneListsListener = [];
        }

        if (!event.phoneListsVipListener) {
            event.phoneListsVipListener = [];
        }

        // update phonelist settings in the conference event:
        let phoneListsListener = this.event.phoneListsListener ? this.event.phoneListsListener : [];
        let phoneListsVipListener = this.event.phoneListsVipListener ? this.event.phoneListsVipListener : [];

        // merge in any updates from the upload
        for (let i:number = 0; i < event.phoneListsListener.length; i++) {
            let phoneList:ConferencePhoneList = event.phoneListsListener[i];
            let found:boolean = false;
            for (let j:number = 0; j < phoneListsListener.length; j++) {
                let oldPhonelist:ConferencePhoneList = phoneListsListener[j];
                if (phoneList.id == oldPhonelist.id) {
                    found = true;
                    break;
                }
            }
            if (!found && this.deletedIds.indexOf(phoneList.id) === -1) {
                // console.log("adding phonelist: ", phoneList);
                phoneListsListener.push(phoneList);
            }
        }

        for (let i:number = 0; i < event.phoneListsVipListener.length; i++) {
            let phoneList:ConferencePhoneList = event.phoneListsVipListener[i];
            let found:boolean = false;
            for (let j:number = 0; j < phoneListsVipListener.length; j++) {
                let oldPhonelist:ConferencePhoneList = phoneListsVipListener[j];
                if (phoneList.id == oldPhonelist.id) {
                    found = true;
                    break;
                }
            }
            if (!found && this.deletedIds.indexOf(phoneList.id) === -1) {
                // console.log("adding vip phonelist: ", phoneList);
                phoneListsVipListener.push(phoneList);
            }
        }

        if (updateEvent) {
            this.event.phoneListsListener = phoneListsListener;
            this.event.phoneListsVipListener = phoneListsVipListener;
        }

        // update the view
        this.phoneListObject = [];
        this.phoneListObject = this.phoneListObject.concat(phoneListsVipListener).concat(phoneListsListener);

        let phoneEntryCount :number = 0;

        for (let i:number = 0; i < this.phoneListObject.length; i++) {
            if (this.phoneListObject[i].type !== "SUPP") {
                // console.log("phonelist: ", this.phoneListObject[i]);
                phoneEntryCount += this.phoneListObject[i].phoneEntryCount;
            }
        }

        if (updateEvent) {
            console.log("setPhonelistData, entry count: " + phoneEntryCount);
            this.event.eventPhoneListSize = phoneEntryCount;
        }
    }


    checkFileFormat(files): void {

        if (files.length != 0) {

            let file = files[0];

            let nameParts = file.name.split('.');

            switch (nameParts[nameParts.length - 1]) {

                // For XLS File
                case 'xls':
                    this.phoneListFormat = "XLS";
                    return;

                // For CSV File
                case 'csv':
                    this.phoneListFormat = "CSV";
                    return;

                // For TXT File
                case 'txt':
                    this.phoneListFormat = "TXT";
                    return;

                // For XLSX File
                case 'xlsx':
                    this.phoneListFormat = "XLSX";
                    return;

                default:
                    this.phoneListFormat = "FILE_FORMAT_ERROR";
                    return;
            }
        }
    }

    toggleItem(phone): void {
        phone.checked = !phone.checked;
        this.toggle = this.phoneListObject.every(phone => phone.checked);
        if (!phone.checked) {
            let index = this.cbCheckedArray.indexOf(phone);
            this.cbCheckedArray.splice(index, 1);
        } else {
            let index = this.cbCheckedArray.indexOf(phone);
            if (index == -1) {
                this.cbCheckedArray.push(phone);
            }
        }
    }

    toggleAll(): void {
        this.toggle = !this.toggle;
        this.phoneListObject.forEach(phone => phone.checked = this.toggle)
    }

    SelectedList(event): void {

        if(this.selectedRow === 100000) {
            this.edited = true;
            console.log(this.edited);
            return;
        }
        else {
            this.edited = false;
            document.getElementById("deletebtn").click();

        }
    }


    deleteSelectedList(event): void {
        let removedItem = this.phoneListObject.splice(this.selectedRow, 1);
        this.deletedIds.push(removedItem[0].id);
        console.log(removedItem);
        let removed: boolean = false;

        for (let i: number = 0; i < this.event.phoneListsListener.length; i++) {
            if (this.event.phoneListsListener[i]['id'] === removedItem[0]['id']) {
                this.event.phoneListsListener.splice(i, 1);
                removed = true;
            }
        }

        if (!removed) {
            for (let i: number = 0; i < this.event.phoneListsVipListener.length; i++) {
                if (this.event.phoneListsVipListener[i]['id'] === removedItem[0]['id']) {
                    this.event.phoneListsVipListener.splice(i, 1);
                    removed = true;
                }
            }
        }

        let phoneEntryCount :number = 0;

        for (let i:number = 0; i < this.phoneListObject.length; i++) {
            if (this.phoneListObject[i].type !== "SUPP") {
                // console.log("phonelist: ", this.phoneListObject[i]);
                phoneEntryCount += this.phoneListObject[i].phoneEntryCount;
            }
        }

        this.event.eventPhoneListSize = phoneEntryCount;
        console.log("deleteSelectedList, phoneEntryCount = " + phoneEntryCount);

        if (removed) {
            this.notify.emit(this.phoneListObject);
            this.notifyChange.emit(true);
        }
    }


    deleteAllList(): void {
        let phoneLists: number[] = [];

        for (let i: number = 0; i < this.phoneListObject.length; i++) {
            phoneLists[i] = this.phoneListObject[i].id
        }

        this.event.phoneListsVipListener = [];
        this.event.phoneListsListener = [];
        this.phoneListObject = [];
        this.notify.emit(this.phoneListObject);

        this.phoneListService.deletePhoneList(this.event.conferenceId, JSON.stringify(phoneLists))
            .then(() => {
                    console.log("phonelist delete ok");
                },
                () => {
                    setTimeout(() => {
                        this.modal.alert().title('Error').body('Unable to delete phone lists. Please try again later!').open();
                    }, 200);
                });
    }
}
