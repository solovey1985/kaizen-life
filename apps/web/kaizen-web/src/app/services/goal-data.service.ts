import { Injectable } from '@angular/core';
import { GoalModel } from '../models/goal.model';
import { BaseDataService } from './base-data.service';
import { FilterParams } from './data.interfaces';

@Injectable({ providedIn: 'root' })
export class GoalDataService extends BaseDataService<GoalModel> {
    protected override getInitialData(): GoalModel[] {
        // Example initial data for demonstration
        return [
            new GoalModel(1, 'Read 10 books', 'Finish reading 10 books this year', 1, 2, "times", new Date('2024-01-01'), new Date('2024-12-31'), 2),
            new GoalModel(2, 'Run a marathon', 'Complete a full marathon', 1, 2, "times", new Date('2024-01-01'), new Date('2024-12-31'), 3),
            new GoalModel(3, 'Meditate 100 times', 'Practice meditation 100 times', 1, 2, "times", new Date('2024-01-01'), new Date('2024-12-31'), 1),
            new GoalModel(4, 'Викурити 100 сигарет', 'Протягом 100 днів', 100, 200, "цигарки", new Date('2024-01-01'), new Date('2024-12-31'), 4),
        ];
    }

    protected override getEntityName(): string {
        return 'Goal';
    }

    protected override getSearchableFields(item: GoalModel): any[] {
        return [item.id, item.name, item.description, item.startDate, item.endDate, item.isCompleted];
    }

    protected override applySpecificFilters(data: GoalModel[], filters: FilterParams): GoalModel[] {
        let filtered = data;

        if ((filters as any).completed !== undefined) {
            filtered = filtered.filter(goal => goal.isCompleted === (filters as any).completed);
        }
        if ((filters as any).startDate) {
            filtered = filtered.filter(goal => goal.startDate !== undefined && goal.startDate >= (filters as any).startDate);
        }
        if ((filters as any).endDate) {
            filtered = filtered.filter(goal => goal.endDate !== undefined && goal.endDate <= (filters as any).endDate);
        }
        if ((filters as any).title) {
            filtered = filtered.filter(goal => goal.name.toLowerCase().includes((filters as any).title.toLowerCase()));
        }

        return filtered;
    }

    constructor() {
        super();
    }
}