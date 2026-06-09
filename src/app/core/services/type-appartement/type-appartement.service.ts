import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../config/api.config';
import { TypeAppartementResponse, TypeAppartement, CreateTypeAppartementDto } from '../../models/type-appartement.model';

@Injectable({
  providedIn: 'root'
})
export class TypeAppartementService {
  private apiUrl = `${API_CONFIG.baseUrl}/typeApt`;

  constructor(private http: HttpClient) {}

  getAllTypes(): Observable<TypeAppartementResponse> {
    return this.http.get<TypeAppartementResponse>(`${this.apiUrl}/list`);
  }

  getPaginatedTypes(limit: number, page: number): Observable<TypeAppartementResponse> {
    return this.http.get<TypeAppartementResponse>(`${this.apiUrl}/list/paginated`, {
      params: {
        limit: String(Math.trunc(limit)),
        page: String(Math.trunc(page)),
      },
    });
  }

  createType(data: CreateTypeAppartementDto): Observable<TypeAppartementResponse> {
    return this.http.post<TypeAppartementResponse>(`${this.apiUrl}/create`, data);
  }

  updateType(id: number, data: Partial<CreateTypeAppartementDto>): Observable<TypeAppartementResponse> {
    return this.http.put<TypeAppartementResponse>(`${this.apiUrl}/update/${id}`, data);
  }

  activateType(id: number): Observable<TypeAppartementResponse> {
    return this.http.patch<TypeAppartementResponse>(`${this.apiUrl}/active/${id}`, {});
  }

  deactivateType(id: number): Observable<TypeAppartementResponse> {
    return this.http.patch<TypeAppartementResponse>(`${this.apiUrl}/desactive/${id}`, {});
  }

  deleteType(id: number): Observable<TypeAppartementResponse> {
    return this.http.delete<TypeAppartementResponse>(`${this.apiUrl}/delete/${id}`);
  }
}
