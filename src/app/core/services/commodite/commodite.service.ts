import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../config/api.config';
import { Commodite, CommoditeResponse } from '../../models/commodite.model';

@Injectable({
  providedIn: 'root',
})
export class CommoditeService {
  private apiUrl = `${API_CONFIG.baseUrl}/commodite`;

  constructor(private http: HttpClient) {}

  getAllCommodites(): Observable<CommoditeResponse> {
    return this.http.get<CommoditeResponse>(`${this.apiUrl}/list`);
  }

  // utile si besoin plus tard
  getCommoditeById(id: number): Observable<{ success: boolean; detail?: Commodite }> {
    return this.http.get<{ success: boolean; detail?: Commodite }>(`${this.apiUrl}/${id}`);
  }

  createCommodite(data: Partial<Commodite>) {
    return this.http.post<CommoditeResponse>(`${this.apiUrl}`, data);
  }

  updateCommodite(id: number, data: Partial<Commodite>) {
    return this.http.put<CommoditeResponse>(`${this.apiUrl}/${id}`, data);
  }

  activateCommodite(id: number) {
    return this.http.post<CommoditeResponse>(`${this.apiUrl}/active/${id}`, {});
  }

  deactivateCommodite(id: number) {
    return this.http.post<CommoditeResponse>(`${this.apiUrl}/desactive/${id}`, {});
  }

  deleteCommodite(id: number) {
    return this.http.delete<CommoditeResponse>(`${this.apiUrl}/${id}`);
  }
}

