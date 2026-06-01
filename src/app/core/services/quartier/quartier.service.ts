import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../config/api.config';
import { QuartierResponse } from '../../models/quartier.model';

@Injectable({
  providedIn: 'root'
})
export class QuartierService {
  private apiUrl = API_CONFIG.baseUrl;

  constructor(private http: HttpClient) {}

  getAllQuartiers(): Observable<QuartierResponse> {
    return this.http.get<QuartierResponse>(`${this.apiUrl}/quartiers`);
  }

  createQuartier(data: { nom: string; communeId: number }) {
    return this.http.post<QuartierResponse>(`${this.apiUrl}/quartier/create`, data);
  }

  updateQuartier(id: number, data: { nom?: string; communeId?: number }) {
    return this.http.put<QuartierResponse>(`${this.apiUrl}/quartier/${id}`, data);
  }

  deleteQuartier(id: number) {
    return this.http.delete<QuartierResponse>(`${this.apiUrl}/quartier/${id}`);
  }
}
