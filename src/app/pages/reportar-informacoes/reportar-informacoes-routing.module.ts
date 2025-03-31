import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportarInformacoesComponent } from './reportar-informacoes.component';

const routes: Routes = [
  {
    path: '',
    component: ReportarInformacoesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportarInformacoesRoutingModule { }
