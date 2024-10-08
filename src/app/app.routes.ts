import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { AddGameComponent } from './pages/add-game/add-game.component';
import { EditGameComponent } from './pages/edit-game/edit-game.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { 
        path: '', 
        component: HomeComponent,  
      },
      {
        path: 'edit-game/:id',
        component: EditGameComponent,
        pathMatch: 'full'
      },
      {
        path: 'add-game',
        component: AddGameComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/',
    pathMatch: 'full'
  }
];
