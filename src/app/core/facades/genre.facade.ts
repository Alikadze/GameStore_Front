import { inject, Injectable } from "@angular/core";
import { GenreService } from "../services/genre.service";
import { Observable } from "rxjs";
import { Genre } from "../interfaces/genre";

@Injectable({
  providedIn: 'root'
})
export class GenreFacade {
  genreService = inject(GenreService);

  getGenres(): Observable<Genre[]> {
    return this.genreService.getGenres();
  }
}