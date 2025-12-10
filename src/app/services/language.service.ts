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

/**
 * Service for handling internationalization (i18n) and language switching.
 * Supports English (en) and Spanish (es) with localStorage persistence.
 */
@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly STORAGE_KEY = 'language';
  private readonly DEFAULT_LANG = 'en';
  private readonly SUPPORTED_LANGUAGES = ['en', 'es'];

  private currentLanguage = new BehaviorSubject<string>(this.DEFAULT_LANG);
  public currentLanguage$ = this.currentLanguage.asObservable();

  constructor() {
    const savedLang = this.loadLanguageFromStorage();
    this.currentLanguage.next(savedLang);
  }

  /**
   * Load language preference from localStorage with fallback to default.
   */
  private loadLanguageFromStorage(): string {
    try {
      const savedLang = localStorage.getItem(this.STORAGE_KEY);
      return savedLang && this.SUPPORTED_LANGUAGES.includes(savedLang) ? savedLang : this.DEFAULT_LANG;
    } catch (error) {
      console.warn('Failed to load language from storage:', error);
      return this.DEFAULT_LANG;
    }
  }

  /**
   * Set the current application language and persist to storage.
   * @param lang - Language code (e.g., 'en', 'es')
   */
  setLanguage(lang: string) {
    if (!this.SUPPORTED_LANGUAGES.includes(lang)) {
      console.warn(`Unsupported language: ${lang}. Falling back to ${this.DEFAULT_LANG}`);
      lang = this.DEFAULT_LANG;
    }
    
    this.currentLanguage.next(lang);
    try {
      localStorage.setItem(this.STORAGE_KEY, lang);
    } catch (error) {
      console.error('Failed to save language to storage:', error);
    }
  }

  /**
   * Get the current active language code.
   * @returns Current language code
   */
  getCurrentLanguage(): string {
    return this.currentLanguage.value;
  }

  /**
   * Translate a key to the current language.
   * Falls back to English if key not found, then returns the key itself.
   * @param key - Translation key in dot notation (e.g., 'app.title')
   * @returns Translated string
   */
  translate(key: string): string {
    const lang = this.currentLanguage.value;
    return translations[lang]?.[key] || translations[this.DEFAULT_LANG]?.[key] || key;
  }

  /**
   * Get an observable stream of translated strings that updates on language change.
   * @param key - Translation key
   * @returns Observable of translated string
   */
  getTranslation(key: string): Observable<string> {
    return new Observable(observer => {
      observer.next(this.translate(key));
      this.currentLanguage$.subscribe(() => {
        observer.next(this.translate(key));
      });
    });
  }
}
