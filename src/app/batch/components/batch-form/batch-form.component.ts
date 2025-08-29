import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { BatchService } from '../../services/batch.service';
import { Batch } from '../../models/batch.model';
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
  selector: 'app-batch-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatOptionModule, MatIconModule, DecimalMaskDirective],
  templateUrl: './batch-form.component.html',
  styleUrls: ['./batch-form.component.scss']
})
export class BatchFormComponent implements OnInit {

  batchForm: FormGroup;
  isEditMode = false;
  resources: Resource[] = [];
  machines: Machine[] = [];

  errorMessages: { [key: string]: string } = {
    'ELECTRICITY resource not found': 'Recurso ELETRICIDADE não encontrado. Por favor, cadastre-o primeiro.',
    'WATER resource not found': 'Recurso ÁGUA não encontrado. Por favor, cadastre-o primeiro.',
    'GAS resource not found': 'Recurso GÁS não encontrado. Por favor, cadastre-o primeiro.',
    'Resource WATER não cadastrada!': 'Recurso ÁGUA não cadastrado. Por favor, cadastre-o primeiro.'
  };

  constructor(
    private fb: FormBuilder,
    private batchService: BatchService,
    private resourceService: ResourceService,
    private machineService: MachineService,
    public dialogRef: MatDialogRef<BatchFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { batch: Batch }
  ) {
    this.batchForm = this.fb.group({
      resourceUsages: this.fb.array([], [Validators.required, Validators.minLength(1)]),
      machineUsages: this.fb.array([], [Validators.required, Validators.minLength(1)])
    });

    if (data && data.batch) {
      this.isEditMode = true;
      data.batch.resourceUsages.forEach(usage => {
        this.resourceUsages.push(this.fb.group({
          resourceId: [usage.resourceId, Validators.required],
          initialQuantity: [usage.initialQuantity, Validators.required],
          umidity: [usage.umidity * 100, Validators.required],
          addedQuantity: [usage.addedQuantity, Validators.required]
        }));
      });
      data.batch.machineUsages.forEach(usage => {
        this.machineUsages.push(this.fb.group({
          machineId: [usage.machineId, Validators.required],
          usageTime: [usage.usageTime, Validators.required]
        }));
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
    return this.batchForm.get('resourceUsages') as FormArray;
  }

  addResourceUsage(): void {
    const resourceUsageForm = this.fb.group({
      resourceId: ['', Validators.required],
      initialQuantity: ['', Validators.required],
      umidity: ['', Validators.required],
      addedQuantity: ['', Validators.required]
    });
    this.resourceUsages.push(resourceUsageForm);
  }

  removeResourceUsage(index: number): void {
    this.resourceUsages.removeAt(index);
  }

  get machineUsages(): FormArray {
    return this.batchForm.get('machineUsages') as FormArray;
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

  getAvailableResources(currentIndex: number): Resource[] {
    const selectedResourceIds = this.resourceUsages.controls
      .map((control, index) => index === currentIndex ? null : control.get('resourceId')?.value)
      .filter(id => id !== null);
    return this.resources.filter(resource => !selectedResourceIds.includes(resource.id));
  }

  getAvailableMachines(currentIndex: number): Machine[] {
    const selectedMachineIds = this.machineUsages.controls
      .map((control, index) => index === currentIndex ? null : control.get('machineId')?.value)
      .filter(id => id !== null);
    return this.machines.filter(machine => !selectedMachineIds.includes(machine.id));
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.batchForm.invalid) {
      return;
    }

    const formValue = this.batchForm.value;

    // Convert comma-strings to numbers and adjust umidity
    const payload = {
      ...formValue,
      resourceUsages: formValue.resourceUsages.map((usage: any) => ({
        ...usage,
        initialQuantity: parseFloat(String(usage.initialQuantity).replace(',', '.')),
        umidity: parseFloat(String(usage.umidity).replace(',', '.')) / 100,
        addedQuantity: parseFloat(String(usage.addedQuantity).replace(',', '.'))
      })),
      machineUsages: formValue.machineUsages.map((usage: any) => ({
        ...usage,
        usageTime: parseFloat(String(usage.usageTime).replace(',', '.'))
      }))
    };

    const operation = this.isEditMode
      ? this.batchService.updateBatch(this.data.batch.id, payload)
      : this.batchService.createBatch(payload);

    operation.subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => {
        const serverMessage = err.error?.message;
        const message = this.errorMessages[serverMessage] || serverMessage || 'Ocorreu um erro ao salvar a batelada.';
        alert(message);
      }
    });
  }
}
