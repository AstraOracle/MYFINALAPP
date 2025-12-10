/// <reference types="jasmine" />
import { TestBed } from '@angular/core/testing';
import { ItemService, ItemStatus, Item } from './item.service';

describe('ItemService', () => {
  let service: ItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ItemService] });
    service = TestBed.inject(ItemService);
  });

  it('should start with no items', () => {
    expect(service.getItems().length).toBe(0);
  });

  it('should add an item', () => {
    const item: Item = { id: '1', title: 'Test', status: ItemStatus.Pending };
    service.addItem(item);
    expect(service.getItems().length).toBe(1);
    expect(service.getItems()[0]).toEqual(item);
  });

  it('should toggle item status', () => {
    const id = 'tog-1';
    service.addItem({ id, title: 'T', status: ItemStatus.Pending });
    service.toggleItem(id);
    expect(service.getItems()[0].status).toBe(ItemStatus.Completed);
    service.toggleItem(id);
    expect(service.getItems()[0].status).toBe(ItemStatus.Pending);
  });

  it('should delete an item', () => {
    const id = 'del-1';
    service.addItem({ id, title: 'ToDelete', status: ItemStatus.Pending });
    expect(service.getItems().some(i => i.id === id)).toBeTrue();
    service.deleteItem(id);
    expect(service.getItems().some(i => i.id === id)).toBeFalse();
  });

  it('should count completed items', () => {
    service.addItem({ id: 'c1', title: 'A', status: ItemStatus.Completed });
    service.addItem({ id: 'c2', title: 'B', status: ItemStatus.Pending });
    expect(service.getCompletedCount()).toBe(1);
  });
});
