import { Injectable, inject } from '@angular/core'
import { GameService } from '../services/game.service';
import { Observable } from 'rxjs';
import { Game, GamePayload } from '../interfaces/game';


@Injectable({
  providedIn: 'root'
})
export class GameFacade {
  gameService = inject(GameService);

  getGames(): Observable<Game[]> {
    return this.gameService.getGames();
  }

  getGame(id: number): Observable<Game> {
    return this.gameService.getGame(id);
  }

  createGame(game: GamePayload): Observable<Game> {
    return this.gameService.createGame(game);
  }

  updateGame(id: number, game: any) {
    return this.gameService.updateGame(id, game);
  }
}