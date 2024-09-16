import { Injectable } from '@angular/core';
import { Environment } from '../../../environment/environment';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { Game, GamePayload } from '../interfaces/game';

@Injectable({
  providedIn: 'root'
})
export class GameService extends BaseService {

  getGames(): Observable<Game[]> {
    return this.get('games');
  }

  getGame(id: number): Observable<Game> {
    return this.get(`games/${id}`);
  }

  createGame(game: GamePayload): Observable<Game> {
    return this.post('games', game);
  }

  updateGame(id: number, game: any): Observable<GamePayload> {
    return this.put(`games/${id}`, game);
  }

  deleteGame(id: number) {
    return this.delete(`games/${id}`);
  }
}
