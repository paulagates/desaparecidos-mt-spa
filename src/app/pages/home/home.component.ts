import { Component } from '@angular/core';
import { PessoasService } from '../../core/services/pessoas.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { HomeRoutingModule } from './home-routing.module';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Page } from '../../core/models/page';
import { Pessoa, PessoaFilter } from '../../core/models/pessoa';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DropdownModule } from 'primeng/dropdown';
import { PessoaCardComponent } from "../../shared/components/pessoa-card/pessoa-card.component";
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
interface OpcaoSexo {
  rotulo: string;
  valor: string;
}

@Component({
  selector: 'app-pagina-inicial',
  standalone: true,
  imports: [
    CommonModule, 
    TableModule, 
    ButtonModule, 
    HomeRoutingModule, 
    ProgressSpinnerModule, 
    DropdownModule, 
    PessoaCardComponent, 
    ReactiveFormsModule,
    InputTextModule,
    CardModule,
    DividerModule,
    SelectButtonModule,
    FormsModule,
    PaginatorModule 
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  primeiroItemPagina = 0;
  pessoas: Pessoa[] = [];
  pagina: Page<Pessoa> | null = null;
  carregando = false;
  formularioPesquisa: FormGroup;
  statusAtual: 'DESAPARECIDO' | 'LOCALIZADO' = 'DESAPARECIDO';

  opcoesSexo: OpcaoSexo[] = [
    { rotulo: 'Todos', valor: '' },
    { rotulo: 'Masculino', valor: 'MASCULINO' },
    { rotulo: 'Feminino', valor: 'FEMININO' },
  ];
  
  opcoesStatus = [
    { label: 'Desaparecidos', value: 'DESAPARECIDO' },
    { label: 'Localizados', value: 'LOCALIZADO' }
  ];
  
  
  onStatusChange(): void {
    this.paginaAtual = 0;
    this.carregarPessoas();
  }

  paginaAtual = 0;
  itensPorPagina = 10;

  constructor(
    private servicoPessoas: PessoasService, 
    private formBuilder: FormBuilder
  ) {
    this.formularioPesquisa = this.formBuilder.group({
      nome: [''],
      faixaIdadeInicial: [null],
      faixaIdadeFinal: [null],
      sexo: [''],
    });
  }
  mudarPagina(evento: any) {
    this.primeiroItemPagina = evento.first;
    this.paginaAtual = evento.page; 
    this.itensPorPagina = evento.rows;
    this.carregarPessoas();
  }

  ngOnInit(): void {
    this.carregarPessoas();
  }

  calcularMinimo(): number {
    if (!this.pagina) return 0;
    return Math.min(
      (this.paginaAtual + 1) * this.itensPorPagina,
      this.pagina.totalElements
    );
  }
  carregarPessoas(): void {
    this.carregando = true;
    this.primeiroItemPagina = this.paginaAtual * this.itensPorPagina;

    const filtro: PessoaFilter = {
      ...this.formularioPesquisa.value,
      pagina: this.paginaAtual,
      porPagina: this.itensPorPagina,
      status: this.statusAtual,
    };
    this.servicoPessoas.getPessoas(filtro).subscribe({
      next: (dados) => {
        this.pagina = dados;
        this.pessoas = dados.content;
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar pessoas:', erro);
        this.carregando = false;
      },
    });
  }


  alternarStatus(status: 'DESAPARECIDO' | 'LOCALIZADO'): void {
    if (this.statusAtual !== status) {
      this.statusAtual = status;
      this.paginaAtual = 0;
      this.carregarPessoas();
    }
  }

  aplicarFiltros(): void {
    this.paginaAtual = 0;
    this.carregarPessoas();
  }

  limparFiltros(): void {
    this.formularioPesquisa.reset({
      nome: '',
      faixaIdadeInicial: null,
      faixaIdadeFinal: null,
      sexo: '',
    });
    this.paginaAtual = 0;
    this.carregarPessoas();
  }

}