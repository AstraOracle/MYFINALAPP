import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Enum representing the status of a task item.
 */
export enum ItemStatus {
  Pending = 'pending',
  Completed = 'completed'
}

/**
 * Interface representing a task item.
 */
export interface Item {
  id: string;
  title: string;
  status: ItemStatus;
}

/**
 * Service for managing task items with CRUD operations.
 * Uses RxJS BehaviorSubject for reactive state management.
 */
@Injectable({ providedIn: 'root' })
export class ItemService {
  private items$ = new BehaviorSubject<Item[]>([]);
  /** Observable stream of all items */
  itemsObservable = this.items$.asObservable();

  constructor() {}

  /**
   * Get the current array of all items.
   * @returns Array of all task items
   */
  getItems(): Item[] {
    return this.items$.value;
  }

  /**
   * Add a new item to the list.
   * @param item - The item to add
   */
  addItem<T extends Item>(item: T) {
    this.items$.next([...this.items$.value, item]);
  }

  /**
   * Toggle the status of an item between pending and completed.
   * @param id - The unique identifier of the item to toggle
   */
  toggleItem(id: string) {
    this.items$.next(
      this.items$.value.map(item =>
        item.id === id
          ? { ...item, status: item.status === ItemStatus.Pending ? ItemStatus.Completed : ItemStatus.Pending }
          : item
      )
    );
  }

  /**
   * Delete an item from the list.
   * @param id - The unique identifier of the item to delete
   */
  deleteItem(id: string) {
    this.items$.next(this.items$.value.filter(item => item.id !== id));
  }

  /**
   * Get the count of completed items.
   * @returns Number of items with completed status
   */
  getCompletedCount(): number {
    return this.items$.value.reduce((acc, item) => item.status === ItemStatus.Completed ? acc + 1 : acc, 0);
  }
}
