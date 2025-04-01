import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { OcorrenciaInformacao } from '../models/ocorrencia';

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
  adicionarInformacaoOcorrencia(formData: FormData): Observable<OcorrenciaInformacao> {
    return this.http.post<OcorrenciaInformacao>(
      `${this.urlApi}/informacoes-desaparecido`, 
      formData
    );
  }

  obterMotivosDesaparecimento(): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlApi}/motivos`);
  }
}