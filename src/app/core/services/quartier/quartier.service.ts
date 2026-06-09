import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../config/api.config';
import { QuartierResponse, CreateQuartierDto } from '../../models/quartier.model';

@Injectable({
  providedIn: 'root',
})
export class QuartierService {
  private apiUrl = `${API_CONFIG.baseUrl}/quartier`;

  constructor(private http: HttpClient) {}

  getAllQuartiers(): Observable<QuartierResponse> {
    return this.http.get<QuartierResponse>(`${this.apiUrl}/list`);
  }

  getPaginatedQuartiers(limit: number, page: number): Observable<QuartierResponse> {
    return this.http.get<QuartierResponse>(`${this.apiUrl}/list/paginated`, {
      params: {
        limit: String(Math.trunc(limit)),
        page: String(Math.trunc(page)),
      },
    });
  }

  createQuartier(data: CreateQuartierDto): Observable<QuartierResponse> {
    return this.http.post<QuartierResponse>(`${this.apiUrl}/create`, data);
  }

  updateQuartier(id: number, data: Partial<CreateQuartierDto>): Observable<QuartierResponse> {
    return this.http.put<QuartierResponse>(`${this.apiUrl}/update/${id}`, data);
  }

  deleteQuartier(id: number): Observable<QuartierResponse> {
    return this.http.delete<QuartierResponse>(`${this.apiUrl}/delete/${id}`);
  }
}