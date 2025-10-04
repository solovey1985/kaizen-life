import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DialogsService } from '../../services/dialogs.service';

@Component({
    selector: 'app-bottom-navbar',
    standalone: true,
    imports: [MatButtonModule, MatIconModule],
    templateUrl: './bottom-navbar.html',
    styleUrls: ['./bottom-navbar.scss']
})
export class BottomNavbarComponent {

  @Output() openCharts = new EventEmitter<void>();
  @Output() goToGoals = new EventEmitter<void>();
  constructor(private dialogService: DialogsService) 
  { }
  addAction() {
      this.dialogService.openAddActionLog();
  }
}
