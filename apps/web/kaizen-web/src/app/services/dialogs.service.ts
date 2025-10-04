import { Injectable, inject } from '@angular/core';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { AddActionLog as AddActionLogDialog } from '../dialogs/add-action-log/add-action-log';
import { AddCategoryDialog } from '../dialogs/add-category-dialog/add-category-dialog';
import { AddActionDialog } from '../dialogs/add-action-dialog/add-action-dialog';
import { AddGoalDialog } from '../dialogs/add-goal-dialog/add-goal-dialog';
import { GoalModel } from '../models/goal.model';
import { CategoryModel } from '../models/category.model';

@Injectable({
    providedIn: 'root'
})
export class DialogsService {
    private dialog = inject(Dialog);

    openAddActionLog(): DialogRef<AddActionLogDialog, any> {
        return this.dialog.open(AddActionLogDialog, {
            disableClose: false
        });
    }
    openAddCategoryDialog() {
        return this.dialog.open(AddCategoryDialog, {
            disableClose: false
        });
    }

    openAddActionDialog(): DialogRef<AddActionDialog, any> {
        return this.dialog.open(AddActionDialog, {
            disableClose: false
        });
    }

    openAddGoalDialog() {
        return this.dialog.open(AddGoalDialog, {
            disableClose: false
        });
    }
}
