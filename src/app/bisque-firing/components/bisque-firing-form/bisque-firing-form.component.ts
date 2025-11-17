
import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Employee } from '../../../employee/models/employee.model';
import { EmployeeService } from '../../../employee/services/employee.service';
import { ProductTransaction } from '../../../product/models/product-transaction.model';
import { ProductService } from '../../../product/services/product.service';
import { DecimalMaskDirective } from '../../../shared/directives/decimal-mask.directive';
import { BisqueFiring } from '../../models/bisque-firing.model';
import { BisqueFiringService } from '../../services/bisque-firing.service';
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-bisque-firing-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatExpansionModule, MatCheckboxModule, DecimalMaskDirective, MatIconModule],
  templateUrl: './bisque-firing-form.component.html',
  styleUrls: ['./bisque-firing-form.component.scss']
})
export class BisqueFiringFormComponent implements OnInit {

  bisqueFiringForm: FormGroup;
  isEditMode = false;
  groupedProducts = new Map<string, ProductTransaction[]>();
  productTransactions: ProductTransaction[] = [];
  employees: Employee[] = [];

  constructor(
    private fb: FormBuilder,
    private bisqueFiringService: BisqueFiringService,
    private productService: ProductService,
    private employeeService: EmployeeService,
    public dialogRef: MatDialogRef<BisqueFiringFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { bisqueFiring?: BisqueFiring, kilnId: string }
  ) {
    this.isEditMode = !!this.data.bisqueFiring;
    this.bisqueFiringForm = this.fb.group({
      temperature: [this.data.bisqueFiring?.temperature || '', [Validators.required, Validators.min(0)]],
      burnTime: [this.data.bisqueFiring?.burnTime || '', [Validators.required, Validators.min(0)]],
      coolingTime: [this.data.bisqueFiring?.coolingTime || '', [Validators.required, Validators.min(0)]],
      firedProducts: this.fb.array([], [Validators.required, Validators.minLength(1)]),
      employeeUsages: this.fb.array([], [Validators.required, Validators.minLength(1)])
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
    this.productService.getProductTransactions('1', 'GREENWARE').subscribe(greenwareProducts => {
      this.productTransactions = greenwareProducts;

      if (this.isEditMode && this.data.bisqueFiring) {
        this.bisqueFiringForm.patchValue({
          temperature: this.data.bisqueFiring.temperature,
          burnTime: this.data.bisqueFiring.burnTime,
          coolingTime: this.data.bisqueFiring.coolingTime
        });

        const existingBiscuitProducts = this.data.bisqueFiring.biscuits.filter(biscuit => 
          !this.productTransactions.some(pt => pt.id === biscuit.id)
        );
        this.productTransactions = [...this.productTransactions, ...existingBiscuitProducts];
        
        this.groupProducts(this.productTransactions);

        const biscuitCounts = new Map<string, number>();
        this.data.bisqueFiring.biscuits.forEach(biscuit => {
          biscuitCounts.set(biscuit.productName, (biscuitCounts.get(biscuit.productName) || 0) + 1);
        });

        this.firedProducts.controls.forEach(control => {
          const productName = control.get('productName')?.value;
          const count = biscuitCounts.get(productName) || 0;
          control.get('quantity')?.patchValue(count);
        });

        this.data.bisqueFiring.employeeUsages.forEach(usage => {
            this.employeeUsages.push(this.fb.group({
                employeeId: [usage.employeeId, Validators.required],
                usageTime: [usage.usageTime, Validators.required]
            }));
        });
      }
      else {
        this.groupProducts(this.productTransactions);
      }
    });
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe(data => {
      this.employees = data;
    });
  }

  private groupProducts(transactions: ProductTransaction[]): void {
    this.groupedProducts.clear();
    transactions.forEach(transaction => {
      const key = transaction.productName;
      if (!this.groupedProducts.has(key)) {
        this.groupedProducts.set(key, []);
      }
      this.groupedProducts.get(key)!.push(transaction);
    });

    this.firedProducts.clear();
    this.groupedProducts.forEach((value, key) => {
      const formGroup = this.fb.group({
        productName: [key],
        quantity: [0, [Validators.required, Validators.min(0), Validators.max(value.length), Validators.pattern(/^[0-9]+$/)]]
      });
      this.firedProducts.push(formGroup);
    });
  }

  get firedProducts(): FormArray {
    return this.bisqueFiringForm.get('firedProducts') as FormArray;
  }

  get employeeUsages(): FormArray {
    return this.bisqueFiringForm.get('employeeUsages') as FormArray;
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

  asIsOrder(a: any, b: any): number { return 1; }

  onCancel(): void { this.dialogRef.close(); }

  onSubmit(): void {
    if (this.bisqueFiringForm.invalid) return;

    const formData = { ...this.bisqueFiringForm.value };
    
    const biscuits: string[] = [];
    this.firedProducts.controls.forEach(control => {
      const productName = control.get('productName')?.value;
      const quantity = control.get('quantity')?.value;
      if (quantity > 0) {
        const transactions = this.groupedProducts.get(productName);
        if (transactions) {
          for (let i = 0; i < quantity; i++) {
            biscuits.push(transactions[i].id);
          }
        }
      }
    });

    if (biscuits.length === 0) {
      alert('Pelo menos um produto deve ser selecionado para a queima.');
      return;
    }

    formData.biscuits = biscuits;
    delete formData.firedProducts;

    if (typeof formData.temperature === 'string') formData.temperature = parseFloat(formData.temperature.replace(',', '.'));
    if (typeof formData.burnTime === 'string') formData.burnTime = parseFloat(formData.burnTime.replace(',', '.'));
    if (typeof formData.coolingTime === 'string') formData.coolingTime = parseFloat(formData.coolingTime.replace(',', '.'));

    formData.employeeUsages = formData.employeeUsages.map((usage: any) => ({
        ...usage,
        usageTime: parseFloat(String(usage.usageTime).replace(',', '.'))
    }));

    const operation = this.isEditMode
      ? this.bisqueFiringService.updateBisqueFiring(this.data.kilnId, this.data.bisqueFiring!.id, formData)
      : this.bisqueFiringService.createBisqueFiring(this.data.kilnId, formData);

    operation.subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => {
        const message = err.error?.message || (this.isEditMode ? 'Ocorreu um erro ao atualizar a queima.' : 'Ocorreu um erro ao criar a queima.');
        alert(message);
      }
    });
  }
}
