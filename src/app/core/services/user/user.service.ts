import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../config/api.config';
import { UserResponse, User } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${API_CONFIG.baseUrl}/users`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}`);
  }

  createUser(data: Partial<User>) {
    return this.http.post<UserResponse>(`${this.apiUrl}`, data);
  }

  updateUser(id: number, data: Partial<User>) {
    return this.http.put<UserResponse>(`${this.apiUrl}/${id}`, data);
  }

  activateUser(id: number) {
    return this.http.post<UserResponse>(`${this.apiUrl}/active/${id}`, {});
  }

  deactivateUser(id: number) {
    return this.http.post<UserResponse>(`${this.apiUrl}/desactive/${id}`, {});
  }

  deleteUser(id: number) {
    return this.http.delete<UserResponse>(`${this.apiUrl}/${id}`);
  }
}
