import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    'app.title': 'MyTodoList',
    'home.settings': 'Settings',
    'home.noItems': 'No Items Yet',
    'home.addFirst': 'Tap the + button to add your first item',
    'home.itemAdded': 'Item added',
    'home.itemUpdated': 'Item status updated',
    'home.itemDeleted': 'Item deleted',
    'add.title': 'Add Item',
    'add.label': 'Task Title',
    'add.button': 'Add Item',
    'add.error': 'Please enter a task title',
    'settings.title': 'Settings',
    'settings.language': 'Language Preferences',
    'settings.selectLanguage': 'Select Language',
    'settings.currentLanguage': 'Current language',
    'settings.about': 'About',
    'settings.version': 'MyFinalApp v1.0',
    'settings.description': 'A simple and elegant task management application built with Ionic and Angular.'
  },
  es: {
    'app.title': 'MiListaTareas',
    'home.settings': 'Configuración',
    'home.noItems': 'Sin elementos aún',
    'home.addFirst': 'Toca el botón + para agregar tu primer elemento',
    'home.itemAdded': 'Elemento añadido',
    'home.itemUpdated': 'Estado del elemento actualizado',
    'home.itemDeleted': 'Elemento eliminado',
    'add.title': 'Agregar elemento',
    'add.label': 'Título de la tarea',
    'add.button': 'Agregar elemento',
    'add.error': 'Por favor, ingresa un título de tarea',
    'settings.title': 'Configuración',
    'settings.language': 'Preferencias de idioma',
    'settings.selectLanguage': 'Selecciona idioma',
    'settings.currentLanguage': 'Idioma actual',
    'settings.about': 'Acerca de',
    'settings.version': 'MiListaTareas v1.0',
    'settings.description': 'Una aplicación simple y elegante de gestión de tareas construida con Ionic y Angular.'
  }
};

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguage = new BehaviorSubject<string>('en');
  public currentLanguage$ = this.currentLanguage.asObservable();

  constructor() {
    const savedLang = localStorage.getItem('language') || 'en';
    this.currentLanguage.next(savedLang);
  }

  setLanguage(lang: string) {
    this.currentLanguage.next(lang);
    localStorage.setItem('language', lang);
  }

  getCurrentLanguage(): string {
    return this.currentLanguage.value;
  }

  translate(key: string): string {
    const lang = this.currentLanguage.value;
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  }

  getTranslation(key: string): Observable<string> {
    return new Observable(observer => {
      observer.next(this.translate(key));
      this.currentLanguage$.subscribe(() => {
        observer.next(this.translate(key));
      });
    });
  }
}
