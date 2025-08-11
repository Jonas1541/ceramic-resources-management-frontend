import { Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'resources', pathMatch: 'full' },
      { 
        path: 'resources', 
        loadComponent: () => import('./resource/components/resource-list/resource-list.component').then(m => m.ResourceListComponent)
      },
      {
        path: 'glazes',
        loadComponent: () => import('./glaze/components/glaze-list/glaze-list.component').then(m => m.GlazeListComponent)
      },
      {
        path: 'batches',
        loadComponent: () => import('./batch/components/batch-list/batch-list.component').then(m => m.BatchListComponent)
      },
      {
        path: 'machines',
        loadComponent: () => import('./machine/components/machine-list/machine-list.component').then(m => m.MachineListComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./product/components/product-list/product-list.component').then(m => m.ProductListComponent)
      },
      {
        path: 'drying-rooms',
        loadComponent: () => import('./drying-room/components/drying-room-list/drying-room-list.component').then(m => m.DryingRoomListComponent)
      },
      {
        path: 'kilns',
        loadComponent: () => import('./kiln/components/kiln-list/kiln-list.component').then(m => m.KilnListComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./report/components/general-report/general-report.component').then(m => m.GeneralReportComponent)
      },
      {
        path: 'account',
        loadComponent: () => import('./account-management/components/account-management.component').then(m => m.AccountManagementComponent)
      }
    ]
  },
  {
    path: '', 
    loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
  }
];