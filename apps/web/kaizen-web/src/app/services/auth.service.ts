import { Injectable, signal } from '@angular/core';
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    readonly isLoggedIn = signal<true | false>(true);

    login() {
        this.isLoggedIn.set(true);
    }

    logout() {
        this.isLoggedIn.set(false);
    }
}
