export type CategoryTypeApiEnum = 'Позитивна' | 'Негативна' | 'Нейтральна';
export type OrientationTypeApiEnum = 'Рутина' | 'Базова' | 'Цільова';
export interface CategoryApiModel {
    id: number;
    name: string;
    description?: string;
    type: CategoryTypeApiEnum;
    orientation: OrientationTypeApiEnum;
}
//# sourceMappingURL=categoryApiModel.d.ts.map