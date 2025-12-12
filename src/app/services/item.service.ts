import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// TypeScript Enum - demonstrating advanced TypeScript usage
export enum ItemStatus {
  Pending = 'pending',
  Completed = 'completed'
}

// TypeScript Interface - strong typing for task items
export interface Item {
  id: string;
  title: string;
  status: ItemStatus;
}

@Injectable({ providedIn: 'root' })
export class ItemService {
  // RxJS BehaviorSubject for reactive state management
  private items$ = new BehaviorSubject<Item[]>([]);
  itemsObservable = this.items$.asObservable();

  constructor() {}

  getItems(): Item[] {
    return this.items$.value;
  }

  // TypeScript Generic with constraint - advanced type safety
  addItem<T extends Item>(item: T) {
    // Spread operator (...) for immutability - Modern JS feature
    this.items$.next([...this.items$.value, item]);
  }

  toggleItem(id: string) {
    // Array.map() method - transforming array elements
    // Arrow function and ternary operator - Modern JS features
    // Object spread {...item} for immutable updates
    this.items$.next(
      this.items$.value.map(item =>
        item.id === id
          ? { ...item, status: item.status === ItemStatus.Pending ? ItemStatus.Completed : ItemStatus.Pending }
          : item
      )
    );
  }

  deleteItem(id: string) {
    // Array.filter() method - removing items functionally
    this.items$.next(this.items$.value.filter(item => item.id !== id));
  }

  getCompletedCount(): number {
    // Array.reduce() method - aggregating values
    // Demonstrates functional programming approach
    return this.items$.value.reduce((acc, item) => item.status === ItemStatus.Completed ? acc + 1 : acc, 0);
  }
}
