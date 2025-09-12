
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { TranslateProductStatePipe } from '../../../shared/pipes/translate-product-state.pipe';

@Component({
  selector: 'app-product-transaction-bulk-cancel-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, TranslateProductStatePipe],
  templateUrl: './product-transaction-bulk-cancel-form.component.html',
})
export class ProductTransactionBulkCancelFormComponent {

  form: FormGroup;
  productStates = ['BISCUIT', 'GLAZED']; // Apenas estados que podem ser revertidos

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    public dialogRef: MatDialogRef<ProductTransactionBulkCancelFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { productId: string }
  ) {
    this.form = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1)]],
      state: ['', Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const { quantity, state } = this.form.value;
    this.productService.cancelOutgoingByQuantity(this.data.productId, quantity, state).subscribe(() => {
      this.dialogRef.close(true);
    });
  }
}
