import { Routes } from '@angular/router';
import { ListaFrutas } from './features/frutas/pages/lista-frutas/lista-frutas';
import { FormularioFruta } from './features/frutas/pages/formulario-fruta/formulario-fruta';

export const routes: Routes = [
  { path: 'frutas', component: ListaFrutas },
  { path: 'frutas/nueva', component: FormularioFruta },
  { path: 'frutas/:id/editar', component: FormularioFruta },
  { path: '', redirectTo: 'frutas', pathMatch: 'full' },
  { path: '**', redirectTo: 'frutas' },
];
