import { DialogRef } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-add-action-log',
    imports: [
        MatCardModule,
        MatButtonModule,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule
    ],
    templateUrl: './add-action-log.html',
    styleUrl: './add-action-log.scss'
})
export class AddActionLog {
    logForm: FormGroup;
    constructor(public dialogRef: DialogRef<string>, private fb: FormBuilder) {
        this.logForm = this.fb.group({
            name: [''],
            quantity: ['']
        });
    }
    saveActionLog() {
        throw new Error('Method not implemented.');
    }

    onOverlayClick(event: MouseEvent) {
        if (event.target === event.currentTarget) {
            // Click was on the overlay, close the dialog
            this.dialogRef.close();
        }
    }

    closeDialog() {
    // TODO: Implement dialog close logic
        this.dialogRef.close();
    }
}
