import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatHint } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { GameFacade } from '../../core/facades/game.facade';
import { GamePayload } from '../../core/interfaces/game';
import { catchError, Subject, Subscription, takeUntil, tap, throwError } from 'rxjs';
import { GenreFacade } from '../../core/facades/genre.facade';
import { AsyncPipe } from '@angular/common';
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogTitle } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { log } from 'console';
import { EditConfirmDialogComponent } from '../../components/edit-confirm-dialog/edit-confirm-dialog.component';


@Component({
  selector: 'app-edit-game',
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
    EditConfirmDialogComponent,
    FormsModule
  ],
  templateUrl: './edit-game.component.html',
  styleUrl: './edit-game.component.scss'
})
export class EditGameComponent implements OnInit, OnDestroy {
  gameFacade = inject(GameFacade);
  genreFacade = inject(GenreFacade);
  router = inject(Router);
  route = inject(ActivatedRoute);

  // Signals
  id = signal<number>(0);
  name = signal<string>('A');
  genreId = signal<number>(0);
  price = signal<number>(0);
  releaseDate = signal<Date>(new Date());
  newDate = signal(new Date());
  genres = signal<any[]>([]);
  error = signal<string | null>(null);

  readonly dialog = inject(MatDialog);

  private subscriptions: Subscription[] = [];

  ngOnInit() {
    this.id.set(this.route.snapshot.params['id']);
    this.loadGame();
    this.loadGenres();
  }

  loadGame() {
    const sub = this.gameFacade.getGame(this.id()).pipe(
      tap((game) => {
        this.name.set(game.name);
        this.genreId.set(game.genreId);
        this.price.set(game.price);
        this.releaseDate.set(new Date(game.releaseDate));
      }),
      catchError((err) => {
        this.error.set(err);
        return throwError(() => err);
      })
    ).subscribe();

    this.subscriptions.push(sub); // Store the subscription
  }

  loadGenres() {
    const sub = this.genreFacade.getGenres().pipe(
      tap((data) => {
        this.genres.set(data);
      }),
      catchError((err) => {
        this.error.set('Failed to load genres');
        return throwError(() => err);
      })
    ).subscribe();

    this.subscriptions.push(sub); // Store the subscription
  }

  openDialog() {
    this.dialog.open(EditConfirmDialogComponent);
  }

  editGame() {
    const { name, genreId, price, releaseDate } = {
      name: this.name(),
      genreId: this.genreId(),
      price: this.price(),
      releaseDate: this.releaseDate()
    };

    const formattedDate = releaseDate ? 
      `${releaseDate.getFullYear()}-${(releaseDate.getMonth() + 1).toString().padStart(2, '0')}-${releaseDate.getDate().toString().padStart(2, '0')}` 
      : null;

    const gamePayload: GamePayload = {
      name,
      genreId,
      price,
      releaseDate: formattedDate
    };

    const sub = this.gameFacade.updateGame(this.id(), gamePayload).pipe(
      tap(() => {
        console.log('Game updated');
        this.resetValues();
        this.router.navigate(['/']);
        this.openDialog();
      }),
      catchError((err) => {
        this.error.set(err);
        return throwError(() => err);
      })
    ).subscribe();

    this.subscriptions.push(sub); // Store the subscription
  }

  resetValues() {
    this.name.set('');
    this.genreId.set(1);
    this.price.set(0);
    this.releaseDate.set(new Date());
  }

  // Unsubscribe to prevent memory leaks
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
