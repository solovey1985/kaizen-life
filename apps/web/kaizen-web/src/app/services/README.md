# Data Services Architecture with Angular Signals

This document describes the comprehensive data services architecture implemented for the KaizenLife application, focusing on modern Angular signal-based patterns for CRUD operations.

## Overview

The data services provide a consistent, type-safe way to manage CRUD operations for the main data models in the application. The architecture follows a base service pattern with model-specific implementations and integrates with Angular's modern signal-based reactivity system.

## Architecture Components

### 1. Core Interfaces (`data.interfaces.ts`)

- **`BaseModel`**: Base interface for all data models with `id` property
- **`PaginationParams`**: Interface for pagination with `page`, `pageSize`, and `sortBy` options
- **`PaginatedResult<T>`**: Result wrapper with `items`, `total`, `page`, and `hasNext`
- **`FilterParams`**: Base filtering interface with `searchTerm` property
- **`CrudResult<T>`**: Wrapper for CRUD operations with `success`, `data`, and `error`
- **`DeleteResult`**: Specific result type for delete operations

### 2. Base Service (`base-data.service.ts`)

Abstract service class providing:

#### Core CRUD Operations
- `getAll(params?)`: Get all items with optional pagination and filtering
- `getById(id)`: Get a single item by ID
- `create(item)`: Create a new item
- `update(item)`: Update an existing item
- `delete(id)`: Delete an item by ID

#### Data Management
- `BehaviorSubject` for reactive data storage (transitioning to signal integration)
- Automatic ID generation for new items
- In-memory data persistence during session
- Observable pattern for real-time updates

### 3. Model-Specific Services

#### CategoryDataService
- **Initial Data**: 4 categories covering health, productivity, leisure, and negative habits
- **Specific Filters**: Filter by `CategoryType` and `OrientationType`
- **Special Methods**: Type-specific filtering and retrieval

#### ActionDataService
- **Initial Data**: 10 actions covering various activities with different quantity types
- **Specific Filters**: Filter by `categoryId` and `quantityType`
- **Special Methods**: Category and quantity type specific operations

#### ActionLogDataService
- **Initial Data**: 10 sample logs covering the last 3 days
- **Specific Filters**: Date range, action, category, quantity filtering
- **Special Methods**: Analytics and aggregation functions

## Signal-Based Component Integration

### Modern Angular Signal Pattern for CRUD Operations

Replace traditional Observable subscriptions with Angular signals for better performance and developer experience:

```typescript
import { Component, OnInit, signal, computed, inject, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-categories',
    imports: [MatTableModule, MatIconModule, MatButtonModule],
    templateUrl: './categories.component.html',
    styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {
    private categoryService = inject(CategoryDataService);
    private dialogService = inject(DialogsService);
    
    // Core signals for CRUD state management
    categories = signal<CategoryModel[]>([]);
    loading = signal<boolean>(false);
    error = signal<string | null>(null);
    selectedCategory = signal<CategoryModel | null>(null);
    
    // Computed signals for derived state
    hasCategories = computed(() => this.categories().length > 0);
    totalCategories = computed(() => this.categories().length);
    
    // Filter signals
    searchTerm = signal<string>('');
    selectedType = signal<CategoryType | null>(null);
    
    // Filtered categories computed signal
    filteredCategories = computed(() => {
        const categories = this.categories();
        const term = this.searchTerm().toLowerCase();
        const type = this.selectedType();
        
        return categories.filter(category => {
            const matchesSearch = !term || 
                category.name.toLowerCase().includes(term) ||
                category.description?.toLowerCase().includes(term);
            const matchesType = !type || category.type === type;
            
            return matchesSearch && matchesType;
        });
    });
    
    ngOnInit() {
        this.loadCategories();
    }
    
    // CRUD Operations with Signals
    
    private loadCategories() {
        this.loading.set(true);
        this.error.set(null);
        
        this.categoryService.getAll().subscribe({
            next: (result) => {
                this.categories.set(result.data);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error loading categories:', err);
                this.error.set('Failed to load categories');
                this.loading.set(false);
            }
        });
    }
    
    onCreate() {
        const dialogRef = this.dialogService.openAddCategoryDialog();
        
        dialogRef.closed.subscribe((result: CategoryModel | undefined) => {
            if (result) {
                this.categoryService.create(result).subscribe({
                    next: (createResult) => {
                        if (createResult.success) {
                            // Update signal with new category
                            this.categories.update(categories => [...categories, createResult.data]);
                        } else {
                            this.error.set('Failed to create category');
                        }
                    },
                    error: () => {
                        this.error.set('Failed to create category');
                    }
                });
            }
        });
    }
    
    onEdit(category: CategoryModel) {
        const dialogRef = this.dialogService.openEditCategoryDialog(category);
        
        dialogRef.closed.subscribe((result: CategoryModel | undefined) => {
            if (result) {
                this.categoryService.update(result).subscribe({
                    next: (updateResult) => {
                        if (updateResult.success) {
                            // Update signal by replacing the edited category
                            this.categories.update(categories =>
                                categories.map(c => c.id === result.id ? updateResult.data : c)
                            );
                        } else {
                            this.error.set('Failed to update category');
                        }
                    },
                    error: () => {
                        this.error.set('Failed to update category');
                    }
                });
            }
        });
    }
    
    onDelete(category: CategoryModel) {
        if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
            this.categoryService.delete(category.id).subscribe({
                next: (deleteResult) => {
                    if (deleteResult.success) {
                        // Update signal by filtering out deleted category
                        this.categories.update(categories =>
                            categories.filter(c => c.id !== category.id)
                        );
                        
                        // Clear selection if deleted category was selected
                        if (this.selectedCategory()?.id === category.id) {
                            this.selectedCategory.set(null);
                        }
                    } else {
                        this.error.set('Failed to delete category');
                    }
                },
                error: () => {
                    this.error.set('Failed to delete category');
                }
            });
        }
    }
    
    onSelect(category: CategoryModel) {
        this.selectedCategory.set(category);
    }
    
    // Filter operations
    onSearchChange(term: string) {
        this.searchTerm.set(term);
    }
    
    onTypeFilter(type: CategoryType | null) {
        this.selectedType.set(type);
    }
    
    clearFilters() {
        this.searchTerm.set('');
        this.selectedType.set(null);
    }
}
```

### Advanced Signal Pattern with toSignal()

For more sophisticated reactive patterns, convert observables to signals:

```typescript
@Component({
    selector: 'app-actions',
    imports: [MatTableModule, MatIconModule, MatButtonModule],
    templateUrl: './actions.component.html',
    styleUrl: './actions.component.scss'
})
export class ActionsComponent {
    private actionService = inject(ActionDataService);
    private categoryService = inject(CategoryDataService);
    
    // Filter state as signals
    searchTerm = signal<string>('');
    selectedCategoryId = signal<number | null>(null);
    currentPage = signal<number>(1);
    
    // Computed signal for filter parameters
    filterParams = computed(() => ({
        page: this.currentPage(),
        pageSize: 10,
        searchTerm: this.searchTerm(),
        categoryId: this.selectedCategoryId()
    }));
    
    // Convert observable to signal for automatic updates
    private actionsResult = toSignal(
        this.actionService.getAll().pipe(
            startWith({ data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 })
        ),
        { initialValue: { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 } }
    );
    
    // Derived signals that automatically update
    actions = computed(() => this.actionsResult()?.data ?? []);
    loading = computed(() => this.actionsResult() === null);
    totalActions = computed(() => this.actionsResult()?.total ?? 0);
    
    // Categories for filtering
    categories = toSignal(
        this.categoryService.getAll().pipe(
            map(result => result.data),
            startWith([])
        ),
        { initialValue: [] }
    );
    
    // Effect for logging when actions change
    private logActionsChange = effect(() => {
        console.log(`Actions updated: ${this.actions().length} items`);
    });
    
    onCreate() {
        const dialogRef = this.dialogService.openAddActionDialog();
        
        dialogRef.closed.subscribe((result: ActionModel | undefined) => {
            if (result) {
                this.actionService.create(result).subscribe({
                    next: (createResult) => {
                        if (createResult.success) {
                            // Service will automatically update and signal will react
                            console.log('Action created successfully');
                        }
                    }
                });
            }
        });
    }
    
    onDelete(action: ActionModel) {
        this.actionService.delete(action.id).subscribe({
            next: (result) => {
                if (result.success) {
                    // Service will automatically update and signal will react
                    console.log('Action deleted successfully');
                }
            }
        });
    }
    
    onSearchChange(term: string) {
        this.searchTerm.set(term);
        this.currentPage.set(1); // Reset to first page
    }
    
    onCategoryFilter(categoryId: number | null) {
        this.selectedCategoryId.set(categoryId);
        this.currentPage.set(1);
    }
}
```

### Template Integration with Signals

Use signal syntax in templates for automatic change detection:

```html
<!-- Use signal() syntax to access signal values -->
@if (loading()) {
    <div class="loading">Loading categories...</div>
} @else if (error()) {
    <div class="error">{{ error() }}</div>
} @else {
    <div class="search-filter">
        <input 
            type="text" 
            placeholder="Search categories..." 
            [value]="searchTerm()"
            (input)="onSearchChange($event.target.value)"
        />
        
        <select (change)="onTypeFilter($event.target.value)">
            <option value="">All Types</option>
            <option value="Positive">Positive</option>
            <option value="Negative">Negative</option>
            <option value="Neutral">Neutral</option>
        </select>
    </div>
    
    <table mat-table [dataSource]="filteredCategories()">
        <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let category">{{ category.name }}</td>
        </ng-container>
        
        <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef>Type</th>
            <td mat-cell *matCellDef="let category">{{ category.type }}</td>
        </ng-container>
        
        <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let category">
                <button mat-icon-button (click)="onEdit(category)">
                    <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="onDelete(category)">
                    <mat-icon>delete</mat-icon>
                </button>
            </td>
        </ng-container>
        
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
    
    @if (!hasCategories()) {
        <div class="no-data">No categories found</div>
    }
    
    <div class="summary">
        Total categories: {{ totalCategories() }}
        @if (searchTerm()) {
            | Filtered: {{ filteredCategories().length }}
        }
    </div>
}
```

### Effects for Side Effects

Use effects for handling side effects based on signal changes:

```typescript
export class ActionLogComponent {
    private actionLogService = inject(ActionLogDataService);
    
    selectedActionId = signal<number | null>(null);
    selectedDateRange = signal<{ start: Date; end: Date } | null>(null);
    
    // Effect to automatically load logs when filters change
    private loadLogsEffect = effect(() => {
        const actionId = this.selectedActionId();
        const dateRange = this.selectedDateRange();
        
        if (actionId && dateRange) {
            this.loadFilteredLogs(actionId, dateRange.start, dateRange.end);
        }
    });
    
    // Effect for analytics calculations
    private analyticsEffect = effect(() => {
        const actionId = this.selectedActionId();
        if (actionId) {
            this.calculateAnalytics(actionId);
        }
    });
    
    private loadFilteredLogs(actionId: number, startDate: Date, endDate: Date) {
        this.actionLogService.getLogsByDateRange(startDate, endDate)
            .subscribe(logs => {
                const filteredLogs = logs.filter(log => log.actionId === actionId);
                this.logs.set(filteredLogs);
            });
    }
    
    private calculateAnalytics(actionId: number) {
        this.actionLogService.getTotalQuantityForAction(actionId)
            .subscribe(total => this.totalQuantity.set(total));
            
        this.actionLogService.getAverageQuantityForAction(actionId)
            .subscribe(average => this.averageQuantity.set(average));
    }
}
```

## Signal Benefits in KaizenLife

1. **Automatic Change Detection**: Signals trigger updates only when values actually change
2. **Performance**: More efficient than traditional change detection with OnPush strategy
3. **Type Safety**: Full TypeScript support with compile-time checking
4. **Reactive Composition**: Easy to create derived state with `computed()`
5. **Memory Management**: Automatic cleanup when components are destroyed
6. **Side Effects**: Controlled side effects with `effect()` for analytics and logging
7. **Developer Experience**: Cleaner, more intuitive reactive patterns

## Migration from Observables to Signals

### Legacy Observable Pattern (Deprecated)

```typescript
// ❌ Old pattern - requires manual subscription management
export class ActionsComponent implements OnInit, OnDestroy {
    actions: ActionModel[] = [];
    loading = false;
    private destroy$ = new Subject<void>();
    
    ngOnInit() {
        this.actionService.getAll()
            .pipe(takeUntil(this.destroy$))
            .subscribe(result => {
                this.actions = result.data;
                this.cdr.markForCheck();
            });
    }
    
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
```

### Modern Signal Pattern (Recommended)

```typescript
// ✅ New pattern - automatic cleanup and change detection
export class ActionsComponent {
    private actionService = inject(ActionDataService);
    
    actions = signal<ActionModel[]>([]);
    loading = signal<boolean>(false);
    
    constructor() {
        this.loadActions();
    }
    
    private loadActions() {
        this.loading.set(true);
        this.actionService.getAll().subscribe({
            next: result => {
                this.actions.set(result.data);
                this.loading.set(false);
            }
        });
    }
    
    // No ngOnDestroy needed - signals handle cleanup automatically
}
```

## Migration to REST APIs

When ready to connect to Firebase Functions backend, the signal-based components require minimal changes:

1. **Service Layer**: Update data services to use HTTP requests
2. **Component Logic**: No changes needed - signals work the same way
3. **Templates**: No changes needed - signal syntax remains identical
4. **Error Handling**: Enhanced error states through signals

```typescript
// Future Firebase integration
@Injectable()
export class CategoryDataService {
    private http = inject(HttpClient);
    
    getAll(): Observable<PaginatedResult<CategoryModel>> {
        return this.http.get<PaginatedResult<CategoryModel>>('/api/categories');
    }
    
    create(category: CategoryModel): Observable<CrudResult<CategoryModel>> {
        return this.http.post<CrudResult<CategoryModel>>('/api/categories', category);
    }
    
    // Component signals remain unchanged
}
```

## Best Practices

### Signal Usage Guidelines

1. **Use signals for component state**: Replace component properties with signals
2. **Computed for derived state**: Use `computed()` for calculated values  
3. **Effects for side effects**: Use `effect()` for analytics, logging, or external API calls
4. **Signal updates**: Use `.set()` for replacement, `.update()` for modifications
5. **Template binding**: Always use `signal()` syntax in templates

### Performance Optimization

1. **Granular signals**: Create specific signals for different data aspects
2. **Computed signals**: Derive state instead of manual calculations
3. **toSignal for observables**: Convert service observables when appropriate
4. **Lazy loading**: Load data only when components need it

The signal-based architecture provides a modern, performant foundation for the KaizenLife application that scales well as the application grows and migrates to Firebase Functions backend.