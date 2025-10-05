export interface PaginationParams {
    page: number;
    pageSize: number;
}
export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}
export interface FilterParams {
    search?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    [key: string]: any;
}
export interface BaseModel {
    id: number;
}
export interface CrudResult<T> {
    success: boolean;
    data?: T;
    error?: string;
}
export interface DeleteResult {
    success: boolean;
    error?: string;
}
//# sourceMappingURL=data.interfaces.d.ts.map