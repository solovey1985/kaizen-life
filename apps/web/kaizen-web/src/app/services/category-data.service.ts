import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseDataService } from './base-data.service';
import { CategoryModel } from '../models/category.model';
import { CategoryType } from '../models/categorytype.enum';
import { OrientationType } from '../models/orientation.type';
import { FilterParams } from './data.interfaces';

export interface CategoryFilterParams extends FilterParams {
    type?: CategoryType;
    orientation?: OrientationType;
}

@Injectable({
    providedIn: 'root'
})
export class CategoryDataService extends BaseDataService<CategoryModel> {
    
    protected getEntityName(): string {
        return 'Category';
    }
    
    protected getInitialData(): CategoryModel[] {
        return [
            new CategoryModel(
                1,
                'Здоровʼя',
                'Дії для підтримки фізичного та ментального здоровʼя',
                CategoryType.Positive,
                OrientationType.Base
            ),
            new CategoryModel(
                2,
                'Продуктивність',
                'Категорія для роботи, навчання та продуктивних звичок',
                CategoryType.Positive,
                OrientationType.Routine
            ),
            new CategoryModel(
                3,
                'Відпочинок',
                'Активності для відпочинку та відновлення енергії',
                CategoryType.Neutral,
                OrientationType.Targeted
            ),
            new CategoryModel(
                4,
                'Шкідливі звички',
                'Негативні дії, які потрібно контролювати',
                CategoryType.Negative,
                OrientationType.Base
            )
        ];
    }
    
    protected getSearchableFields(item: CategoryModel): any[] {
        return [item.name, item.description, item.type, item.orientation];
    }
    
    protected applySpecificFilters(data: CategoryModel[], filters: FilterParams): CategoryModel[] {
        const categoryFilters = filters as CategoryFilterParams;
        let filtered = data;
        
        if (categoryFilters.type) {
            filtered = filtered.filter(item => item.type === categoryFilters.type);
        }
        
        if (categoryFilters.orientation) {
            filtered = filtered.filter(item => item.orientation === categoryFilters.orientation);
        }
        
        return filtered;
    }
    
    // Category-specific methods
    getCategoriesByType(type: CategoryType): Observable<CategoryModel[]> {
        return new Observable(observer => {
            const filtered = this.getCurrentData().filter(category => category.type === type);
            setTimeout(() => {
                observer.next(filtered);
                observer.complete();
            }, 50);
        });
    }
    
    getCategoriesByOrientation(orientation: OrientationType): Observable<CategoryModel[]> {
        return new Observable(observer => {
            const filtered = this.getCurrentData().filter(category => category.orientation === orientation);
            setTimeout(() => {
                observer.next(filtered);
                observer.complete();
            }, 50);
        });
    }
    
    getPositiveCategories(): Observable<CategoryModel[]> {
        return this.getCategoriesByType(CategoryType.Positive);
    }
    
    getNegativeCategories(): Observable<CategoryModel[]> {
        return this.getCategoriesByType(CategoryType.Negative);
    }
}