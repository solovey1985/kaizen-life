import { DialogRef } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
    selector: 'app-add-action-dialog',
    templateUrl: './add-action-dialog.html',
    styleUrl: './add-action-dialog.scss',
    imports: [
        ReactiveFormsModule,
        MatInputModule,
        MatCardModule,
        MatSelectModule
    ]
})
export class AddActionDialog {
    form: FormGroup;
    categories = [
        { id: 'health', name: 'Здоровʼя' },
        { id: 'productivity', name: 'Продуктивність' }
    // Add more categories as needed
    ];

    constructor(
    private dialogRef: DialogRef<string>,
    private fb: FormBuilder
    ) {
        this.form = this.fb.group({
            name: [''],
            description: [''],
            categoryId: ['']
        });
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

    onOverlayClick(event: MouseEvent) {
        if (event.target === event.currentTarget) {
            // Click was on the overlay, close the dialog
            this.dialogRef.close();
        }
    }

    saveAction(): void {
        if (this.form.valid) {
            // Here you would send the form value to your backend or service
            // For now, just close the dialog and return the form value
            this.dialogRef.close(this.form.value);
        } else {
            this.form.markAllAsTouched();
        }
    }
}
