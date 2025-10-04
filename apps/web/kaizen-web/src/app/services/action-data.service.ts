import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseDataService } from './base-data.service';
import { ActionModel } from '../models/action.model';
import { QuantityType } from '../models/quantity.enum';
import { FilterParams } from './data.interfaces';

export interface ActionFilterParams extends FilterParams {
    categoryId?: number;
    quantityType?: QuantityType;
}

@Injectable({
    providedIn: 'root'
})
export class ActionDataService extends BaseDataService<ActionModel> {
    
    protected getEntityName(): string {
        return 'Action';
    }
    
    protected getInitialData(): ActionModel[] {
        return [
            new ActionModel(
                1,
                'Ранкова зарядка',
                'Комплекс фізичних вправ на початку дня',
                QuantityType.minutes,
                1 // categoryId - Здоровʼя
            ),
            new ActionModel(
                2,
                'Медитація',
                'Практика усвідомленості та релаксації',
                QuantityType.minutes,
                1 // categoryId - Здоровʼя
            ),
            new ActionModel(
                3,
                'Читання книг',
                'Читання художньої або навчальної літератури',
                QuantityType.minutes,
                2 // categoryId - Продуктивність
            ),
            new ActionModel(
                4,
                'Вивчення мови',
                'Практика іноземної мови',
                QuantityType.minutes,
                2 // categoryId - Продуктивність
            ),
            new ActionModel(
                5,
                'Прогулянка в парку',
                'Активний відпочинок на свіжому повітрі',
                QuantityType.minutes,
                3 // categoryId - Відпочинок
            ),
            new ActionModel(
                6,
                'Перегляд соціальних мереж',
                'Час, проведений у соціальних мережах',
                QuantityType.minutes,
                4 // categoryId - Шкідливі звички
            ),
            new ActionModel(
                7,
                'Переїдання солодкого',
                'Вживання надмірної кількості цукерок',
                QuantityType.times,
                4 // categoryId - Шкідливі звички
            ),
            new ActionModel(
                8,
                'Робота над проектом',
                'Час, присвячений особистим або робочим проектам',
                QuantityType.minutes,
                2 // categoryId - Продуктивність
            ),
            new ActionModel(
                9,
                'Вечірня йога',
                'Розтяжка та релаксація перед сном',
                QuantityType.minutes,
                1 // categoryId - Здоровʼя
            ),
            new ActionModel(
                10,
                'Слухання музики',
                'Активне слухання улюбленої музики',
                QuantityType.minutes,
                3 // categoryId - Відпочинок
            )
        ];
    }
    
    protected getSearchableFields(item: ActionModel): any[] {
        return [item.name, item.description, item.quantityType, item.categoryId];
    }
    
    protected applySpecificFilters(data: ActionModel[], filters: FilterParams): ActionModel[] {
        const actionFilters = filters as ActionFilterParams;
        let filtered = data;
        
        if (actionFilters.categoryId !== undefined) {
            filtered = filtered.filter(item => item.categoryId === actionFilters.categoryId);
        }
        
        if (actionFilters.quantityType !== undefined) {
            filtered = filtered.filter(item => item.quantityType === actionFilters.quantityType);
        }
        
        return filtered;
    }
    
    // Action-specific methods
    getActionsByCategory(categoryId: number): Observable<ActionModel[]> {
        return new Observable(observer => {
            const filtered = this.getCurrentData().filter(action => action.categoryId === categoryId);
            setTimeout(() => {
                observer.next(filtered);
                observer.complete();
            }, 50);
        });
    }
    
    getActionsByQuantityType(quantityType: QuantityType): Observable<ActionModel[]> {
        return new Observable(observer => {
            const filtered = this.getCurrentData().filter(action => action.quantityType === quantityType);
            setTimeout(() => {
                observer.next(filtered);
                observer.complete();
            }, 50);
        });
    }
    
    getTimeBasedActions(): Observable<ActionModel[]> {
        return this.getActionsByQuantityType(QuantityType.minutes);
    }
    
    getCountBasedActions(): Observable<ActionModel[]> {
        return this.getActionsByQuantityType(QuantityType.times);
    }
    
    getOccurrenceBasedActions(): Observable<ActionModel[]> {
        return this.getActionsByQuantityType(QuantityType.occurrence);
    }
}