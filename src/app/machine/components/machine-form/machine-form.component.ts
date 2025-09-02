import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MachineService } from '../../services/machine.service';
import { Machine } from '../../models/machine.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DecimalMaskDirective } from '../../../shared/directives/decimal-mask.directive';

import { TrimDirective } from '../../../shared/directives/trim.directive';

@Component({
  selector: 'app-machine-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, DecimalMaskDirective, TrimDirective],
  templateUrl: './machine-form.component.html',
  styleUrls: ['./machine-form.component.scss']
})
export class MachineFormComponent implements OnInit {

  machineForm: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private machineService: MachineService,
    public dialogRef: MatDialogRef<MachineFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { machine: Machine }
  ) {
    this.machineForm = this.fb.group({
      name: ['', Validators.required],
      power: ['', [Validators.required, Validators.min(0.01)]]
    });

    if (data && data.machine) {
      this.isEditMode = true;
      this.machineForm.patchValue(data.machine);
    }
  }

  ngOnInit(): void { }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.machineForm.invalid) {
      return;
    }

    const formData = { ...this.machineForm.value };
    if (typeof formData.power === 'string') {
      formData.power = parseFloat(formData.power.replace(',', '.'));
    }

    if (this.isEditMode) {
      this.machineService.updateMachine(this.data.machine.id, formData).subscribe(() => {
        this.dialogRef.close(true);
      });
    } else {
      this.machineService.createMachine(formData).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }
}
