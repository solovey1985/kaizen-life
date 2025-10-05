// Shared API model for Goal between web and functions

export interface GoalApiModel {
    id: number;
    name: string;
    description?: string;
    targetValue?: number;
    unit?: string;
    currentValue?: number;
    categoryId?: number;
    startDate?: string; // ISO timestamp
    endDate?: string;   // ISO timestamp
    isCompleted?: boolean;
}
