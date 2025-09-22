import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Employee } from '../../../employee/models/employee.model';
import { EmployeeService } from '../../../employee/services/employee.service';
import { Machine } from '../../../machine/models/machine.model';
import { MachineService } from '../../../machine/services/machine.service';
import { ResourceService } from '../../../resource/services/resource.service';
import { DecimalMaskDirective } from '../../../shared/directives/decimal-mask.directive';
import { TrimDirective } from '../../../shared/directives/trim.directive';
import { Glaze } from '../../models/glaze.model';
import { GlazeService } from '../../services/glaze.service';
import { Resource } from '../../../resource/models/resource.model';

@Component({
  selector: 'app-glaze-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatOptionModule, MatIconModule, DecimalMaskDirective, TrimDirective],
  templateUrl: './glaze-form.component.html',
  styleUrls: ['./glaze-form.component.scss']
})
export class GlazeFormComponent implements OnInit {

  glazeForm: FormGroup;
  isEditMode = false;
  resources: Resource[] = [];
  machines: Machine[] = [];
  employees: Employee[] = [];

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
    private employeeService: EmployeeService,
    public dialogRef: MatDialogRef<GlazeFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { glaze: Glaze }
  ) {
    this.glazeForm = this.fb.group({
      color: ['', Validators.required],
      resourceUsages: this.fb.array([], [Validators.required, Validators.minLength(1)]),
      machineUsages: this.fb.array([], [Validators.required, Validators.minLength(1)]),
      employeeUsages: this.fb.array([], [Validators.required, Validators.minLength(1)])
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
        glazeDetails.employeeUsages.forEach(usage => {
          this.employeeUsages.push(this.fb.group(usage));
        });
      });
    }
  }

  ngOnInit(): void {
    this.loadResources();
    this.loadMachines();
    this.loadEmployees();
  }

  loadResources(): void {
    this.resourceService.getResources().subscribe(data => {
      this.resources = data.filter(r => r.category === 'COMPONENT');
    });
  }

  loadMachines(): void {
    this.machineService.getMachines().subscribe(data => {
      this.machines = data;
    });
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe(data => {
      this.employees = data;
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

  get employeeUsages(): FormArray {
    return this.glazeForm.get('employeeUsages') as FormArray;
  }

  addEmployeeUsage(): void {
    const employeeUsageForm = this.fb.group({
      employeeId: ['', Validators.required],
      usageTime: ['', Validators.required]
    });
    this.employeeUsages.push(employeeUsageForm);
  }

  removeEmployeeUsage(index: number): void {
    this.employeeUsages.removeAt(index);
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

  getAvailableEmployees(currentIndex: number): Employee[] {
    const selectedEmployeeIds = this.employeeUsages.controls
      .map((control, index) => index === currentIndex ? null : control.get('employeeId')?.value)
      .filter(id => id !== null);
    return this.employees.filter(employee => !selectedEmployeeIds.includes(employee.id));
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.glazeForm.invalid) {
      return;
    }

    const formValue = this.glazeForm.value;
    const payload = {
      ...formValue,
      resourceUsages: formValue.resourceUsages.map((usage: any) => ({
        ...usage,
        quantity: parseFloat(String(usage.quantity).replace(',', '.'))
      })),
      machineUsages: formValue.machineUsages.map((usage: any) => ({
        ...usage,
        usageTime: parseFloat(String(usage.usageTime).replace(',', '.'))
      })),
      employeeUsages: formValue.employeeUsages.map((usage: any) => ({
        ...usage,
        usageTime: parseFloat(String(usage.usageTime).replace(',', '.'))
      }))
    };

    const operation = this.isEditMode
      ? this.glazeService.updateGlaze(this.data.glaze.id, payload)
      : this.glazeService.createGlaze(payload);

    operation.subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => {
        const serverMessage = err.error?.message;
        const message = this.errorMessages[serverMessage] || serverMessage || 'Ocorreu um erro ao salvar a glasura.';
        alert(message);
      }
    });
  }
}
