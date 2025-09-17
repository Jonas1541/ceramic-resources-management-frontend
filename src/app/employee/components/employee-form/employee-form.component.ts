import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

import { EmployeeCategory } from '../../../employee-category/models/employee-category.model';
import { EmployeeCategoryService } from '../../../employee-category/services/employee-category.service';

import { DecimalMaskDirective } from '../../../shared/directives/decimal-mask.directive';
import { TrimDirective } from '../../../shared/directives/trim.directive';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    DecimalMaskDirective,
    TrimDirective
  ],
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit {

  employeeForm: FormGroup;
  isEditMode = false;
  employeeCategories: EmployeeCategory[] = [];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private employeeCategoryService: EmployeeCategoryService,
    public dialogRef: MatDialogRef<EmployeeFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { employee: Employee }
  ) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      costPerHour: ['', Validators.required],
      categoryId: ['', Validators.required]
    });

    if (data && data.employee) {
      this.isEditMode = true;
    }
  }

  ngOnInit(): void {
    this.employeeCategoryService.getEmployeeCategories().subscribe(categories => {
      this.employeeCategories = categories;

      if (this.isEditMode && this.data.employee) {
        this.employeeForm.setValue({
          name: this.data.employee.name,
          costPerHour: this.data.employee.costPerHour.toString(),
          categoryId: this.data.employee.categoryId
        });
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    const formData = { ...this.employeeForm.value };

    if (typeof formData.costPerHour === 'string') {
      formData.costPerHour = parseFloat(formData.costPerHour.replace(',', '.'));
    }

    if (this.isEditMode) {
      this.employeeService.updateEmployee(this.data.employee.id, formData).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => alert(err.error.message || 'Ocorreu um erro ao atualizar o funcionário.')
      });
    } else {
      this.employeeService.createEmployee(formData).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => alert(err.error.message || 'Ocorreu um erro ao criar o funcionário.')
      });
    }
  }
}