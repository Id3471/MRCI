import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../config/api.config';
import { User, CreateUserDto, UserResponse } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${API_CONFIG.baseUrl}/user`;

  constructor(private http: HttpClient) {}

  /**
   * Récupère la liste de tous les utilisateurs
   */
  getAllUsers(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/list`);
  }


  /**
   * Récupère la liste paginée des utilisateurs
   */
  getNbUsers(limit: number, page: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/list/paginated`, {
      params: {
        limit: String(limit),
        page: String(page),
      },
    });
  }

  /**
   * Ajoute un nouvel utilisateur
   */
  createUser(data: CreateUserDto): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/store`, data);
  }

  /**
   * Modifie un utilisateur
   */
  updateUser(id: number, data: Partial<CreateUserDto>): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.apiUrl}/update/${id}`, data);
  }

  /**
   * Active un utilisateur
   */
  activateUser(id: number): Observable<UserResponse> {
    return this.http.patch<UserResponse>(`${this.apiUrl}/active/${id}`, {});
  }

  /**
   * Désactive un utilisateur
   */
  deactivateUser(id: number): Observable<UserResponse> {
    return this.http.patch<UserResponse>(`${this.apiUrl}/desactive/${id}`, {});
  }

  /**
   * Supprime un utilisateur
   */
  deleteUser(id: number): Observable<UserResponse> {
    return this.http.delete<UserResponse>(`${this.apiUrl}/delete/${id}`);
  }

  /**
   * Attribue un profil à une liste d'utilisateurs (En masse)
   * POST /user/attrib-profil
   */
  assignProfileToUsers(profilId: number, userIds: number[]): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/attrib-profil`, {
      profilId,
      userId: userIds,
    });
  }
}
