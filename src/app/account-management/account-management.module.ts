import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';

import { AccountManagementRoutingModule } from './account-management-routing.module';
import { AccountManagementComponent } from './components/account-management.component';

@NgModule({
  imports: [
    CommonModule,
    AccountManagementRoutingModule,
    MatButtonModule,
    AccountManagementComponent
  ]
})
export class AccountManagementModule { }
