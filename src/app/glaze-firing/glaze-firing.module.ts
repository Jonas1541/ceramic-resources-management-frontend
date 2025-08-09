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

import { GlazeFiringRoutingModule } from './glaze-firing-routing.module';
import { GlazeFiringListComponent } from './components/glaze-firing-list/glaze-firing-list.component';
import { GlazeFiringFormComponent } from './components/glaze-firing-form/glaze-firing-form.component';

@NgModule({
  imports: [
    CommonModule,
    GlazeFiringRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    GlazeFiringListComponent,
    GlazeFiringFormComponent
  ]
})
export class GlazeFiringModule { }
