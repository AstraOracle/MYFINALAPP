import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { addIcons } from 'ionicons';
import {
  add,
  checkmarkDone,
  alertCircle,
  settings,
  documentOutline,
  trash,
  checkmarkCircle,
} from 'ionicons/icons';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

// Register all icons
addIcons({
  add,
  'checkmark-done': checkmarkDone,
  'alert-circle': alertCircle,
  settings,
  'document-outline': documentOutline,
  trash,
  'checkmark-circle': checkmarkCircle,
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
  ],
});
