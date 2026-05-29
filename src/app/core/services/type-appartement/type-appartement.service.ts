import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../config/api.config';
import { TypeAppartementResponse, TypeAppartement } from '../../models/type-appartement.model';

@Injectable({
  providedIn: 'root'
})
export class TypeAppartementService {
  private apiUrl = `${API_CONFIG.baseUrl}/chambre/type`;

  constructor(private http: HttpClient) {}

  getAllTypes(): Observable<TypeAppartementResponse> {
    return this.http.get<TypeAppartementResponse>(`${this.apiUrl}/all`);
  }

  createType(libelle: string): Observable<TypeAppartementResponse> {
    return this.http.post<TypeAppartementResponse>(`${API_CONFIG.baseUrl}/chambre/type/create`, { libelle });
  }

  updateType(id: number, libelle: string): Observable<TypeAppartementResponse> {
    return this.http.put<TypeAppartementResponse>(`${API_CONFIG.baseUrl}/chambre/type/${id}`, { libelle });
  }

  activateType(id: number): Observable<TypeAppartementResponse> {
    return this.http.post<TypeAppartementResponse>(`${API_CONFIG.baseUrl}/chambre/type/active/${id}`, {});
  }

  deactivateType(id: number): Observable<TypeAppartementResponse> {
    return this.http.post<TypeAppartementResponse>(`${API_CONFIG.baseUrl}/chambre/type/desactive/${id}`, {});
  }

  deleteType(id: number): Observable<TypeAppartementResponse> {
    return this.http.delete<TypeAppartementResponse>(`${API_CONFIG.baseUrl}/chambre/type/${id}`);
  }
}
