import { Component, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { ActionModel } from '../../models/action.model';
import { QuantityType } from '../../models/quantity.enum';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DialogsService } from '../../services/dialogs.service';
import { ActionDataService } from '../../services/action-data.service';

@Component({
    selector: 'app-actions',
    imports: [MatTableModule, MatIconModule, MatButtonModule],
    templateUrl: './actions.component.html',
    styleUrl: './actions.component.scss'
})
export class ActionsComponent {

    actionsSource = signal<ActionModel[]>([]);
    lodading = signal<boolean>(true);
    error = signal<string | null>(null);

    constructor(private dataService: ActionDataService, private dialogs: DialogsService) {

        this.dataService.getAll().subscribe(result => {
            this.actionsSource.set(result.data);
        });
    }

    displayedColumns: string[] = ['id', 'name', 'description'];

    onAdd() {
        const dialogRef = this.dialogs.openAddActionDialog();

        // Reload data after adding new action
        dialogRef.closed.subscribe(result => {
            if (result) {
                this.loadActions();
            }
        });
    }



    onDelete(action: ActionModel) {
        this.dataService.delete(action.id).subscribe({
            next: (result) => {
                if (result.success) {
                    this.loadActions(); // Refresh after deletion
                } else {
                    this.error.set('Failed to delete action');
                }
            },
            error: (err) => {
                console.error('Error deleting action:', err);
                this.error.set('Failed to delete action');
            }
        });
    }
    onEdit(action: ActionModel) {
        console.log('Edit action', action);
        // TODO: Implement edit functionality
    }
    
    private loadActions() {
        this.lodading.set(true);
        this.error.set(null);

        this.dataService.getAll().subscribe({
            next: result => {
                this.actionsSource.set(result.data);
                this.lodading.set(false);
            },
            error: err => {
                this.error.set('Помилка завантаження дій');
                this.lodading.set(false);
            }
        });
    }
}
