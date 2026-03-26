import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { IAuthService, LoginRequest, AuthTokens } from '../../core/interfaces';
import { User } from '../../core/entities';
import { ApiService } from '../services/api.service';
import { TokenStorageService } from '../services/token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements IAuthService {
  constructor(
    private readonly api: ApiService,
    private readonly tokenStorage: TokenStorageService
  ) {}

  login(credentials: LoginRequest): Observable<AuthTokens> {
    return this.api.post<AuthTokens>('auth/login', credentials).pipe(
      tap((tokens) => {
        this.tokenStorage.saveTokens(tokens.accessToken, tokens.refreshToken);
      })
    );
  }

  logout(): Observable<void> {
    return this.api.post<void>('auth/logout', {}).pipe(
      tap(() => {
        this.tokenStorage.clear();
      })
    );
  }

  refreshToken(refreshToken: string): Observable<AuthTokens> {
    return this.api.post<AuthTokens>('auth/refresh', { refreshToken }).pipe(
      tap((tokens) => {
        this.tokenStorage.saveTokens(tokens.accessToken, tokens.refreshToken);
      })
    );
  }

  getCurrentUser(): Observable<User> {
    return this.api.get<User>('auth/me');
  }

  recoverPassword(email: string): Observable<void> {
    return this.api.post<void>('auth/recover-password', { email });
  }
}
