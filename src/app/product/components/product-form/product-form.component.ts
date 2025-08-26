import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { ProductType } from '../../../product-type/models/product-type.model';
import { ProductLine } from '../../../product-line/models/product-line.model';
import { ProductTypeService } from '../../../product-type/services/product-type.service';
import { ProductLineService } from '../../../product-line/services/product-line.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { DecimalMaskDirective } from '../../../shared/directives/decimal-mask.directive';

import { TrimDirective } from '../../../shared/directives/trim.directive';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatOptionModule, DecimalMaskDirective, TrimDirective],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {

  productForm: FormGroup;
  isEditMode = false;
  productTypes: ProductType[] = [];
  productLines: ProductLine[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private productTypeService: ProductTypeService,
    private productLineService: ProductLineService,
    public dialogRef: MatDialogRef<ProductFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product: Product }
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0.01)]],
      height: ['', [Validators.required, Validators.min(0.01)]],
      length: ['', [Validators.required, Validators.min(0.01)]],
      width: ['', [Validators.required, Validators.min(0.01)]],
      typeId: ['', Validators.required],
      lineId: ['', Validators.required]
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

        if (this.isEditMode) {
          this.productService.getProduct(this.data.product.id).subscribe(productDetails => {
            const selectedType = this.productTypes.find(t => t.name === productDetails.type);
            const selectedLine = this.productLines.find(l => l.name === productDetails.line);

            this.productForm.setValue({
              name: productDetails.name,
              price: productDetails.price,
              height: productDetails.height,
              length: productDetails.length,
              width: productDetails.width,
              typeId: selectedType ? selectedType.id : '',
              lineId: selectedLine ? selectedLine.id : ''
            });
          });
        }
      });
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const formData = this.productForm.value;

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
