import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ProductLineRoutingModule } from './product-line-routing.module';
import { ProductLineListComponent } from './components/product-line-list/product-line-list.component';
import { ProductLineFormComponent } from './components/product-line-form/product-line-form.component';

@NgModule({
  imports: [
    CommonModule,
    ProductLineRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ProductLineListComponent,
    ProductLineFormComponent
  ]
})
export class ProductLineModule { }
