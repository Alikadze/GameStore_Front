import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { Genre } from '../interfaces/genre';

@Injectable({
  providedIn: 'root'
})
export class GenreService extends BaseService {

  getGenres(): Observable<Genre[]> {
    return this.get('genres');
  }
}
