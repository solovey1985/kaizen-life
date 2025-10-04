import { QuantityType } from "./quantity.enum";

export class ActionLogModel {
    id: number;
    actionId: number;
    categoryId?: number;
    quantityType: QuantityType;
    quantity?: number;
    logDate: Date;
    notes?: string;
    constructor(
        id: number,
        actionId: number,
        logDate: Date,
        quantityType: QuantityType,
        quantity?: number,
        notes?: string,
        categoryId?: number
    ) {
        this.id = id;
        this.actionId = actionId;
        this.logDate = logDate;
        this.quantityType = quantityType;
        this.quantity = quantity;
        this.notes = notes;
        this.categoryId = categoryId;
    }
}
