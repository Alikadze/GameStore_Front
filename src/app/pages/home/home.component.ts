import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { GameFacade } from '../../core/facades/game.facade';
import { GenreFacade } from '../../core/facades/genre.facade';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Game, GamePayload } from '../../core/interfaces/game';
import { Router, RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmDialogComponent } from '../../components/delete-confirm-dialog/delete-confirm-dialog.component';
import { Genre } from '../../core/interfaces/genre';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatTableModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  gameFacade = inject(GameFacade);
  genreFacade = inject(GenreFacade);
  router = inject(Router);
  dialog = inject(MatDialog);

  games = signal<Game[]>([]);
  genres = signal<Genre[]>([]);
  formValid = signal(true);
  dialogOpen = signal(false);
  error = signal<string | null>(null);

  private destroy$ = new Subject<void>();

  displayedColumns = ['name', 'genre', 'price', 'releaseDate', 'actions'];

  name = signal('');
  genreId = signal(0);
  price = signal(0);
  releaseDate = signal(new Date());

  constructor() {
    this.loadGames();
    this.loadGenres();
  }

  loadGames() {
    this.gameFacade.getGames().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {
        this.games.set(data);
      },
      error: (err) => {
        this.error.set(err);
      }
    });
  }

  loadGenres() {
    this.genreFacade.getGenres().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {
        this.genres.set(data);
      },
      error: () => {
        this.error.set('Failed to load genres');
      }
    });
  }

  openDialog() {
    this.dialogOpen.set(true);
    this.dialog.open(DeleteConfirmDialogComponent);
  }

  closeDialog() {
    this.dialogOpen.set(false);
  }

  deleteGame(id: number) {
    this.gameFacade.deleteGame(id).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        console.log('Game deleted');
        this.loadGames();
      },
      error: (err) => {
        this.error.set(err);
      }
    });
    this.openDialog();
  }

  checkFormValidity() {
    this.formValid.set(
      this.name() !== '' &&
      this.genreId() > 0 &&
      this.price() > 0 &&
      this.releaseDate() !== null
    );
  }

  createGame() {
    this.checkFormValidity();

    if (!this.formValid()) {
      console.log('Form is invalid');
      return;
    }

    const formattedDate = this.releaseDate()
      ? `${this.releaseDate().getFullYear()}-${(this.releaseDate().getMonth() + 1).toString().padStart(2, '0')}-${this.releaseDate().getDate().toString().padStart(2, '0')}`
      : null;

    const gamePayload: GamePayload = {
      name: this.name(),
      genreId: this.genreId(),
      price: this.price(),
      releaseDate: formattedDate
    };

    this.gameFacade.createGame(gamePayload).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        console.log('Game created');
        this.loadGames();
        this.resetForm();
      },
      error: (err) => {
        this.error.set(err);
      }
    });
  }

  resetForm() {
    this.name.set('');
    this.genreId.set(0);
    this.price.set(0);
    this.releaseDate.set(new Date());
  }

  editGame(id: number) {
    this.router.navigate([`edit-game/${id}`]);
  }

  updateGame(id: number) {
    this.router.navigate([`edit-game/${id}`]);
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
