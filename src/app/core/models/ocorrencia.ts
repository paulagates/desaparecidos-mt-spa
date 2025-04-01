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
  
  export interface OcorrenciaInformacao {
    ocoId: number;
    informacao: string;
    data: string; 
    id?: number;
    anexos?: string[];
  }
  