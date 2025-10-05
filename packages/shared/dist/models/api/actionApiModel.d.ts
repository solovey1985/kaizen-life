type QuantityTypeApi = 'minutes' | 'times' | 'occurrence' | 'undefined';
export interface ActionApiModel {
    id: number;
    name: string;
    description?: string;
    quantityType: QuantityTypeApi;
    categoryId?: number;
}
export {};
//# sourceMappingURL=actionApiModel.d.ts.map