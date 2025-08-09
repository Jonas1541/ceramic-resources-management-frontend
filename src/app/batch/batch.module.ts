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
import { MatOptionModule } from '@angular/material/core';

import { BatchRoutingModule } from './batch-routing.module';
import { BatchListComponent } from './components/batch-list/batch-list.component';
import { BatchFormComponent } from './components/batch-form/batch-form.component';
import { BatchTransactionFormComponent } from './components/batch-transaction-form/batch-transaction-form.component';

@NgModule({
  imports: [
    CommonModule,
    BatchRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    BatchListComponent,
    BatchFormComponent,
    BatchTransactionFormComponent
  ]
})
export class BatchModule { }
