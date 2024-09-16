import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatHint } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { GameFacade } from '../../core/facades/game.facade';
import { GamePayload } from '../../core/interfaces/game';
import { catchError, tap, throwError } from 'rxjs';
import { GenreFacade } from '../../core/facades/genre.facade';
import { AsyncPipe } from '@angular/common';
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogTitle } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-game',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule, 
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatDatepickerModule,
    MatHint,
    MatButtonModule,
    AsyncPipe,
    MatDialogModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    ConfirmDialogComponent
  ],
  templateUrl: './add-game.component.html',
  styleUrl: './add-game.component.scss'
})
export class AddGameComponent {
  gameFacade = inject(GameFacade);
  gerneFacade = inject(GenreFacade);
  router = inject(Router);

  genres$ = this.gerneFacade.getGenres();

  readonly dialog = inject(MatDialog);

  openDialog() {
    this.dialog.open(ConfirmDialogComponent);
  }


  newDate = new Date();

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    genreId: new FormControl(0, [Validators.required]),
    price: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(100)]),
    releaseDate: new FormControl(new Date() ,Validators.required),
  });

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
      releaseDate: formattedDate
    };

  
    this.gameFacade.createGame(gamePayload).pipe(
      catchError((err) => {
        return throwError(() => err);
      }),
      tap(() => {
        console.log('Game created');    
        this.form.reset();
        this.form.untouched;
        this.router.navigate(['/']);
        this.openDialog();
      })
    ).subscribe();
  }

}
