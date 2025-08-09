import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { DecimalMaskDirective } from '../../../shared/directives/decimal-mask.directive';

@Component({
  selector: 'app-product-transaction-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, DecimalMaskDirective],
  templateUrl: './product-transaction-form.component.html',
  styleUrls: ['./product-transaction-form.component.scss']
})
export class ProductTransactionFormComponent implements OnInit {

  transactionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    public dialogRef: MatDialogRef<ProductTransactionFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { productId: string }
  ) {
    this.transactionForm = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void { }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.transactionForm.invalid) {
      return;
    }

    const quantity = this.transactionForm.value.quantity;

    this.productService.createProductTransaction(this.data.productId, quantity).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err: any) => alert(err.error.message || 'Ocorreu um erro ao criar a transação.')
    });
  }
}