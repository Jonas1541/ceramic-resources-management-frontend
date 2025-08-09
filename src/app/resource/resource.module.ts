import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { ResourceRoutingModule } from './resource-routing.module';
import { ResourceListComponent } from './components/resource-list/resource-list.component';
import { ResourceFormComponent } from './components/resource-form/resource-form.component';
import { ResourceTransactionFormComponent } from './components/resource-transaction-form/resource-transaction-form.component';

@NgModule({
  imports: [
    CommonModule,
    ResourceRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ]
})
export class ResourceModule { }
