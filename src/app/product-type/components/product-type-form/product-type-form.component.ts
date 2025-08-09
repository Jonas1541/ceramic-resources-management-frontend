import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ProductTypeService } from '../../services/product-type.service';
import { ProductType } from '../../models/product-type.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-product-type-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './product-type-form.component.html',
  styleUrls: ['./product-type-form.component.scss']
})
export class ProductTypeFormComponent implements OnInit {

  productTypeForm: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private productTypeService: ProductTypeService,
    public dialogRef: MatDialogRef<ProductTypeFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { productType: ProductType }
  ) {
    this.productTypeForm = this.fb.group({
      name: ['', Validators.required]
    });

    if (data && data.productType) {
      this.isEditMode = true;
      this.productTypeForm.patchValue(data.productType);
    }
  }

  ngOnInit(): void { }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.productTypeForm.invalid) {
      return;
    }

    const formData = this.productTypeForm.value;

    if (this.isEditMode) {
      this.productTypeService.updateProductType(this.data.productType.id, formData).subscribe(() => {
        this.dialogRef.close(true);
      });
    } else {
      this.productTypeService.createProductType(formData).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }
}
