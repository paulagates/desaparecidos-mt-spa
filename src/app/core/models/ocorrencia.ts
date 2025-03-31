export interface Ocorrencia {
    dtDesaparecimento: string;
    dataLocalizacao: string;
    encontradoVivo: boolean;
    localDesaparecimentoConcat: string;
    ocorrenciaEntrevDesapDTO: OcorrenciaEntrevDesap;
    listaCartaz: OcorrenciaPoster[];
    ocoId: number;
  }

  export interface OcorrenciaPoster {
    urlCartaz: string;
    tipoCartaz: 'PDF_DESAPARECIDO' | 'PDF_LOCALIZADO' | 'JPG_DESAPARECIDO' |
                'JPG_LOCALIZADO' | 'INSTA_DESAPARECIDO' | 'INSTA_LOCALIZADO';
  }

  export interface OcorrenciaEntrevDesap {
    informacao: string;
    vestimentasDesaparecido: string;
  }
  
  export interface OcorrenciaInfoRequest {
    informacao: string;
    descricao: string;
    data: string; 
    ocoId: number;
    files?: File[];
  }

  
  export interface OcorrenciaInformacao {
    ocoId: number;
    informacao: string;
    data: string; 
    id?: number;
    anexos?: string[];
  }
  