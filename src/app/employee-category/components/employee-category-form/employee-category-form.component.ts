import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TrimDirective } from '../../../shared/directives/trim.directive';
import { EmployeeCategoryService } from '../../services/employee-category.service';
import { EmployeeCategory } from '../../models/employee-category.model';

@Component({
  selector: 'app-employee-category-form',
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, TrimDirective],
  templateUrl: './employee-category-form.component.html',
  styleUrl: './employee-category-form.component.scss'
})
export class EmployeeCategoryFormComponent {

    employeeCategoryForm: FormGroup;
    isEditMode = false;

    constructor(
        private fb: FormBuilder,
        private employeeCategoryService: EmployeeCategoryService,
        public dialogRef: MatDialogRef<EmployeeCategoryFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { employeeCategory: EmployeeCategory }
    ) {
    this.employeeCategoryForm = this.fb.group({
      name: ['', Validators.required]
    });

    if (data && data.employeeCategory) {
      this.isEditMode = true;
      this.employeeCategoryForm.patchValue(data.employeeCategory);
    }
  }

  ngOnInit(): void { }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.employeeCategoryForm.invalid) {
      return;
    }

    const formData = this.employeeCategoryForm.value;

    if (this.isEditMode) {
      this.employeeCategoryService.updateEmployeeCategory(this.data.employeeCategory.id, formData).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => {
          if (err.status === 409 && err.error?.message) {
            alert(err.error.message); // Repassa a mensagem do backend
          } else {
            alert('Ocorreu um erro ao atualizar a categoria de funcionário.'); // Mensagem genérica
          }
        }
      });
    } else {
      this.employeeCategoryService.createEmployeeCategory(formData).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => {
          if (err.status === 409 && err.error?.message) {
            alert(err.error.message); // Repassa a mensagem do backend
          } else {
            alert('Ocorreu um erro ao criar a categoria de funcionário.'); // Mensagem genérica
          }
        }
      });
    }
  }
}