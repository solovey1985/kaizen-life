import { Component, computed, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { BottomNavbarComponent } from './components/bottom-navbar/bottom-navbar';
import { MatSidenav, MatSidenavContainer, MatSidenavModule } from '@angular/material/sidenav';
import { MatNavList } from '@angular/material/list';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        BottomNavbarComponent,
        MatNavList,
        MatToolbar,
        MatIcon,
        RouterLink,
        MatSidenavModule
    ],
    templateUrl: './app.html',
    styleUrls: ['./app.scss']
})
export class App {
    constructor(private authService: AuthService) {}

    protected readonly title = signal('Kaizen Life');

    readonly isLoggedIn = computed(() => this.authService.isLoggedIn());

    logout() {
        this.authService.logout();
    }
}
