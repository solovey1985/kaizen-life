// Shared API model for Action between web and functions

// File-internal alias to avoid duplicate re-exports when bundling
type QuantityTypeApi = 'minutes' | 'times' | 'occurrence' | 'undefined';

export interface ActionApiModel {
    id: number;
    name: string;
    description?: string;
    quantityType: QuantityTypeApi;
    categoryId?: number;
}
