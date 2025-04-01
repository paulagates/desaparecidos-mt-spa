import { Component } from '@angular/core';
import { PessoasService } from '../../../core/services/pessoas.service';
import { Router } from '@angular/router';
import { Estatistica } from '../../../core/models/estatistica';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  estatisticas: Estatistica = {
    quantPessoasDesaparecidas: 0,
    quantPessoasEncontradas: 0
  };

  constructor(
    private servicoPessoas: PessoasService,
    private roteador: Router
  ) {}

  ngOnInit(): void {
    this.carregarEstatisticas();
  }

  carregarEstatisticas(): void {
    this.servicoPessoas.getStatistics().subscribe({
      next: (dados) => {
        this.estatisticas = dados;
      },
      error: (erro) => {
        console.error('Erro ao carregar estatísticas:', erro);
      }
    });
  }

  irParaHome(): void {
    this.roteador.navigate(['/']);
  }

  formatarNumero(valor: number): string {
    return valor.toLocaleString('pt-BR');
  }
}