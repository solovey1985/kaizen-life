import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';

@Component({
    selector: 'app-top-navbar',
    imports: [MatToolbar, MatIcon, MatSidenavModule],
    templateUrl: './top-navbar.component.html',
    styleUrl: './top-navbar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopNavbarComponent {
  @ViewChild('mainDrawer', { static: false }) private mainDrawer?: MatDrawer;

  toggleMenu(): void {
      this.mainDrawer?.toggle();
  }

  closeMenu(): void {
      this.mainDrawer?.close();
  }
}
