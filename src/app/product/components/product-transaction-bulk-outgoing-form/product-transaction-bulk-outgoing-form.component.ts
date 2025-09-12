
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
import { TranslateOutgoingReasonPipe } from '../../../shared/pipes/translate-outgoing-reason.pipe';

@Component({
  selector: 'app-product-transaction-bulk-outgoing-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, TranslateProductStatePipe, TranslateOutgoingReasonPipe],
  templateUrl: './product-transaction-bulk-outgoing-form.component.html',
})
export class ProductTransactionBulkOutgoingFormComponent {

  form: FormGroup;
  productStates = ['BISCUIT', 'GLAZED'];
  outgoingReasons = ['SOLD', 'DEFECT_DISPOSAL'];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    public dialogRef: MatDialogRef<ProductTransactionBulkOutgoingFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { productId: string }
  ) {
    this.form = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1)]],
      state: ['', Validators.required],
      outgoingReason: ['', Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const { quantity, state, outgoingReason } = this.form.value;
    this.productService.outgoingByQuantity(this.data.productId, quantity, state, outgoingReason).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => {
        if (err.status === 404 && err.error?.message) {
          alert(err.error.message);
        } else {
          alert('Ocorreu um erro ao processar a saída dos produtos.');
        }
      }
    });
  }
}
