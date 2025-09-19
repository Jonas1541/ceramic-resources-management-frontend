import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { Employee } from '../../../employee/models/employee.model';
import { EmployeeService } from '../../../employee/services/employee.service';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { integerValidator } from '../../../shared/validators/integer.validator';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-transaction-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatSelectModule],
  templateUrl: './product-transaction-form.component.html',
  styleUrls: ['./product-transaction-form.component.scss']
})
export class ProductTransactionFormComponent implements OnInit {

  transactionForm: FormGroup;
  employees: Employee[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private employeeService: EmployeeService,
    public dialogRef: MatDialogRef<ProductTransactionFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { productId: string }
  ) {
    this.transactionForm = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1), integerValidator()]],
      employeeUsages: this.fb.array([], [Validators.required, Validators.minLength(1)])
    });
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
    return this.transactionForm.get('employeeUsages') as FormArray;
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
    if (this.transactionForm.invalid) {
      return;
    }

    const formValue = this.transactionForm.value;
    const payload = {
        employeeUsages: formValue.employeeUsages.map((usage: any) => ({
            ...usage,
            usageTime: parseFloat(String(usage.usageTime).replace(',', '.'))
        }))
    };

    this.productService.createProductTransaction(this.data.productId, formValue.quantity, payload).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err: any) => alert(err.error.message || 'Ocorreu um erro ao criar a transação.')
    });
  }
}