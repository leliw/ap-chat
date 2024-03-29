import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription, interval } from 'rxjs';
import { WebSocketSubject } from 'rxjs/webSocket';

export interface Message {
    channel: string;
    text?: string;
}

@Injectable({
    providedIn: 'root'
})
/**
 * Represents a service for handling chat functionality.
 */
export class ChatService {

    private socket$!: WebSocketSubject<Message>;
    private proxy$ = new Subject<Message>();
    private connected$ = new BehaviorSubject<boolean>(false);
    private socketUrl: string;
    private subInterval: Subscription

    private endpoint = '/api/ws';

    constructor() {
        const url = new URL(window.origin);
        let host = url.host;
        let protocol = url.protocol === 'https:' ? 'wss' : 'ws';
        // Replace the port of the host if the app is running in development mode
        host = host.replace('localhost:4200', 'localhost:8000')
        this.socketUrl = `${protocol}://${host}${this.endpoint}`;
        this.socket$ = this.createSocket();
        this.subInterval = interval(5000).subscribe(val => this.reconnectSocket());
    }

    /**
     * Creates a WebSocketSubject for sending and receiving messages.
     * @returns The WebSocketSubject instance.
     */
    private createSocket(): WebSocketSubject<Message> {
        const socket$ = new WebSocketSubject<Message>({
            url: this.socketUrl,
            openObserver: { next: () => this.connected$.next(true) },
            closeObserver: { next: () => this.connected$.next(false) }
        });
        socket$.subscribe({
            next: (message) => this.proxy$.next(message),
            error: (error) => console.error(error)
        });
        return socket$;
    }

    /**
     * Reconnects the socket if it is not already connected.
     */
    private reconnectSocket() {
        if (!this.connected$.value && this.socket$)
            this.socket$ = this.createSocket();
    }

    /**
     * Connects to the chat service and returns a subject that emits messages.
     * @returns A subject that emits messages.
     */
    public connect(): Subject<Message> {
        return this.proxy$;
    }

    /**
     * Disconnects the chat service.
     */
    public disconnect(): void {
        this.close();
    }

    /**
     * Sends a message through the socket.
     * @param message - The message to be sent.
     */
    public send(message: any): void {
        this.socket$.next(message);
    }

    /**
     * Closes the chat service.
     * Unsubscribes from the subInterval and completes the socket$.
     */
    public close(): void {
        this.subInterval.unsubscribe();
        this.socket$.complete();
    }

    /**
     * Returns an Observable that emits a boolean value indicating whether the chat service is connected.
     * @returns An Observable that emits a boolean value indicating the connection status.
     */
    public connected(): Observable<boolean> {
        return this.connected$;
    }

}
