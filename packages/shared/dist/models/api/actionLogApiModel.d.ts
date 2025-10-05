type QuantityTypeApiModel = 'minutes' | 'times' | 'occurrence' | 'undefined';
export interface ActionLogApiModel {
    id: number;
    actionId: number;
    categoryId?: number;
    quantityType: QuantityTypeApiModel;
    quantity?: number;
    logDate: string;
    notes?: string;
}
export {};
//# sourceMappingURL=actionLogApiModel.d.ts.map