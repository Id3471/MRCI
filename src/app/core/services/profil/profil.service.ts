import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../config/api.config';
import { ProfilResponse, CreateProfilDto } from '../../models/profil.model';

@Injectable({
  providedIn: 'root',
})
export class ProfilService {
  private apiUrl = `${API_CONFIG.baseUrl}/profil`;

  constructor(private http: HttpClient) {}

  getAllProfils(): Observable<ProfilResponse> {
    return this.http.get<ProfilResponse>(`${this.apiUrl}/list`);
  }

  getPaginatedProfils(limit: number, page: number): Observable<ProfilResponse> {
    return this.http.get<ProfilResponse>(`${this.apiUrl}/list/paginated`, {
      params: {
        limit: String(Math.trunc(limit)),
        page: String(Math.trunc(page)),
      },
    });
  }

  createProfil(data: CreateProfilDto): Observable<ProfilResponse> {
    return this.http.post<ProfilResponse>(`${this.apiUrl}/create`, data);
  }

  updateProfil(id: number, data: Partial<CreateProfilDto>): Observable<ProfilResponse> {
    return this.http.put<ProfilResponse>(`${this.apiUrl}/update/${id}`, data);
  }

  activateProfil(id: number): Observable<ProfilResponse> {
    return this.http.patch<ProfilResponse>(`${this.apiUrl}/active/${id}`, {});
  }

  deactivateProfil(id: number): Observable<ProfilResponse> {
    return this.http.patch<ProfilResponse>(`${this.apiUrl}/desactive/${id}`, {});
  }

  deleteProfil(id: number): Observable<ProfilResponse> {
    return this.http.delete<ProfilResponse>(`${this.apiUrl}/delete/${id}`);
  }
}