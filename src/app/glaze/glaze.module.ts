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

import { GlazeRoutingModule } from './glaze-routing.module';
import { GlazeListComponent } from './components/glaze-list/glaze-list.component';
import { GlazeFormComponent } from './components/glaze-form/glaze-form.component';
import { GlazeTransactionFormComponent } from './components/glaze-transaction-form/glaze-transaction-form.component';

@NgModule({
  imports: [
    CommonModule,
    GlazeRoutingModule,
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
export class GlazeModule { }
