import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GameFacade } from '../../core/facades/game.facade';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { GenreFacade } from '../../core/facades/genre.facade';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms'
import { GamePayload } from '../../core/interfaces/game';
import { catchError, tap, throwError } from 'rxjs';
import {MatOptionModule} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule, MatHint} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepicker, MatDatepickerModule} from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    JsonPipe,
    AsyncPipe,
    ReactiveFormsModule,
    MatFormFieldModule, 
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatDatepickerModule,
    MatHint,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  gameFacade = inject(GameFacade);
  genreFacade = inject(GenreFacade);

  newDate = new Date();

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    genreId: new FormControl(0, [Validators.required]),
    price: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(100)]),
    releaseDate: new FormControl(new Date() ,Validators.required),
  });
  
  games$ = this.gameFacade.getGames();
  genres$ = this.genreFacade.getGenres();

  createGame() {
    if (!this.form.valid) {
      console.log('Form is invalid');
      return;
    }
  
    const { name, genreId, price, releaseDate } = this.form.value as { name: string, genreId: number, price: number, releaseDate: Date };
  
    // Format releaseDate to 'YYYY-MM-DD'
    const formattedDate = releaseDate ? 
      `${releaseDate.getFullYear()}-${(releaseDate.getMonth() + 1).toString().padStart(2, '0')}-${releaseDate.getDate().toString().padStart(2, '0')}` 
      : null;
  
    const gamePayload: GamePayload = {
      name,
      genreId,
      price,
      releaseDate: formattedDate  // Send formatted date string
    };

  
    this.gameFacade.createGame(gamePayload).pipe(
      catchError((err) => {
        return throwError(() => err);
      }),
      tap(() => {
        console.log('Game created');
        this.games$ = this.gameFacade.getGames();      
        this.form.reset();
        this.form.untouched;
      })
    ).subscribe();
  }
}
