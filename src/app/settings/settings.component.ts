import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonButtons,
    IonBackButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonIcon
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  private router = inject(Router);
  private languageService = inject(LanguageService);
  
  selectedLang = 'en';
  
  private languageNames: { [key: string]: string } = {
    'en': 'English',
    'es': 'Español',
    'fr': 'Français',
    'de': 'Deutsch'
  };

  ngOnInit() {
    this.selectedLang = this.languageService.getCurrentLanguage();
  }

  changeLanguage(lang: string) {
    this.selectedLang = lang;
    this.languageService.setLanguage(lang);
    console.log('Language changed to:', lang);
  }
  
  getLanguageName(code: string): string {
    return this.languageNames[code] || code;
  }

  translate(key: string): string {
    return this.languageService.translate(key);
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
