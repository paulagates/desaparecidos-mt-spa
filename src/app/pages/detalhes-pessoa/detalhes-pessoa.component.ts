import { Component } from '@angular/core';
import { DetalhesPessoaRoutingModule } from './detalhes-pessoa-routing.module';
import { Pessoa } from '../../core/models/pessoa';
import { OcorrenciaInformacao } from '../../core/models/ocorrencia';
import { ActivatedRoute, Router } from '@angular/router';
import { PessoasService } from '../../core/services/pessoas.service';
import { OcorrenciaService } from '../../core/services/ocorrencia.service';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { TimelineModule } from 'primeng/timeline';
import { GalleriaModule } from 'primeng/galleria';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessagesModule } from 'primeng/messages';
import { ListboxModule } from 'primeng/listbox';

@Component({
  selector: 'app-detalhes',
  standalone: true,
  imports: [
    DetalhesPessoaRoutingModule,
    CardModule,
    TimelineModule,
    GalleriaModule,
    ButtonModule,
    ImageModule,
    ProgressSpinnerModule,
    MessagesModule,
    ListboxModule,
  ],
  providers: [MessageService],
  templateUrl: './detalhes-pessoa.component.html',
  styleUrl: './detalhes-pessoa.component.scss',
})
export class DetalhesPessoaComponent {
  idPessoa!: number;
  pessoa: Pessoa | null = null;
  informacoesOcorrencia: OcorrenciaInformacao[] = [];
  carregando = true;
  erro: string | null = null;
  mensagensErro: any[] = [];
  responsiveOptions: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pessoaService: PessoasService,
    private ocorrenciaService: OcorrenciaService,
    private messageService: MessageService
  ) {
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
      },
      {
        breakpoint: '768px',
        numVisible: 2,
      },
      {
        breakpoint: '560px',
        numVisible: 1,
      },
    ];
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.idPessoa = +params['id'];
      this.carregarDetalhesPessoa();
    });
  }

  carregarDetalhesPessoa(): void {
    this.carregando = true;

    this.pessoaService.getPessoa(this.idPessoa).subscribe({
      next: (dados) => {
        this.pessoa = dados;

        if (dados.ultimaOcorrencia?.ocoId) {
          this.carregarInformacoesOcorrencia(dados.ultimaOcorrencia.ocoId);
        } else {
          this.carregando = false;
        }
      },
      error: (erro) => {
        console.error('Erro ao carregar detalhes da pessoa:', erro);
        this.erro = 'Não foi possível carregar os detalhes da pessoa.';
        this.mensagensErro = [
          { severity: 'error', summary: 'Erro', detail: this.erro },
        ];
        this.carregando = false;
      },
    });
  }

  carregarInformacoesOcorrencia(idOcorrencia: number): void {
    this.ocorrenciaService.getInformacoesOcorrencia(idOcorrencia).subscribe({
      next: (dados: OcorrenciaInformacao[]) => {
        this.informacoesOcorrencia = dados.sort((a, b) => {
          const dateA = new Date(a.data).getTime();
          const dateB = new Date(b.data).getTime();
          return dateB - dateA;
        });
        this.carregando = false;
      },
      error: (erro: any) => {
        console.error('Erro ao carregar informações da ocorrência:', erro);
        this.carregando = false;
      },
    });
  }

  reportarInformacao(): void {
    if (this.pessoa?.ultimaOcorrencia) {
      this.router.navigate([
        '/reportar-informacao',
        this.pessoa.ultimaOcorrencia.ocoId,
      ]);
    }
  }

  voltar(): void {
    this.router.navigate(['/']);
  }

  get status(): string {
    return this.pessoa?.ultimaOcorrencia?.dataLocalizacao
      ? 'LOCALIZADO'
      : 'DESAPARECIDO';
  }

  get classeStatus(): string {
    return this.status === 'LOCALIZADO'
      ? 'detalhes-pessoa__banner-status--localizado'
      : 'detalhes-pessoa__banner-status--desaparecido';
  }

  obterDescricaoCartaz(tipoCartaz: string): string {
    const tipos = {
      PDF_DESAPARECIDO: 'Cartaz Desaparecido (PDF)',
      JPG_DESAPARECIDO: 'Cartaz Desaparecido (Imagem)',
      INSTA_DESAPARECIDO: 'Cartaz Desaparecido (Instagram)',
      PDF_LOCALIZADO: 'Cartaz Localizado (PDF)',
      JPG_LOCALIZADO: 'Cartaz Localizado (Imagem)',
      INSTA_LOCALIZADO: 'Cartaz Localizado (Instagram)',
    };
    return tipos[tipoCartaz as keyof typeof tipos] || tipoCartaz;
  }
}
