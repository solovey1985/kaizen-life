import { QuantityType } from './quantity.enum';

export class ActionModel {
    id: number;
    name: string;
    description?: string;
    quantityType: QuantityType;
    categoryId?: number;
    constructor(
        id: number,
        name: string,
        description?: string,
        quantityType: QuantityType = QuantityType.undefined,
        categoryId?: number
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.quantityType = quantityType;
        this.categoryId = categoryId;
    }
}
