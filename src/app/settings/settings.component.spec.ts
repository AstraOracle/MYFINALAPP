/// <reference types="jasmine" />
import { TestBed } from '@angular/core/testing';
import { SettingsComponent } from './settings.component';
import { TranslateService } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

describe('SettingsComponent', () => {
  let fixture: any;
  let component: SettingsComponent;
  let translateSpy: any;
  let routerSpy: any;

  beforeEach(async () => {
    translateSpy = { currentLang: 'en', use: jasmine.createSpy('use') };
    routerSpy = { navigate: jasmine.createSpy('navigate') };
    
    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), SettingsComponent],
      providers: [
        { provide: TranslateService, useValue: translateSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize selectedLang from translate service', () => {
    expect(component.selectedLang).toBe('en');
  });

  it('changeLanguage should call translate.use and update selectedLang', () => {
    component.changeLanguage('es');
    expect(component.selectedLang).toBe('es');
    expect(translateSpy.use).toHaveBeenCalledWith('es');
  });

  it('goBack should navigate to home', () => {
    component.goBack();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });
});
