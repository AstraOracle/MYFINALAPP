import { TestBed } from '@angular/core/testing';
import { SettingsComponent } from './settings.component';
import { TranslateService } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { provideRouter } from '@angular/router';
import { LanguageService } from '../services/language.service';

describe('SettingsComponent', () => {
  let fixture: any;
  let component: SettingsComponent;
  let languageServiceSpy: any;
  let routerSpy: any;

  beforeEach(async () => {
    languageServiceSpy = {
      getCurrentLanguage: jasmine.createSpy('getCurrentLanguage').and.returnValue('en'),
      setLanguage: jasmine.createSpy('setLanguage'),
      translate: (key: string) => key
    };
    routerSpy = { navigate: jasmine.createSpy('navigate') };
    
    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), SettingsComponent],
      providers: [
        provideRouter([]),
        { provide: LanguageService, useValue: languageServiceSpy },
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

  it('should initialize selectedLang from language service', () => {
    expect(component.selectedLang).toBe('en');
  });

  it('changeLanguage should call languageService.setLanguage and update selectedLang', () => {
    component.changeLanguage('es');
    expect(component.selectedLang).toBe('es');
    expect(languageServiceSpy.setLanguage).toHaveBeenCalledWith('es');
  });

  it('goBack should navigate to home', () => {
    component.goBack();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });
});
