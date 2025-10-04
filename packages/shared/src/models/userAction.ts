export interface UserAction {
  id?: string;
  userId: string;
  actionTypeId: string;
  amount: number;
  calculatedCredits: number;
  type: 'KP' | 'KZ';
  date: string; // ISO timestamp
  snapshotActionType?: any; // store actionType snapshot to preserve historical creditValue
  createdAt?: string;
}
