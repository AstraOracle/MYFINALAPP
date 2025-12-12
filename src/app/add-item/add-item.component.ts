import { Component } from '@angular/core';
import { ItemService, Item, ItemStatus } from '../services/item.service';
import { LanguageService } from '../services/language.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonHeader, IonLabel, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonButton, IonButtons, IonBackButton, IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonButtons, IonBackButton, IonIcon, FormsModule, ReactiveFormsModule, RouterModule, CommonModule]
})
export class AddItemComponent {
  // Reactive Forms with validation - demonstrates form handling
  form = this.fb.group({ 
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]] 
  });

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
    private languageService: LanguageService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  async submit() {
    if (this.form.valid) {
      // Non-null assertion (!) and chaining - TypeScript feature
      const title = this.form.value.title!.trim();
      
      // Validate title is not empty after trimming
      if (!title) {
        const errorMsg = this.languageService.translate('addItem.error');
        // Toast with color property - Mobile UI feedback element
        const toast = await this.toastCtrl.create({ message: errorMsg, duration: 2000, color: 'danger' });
        await toast.present();
        return;
      }

      // Object shorthand property (title instead of title: title) - Modern JS
      // crypto.randomUUID() for unique IDs
      const item: Item = { id: crypto.randomUUID(), title, status: ItemStatus.Pending };
      this.itemService.addItem(item);
      const msg = this.languageService.translate('home.itemAdded');
      const toast = await this.toastCtrl.create({ message: msg, duration: 1500, color: 'success' });
      await toast.present();
      this.goBack();
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }

  translate(key: string): string {
    return this.languageService.translate(key);
  }
}
