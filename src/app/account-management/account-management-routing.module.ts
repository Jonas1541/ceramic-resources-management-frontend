import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountManagementComponent } from './components/account-management.component';

const routes: Routes = [
  { path: '', component: AccountManagementComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountManagementRoutingModule { }
