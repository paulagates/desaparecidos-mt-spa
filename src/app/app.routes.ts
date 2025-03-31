import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'pessoa/:id',
    loadComponent: () => import('./pages/detalhes-pessoa/detalhes-pessoa.component').then(m => m.DetalhesPessoaComponent)
  },
  {
    path: 'reportar-informacao/:id',
    loadComponent: () => import('./pages/reportar-informacoes/reportar-informacoes.component').then(m => m.ReportarInformacoesComponent)
  },
  {
    path: '**',
    redirectTo: '',
  },
];
