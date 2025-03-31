import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { OcorrenciaInfoRequest, OcorrenciaInformacao } from '../models/ocorrencia';

@Injectable({
  providedIn: 'root'
})
export class OcorrenciaService {
  private urlApi = `${environment.apiUrl}/v1/ocorrencias`;

  constructor(private http: HttpClient) { }

  getInformacoesOcorrencia(idOcorrencia: number): Observable<OcorrenciaInformacao[]> {
    const parametros = new HttpParams().set('ocorrenciaId', idOcorrencia.toString());
    return this.http.get<OcorrenciaInformacao[]>(`${this.urlApi}/informacoes-desaparecido`, { params: parametros });
  }
  adicionarInformacaoOcorrencia(informacao: OcorrenciaInfoRequest): Observable<OcorrenciaInformacao> {
    const dadosFormulario = new FormData();

    dadosFormulario.append('informacao', informacao.informacao);
    dadosFormulario.append('descricao', informacao.descricao);
    dadosFormulario.append('data', informacao.data);
    dadosFormulario.append('ocoId', informacao.ocoId.toString());

    if (informacao.files && informacao.files.length > 0) {
      informacao.files.forEach((arquivo: string | Blob) => {
        dadosFormulario.append('files', arquivo);
      });
    }

    return this.http.post<OcorrenciaInformacao>(`${this.urlApi}/informacoes-desaparecido`, dadosFormulario);
  }

  obterMotivosDesaparecimento(): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlApi}/motivos`);
  }
}