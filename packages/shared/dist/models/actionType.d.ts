export type Orientation = 'Routine' | 'Base' | 'Targeted';
export type CreditType = 'KP' | 'KZ';
export interface ActionType {
    id?: string;
    name: string;
    category?: string;
    orientation: Orientation;
    unit: string;
    creditValue: number;
    type: CreditType;
    createdAt?: string;
}
//# sourceMappingURL=actionType.d.ts.map