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

import { BisqueFiringRoutingModule } from './bisque-firing-routing.module';
import { BisqueFiringListComponent } from './components/bisque-firing-list/bisque-firing-list.component';
import { BisqueFiringFormComponent } from './components/bisque-firing-form/bisque-firing-form.component';

@NgModule({
  imports: [
    CommonModule,
    BisqueFiringRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    BisqueFiringListComponent,
    BisqueFiringFormComponent
  ]
})
export class BisqueFiringModule { }
