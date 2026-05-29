import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../config/api.config';
import { Commodite, CommoditeResponse } from '../../models/commodite.model';

@Injectable({
  providedIn: 'root',
})
export class CommoditeService {
  private apiUrl = `${API_CONFIG.baseUrl}/commodites`;

  constructor(private http: HttpClient) {}

  getAllCommodites(): Observable<CommoditeResponse> {
    return this.http.get<CommoditeResponse>(`${this.apiUrl}`);
  }

  // utile si besoin plus tard
  getCommoditeById(id: number): Observable<{ success: boolean; detail?: Commodite }> {
    return this.http.get<{ success: boolean; detail?: Commodite }>(`${this.apiUrl}/${id}`);
  }
}

