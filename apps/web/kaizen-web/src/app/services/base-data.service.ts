import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { 
    BaseModel, 
    PaginationParams, 
    PaginatedResult, 
    FilterParams, 
    CrudResult, 
    DeleteResult 
} from './data.interfaces';

@Injectable({
    providedIn: 'root'
})
export abstract class BaseDataService<T extends BaseModel> {
    protected data$ = new BehaviorSubject<T[]>([]);
    protected nextId = 1;
    
    // Abstract method to get initial data - to be implemented by child services
    protected abstract getInitialData(): T[];
    
    // Abstract method for entity name - used in error messages
    protected abstract getEntityName(): string;
    
    constructor() {
        this.initializeData();
    }
    
    protected initializeData(): void {
        const initialData = this.getInitialData();
        this.nextId = initialData.length > 0 ? Math.max(...initialData.map(item => item.id)) + 1 : 1;
        this.data$.next(initialData);
    }
    
    // Get all entities with pagination and filtering
    getAll(pagination?: PaginationParams, filters?: FilterParams): Observable<PaginatedResult<T>> {
        return this.data$.pipe(
            map(data => {
                let filteredData = [...data];
                
                // Apply filters
                if (filters) {
                    filteredData = this.applyFilters(filteredData, filters);
                }
                
                // Apply sorting
                if (filters?.sortBy) {
                    filteredData = this.applySorting(filteredData, filters.sortBy, filters.sortDirection || 'asc');
                }
                
                const total = filteredData.length;
                
                // Apply pagination
                if (pagination) {
                    const startIndex = (pagination.page - 1) * pagination.pageSize;
                    const endIndex = startIndex + pagination.pageSize;
                    filteredData = filteredData.slice(startIndex, endIndex);
                }
                
                return {
                    data: filteredData,
                    total,
                    page: pagination?.page || 1,
                    pageSize: pagination?.pageSize || total,
                    totalPages: pagination ? Math.ceil(total / pagination.pageSize) : 1
                };
            }),
            delay(100) // Simulate API delay
        );
    }
    
    // Get entity by ID
    getById(id: number): Observable<CrudResult<T>> {
        return this.data$.pipe(
            map(data => {
                const item = data.find(entity => entity.id === id);
                if (item) {
                    return { success: true, data: item };
                } else {
                    return { success: false, error: `${this.getEntityName()} with ID ${id} not found` };
                }
            }),
            delay(50)
        );
    }
    
    // Create new entity
    create(entity: Omit<T, 'id'>): Observable<CrudResult<T>> {
        return new Observable(observer => {
            try {
                const newEntity = { ...entity, id: this.nextId++ } as T;
                const currentData = this.data$.value;
                const updatedData = [...currentData, newEntity];
                this.data$.next(updatedData);
                
                setTimeout(() => {
                    observer.next({ success: true, data: newEntity });
                    observer.complete();
                }, 100);
            } catch (error) {
                observer.next({ 
                    success: false, 
                    error: `Failed to create ${this.getEntityName()}: ${error}` 
                });
                observer.complete();
            }
        });
    }
    
    // Update existing entity
    update(id: number, updates: Partial<Omit<T, 'id'>>): Observable<CrudResult<T>> {
        return new Observable(observer => {
            try {
                const currentData = this.data$.value;
                const index = currentData.findIndex(entity => entity.id === id);
                
                if (index === -1) {
                    observer.next({ 
                        success: false, 
                        error: `${this.getEntityName()} with ID ${id} not found` 
                    });
                    observer.complete();
                    return;
                }
                
                const updatedEntity = { ...currentData[index], ...updates } as T;
                const updatedData = [...currentData];
                updatedData[index] = updatedEntity;
                this.data$.next(updatedData);
                
                setTimeout(() => {
                    observer.next({ success: true, data: updatedEntity });
                    observer.complete();
                }, 100);
            } catch (error) {
                observer.next({ 
                    success: false, 
                    error: `Failed to update ${this.getEntityName()}: ${error}` 
                });
                observer.complete();
            }
        });
    }
    
    // Delete entity
    delete(id: number): Observable<DeleteResult> {
        return new Observable(observer => {
            try {
                const currentData = this.data$.value;
                const index = currentData.findIndex(entity => entity.id === id);
                
                if (index === -1) {
                    observer.next({ 
                        success: false, 
                        error: `${this.getEntityName()} with ID ${id} not found` 
                    });
                    observer.complete();
                    return;
                }
                
                const updatedData = currentData.filter(entity => entity.id !== id);
                this.data$.next(updatedData);
                
                setTimeout(() => {
                    observer.next({ success: true });
                    observer.complete();
                }, 100);
            } catch (error) {
                observer.next({ 
                    success: false, 
                    error: `Failed to delete ${this.getEntityName()}: ${error}` 
                });
                observer.complete();
            }
        });
    }
    
    // Protected helper methods for filtering and sorting
    protected applyFilters(data: T[], filters: FilterParams): T[] {
        let filtered = data;
        
        // Generic search functionality
        if (filters.search) {
            filtered = filtered.filter(item => 
                this.matchesSearch(item, filters.search!)
            );
        }
        
        // Allow child classes to add specific filters
        return this.applySpecificFilters(filtered, filters);
    }
    
    protected applySorting(data: T[], sortBy: string, direction: 'asc' | 'desc'): T[] {
        return data.sort((a, b) => {
            const aValue = this.getPropertyValue(a, sortBy);
            const bValue = this.getPropertyValue(b, sortBy);
            
            let comparison = 0;
            if (aValue < bValue) comparison = -1;
            if (aValue > bValue) comparison = 1;
            
            return direction === 'desc' ? -comparison : comparison;
        });
    }
    
    protected getPropertyValue(obj: any, path: string): any {
        return path.split('.').reduce((current, prop) => current?.[prop], obj);
    }
    
    protected matchesSearch(item: T, searchTerm: string): boolean {
        const searchLower = searchTerm.toLowerCase();
        return this.getSearchableFields(item).some(field => 
            field?.toString().toLowerCase().includes(searchLower)
        );
    }
    
    // Abstract methods for child classes to implement
    protected abstract getSearchableFields(item: T): any[];
    protected abstract applySpecificFilters(data: T[], filters: FilterParams): T[];
    
    // Get current data snapshot
    getCurrentData(): T[] {
        return this.data$.value;
    }
    
    // Get data as observable
    getData(): Observable<T[]> {
        return this.data$.asObservable();
    }
}