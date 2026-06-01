import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../config/api.config';
import { Residence, CreateResidenceDto, ResidenceResponse } from '../../models/residence.model';

@Injectable({
  providedIn: 'root'
})
export class ResidenceService {
  private apiUrl = `${API_CONFIG.baseUrl}/residence`;

  constructor(private http: HttpClient) {}

  /**
   * Récupère la liste de toutes les résidences actives
   * GET /residence/list
   */
  getAllResidences(): Observable<ResidenceResponse> {
    return this.http.get<ResidenceResponse>(`${this.apiUrl}/list`);
  }


  /**
   * Récupère la liste de toutes les résidences
   * GET /residence/allList
   */
  getAbsAllResidences(): Observable<ResidenceResponse> {
    return this.http.get<ResidenceResponse>(`${this.apiUrl}/allList`);
  }


  /**
   * Pagination des résidences actives
   * GET /residence/list/paginated?limit=10&page=1
   */
  getNbResidences(limit: number, page: number): Observable<ResidenceResponse> {
    return this.http.get<ResidenceResponse>(`${this.apiUrl}/list/paginated`, {
      // Envoi en int côté back (sinon validation Laravel peut échouer si le type n'est pas integer)
      params: {
        limit: String(Math.trunc(limit)),
        page: String(Math.trunc(page)),
      },
    });
  }


  /**
   * Récupère une résidence par son ID
   * GET /residence/{id}
   */
  getResidenceById(id: number): Observable<ResidenceResponse> {
    return this.http.get<ResidenceResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crée une nouvelle résidence
   * POST /residence/create
   */
  createResidence(data: CreateResidenceDto): Observable<ResidenceResponse> {
    const formData = new FormData();
    formData.append('denomination', data.denomination);
    formData.append('contact', data.contact);
    formData.append('email', data.email);
    formData.append('manager', data.manager);

    // Laravel create() utilise full_phone pour remplir `contact`
    if (data.full_phone) {
      formData.append('full_phone', data.full_phone);
    } else {
      // compat: envoyer contact aussi en full_phone si aucun full_phone n'est fourni
      formData.append('full_phone', data.contact);
    }

    if (data.country_code) {
      formData.append('country_code', data.country_code);
    }

    if (data.logo) {
      formData.append('logo', data.logo, data.logo.name);
    }

    return this.http.post<ResidenceResponse>(`${this.apiUrl}/create`, formData);
  }


  /**
   * Active une résidence
   * POST /residence/active/{id}
   */
  activateResidence(id: number): Observable<ResidenceResponse> {
    return this.http.post<ResidenceResponse>(`${this.apiUrl}/active/${id}`, {});
  }

  /**
   * Désactive une résidence
   * POST /residence/desactive/{id}
   */
  deactivateResidence(id: number): Observable<ResidenceResponse> {
    return this.http.post<ResidenceResponse>(`${this.apiUrl}/desactive/${id}`, {});
  }

  /**
   * Supprime une résidence
   * DELETE /residence/{id}
   */
  deleteResidence(id: number): Observable<ResidenceResponse> {
    return this.http.delete<ResidenceResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Met à jour une résidence
   * PUT /residence/{id}
   */
  updateResidence(id: number, data: Partial<CreateResidenceDto>): Observable<ResidenceResponse> {
    const formData = new FormData();
    
    if (data.denomination) {
      formData.append('denomination', data.denomination);
    }
    if (data.contact) {
      formData.append('contact', data.contact);
    }
    if (data.email) {
      formData.append('email', data.email);
    }
    if (data.manager) {
      formData.append('manager', data.manager);
    }
    if (data.logo) {
      formData.append('logo', data.logo, data.logo.name);
    }

    return this.http.put<ResidenceResponse>(`${this.apiUrl}/${id}`, formData);
  }
}
