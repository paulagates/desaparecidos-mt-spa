import { Ocorrencia } from "./ocorrencia";

export interface Pessoa {
    id: number;
    nome: string;
    idade: number;
    sexo: 'MASCULINO' | 'FEMININO';
    vivo: boolean;
    urlFoto: string;
    ultimaOcorrencia: Ocorrencia;
  }

  export interface PessoaFilter {
    nome?: string;
    faixaIdadeInicial?: number;
    faixaIdadeFinal?: number;
    sexo?: 'MASCULINO' | 'FEMININO' | '';
    pagina?: number;
    porPagina?: number;
    status?: 'DESAPARECIDO' | 'LOCALIZADO' | '';
  }
  