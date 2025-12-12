import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';

interface TranslationData {
  [key: string]: any;
}

/**
 * Service for handling internationalization (i18n) and language switching.
 * Loads translations from JSON files and supports multiple languages with localStorage persistence.
 * Supports: English (en), Spanish (es), French (fr), German (de)
 */
@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly http = inject(HttpClient);
  private readonly STORAGE_KEY = 'language';
  private readonly DEFAULT_LANG = 'en';
  private readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de'];

  private currentLanguage = new BehaviorSubject<string>(this.DEFAULT_LANG);
  public currentLanguage$ = this.currentLanguage.asObservable();
  
  private translations: { [lang: string]: TranslationData } = {};
  private loadedLanguages = new Set<string>();

  constructor() {
    const savedLang = this.loadLanguageFromStorage();
    this.loadLanguage(savedLang).then(() => {
      this.currentLanguage.next(savedLang);
    });
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
   * Load translation file from assets folder.
   * @param lang - Language code to load
   */
  private async loadLanguage(lang: string): Promise<void> {
    if (this.loadedLanguages.has(lang)) {
      return;
    }

    try {
      const translations = await firstValueFrom(
        this.http.get<TranslationData>(`/assets/i18n/${lang}.json`)
      );
      this.translations[lang] = translations;
      this.loadedLanguages.add(lang);
    } catch (error) {
      console.error(`Failed to load language ${lang}:`, error);
      // Load default language as fallback
      if (lang !== this.DEFAULT_LANG && !this.loadedLanguages.has(this.DEFAULT_LANG)) {
        await this.loadLanguage(this.DEFAULT_LANG);
      }
    }
  }

  /**
   * Set the current application language and persist to storage.
   * @param lang - Language code (e.g., 'en', 'es', 'fr', 'de')
   */
  async setLanguage(lang: string): Promise<void> {
    if (!this.SUPPORTED_LANGUAGES.includes(lang)) {
      console.warn(`Unsupported language: ${lang}. Falling back to ${this.DEFAULT_LANG}`);
      lang = this.DEFAULT_LANG;
    }
    
    await this.loadLanguage(lang);
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
   * Get list of supported languages.
   * @returns Array of supported language codes
   */
  getSupportedLanguages(): string[] {
    return [...this.SUPPORTED_LANGUAGES];
  }

  /**
   * Translate a key to the current language.
   * Falls back to English if key not found, then returns the key itself.
   * @param key - Translation key in dot notation (e.g., 'app.title')
   * @returns Translated string
   */
  translate(key: string): string {
    const lang = this.currentLanguage.value;
    const value = this.getNestedValue(this.translations[lang], key);
    
    if (value) return value;
    
    // Fallback to default language
    if (lang !== this.DEFAULT_LANG) {
      const defaultValue = this.getNestedValue(this.translations[this.DEFAULT_LANG], key);
      if (defaultValue) return defaultValue;
    }
    
    // Return key if no translation found
    return key;
  }

  /**
   * Get nested value from object using dot notation.
   * @param obj - Object to search in
   * @param path - Dot notation path (e.g., 'app.title')
   * @returns Value at path or undefined
   */
  private getNestedValue(obj: any, path: string): string | undefined {
    if (!obj) return undefined;
    return path.split('.').reduce((current, key) => current?.[key], obj);
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
