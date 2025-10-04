import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseDataService } from './base-data.service';
import { ActionLogModel } from '../models/action-log.model';
import { QuantityType } from '../models/quantity.enum';
import { FilterParams } from './data.interfaces';

export interface ActionLogFilterParams extends FilterParams {
    actionId?: number;
    categoryId?: number;
    quantityType?: QuantityType;
    dateFrom?: Date;
    dateTo?: Date;
    minQuantity?: number;
    maxQuantity?: number;
}

@Injectable({
    providedIn: 'root'
})
export class ActionLogDataService extends BaseDataService<ActionLogModel> {
    
    protected getEntityName(): string {
        return 'ActionLog';
    }
    
    protected getInitialData(): ActionLogModel[] {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const dayBeforeYesterday = new Date(today);
        dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);
        
        return [
            new ActionLogModel(
                1,
                1, // Ранкова зарядка
                today,
                QuantityType.minutes,
                30,
                'Повний комплекс вправ',
                1 // categoryId - Здоровʼя
            ),
            new ActionLogModel(
                2,
                2, // Медитація
                today,
                QuantityType.minutes,
                15,
                'Ранкова медитація',
                1 // categoryId - Здоровʼя
            ),
            new ActionLogModel(
                3,
                3, // Читання книг
                yesterday,
                QuantityType.minutes,
                45,
                'Читав "Атомні звички"',
                2 // categoryId - Продуктивність
            ),
            new ActionLogModel(
                4,
                4, // Вивчення мови
                yesterday,
                QuantityType.minutes,
                60,
                'Англійська мова - граматика',
                2 // categoryId - Продуктивність
            ),
            new ActionLogModel(
                5,
                5, // Прогулянка в парку
                dayBeforeYesterday,
                QuantityType.minutes,
                120,
                'Прогулянка в центральному парку',
                3 // categoryId - Відпочинок
            ),
            new ActionLogModel(
                6,
                6, // Перегляд соціальних мереж
                today,
                QuantityType.minutes,
                45,
                'Instagram та Facebook',
                4 // categoryId - Шкідливі звички
            ),
            new ActionLogModel(
                7,
                7, // Переїдання солодкого
                yesterday,
                QuantityType.times,
                3,
                'Цукерки після обіду',
                4 // categoryId - Шкідливі звички
            ),
            new ActionLogModel(
                8,
                8, // Робота над проектом
                today,
                QuantityType.minutes,
                180,
                'Розробка веб-додатку',
                2 // categoryId - Продуктивність
            ),
            new ActionLogModel(
                9,
                9, // Вечірня йога
                yesterday,
                QuantityType.minutes,
                25,
                'Розтяжка перед сном',
                1 // categoryId - Здоровʼя
            ),
            new ActionLogModel(
                10,
                10, // Слухання музики
                dayBeforeYesterday,
                QuantityType.minutes,
                90,
                'Класична музика',
                3 // categoryId - Відпочинок
            )
        ];
    }
    
    protected getSearchableFields(item: ActionLogModel): any[] {
        return [item.actionId, item.categoryId, item.quantityType, item.quantity, item.notes, item.logDate];
    }
    
    protected applySpecificFilters(data: ActionLogModel[], filters: FilterParams): ActionLogModel[] {
        const logFilters = filters as ActionLogFilterParams;
        let filtered = data;
        
        if (logFilters.actionId !== undefined) {
            filtered = filtered.filter(item => item.actionId === logFilters.actionId);
        }
        
        if (logFilters.categoryId !== undefined) {
            filtered = filtered.filter(item => item.categoryId === logFilters.categoryId);
        }
        
        if (logFilters.quantityType !== undefined) {
            filtered = filtered.filter(item => item.quantityType === logFilters.quantityType);
        }
        
        if (logFilters.dateFrom) {
            filtered = filtered.filter(item => item.logDate >= logFilters.dateFrom!);
        }
        
        if (logFilters.dateTo) {
            filtered = filtered.filter(item => item.logDate <= logFilters.dateTo!);
        }
        
        if (logFilters.minQuantity !== undefined) {
            filtered = filtered.filter(item => (item.quantity || 0) >= logFilters.minQuantity!);
        }
        
        if (logFilters.maxQuantity !== undefined) {
            filtered = filtered.filter(item => (item.quantity || 0) <= logFilters.maxQuantity!);
        }
        
        return filtered;
    }
    
    // ActionLog-specific methods
    getLogsByAction(actionId: number): Observable<ActionLogModel[]> {
        return new Observable(observer => {
            const filtered = this.getCurrentData().filter(log => log.actionId === actionId);
            setTimeout(() => {
                observer.next(filtered);
                observer.complete();
            }, 50);
        });
    }
    
    getLogsByCategory(categoryId: number): Observable<ActionLogModel[]> {
        return new Observable(observer => {
            const filtered = this.getCurrentData().filter(log => log.categoryId === categoryId);
            setTimeout(() => {
                observer.next(filtered);
                observer.complete();
            }, 50);
        });
    }
    
    getLogsByDateRange(dateFrom: Date, dateTo: Date): Observable<ActionLogModel[]> {
        return new Observable(observer => {
            const filtered = this.getCurrentData().filter(log => 
                log.logDate >= dateFrom && log.logDate <= dateTo
            );
            setTimeout(() => {
                observer.next(filtered);
                observer.complete();
            }, 50);
        });
    }
    
    getTodayLogs(): Observable<ActionLogModel[]> {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        
        return this.getLogsByDateRange(startOfDay, endOfDay);
    }
    
    getRecentLogs(days: number = 7): Observable<ActionLogModel[]> {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        
        return this.getLogsByDateRange(startDate, endDate);
    }
    
    getLogsByQuantityType(quantityType: QuantityType): Observable<ActionLogModel[]> {
        return new Observable(observer => {
            const filtered = this.getCurrentData().filter(log => log.quantityType === quantityType);
            setTimeout(() => {
                observer.next(filtered);
                observer.complete();
            }, 50);
        });
    }
    
    getTotalQuantityForAction(actionId: number, dateFrom?: Date, dateTo?: Date): Observable<number> {
        return new Observable(observer => {
            let logs = this.getCurrentData().filter(log => log.actionId === actionId);
            
            if (dateFrom) {
                logs = logs.filter(log => log.logDate >= dateFrom);
            }
            
            if (dateTo) {
                logs = logs.filter(log => log.logDate <= dateTo);
            }
            
            const total = logs.reduce((sum, log) => sum + (log.quantity || 0), 0);
            
            setTimeout(() => {
                observer.next(total);
                observer.complete();
            }, 50);
        });
    }
    
    getAverageQuantityForAction(actionId: number, dateFrom?: Date, dateTo?: Date): Observable<number> {
        return new Observable(observer => {
            let logs = this.getCurrentData().filter(log => log.actionId === actionId);
            
            if (dateFrom) {
                logs = logs.filter(log => log.logDate >= dateFrom);
            }
            
            if (dateTo) {
                logs = logs.filter(log => log.logDate <= dateTo);
            }
            
            const total = logs.reduce((sum, log) => sum + (log.quantity || 0), 0);
            const average = logs.length > 0 ? total / logs.length : 0;
            
            setTimeout(() => {
                observer.next(average);
                observer.complete();
            }, 50);
        });
    }
}