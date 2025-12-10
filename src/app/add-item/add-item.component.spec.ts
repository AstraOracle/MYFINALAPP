/// <reference types="jasmine" />
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AddItemComponent } from './add-item.component';
import { ItemService } from '../services/item.service';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController, IonicModule } from '@ionic/angular';

describe('AddItemComponent', () => {
  let fixture: any;
  let component: AddItemComponent;
  let itemService: ItemService;
  let routerSpy: any;
  let toastCtrlSpy: any;

  beforeEach(async () => {
    routerSpy = { navigate: jasmine.createSpy('navigate') };
    toastCtrlSpy = jasmine.createSpyObj('ToastController', ['create']);
    toastCtrlSpy.create.and.returnValue(Promise.resolve({ present: () => Promise.resolve() }));

    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), ReactiveFormsModule, AddItemComponent],
      providers: [ItemService, { provide: Router, useValue: routerSpy }, { provide: ToastController, useValue: toastCtrlSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(AddItemComponent);
    component = fixture.componentInstance;
    itemService = TestBed.inject(ItemService);
  });

  it('form should be invalid when title is empty', () => {
    component.form.controls['title'].setValue('');
    expect(component.form.valid).toBe(false);
  });

  it('should submit valid form, add item, show toast and navigate', fakeAsync(async () => {
    component.form.controls['title'].setValue('New item');
    expect(component.form.valid).toBe(true);
    await component.submit();
    tick();
    expect(itemService.getItems().some((i: any) => i.title === 'New item')).toBe(true);
    expect(toastCtrlSpy.create.calls.any()).toBe(true);
    expect(routerSpy.navigate.calls.any()).toBe(true);
  }));

  it('should add item when submit is called synchronously', () => {
    component.form.controls['title'].setValue('Sync item');
    // submit is async but addItem is synchronous before awaiting toast
    component.submit();
    expect(itemService.getItems().some((i: any) => i.title === 'Sync item')).toBe(true);
  });
});
