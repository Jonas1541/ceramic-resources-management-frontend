import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { KilnRoutingModule } from './kiln-routing.module';
import { KilnListComponent } from './components/kiln-list/kiln-list.component';
import { KilnFormComponent } from './components/kiln-form/kiln-form.component';

@NgModule({
  imports: [
    CommonModule,
    KilnRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    KilnListComponent,
    KilnFormComponent
  ]
})
export class KilnModule { }
