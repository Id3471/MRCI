import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../config/api.config';
import { CommuneResponse, CreateCommuneDto } from '../../models/commune.model';

@Injectable({
  providedIn: 'root',
})
export class CommuneService {
  private apiUrl = `${API_CONFIG.baseUrl}/commune`;

  constructor(private http: HttpClient) {}

  getAllCommunes(): Observable<CommuneResponse> {
    return this.http.get<CommuneResponse>(`${this.apiUrl}/list`);
  }

  getPaginatedCommunes(limit: number, page: number): Observable<CommuneResponse> {
    return this.http.get<CommuneResponse>(`${this.apiUrl}/list/paginated`, {
      params: {
        limit: String(Math.trunc(limit)),
        page: String(Math.trunc(page)),
      },
    });
  }

  createCommune(data: CreateCommuneDto): Observable<CommuneResponse> {
    return this.http.post<CommuneResponse>(`${this.apiUrl}/create`, data);
  }

  updateCommune(id: number, data: Partial<CreateCommuneDto>): Observable<CommuneResponse> {
    return this.http.put<CommuneResponse>(`${this.apiUrl}/update/${id}`, data);
  }

  deleteCommune(id: number): Observable<CommuneResponse> {
    return this.http.delete<CommuneResponse>(`${this.apiUrl}/delete/${id}`);
  }
}