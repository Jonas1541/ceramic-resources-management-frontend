import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { GlazeService } from '../../services/glaze.service';
import { Glaze } from '../../models/glaze.model';
import { Resource } from '../../../resource/models/resource.model';
import { Machine } from '../../../machine/models/machine.model';
import { ResourceService } from '../../../resource/services/resource.service';
import { MachineService } from '../../../machine/services/machine.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { DecimalMaskDirective } from '../../../shared/directives/decimal-mask.directive';

@Component({
  selector: 'app-glaze-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatOptionModule, MatIconModule, DecimalMaskDirective],
  templateUrl: './glaze-form.component.html',
  styleUrls: ['./glaze-form.component.scss']
})
export class GlazeFormComponent implements OnInit {

  glazeForm: FormGroup;
  isEditMode = false;
  resources: Resource[] = [];
  machines: Machine[] = [];

  errorMessages: { [key: string]: string } = {
    'ELECTRICITY resource not found': 'Recurso ELETRICIDADE não encontrado. Por favor, cadastre-o primeiro.',
    'WATER resource not found': 'Recurso ÁGUA não encontrado. Por favor, cadastre-o primeiro.',
    'GAS resource not found': 'Recurso GÁS não encontrado. Por favor, cadastre-o primeiro.'
  };

  constructor(
    private fb: FormBuilder,
    private glazeService: GlazeService,
    private resourceService: ResourceService,
    private machineService: MachineService,
    public dialogRef: MatDialogRef<GlazeFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { glaze: Glaze }
  ) {
    this.glazeForm = this.fb.group({
      color: ['', Validators.required],
      unitValue: ['', [Validators.required, Validators.min(0.01)]],
      resourceUsages: this.fb.array([], [Validators.required, Validators.minLength(1)]),
      machineUsages: this.fb.array([], [Validators.required, Validators.minLength(1)])
    });

    if (data && data.glaze) {
      this.isEditMode = true;
      this.glazeService.getGlaze(data.glaze.id).subscribe(glazeDetails => {
        this.glazeForm.patchValue(glazeDetails);
        glazeDetails.resourceUsages.forEach(usage => {
          this.resourceUsages.push(this.fb.group(usage));
        });
        glazeDetails.machineUsages.forEach(usage => {
          this.machineUsages.push(this.fb.group(usage));
        });
      });
    }
  }

  ngOnInit(): void {
    this.loadResources();
    this.loadMachines();
  }

  loadResources(): void {
    this.resourceService.getResources().subscribe(data => {
      this.resources = data;
    });
  }

  loadMachines(): void {
    this.machineService.getMachines().subscribe(data => {
      this.machines = data;
    });
  }

  get resourceUsages(): FormArray {
    return this.glazeForm.get('resourceUsages') as FormArray;
  }

  addResourceUsage(): void {
    const resourceUsageForm = this.fb.group({
      resourceId: ['', Validators.required],
      quantity: ['', Validators.required]
    });
    this.resourceUsages.push(resourceUsageForm);
  }

  removeResourceUsage(index: number): void {
    this.resourceUsages.removeAt(index);
  }

  get machineUsages(): FormArray {
    return this.glazeForm.get('machineUsages') as FormArray;
  }

  addMachineUsage(): void {
    const machineUsageForm = this.fb.group({
      machineId: ['', Validators.required],
      usageTime: ['', Validators.required]
    });
    this.machineUsages.push(machineUsageForm);
  }

  removeMachineUsage(index: number): void {
    this.machineUsages.removeAt(index);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.glazeForm.invalid) {
      return;
    }

    const formData = this.glazeForm.value;

    if (this.isEditMode) {
      this.glazeService.updateGlaze(this.data.glaze.id, formData).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => {
          const message = this.errorMessages[err.error.message] || err.error.message;
          alert(message);
        }
      });
    } else {
      this.glazeService.createGlaze(formData).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => {
          const message = this.errorMessages[err.error.message] || err.error.message;
          alert(message);
        }
      });
    }
  }
}
