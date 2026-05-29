import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../config/api.config';
import { Chambre, ChambreResponse, ChambreSearchParams, ChambreProchesParams } from '../../models/chambre.model';

@Injectable({
  providedIn: 'root'
})
export class ChambreService {
  private apiUrl = `${API_CONFIG.baseUrl}/chambre`;

  constructor(private http: HttpClient) {}

  getAllChambres(): Observable<ChambreResponse> {
    return this.http.get<ChambreResponse>(`${this.apiUrl}/list`);
  }

  getChambreById(id: number): Observable<ChambreResponse> {
    return this.http.get<ChambreResponse>(`${this.apiUrl}/${id}`);
  }

  getChambreByResidenceId(id: number): Observable<ChambreResponse> {
    return this.http.get<ChambreResponse>(`${this.apiUrl}/residence/${id}`);
  }

  getTypePieceByResidenceId(id: number): Observable<ChambreResponse> {
    return this.http.get<ChambreResponse>(`${this.apiUrl}/type/residence/${id}`);
  }

  getBestChambres(): Observable<ChambreResponse> {
    return this.http.get<ChambreResponse>(`${this.apiUrl}/best/list`);
  }

  searchChambre(params: ChambreSearchParams = {}): Observable<ChambreResponse> {
    let httpParams = new HttpParams();
    if (params.searchTerm) {
      httpParams = httpParams.set('searchTerm', params.searchTerm);
    }
    return this.http.get<ChambreResponse>(`${API_CONFIG.baseUrl}/chambre-search`, { params: httpParams });
  }

  getTenFirstChambres(): Observable<ChambreResponse> {
    return this.http.get<ChambreResponse>(`${this.apiUrl}/tenfirst/list`);
  }

  getChambresProches(params: ChambreProchesParams): Observable<ChambreResponse> {
    const httpParams = new HttpParams()
      .set('latitude', String(params.latitude))
      .set('longitude', String(params.longitude));

    return this.http.get<ChambreResponse>(`${API_CONFIG.baseUrl}/chambre-proches`, { params: httpParams });
  }
}
