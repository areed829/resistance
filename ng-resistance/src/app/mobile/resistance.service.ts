import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NODE_HOST } from '../api-url';
import { GameStatus } from '../models/game-status';
import { WebSocketService } from '../web-socket.service';

@Injectable()
export class ResistanceService {
  constructor(
    @Inject(NODE_HOST) private host: string,
    private httpClient: HttpClient,
    private webSocketService: WebSocketService,
  ) {}

  getGameStatus() {
    return this.httpClient.get<{ status: GameStatus; hostExists: boolean }>(
      `${this.host}/game-status`,
    );
  }

  joinGame(name: string) {
    const id = this.webSocketService.getPlayerId();
    console.log('name', name);
    console.log('id', id);
    return this.httpClient.post(`${this.host}/join-game`, { name, id });
  }
}
