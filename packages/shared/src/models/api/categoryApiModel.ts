// Shared API model for Category between web and functions

// Note: Using localized string unions to mirror the current web enum values.
export type CategoryTypeApiEnum = 'Позитивна' | 'Негативна' | 'Нейтральна';
export type OrientationTypeApiEnum = 'Рутина' | 'Базова' | 'Цільова';

export interface CategoryApiModel {
    id: number;
    name: string;
    description?: string;
    type: CategoryTypeApiEnum;
    orientation: OrientationTypeApiEnum;
}
