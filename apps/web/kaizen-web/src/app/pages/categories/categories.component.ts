import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DialogsService } from '../../services/dialogs.service';
import { CategoryModel } from '../../models/category.model';
import { CategoryType } from '../../models/categorytype.enum';
import { OrientationType } from '../../models/orientation.type';
import { CategoryDataService } from '../../services/category-data.service';



@Component({
    selector: 'app-categories',
    standalone: true,
    imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent {
    displayedColumns = ['id', 'name', 'description', 'type', 'orientation', 'actions'];
    dataSource = signal<CategoryModel[]>([]);
    loading = signal<boolean>(false);
    error = signal<string | null>(null);




    constructor(
        private router: Router,
        private dialogService: DialogsService,
        private dataService: CategoryDataService) {

        this.loadCategories();
    }

    private loadCategories() {
        this.loading.set(true);
        this.error.set(null);

        this.dataService.getAll().subscribe({
            next: (result) => {
                this.dataSource.set(result.data);
                this.loading.set(false);
            },
            error: (err) => {
                this.error.set('Помилка завантаження категорій');
                this.loading.set(false);
            }
        });
    }

    openCategory(row: CategoryModel) {
        this.router.navigate([`/category/${row.id}`]);
    }

    editCategory(row: CategoryModel) {
        // TODO: replace alert with dialog implementation
        alert(`Редагувати категорію: ${row.name}`);
    }

    deleteCategory(row: CategoryModel) {
        // TODO: replace with confirmation + deletion logic
        this.dataService.delete(row.id);
        this.dataSource.set(this.dataSource().filter(c => c.id !== row.id));
    }

    addCategory() {
        const dialogRef = this.dialogService.openAddCategoryDialog();

        dialogRef.closed.subscribe((result: unknown) => {
            const categoryResult = result as CategoryModel | undefined;
            if (categoryResult) {
                // Generate a new ID for the category
                this.dataSource.set([...this.dataSource(), categoryResult]);
            }
        });
    }
}
