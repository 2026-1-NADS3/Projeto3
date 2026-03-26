import { Observable } from 'rxjs';
import { User } from '../entities';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthService {
  login(credentials: LoginRequest): Observable<AuthTokens>;
  logout(): Observable<void>;
  refreshToken(refreshToken: string): Observable<AuthTokens>;
  getCurrentUser(): Observable<User>;
  recoverPassword(email: string): Observable<void>;
}
