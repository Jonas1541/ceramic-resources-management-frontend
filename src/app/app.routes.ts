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
        loadChildren: () => import('./resource/resource.module').then(m => m.ResourceModule) 
      },
      {
        path: 'glazes',
        loadChildren: () => import('./glaze/glaze.module').then(m => m.GlazeModule)
      },
      {
        path: 'batches',
        loadChildren: () => import('./batch/batch.module').then(m => m.BatchModule)
      },
      {
        path: 'machines',
        loadChildren: () => import('./machine/machine.module').then(m => m.MachineModule)
      },
      {
        path: 'products',
        loadChildren: () => import('./product/product.module').then(m => m.ProductModule)
      },
      {
        path: 'bisque-firings',
        loadChildren: () => import('./bisque-firing/bisque-firing.module').then(m => m.BisqueFiringModule)
      },
      {
        path: 'glaze-firings',
        loadChildren: () => import('./glaze-firing/glaze-firing.module').then(m => m.GlazeFiringModule)
      },
      {
        path: 'drying-rooms',
        loadComponent: () => import('./drying-room/components/drying-room-list/drying-room-list.component').then(m => m.DryingRoomListComponent)
      },
      {
        path: 'kilns',
        loadChildren: () => import('./kiln/kiln.module').then(m => m.KilnModule)
      },
      {
        path: 'reports',
        loadChildren: () => import('./report/report.module').then(m => m.ReportModule)
      },
      {
        path: 'account',
        loadChildren: () => import('./account-management/account-management.module').then(m => m.AccountManagementModule)
      }
    ]
  },
  {
    path: '', 
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  }
];