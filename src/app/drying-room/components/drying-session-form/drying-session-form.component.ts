import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Employee } from '../../../employee/models/employee.model';
import { EmployeeService } from '../../../employee/services/employee.service';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DecimalMaskDirective } from '../../../shared/directives/decimal-mask.directive';
import { DryingSession } from '../../models/drying-session.model';
import { DryingRoomService } from '../../services/drying-room.service';

@Component({
  selector: 'app-drying-session-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, DecimalMaskDirective, MatIconModule, MatSelectModule],
  templateUrl: './drying-session-form.component.html',
  styleUrls: ['./drying-session-form.component.scss']
})
export class DryingSessionFormComponent implements OnInit {

  sessionForm: FormGroup;
  isEditMode: boolean;
  employees: Employee[] = [];

  constructor(
    private fb: FormBuilder,
    private dryingRoomService: DryingRoomService,
    private employeeService: EmployeeService,
    public dialogRef: MatDialogRef<DryingSessionFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { session?: DryingSession, dryingRoomId: string }
  ) {
    this.isEditMode = !!this.data.session;
    this.sessionForm = this.fb.group({
      hours: [this.data.session?.hours || '', [Validators.required, Validators.min(1)]],
      employeeUsages: this.fb.array([], [Validators.required, Validators.minLength(1)])
    });

    if (this.isEditMode && this.data.session?.employeeUsages) {
        this.data.session.employeeUsages.forEach(usage => {
            this.employeeUsages.push(this.fb.group({
                employeeId: [usage.employeeId, Validators.required],
                usageTime: [usage.usageTime, Validators.required]
            }));
        });
    }
  }

  ngOnInit(): void { 
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe(data => {
      this.employees = data;
    });
  }

  get employeeUsages(): FormArray {
    return this.sessionForm.get('employeeUsages') as FormArray;
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
    if (this.sessionForm.invalid) {
      return;
    }

    const formValue = this.sessionForm.value;
    const payload = {
        ...formValue,
        employeeUsages: formValue.employeeUsages.map((usage: any) => ({
            ...usage,
            usageTime: parseFloat(String(usage.usageTime).replace(',', '.'))
        }))
    };

    if (this.isEditMode) {
      this.dryingRoomService.updateDryingSession(this.data.dryingRoomId, this.data.session!.id, payload).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => {
          if (err.status === 404) {
            alert(err.error.message);
          } else {
            alert('Ocorreu um erro ao atualizar o uso da estufa.');
          }
        }
      });
    } else {
      this.dryingRoomService.createDryingSession(this.data.dryingRoomId, payload).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => {
          if (err.status === 404) {
            alert(err.error.message);
          } else {
            alert('Ocorreu um erro ao criar o uso da estufa.');
          }
        }
      });
    }
  }
}