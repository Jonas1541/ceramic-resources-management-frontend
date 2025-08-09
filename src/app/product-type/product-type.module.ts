import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ProductTypeRoutingModule } from './product-type-routing.module';
import { ProductTypeListComponent } from './components/product-type-list/product-type-list.component';
import { ProductTypeFormComponent } from './components/product-type-form/product-type-form.component';

@NgModule({
  imports: [
    CommonModule,
    ProductTypeRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ProductTypeListComponent,
    ProductTypeFormComponent
  ]
})
export class ProductTypeModule { }
