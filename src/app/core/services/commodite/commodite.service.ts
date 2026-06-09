import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../config/api.config';
import { CommoditeResponse, CreateCommoditeDto } from '../../models/commodite.model';

@Injectable({
  providedIn: 'root',
})
export class CommoditeService {
  private apiUrl = `${API_CONFIG.baseUrl}/commodite`;

  constructor(private http: HttpClient) {}

  getAllCommodites(): Observable<CommoditeResponse> {
    return this.http.get<CommoditeResponse>(`${this.apiUrl}/list`);
  }

  getPaginatedCommodites(limit: number, page: number): Observable<CommoditeResponse> {
    return this.http.get<CommoditeResponse>(`${this.apiUrl}/list/paginated`, {
      params: {
        limit: String(Math.trunc(limit)),
        page: String(Math.trunc(page)),
      },
    });
  }

  getCommoditeById(id: number): Observable<CommoditeResponse> {
    return this.http.get<CommoditeResponse>(`${this.apiUrl}/${id}`);
  }

  createCommodite(data: CreateCommoditeDto): Observable<CommoditeResponse> {
    return this.http.post<CommoditeResponse>(`${this.apiUrl}/create`, data);
  }

  activateCommodite(id: number): Observable<CommoditeResponse> {
    return this.http.patch<CommoditeResponse>(`${this.apiUrl}/active/${id}`, {});
  }

  deactivateCommodite(id: number): Observable<CommoditeResponse> {
    return this.http.patch<CommoditeResponse>(`${this.apiUrl}/desactive/${id}`, {});
  }

  deleteCommodite(id: number): Observable<CommoditeResponse> {
    return this.http.delete<CommoditeResponse>(`${this.apiUrl}/delete/${id}`);
  }

  updateCommodite(id: number, data: Partial<CreateCommoditeDto>): Observable<CommoditeResponse> {
    return this.http.post<CommoditeResponse>(`${this.apiUrl}/update/${id}`, data);
  }
}
