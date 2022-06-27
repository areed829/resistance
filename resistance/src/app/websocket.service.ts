import { Injectable } from '@angular/core';
import { map, Observable, Observer, Subject } from 'rxjs';
import { AnonymousSubject } from 'rxjs/internal/Subject';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private subject: AnonymousSubject<MessageEvent> | undefined;
  public messages: Subject<Message>;
  constructor() {
    this.messages = <Subject<Message>>this.connect(CHAT_URL).pipe(
      map((response: MessageEvent): Message => {
        console.log(response.data);
        let data = JSON.parse(response.data);
        return data;
      })
    );
  }

  connect(url: string): AnonymousSubject<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create(url);
      console.log('Successfully connected: ', url);
    }
    return this.subject;
  }

  private create(url: string): AnonymousSubject<MessageEvent> {
    let ws = new WebSocket(url);
    const observable = new Observable((obs: Observer<MessageEvent>) => {
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);
      return ws.close.bind(ws);
    });
    const observer: Observer<MessageEvent<any>> = {
      error: () => {},
      complete: () => {},
      next: (data: Object) => {
        console.log('Message sent to websocket: ', data);
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      },
    };
    return new AnonymousSubject<MessageEvent>(observer, observable);
  }
}

const CHAT_URL = 'ws://localhost:8080';

export interface Message {
  source: string;
  content: string;
}
