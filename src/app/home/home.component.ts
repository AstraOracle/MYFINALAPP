import { Component } from '@angular/core';
import { ItemService, Item, ItemStatus } from '../services/item.service';
import { LanguageService } from '../services/language.service';
import { Observable } from 'rxjs';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
// Mobile UI Elements: FAB, Lists, Sliding Items, Buttons, Icons, Navigation
import { IonHeader, IonItemSliding, IonContent, IonToolbar, IonTitle, IonList,
  IonButtons, IonButton, IonItem, IonLabel, IonCheckbox, IonItemOption, IonItemOptions, IonFab, IonFabButton, IonIcon
 } from "@ionic/angular/standalone";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [IonList, IonTitle, IonHeader, IonToolbar, IonContent, IonItemSliding, IonItem, IonLabel, IonCheckbox, IonItemOptions, IonItemOption, IonButtons, IonButton, IonFab, IonFabButton, IonIcon, CommonModule, AsyncPipe, RouterModule]
})
export class HomeComponent {
  items$: Observable<Item[]>;

  constructor(
    private itemService: ItemService,
    private languageService: LanguageService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private router: Router
  ) {
    this.items$ = this.itemService.itemsObservable;
  }

  navigateToSettings() {
    this.router.navigate(['/settings']);
  }

  navigateToAddItem() {
    this.router.navigate(['/add-item']);
  }

  // Toast notifications - Mobile UI element for user feedback
  async toggle(item: Item) {
    this.itemService.toggleItem(item.id);
    const msg = this.languageService.translate('home.itemUpdated');
    const toast = await this.toastCtrl.create({ message: msg, duration: 1500 });
    await toast.present();
  }

  // Async/await pattern for handling toast display
  async delete(item: Item) {
    this.itemService.deleteItem(item.id);
    const msg = this.languageService.translate('home.itemDeleted');
    const toast = await this.toastCtrl.create({ message: msg, duration: 1500 });
    await toast.present();
  }

  // Loading indicator - Mobile UI element for async operations
  async showLoading() {
    const loading = await this.loadingCtrl.create({ message: 'Loading items...', duration: 500 });
    await loading.present();
  }

  isCompleted(item: Item) {
    return item.status === ItemStatus.Completed;
  }

  translate(key: string): string {
    return this.languageService.translate(key);
  }
}
