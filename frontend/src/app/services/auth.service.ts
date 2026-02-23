import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private api = inject(ApiService);
    private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
    isLoggedIn$ = this.isLoggedInSubject.asObservable();

    private hasToken(): boolean {
        return !!localStorage.getItem('access_token');
    }

    login(code: string) {
        return this.api.post<{ access_token: string }>('auth/login', { code }).pipe(
            tap(res => {
                localStorage.setItem('access_token', res.access_token);
                this.isLoggedInSubject.next(true);
            })
        );
    }

    logout() {
        localStorage.removeItem('access_token');
        this.isLoggedInSubject.next(false);
    }
}
