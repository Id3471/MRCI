import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../config/api.config';
import { CommuneResponse, Commune } from '../../models/commune.model';

@Injectable({
  providedIn: 'root'
})
export class CommuneService {
  private apiUrl = API_CONFIG.baseUrl;

  constructor(private http: HttpClient) {}

  getAllCommunes(): Observable<CommuneResponse> {
    return this.http.get<CommuneResponse>(`${this.apiUrl}/communes`);
  }

  createCommune(libelle: string): Observable<CommuneResponse> {
    return this.http.post<CommuneResponse>(`${this.apiUrl}/commune/create`, { libelle });
  }
}
