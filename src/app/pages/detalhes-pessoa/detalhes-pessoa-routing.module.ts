import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetalhesPessoaComponent } from './detalhes-pessoa.component';

const routes: Routes = [
  {
    path: '',
    component: DetalhesPessoaComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetalhesPessoaRoutingModule { }
