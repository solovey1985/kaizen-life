import { CategoryType } from "./categorytype.enum";
import { OrientationType } from "./orientation.type";

export class CategoryModel {
    id: number;
    name: string;
    description?: string;
    type: CategoryType;
    orientation: OrientationType;
    constructor(id: number,
        name: string,
        description?: string,
        type: CategoryType = CategoryType.Neutral,
        orientation: OrientationType = OrientationType.Base) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.type = type;
        this.orientation = orientation;
    }
}
