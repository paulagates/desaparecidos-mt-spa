import { Component } from '@angular/core';
import { ReportarInformacoesRoutingModule } from './reportar-informacoes-routing.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Pessoa } from '../../core/models/pessoa';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { OcorrenciaService } from '../../core/services/ocorrencia.service';
import { PessoasService } from '../../core/services/pessoas.service';
import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { MessagesModule } from 'primeng/messages';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-informacoes',
  standalone: true,
  imports: [
    ReportarInformacoesRoutingModule,
    ButtonModule,
    ListboxModule,
    FileUploadModule,
    CalendarModule,
    CardModule,
    MessagesModule,
    ProgressSpinnerModule,
    ReactiveFormsModule,
    InputTextareaModule,
    InputTextModule
],
  templateUrl: './reportar-informacoes.component.html',
  styleUrl: './reportar-informacoes.component.scss',
  providers: [MessageService, DatePipe],
})
export class ReportarInformacoesComponent {
  idOcorrencia!: number;
  pessoa: Pessoa | null = null;
  carregando = true;
  enviando = false;
  erro: string | null = null;
  sucesso = false;
  formularioReporte: FormGroup;
  _arquivosSelecionados: any[] = [];
  maxArquivos = 5;
  maxTamanhoArquivo = 5 * 1024 * 1024; 
  hoje = new Date();

  mensagensErro: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private pessoaService: PessoasService,
    private ocorrenciaService: OcorrenciaService,
    private messageService: MessageService,
    private datePipe: DatePipe
  ) {
    this.formularioReporte = this.fb.group({
      informacao: ['', [Validators.required, Validators.minLength(10)]],
      descricao: [''],
      data: [new Date(), [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.idOcorrencia = +params['id'];
      this.carregarPessoaPorOcorrencia();
    });
  }

  carregarPessoaPorOcorrencia(): void {
    this.carregando = true;

    this.pessoaService.getPessoas({ pagina: 0, porPagina: 100 }).subscribe({
      next: (data) => {
        const pessoaEncontrada = data.content.find(
          (p) =>
            p.ultimaOcorrencia && p.ultimaOcorrencia.ocoId === this.idOcorrencia
        );

        if (pessoaEncontrada) {
          this.pessoa = pessoaEncontrada;
        } else {
          this.erro = 'Pessoa não encontrada para esta ocorrência.';
          this.mensagensErro = [
            { severity: 'error', summary: 'Erro', detail: this.erro },
          ];
        }

        this.carregando = false;
      },
      error: (error) => {
        console.error('Erro ao carregar pessoa:', error);
        this.erro = 'Não foi possível carregar os dados da pessoa.';
        this.mensagensErro = [
          { severity: 'error', summary: 'Erro', detail: this.erro },
        ];
        this.carregando = false;
      },
    });
  }


  arquivosSelecionados(event: any): void {
    const novosArquivos = Array.isArray(event.files) ? event.files : [...event.files];
  
    console.log(this._arquivosSelecionados.length);
  
    if (this._arquivosSelecionados.length + novosArquivos.length > this.maxArquivos) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: `Você pode enviar no máximo ${this.maxArquivos} arquivos.`,
      });
      return;
    }
  
    const arquivosGrandes = novosArquivos.filter(
      (file: any) => file.size > this.maxTamanhoArquivo
    );
  
    if (arquivosGrandes.length > 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: `Os seguintes arquivos excedem o tamanho máximo permitido (5MB): ${arquivosGrandes
          .map((f: any) => f.name)
          .join(', ')}`,
      });
      return;
    }
  
    this._arquivosSelecionados = [...this._arquivosSelecionados, ...novosArquivos];
  }

  removerArquivo(arquivo: any): void {
    this._arquivosSelecionados = this._arquivosSelecionados.filter(
      (f) => f.name !== arquivo.name
    );
  }

  enviarReporte(): void {
    if (this.formularioReporte.invalid) {
      Object.keys(this.formularioReporte.controls).forEach((key) => {
        this.formularioReporte.get(key)?.markAsTouched();
      });
      return;
    }
  
    this.enviando = true;
  
    const formData = new FormData();
    formData.append('informacao', this.formularioReporte.value.informacao);
    formData.append('descricao', this.formularioReporte.value.descricao || '');
    formData.append('data', this.datePipe.transform(this.formularioReporte.value.data, 'yyyy-MM-dd') || '');
    formData.append('ocoId', this.idOcorrencia.toString());
  

    this._arquivosSelecionados.forEach((arquivo: File) => {
      formData.append('files', arquivo, arquivo.name);
    });
  
    console.log('Enviando:', formData); // Para debug
  
    this.ocorrenciaService.adicionarInformacaoOcorrencia(formData).subscribe({
      next: () => {
        this.enviando = false;
        this.sucesso = true;
        this.formularioReporte.reset({
          data: new Date(),
        });
        this._arquivosSelecionados = [];
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Informação enviada com sucesso!',
        });
      },
      error: (error) => {
        console.error('Erro ao enviar informações:', error);
        this.erro = 'Não foi possível enviar as informações. Tente novamente mais tarde.';
        this.mensagensErro = [
          { severity: 'error', summary: 'Erro', detail: this.erro },
        ];
        this.enviando = false;
      },
    });
  }

  voltar(): void {
    if (this.pessoa) {
      this.router.navigate(['/pessoa', this.pessoa.id]);
    } else {
      this.router.navigate(['/']);
    }
  }
}
