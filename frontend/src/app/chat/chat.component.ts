import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChatService, Message } from './chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [CommonModule, FormsModule, MatIconModule, MatTooltipModule],
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {

    @ViewChild('container') container!: ElementRef;

    messages: Message[] = []
    newMessage = '';
    waitingForResponse = false;
    connected = false;

    constructor(private wsService: ChatService) { }

    ngOnInit(): void {
        this.wsService.connect()
            .subscribe({
                next: (msg: Message) => {
                    this.waitingForResponse = false;
                    this.messages.push(msg);
                },
                error: (err: any) => {
                    this.messages.push({ channel: "error", text: "Błąd połączenia z serwerem.\nSpróbuj ponownie później." });
                    console.error(err);
                },
                complete: () => console.warn('Completed!')
            });
        this.wsService.connected().subscribe(connected => this.connected = connected);
    }

    ngOnDestroy(): void {
        this.wsService.disconnect();
    }

    sendMessage(): void {
        this.messages.push({ channel: "user", "text": this.newMessage });
        if (this.newMessage.trim().length > 0) {
            this.wsService.send(this.newMessage);
            this.waitingForResponse = true;
            this.newMessage = '';
        }
    }

    ngAfterViewChecked(): void {
        this.scrollToBottom();
    }

    private scrollToBottom() {
        this.container.nativeElement.scrollTop = this.container.nativeElement.scrollHeight;
    }
}
