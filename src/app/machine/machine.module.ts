import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MachineRoutingModule } from './machine-routing.module';
import { MachineListComponent } from './components/machine-list/machine-list.component';
import { MachineFormComponent } from './components/machine-form/machine-form.component';

@NgModule({
  imports: [
    CommonModule,
    MachineRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MachineListComponent,
    MachineFormComponent
  ]
})
export class MachineModule { }
