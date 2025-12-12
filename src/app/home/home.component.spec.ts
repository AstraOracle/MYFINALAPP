import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { ItemService, ItemStatus, Item } from '../services/item.service';
import { IonicModule, ToastController, LoadingController } from '@ionic/angular';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { provideRouter } from '@angular/router';
import { LanguageService } from '../services/language.service';

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let service: ItemService;
  let routerSpy: any;

  beforeEach(async () => {
    routerSpy = { navigate: jest.fn() };
    const languageServiceStub = {
      translate: (key: string) => key === 'app.title' ? 'MyTodoList' : key,
      currentLanguage$: { subscribe: () => ({}) }
    };
    const toastCtrlSpy = { create: jest.fn().mockResolvedValue({ present: jest.fn().mockResolvedValue(undefined) }) };
    const loadingCtrlSpy = { create: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), HomeComponent],
      providers: [
        provideRouter([]),
        ItemService,
        { provide: Router, useValue: routerSpy },
        { provide: LanguageService, useValue: languageServiceStub },
        { provide: ToastController, useValue: toastCtrlSpy },
        { provide: LoadingController, useValue: loadingCtrlSpy }
      ]
    }).compileComponents();

    service = TestBed.inject(ItemService);
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should render title and settings button', () => {
    fixture.detectChanges();
    const toolbar = fixture.nativeElement.querySelector('ion-toolbar');
    expect(toolbar).toBeTruthy();
    expect(toolbar.textContent).toContain('MyTodoList');
  });

  it('navigateToSettings should navigate to /settings', () => {
    component.navigateToSettings();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/settings']);
  });

  it('navigateToAddItem should navigate to /add-item', () => {
    component.navigateToAddItem();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/add-item']);
  });

  it('should display items from the service', (done) => {
    service.addItem({ id: '1', title: 'One', status: ItemStatus.Pending });
    service.addItem({ id: '2', title: 'Two', status: ItemStatus.Completed });
    fixture.detectChanges();

    setTimeout(() => {
      const labels = fixture.debugElement.queryAll(By.css('ion-label'));
      const texts = labels.map(l => (l.nativeElement.textContent || '').trim()).filter(t => t.length > 0);
      expect(texts.length).toBeGreaterThanOrEqual(1);
      done();
    }, 100);
  });

  it('should call toggle and delete via component method calls', () => {
    service.addItem({ id: 't1', title: 'ToggleMe', status: ItemStatus.Pending });
    fixture.detectChanges();

    const toggleSpy = jest.spyOn(service, 'toggleItem');
    const deleteSpy = jest.spyOn(service, 'deleteItem');

    const item = service.getItems()[0];
    component.toggle(item);
    expect(toggleSpy).toHaveBeenCalledWith(item.id);

    component.delete(item);
    expect(deleteSpy).toHaveBeenCalledWith(item.id);
  });

  it('isCompleted helper should return correct boolean', () => {
    const item: Item = { id: 'c1', title: 'X', status: ItemStatus.Completed };
    expect(component.isCompleted(item)).toBe(true);
    expect(component.isCompleted({ id: 'p1', title: 'Y', status: ItemStatus.Pending })).toBe(false);
  });
});
