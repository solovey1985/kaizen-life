export interface UserAction {
    id?: string;
    userId: string;
    actionTypeId: string;
    amount: number;
    calculatedCredits: number;
    type: 'KP' | 'KZ';
    date: string;
    snapshotActionType?: any;
    createdAt?: string;
}
//# sourceMappingURL=userAction.d.ts.map