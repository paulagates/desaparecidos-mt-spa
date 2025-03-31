import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pessoa, PessoaFilter } from '../models/pessoa';
import { Page } from '../models/page';
import { Estatistica } from '../models/estatistica';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PessoasService {
  private apiUrl = `${environment.apiUrl}/v1/pessoas`;
  constructor(private http: HttpClient) {}

  getPessoas(filter: PessoaFilter): Observable<Page<Pessoa>> {
    let params = new HttpParams()
      .set('pagina', filter.pagina?.toString() || '0')
      .set('porPagina', filter.porPagina?.toString() || '10');

    if (filter.nome) {
      params = params.set('nome', filter.nome);
    }

    if (filter.faixaIdadeInicial) {
      params = params.set('faixaIdadeInicial', filter.faixaIdadeInicial.toString());
    }

    if (filter.faixaIdadeFinal) {
      params = params.set('faixaIdadeFinal', filter.faixaIdadeFinal.toString());
    }

    if (filter.sexo) {
      params = params.set('sexo', filter.sexo);
    }

    if (filter.status) {
      params = params.set('status', filter.status);
    }

    return this.http.get<Page<Pessoa>>(`${this.apiUrl}/aberto/filtro`, { params });
  }

  getPessoa(id: number): Observable<Pessoa> {
    return this.http.get<Pessoa>(`${this.apiUrl}/${id}`);
  }

  getStatistics(): Observable<Estatistica> {
    return this.http.get<Estatistica>(`${this.apiUrl}/aberto/estatistico`);
  }

  getRandomPessoas(count: number = 4): Observable<Pessoa[]> {
    const params = new HttpParams().set('registros', count.toString());
    return this.http.get<Pessoa[]>(`${this.apiUrl}/aberto/dinamico`, { params });
  }
}

