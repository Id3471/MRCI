import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../config/api.config';
import { AppartementResponse } from '../../models/chambre.model';

@Injectable({
  providedIn: 'root',
})
export class AppartementService {
  private apiUrl = `${API_CONFIG.baseUrl}/chambre`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<AppartementResponse> {
    return this.http.get<AppartementResponse>(`${this.apiUrl}/list`);
  }

  getPaginated(limit: number, page: number): Observable<AppartementResponse> {
    return this.http.get<AppartementResponse>(`${this.apiUrl}/list/paginated`, {
      params: { limit: String(limit), page: String(page) },
    });
  }

  // Utilisation de FormData pour gérer les fichiers (images)
  createAppartement(data: FormData): Observable<AppartementResponse> {
    return this.http.post<AppartementResponse>(`${this.apiUrl}/create`, data);
  }

  updateAppartement(id: number, data: FormData): Observable<AppartementResponse> {
    return this.http.put<AppartementResponse>(`${this.apiUrl}/update/${id}`, data);
  }

  activateAppartement(id: number): Observable<AppartementResponse> {
    return this.http.patch<AppartementResponse>(`${this.apiUrl}/active/${id}`, {});
  }

  deactivateAppartement(id: number): Observable<AppartementResponse> {
    return this.http.patch<AppartementResponse>(`${this.apiUrl}/desactive/${id}`, {});
  }

  deleteAppartement(id: number): Observable<AppartementResponse> {
    return this.http.delete<AppartementResponse>(`${this.apiUrl}/delete/${id}`);
  }
}