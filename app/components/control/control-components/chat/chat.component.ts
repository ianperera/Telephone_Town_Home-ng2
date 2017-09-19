import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ChatService} from "./chat.service";
import {Modal} from "angular2-modal/plugins/bootstrap";

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { MinConversationMessage, ConversationMessage } from '../../../../models/chat';
import * as fromRoot from '../../../../store';
import * as fromChat from '../../../../store/chat/chat.actions';

@Component({
    selector: 'app-control-chat',
    styleUrls: ['components/control/control-components/chat/chat.css'],
    templateUrl: 'components/control/control-components/chat/chat.tmpl.html'
})

export class ChatComponent implements OnInit, AfterViewInit {
    @ViewChild('chatContainer') private chatContainer: ElementRef;

    protected chatHistory = [];
    protected message: string = '';
    protected nickname: string = '';
    protected priority: number = 0;
    protected latestTimeStamp: number = null;

    protected fontSize: number = 12; // default font size in `px`
    protected currentText: string = '';
    protected charsLeft: number = 160;

    chat$: Observable<ConversationMessage[]>;

    constructor(
        private chatService: ChatService,
        private modal: Modal,
        private store: Store<fromRoot.State>,
    ) {
        this.chat$ = this.store.select(fromRoot.getLatestChat(20)); // This observable will emit whenever chat events arrive
    }

    ngOnInit() {
        this.getChatHistory();
        this.getNickname();
    }

    ngAfterViewInit() {
        this.scrollToBottom();
    }

    getNickname() {
        this.chatService.getNickname().then((res: any) => {
            this.nickname = res.data;
        });
    }

    getChatHistory() {
        this.chatService.getchatHistory().then((res: any) => {
            let data = res.data;

            data.forEach((val) => {
                this.setFormattedTime(val);
            });

            this.chatHistory = data;

            if (this.chatHistory.length > 0) {
                this.latestTimeStamp = this.chatHistory[this.chatHistory.length - 1].messageTimestamp + 1000;
            } else {
                this.latestTimeStamp = 0;
            }

            this.scrollToBottom();
            // console.log('chat history : ', this.chatHistory);
        });
    }

    // Create a pipe that does this formatting
    private setFormattedTime(message) {
        let date = new Date(message.messageTimestamp);
        message.time = date.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true});
        return message;
    }

    newSendMessage(msg: MinConversationMessage): void {
        this.store.dispatch(new fromChat.ChatSendStart(msg));
    }

    sendMessage(priority: number) {
        // This is what you did before
        this.priority = priority;

        if (this.message.length === 0) return false; 

        this.chatService.sendchat(this.nickname, this.message, priority).then((res: any) => {
            this.message = '';
        });
    }

    showMessage(message) {
        // console.log('latest timestamp : ', this.latestTimeStamp);
        if (this.latestTimeStamp === null) return false;

        // console.log(message.messageTimestamp, this.latestTimeStamp);
        // console.log('comp res ', message.messageTimestamp > this.latestTimeStamp);
        if (message.messageTimestamp > this.latestTimeStamp) {
            if (message.priority === 2 && message.fromUserName !== this.nickname) {
                this.modal.alert()
                    .title(`Priority Message from ${message.fromUserName}`)
                    .body(`${message.fromUserName} : ${message.text}`).open()
                    .then(dialog => {
                    });

                this.setFormattedTime(message);
                this.chatHistory.push(message);
                this.scrollToBottom();

            } else {
                this.setFormattedTime(message);
                this.chatHistory.push(message);
                this.scrollToBottom();
            }
        } else {
            return false;
        }
    }

    fontSizeChange($val: number) {
        this.fontSize += $val;
    }

    DefaultfontSize(): void {
        this.fontSize = 12;
    }

    changed() {
        this.charsLeft = 160 - this.currentText.length;
    }

    scrollToBottom(): void {
        setTimeout(() => {
            try {
                this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
            } catch (err) {
                console.error('error in scrolling : ', err);
            }
        }, 0);
    }
}
