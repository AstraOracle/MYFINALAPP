import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export enum ItemStatus {
  Pending = 'pending',
  Completed = 'completed'
}

export interface Item {
  id: string;
  title: string;
  status: ItemStatus;
}

@Injectable({ providedIn: 'root' })
export class ItemService {
  private items$ = new BehaviorSubject<Item[]>([]);
  itemsObservable = this.items$.asObservable();

  constructor() {}

  getItems(): Item[] {
    return this.items$.value;
  }

  addItem<T extends Item>(item: T) {
    this.items$.next([...this.items$.value, item]);
  }

  toggleItem(id: string) {
    this.items$.next(
      this.items$.value.map(item =>
        item.id === id
          ? { ...item, status: item.status === ItemStatus.Pending ? ItemStatus.Completed : ItemStatus.Pending }
          : item
      )
    );
  }

  deleteItem(id: string) {
    this.items$.next(this.items$.value.filter(item => item.id !== id));
  }

  getCompletedCount(): number {
    return this.items$.value.reduce((acc, item) => item.status === ItemStatus.Completed ? acc + 1 : acc, 0);
  }
}
