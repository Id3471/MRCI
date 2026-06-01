import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../config/api.config';
import { ProfilResponse, Profil } from '../../models/profil.model';

@Injectable({
  providedIn: 'root',
})
export class ProfilService {
  private apiUrl = `${API_CONFIG.baseUrl}/profils`;

  constructor(private http: HttpClient) {}

  getAllProfils(): Observable<ProfilResponse> {
    return this.http.get<ProfilResponse>(`${this.apiUrl}`);
  }

  createProfil(data: Partial<Profil>): Observable<ProfilResponse> {
    return this.http.post<ProfilResponse>(`${this.apiUrl}`, data);
  }

  updateProfil(id: number, data: Partial<Profil>): Observable<ProfilResponse> {
    return this.http.put<ProfilResponse>(`${this.apiUrl}/${id}`, data);
  }

  activateProfil(id: number) {
    return this.http.post<ProfilResponse>(`${this.apiUrl}/active/${id}`, {});
  }

  deactivateProfil(id: number) {
    return this.http.post<ProfilResponse>(`${this.apiUrl}/desactive/${id}`, {});
  }

  deleteProfil(id: number) {
    return this.http.delete<ProfilResponse>(`${this.apiUrl}/${id}`);
  }
}
