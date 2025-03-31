import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Pessoa } from '../../../core/models/pessoa';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-pessoa-card',
  templateUrl: './pessoa-card.component.html',
  styleUrls: ['./pessoa-card.component.scss'],
  imports: [CommonModule, TagModule, ImageModule],
  standalone: true
})
export class PessoaCardComponent {
  @Input() pessoa!: Pessoa;

  constructor(private roteador: Router) {}

  verDetalhes(): void {
    this.roteador.navigate(['/pessoa', this.pessoa.id]);
  }

  get rotuloStatus(): string {
    return this.pessoa.ultimaOcorrencia.dataLocalizacao ? 'LOCALIZADO' : 'DESAPARECIDO';
  }

  get urlFoto(): string {
    return this.pessoa.urlFoto || 'assets/images/person-placeholder.jpg';
  }
}