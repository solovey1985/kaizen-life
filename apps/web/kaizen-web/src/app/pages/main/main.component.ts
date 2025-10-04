import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
    selector: 'app-main',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatToolbarModule
  
    ],
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class Main {
    userBalance = { kp: 78, kz: 78 };


    goToGoals() { this.router.navigate(['/goals']); }
    goToActions() { this.router.navigate(['/actions']); }
    openCharts() {}
    addAction() {}

    constructor(private router: Router) {}
}
