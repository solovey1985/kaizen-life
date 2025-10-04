export class GoalModel {
    id: number;
    name: string;
    description?: string;
    targetValue?: number;
    unit?: string;
    currentValue?: number;
    categoryId?: number;
    startDate?: Date;
    endDate?: Date;
    isCompleted?: boolean;

    constructor(
        id: number,
        name: string,
        description?: string,
        targetValue?: number,
        currentValue?: number,
        unit?: string,
        startDate?: Date,
        endDate?: Date,
        categoryId?: number
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.targetValue = targetValue;
        this.currentValue = currentValue;
        this.unit = unit;
        this.startDate = startDate;
        this.endDate = endDate;
        this.categoryId = categoryId;
    }
}
