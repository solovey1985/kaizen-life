import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class Login {
    isLoading = false;
    errorMessage = '';

    constructor(private router: Router, private authService: AuthService) {}

    async loginWithGoogle() {
        this.isLoading = true;
        this.errorMessage = '';

        try {
            // TODO: Implement Firebase Google Auth
            console.log('Спроба Google login...');
      
            // Simulate login delay
            await new Promise(resolve => setTimeout(resolve, 2000));
      
            this.authService.login();
            this.router.navigate(['/']);
      
        } catch (error) {
            console.error('Login failed:', error);
            this.errorMessage = 'Помилка входу. Спробуйте ще раз.';
        } finally {
            this.isLoading = false;
        }
    }
}
