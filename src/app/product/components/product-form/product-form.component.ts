
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { ProductType } from '../../../product-type/models/product-type.model';
import { ProductLine } from '../../../product-line/models/product-line.model';
import { Employee } from '../../../employee/models/employee.model';
import { ProductTypeService } from '../../../product-type/services/product-type.service';
import { ProductLineService } from '../../../product-line/services/product-line.service';
import { EmployeeService } from '../../../employee/services/employee.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { DecimalMaskDirective } from '../../../shared/directives/decimal-mask.directive';
import { TrimDirective } from '../../../shared/directives/trim.directive';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatOptionModule, MatIconModule, DecimalMaskDirective, TrimDirective],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {

  productForm: FormGroup;
  isEditMode = false;
  productTypes: ProductType[] = [];
  productLines: ProductLine[] = [];
  employees: Employee[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private productTypeService: ProductTypeService,
    private productLineService: ProductLineService,
    private employeeService: EmployeeService,
    public dialogRef: MatDialogRef<ProductFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product: Product }
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required]],
      height: ['', [Validators.required]],
      length: ['', [Validators.required]],
      width: ['', [Validators.required]],
      glazeQuantityPerUnit: ['', [Validators.required]],
      weight: ['', [Validators.required]],
      typeId: ['', Validators.required],
      lineId: ['', Validators.required],
      employeeUsages: this.fb.array([])
    });

    if (data && data.product) {
      this.isEditMode = true;
    }
  }

  ngOnInit(): void {
    this.productTypeService.getProductTypes().subscribe(types => {
      this.productTypes = types;
      this.productLineService.getProductLines().subscribe(lines => {
        this.productLines = lines;
        this.employeeService.getEmployees().subscribe(employees => {
          this.employees = employees;

          if (this.isEditMode) {
            this.productService.getProduct(this.data.product.id).subscribe(productDetails => {
              const selectedType = this.productTypes.find(t => t.name === productDetails.type);
              const selectedLine = this.productLines.find(l => l.name === productDetails.line);

              this.productForm.patchValue({
                name: productDetails.name,
                price: productDetails.price,
                height: productDetails.height,
                length: productDetails.length,
                width: productDetails.width,
                glazeQuantityPerUnit: productDetails.glazeQuantityPerUnit,
                weight: productDetails.weight,
                typeId: selectedType ? selectedType.id : '',
                lineId: selectedLine ? selectedLine.id : ''
              });

              if (productDetails.employeeUsages) {
                productDetails.employeeUsages.forEach(usage => {
                  this.addEmployeeUsage(usage.employeeId, usage.usageTime);
                });
              }
            });
          }
        });
      });
    });
  }

  get employeeUsages(): FormArray {
    return this.productForm.get('employeeUsages') as FormArray;
  }

  addEmployeeUsage(employeeId: string = '', usageTime: number | string = ''): void {
    this.employeeUsages.push(this.fb.group({
      employeeId: [employeeId, Validators.required],
      usageTime: [usageTime, [Validators.required, Validators.min(0)]]
    }));
  }

  removeEmployeeUsage(index: number): void {
    this.employeeUsages.removeAt(index);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const formData = { ...this.productForm.value };
    // Process number fields (same as before)
    if (typeof formData.price === 'string') formData.price = parseFloat(formData.price.replace(',', '.'));
    if (typeof formData.height === 'string') formData.height = parseFloat(formData.height.replace(',', '.'));
    if (typeof formData.length === 'string') formData.length = parseFloat(formData.length.replace(',', '.'));
    if (typeof formData.width === 'string') formData.width = parseFloat(formData.width.replace(',', '.'));
    if (typeof formData.glazeQuantityPerUnit === 'string') formData.glazeQuantityPerUnit = parseFloat(formData.glazeQuantityPerUnit.replace(',', '.'));
    if (typeof formData.weight === 'string') formData.weight = parseFloat(formData.weight.replace(',', '.'));

    // Ensure usageTime is a number
    if (formData.employeeUsages) {
      formData.employeeUsages = formData.employeeUsages.map((u: any) => ({
        ...u,
        usageTime: typeof u.usageTime === 'string' ? parseFloat(u.usageTime.replace(',', '.')) : u.usageTime
      }));
    }

    if (this.isEditMode) {
      this.productService.updateProduct(this.data.product.id, formData).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => alert(err.error.message || 'Ocorreu um erro ao atualizar o produto.')
      });
    } else {
      this.productService.createProduct(formData).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => alert(err.error.message || 'Ocorreu um erro ao criar o produto.')
      });
    }
  }
}
