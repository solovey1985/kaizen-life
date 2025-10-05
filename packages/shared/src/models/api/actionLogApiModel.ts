// Shared API model for Action Log between web and functions

// File-internal alias to avoid duplicate re-exports when bundling
type QuantityTypeApiModel = 'minutes' | 'times' | 'occurrence' | 'undefined';

export interface ActionLogApiModel {
    id: number;
    actionId: number;
    categoryId?: number;
    quantityType: QuantityTypeApiModel;
    quantity?: number;
    logDate: string; // ISO timestamp for transport
    notes?: string;
}
