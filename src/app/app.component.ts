import { Component, ViewChild, inject, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay, filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  private breakpointObserver = inject(BreakpointObserver);
  showMainLayout: boolean = true; // Controla a visibilidade do layout principal

  isHandset$: Observable<boolean> = this.breakpointObserver.observe('(max-width: 1240px)')
    .pipe(
      map(result => {
        console.log('isHandset:', result.matches);
        return result.matches;
      }),
      shareReplay()
    );

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Define quais rotas não devem mostrar o layout principal
      const authRoutes = ['/login', '/register', '/forgot-password'];
      const currentUrl = event.urlAfterRedirects.split('?')[0]; // Remove query params

      // Verifica se a URL atual começa com alguma das rotas de autenticação
      this.showMainLayout = !authRoutes.some(route => currentUrl.startsWith(route));

      // Lida com a rota de reset-password que tem um token como parâmetro
      if (currentUrl.startsWith('/reset-password/')) {
        this.showMainLayout = false;
      }
    });
  }

  closeSidenavIfHandset() {
    if (this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      this.sidenav.close();
    }
  }
}