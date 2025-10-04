import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { DialogRef } from '@angular/cdk/dialog';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CategoryModel } from '../../models/category.model';
import { CategoryType } from '../../models/categorytype.enum';
import { OrientationType } from '../../models/orientation.type';

@Component({
    selector: 'app-add-category-dialog',
    imports: [
        MatCardModule,
        MatButtonModule,
        MatSelectModule,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule
    ],
    templateUrl: './add-category-dialog.html',
    styleUrl: './add-category-dialog.scss'
})
export class AddCategoryDialog {
    form: FormGroup;
    
    // Enum values for template
    categoryTypes = Object.values(CategoryType);
    orientationTypes = Object.values(OrientationType);
    
    // Enum references for template
    CategoryType = CategoryType;
    OrientationType = OrientationType;

    constructor(public dialogRef: DialogRef<CategoryModel>, private fb: FormBuilder) {
        this.form = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            description: [''],
            type: [CategoryType.Neutral, Validators.required],
            orientation: [OrientationType.Base, Validators.required]
        });
    }

    onOverlayClick(event: MouseEvent) {
        if (event.target === event.currentTarget) {
            // Click was on the overlay, close the dialog
            this.closeDialog();
        }
    }

    closeDialog() {
        this.dialogRef.close();
    }

    onSubmit() {
        if (this.form.valid) {
            const formValue = this.form.value;
            const newCategory = new CategoryModel(
                0, // ID will be assigned by the service
                formValue.name,
                formValue.description,
                formValue.type,
                formValue.orientation
            );
            this.dialogRef.close(newCategory);
        } else {
            // Mark all fields as touched to show validation errors
            this.form.markAllAsTouched();
        }
    }

    // Helper methods for form validation
    hasError(fieldName: string, errorType: string): boolean {
        const field = this.form.get(fieldName);
        return field ? field.hasError(errorType) && (field.dirty || field.touched) : false;
    }

    getErrorMessage(fieldName: string): string {
        const field = this.form.get(fieldName);
        if (field?.hasError('required')) {
            return `${fieldName} є обов'язковим`;
        }
        if (field?.hasError('minlength')) {
            return `${fieldName} повинно містити принаймні 2 символи`;
        }
        return '';
    }
}
