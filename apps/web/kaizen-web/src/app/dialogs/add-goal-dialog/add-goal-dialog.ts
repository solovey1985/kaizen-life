import { DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { GoalModel } from '../../models/goal.model';
import { CategoryModel } from '../../models/category.model';
import { CategoryDataService } from '../../services/category-data.service';

@Component({
    selector: 'app-add-goal-dialog',
    imports: [
        MatCardModule,
        MatButtonModule,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatDatepickerModule,
        MatNativeDateModule
    ],
    templateUrl: './add-goal-dialog.html',
    styleUrl: './add-goal-dialog.scss'
})
export class AddGoalDialog implements OnInit {
    goalForm: FormGroup;
    categories: CategoryModel[] = [];
    
    constructor(
        public dialogRef: DialogRef<GoalModel>, 
        private fb: FormBuilder,
        private categoryService: CategoryDataService
    ) {
        this.goalForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            description: [''],
            targetValue: ['', [Validators.min(0)]],
            unit: [''],
            currentValue: [0, [Validators.min(0)]],
            startDate: [new Date()],
            endDate: [''],
            categoryId: ['']
        });
    }

    ngOnInit() {
        // Load categories from the service
        this.categoryService.getAll().subscribe(result => {
            this.categories = result.data;
        });
    }

    saveGoal() {
        if (this.goalForm.valid) {
            const formValue = this.goalForm.value;
            const newGoal = new GoalModel(
                0, // ID will be assigned by the service
                formValue.name,
                formValue.description,
                formValue.targetValue,
                formValue.currentValue,
                formValue.unit,
                formValue.startDate,
                formValue.endDate,
                formValue.categoryId
            );
            this.dialogRef.close(newGoal);
        } else {
            // Mark all fields as touched to show validation errors
            this.goalForm.markAllAsTouched();
        }
    }

    onOverlayClick(event: MouseEvent) {
        if (event.target === event.currentTarget) {
            // Click was on the overlay, close the dialog
            this.dialogRef.close();
        }
    }

    closeDialog() {
        this.dialogRef.close();
    }

    // Helper methods for form validation
    hasError(fieldName: string, errorType: string): boolean {
        const field = this.goalForm.get(fieldName);
        return field ? field.hasError(errorType) && (field.dirty || field.touched) : false;
    }

    getErrorMessage(fieldName: string): string {
        const field = this.goalForm.get(fieldName);
        if (field?.hasError('required')) {
            return `${fieldName} є обов'язковим`;
        }
        if (field?.hasError('minlength')) {
            return `${fieldName} повинно містити принаймні 2 символи`;
        }
        if (field?.hasError('min')) {
            return `${fieldName} повинно бути більше або дорівнювати 0`;
        }
        return '';
    }
}
