import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
// A linha de provideAnimations não é mais necessária aqui, pois vamos usar o módulo
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { AuthInterceptor } from './auth/interceptors/auth.interceptor';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { routes } from './app.routes';

registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    importProvidersFrom(
      MatToolbarModule, 
      MatButtonModule, 
      MatDialogModule, 
      BrowserAnimationsModule 
    ),
    provideCharts(withDefaultRegisterables())
  ]
};