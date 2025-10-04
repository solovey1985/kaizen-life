import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogsService } from '../../services/dialogs.service';
import { GoalModel } from '../../models/goal.model';
import { GoalDataService } from '../../services/goal-data.service';
import { CategoryDataService } from '../../services/category-data.service';
import { CategoryModel } from '../../models/category.model';

@Component({
    selector: 'app-goals',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule
    ],
    templateUrl: './goals.component.html',
    styleUrls: ['./goals.component.scss']
})
export class GoalsComponent {
    displayedColumns = ['id', 'name', 'description', 'category', 'actions'];
    goals = signal<GoalModel[]>([]);
    loading = signal<boolean>(false);
    error = signal<string | null>(null);
    categories: CategoryModel[] = [];

    constructor(private router: Router,
        private dialogService: DialogsService,
        private dataService: GoalDataService,
        private categoryDataService: CategoryDataService) { }

    ngOnInit() {
        this.loading.set(true);
        this.categoryDataService.getAll().subscribe({
            next: result => {
                this.categories = result.data;
                this.loadGoals();
            }
        });
    }

    private loadGoals() {
        this.loading.set(true);
        this.error.set(null);
        this.dataService.getAll().subscribe({
            next: (result) => {
                console.log(this.categories);
                var goalsWithCategoryNames = result.data.map(goal => {
                    const category = this.categories.find(cat => cat.id === goal.categoryId);
                    return { ...goal, categoryTitle: category ? category.name : 'Uncategorized' };
                }); 
                this.goals.set(goalsWithCategoryNames);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error loading goals:', err);
                this.error.set('Failed to load goals');
                this.loading.set(false);
            }
        });
    }
    // Simulate loading goals from a service
    goToCategory(goal: GoalModel) {
        this.router.navigate([`/category/${goal.categoryId}`]);
    }

    editGoal(goal: GoalModel) {
        // TODO: Open edit dialog
        alert('Edit goal: ' + goal.name);
    }

    deleteGoal(goal: GoalModel) {
        // TODO: Confirm and delete
        this.dataService.delete(goal.id).subscribe({
            next: (result) => {
                if (result.success) {
                    this.loadGoals(); // Reload goals after deletion
                } else {
                    this.error.set('Failed to delete goal');
                }
            },
            error: (err) => {
                console.error('Error deleting goal:', err);
                this.error.set('Failed to delete goal');
            }
        });
    }

    addGoal() {
        const dialogRef = this.dialogService.openAddGoalDialog();

        dialogRef.closed.subscribe((result: unknown) => {
            const goalResult = result as GoalModel | undefined;
            if (goalResult) {
                this.dataService.create(goalResult).subscribe({
                    next: (createResult) => {
                        if (createResult.success) {
                            this.loadGoals(); // Reload goals after addition
                        } else {
                            this.error.set('Failed to create goal');
                        }
                    }
                })
            }
        });
    }
}
