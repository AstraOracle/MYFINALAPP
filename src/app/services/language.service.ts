import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';

// TypeScript Interface with index signature for flexible JSON structure
interface TranslationData {
  [key: string]: any;
}

// Internationalization Service - supports 4 languages
@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly http = inject(HttpClient);
  private readonly STORAGE_KEY = 'language';
  private readonly DEFAULT_LANG = 'en';
  // Multi-language support: English, Spanish, French, German
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

  private loadLanguageFromStorage(): string {
    try {
      const savedLang = localStorage.getItem(this.STORAGE_KEY);
      return savedLang && this.SUPPORTED_LANGUAGES.includes(savedLang) ? savedLang : this.DEFAULT_LANG;
    } catch (error) {
      console.warn('Failed to load language from storage:', error);
      return this.DEFAULT_LANG;
    }
  }

  // Async/await pattern - Modern JS feature for handling promises
  private async loadLanguage(lang: string): Promise<void> {
    if (this.loadedLanguages.has(lang)) {
      return;
    }

    try {
      // Template literal for dynamic URL - Modern JS feature
      const translations = await firstValueFrom(
        this.http.get<TranslationData>(`/assets/i18n/${lang}.json`)
      );
      this.translations[lang] = translations;
      this.loadedLanguages.add(lang);
    } catch (error) {
      console.error(`Failed to load language ${lang}:`, error);
      // fallback to english if loading fails
      if (lang !== this.DEFAULT_LANG && !this.loadedLanguages.has(this.DEFAULT_LANG)) {
        await this.loadLanguage(this.DEFAULT_LANG);
      }
    }
  }

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

  getCurrentLanguage(): string {
    return this.currentLanguage.value;
  }

  getSupportedLanguages(): string[] {
    return [...this.SUPPORTED_LANGUAGES];
  }

  translate(key: string): string {
    const lang = this.currentLanguage.value;
    const value = this.getNestedValue(this.translations[lang], key);
    
    if (value) return value;
    
    // fallback to english
    if (lang !== this.DEFAULT_LANG) {
      const defaultValue = this.getNestedValue(this.translations[this.DEFAULT_LANG], key);
      if (defaultValue) return defaultValue;
    }
    
    return key;
  }

  // Array.reduce() with closure - navigating nested objects
  // Demonstrates functional programming and closure concept
  private getNestedValue(obj: any, path: string): string | undefined {
    if (!obj) return undefined;
    // Split path by dots and reduce to get nested value
    return path.split('.').reduce((current, key) => current?.[key], obj);
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
