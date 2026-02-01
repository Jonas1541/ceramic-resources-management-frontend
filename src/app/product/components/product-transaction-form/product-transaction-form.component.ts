import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    public dialogRef: MatDialogRef<ProductTransactionFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { productId: string }
  ) {
    this.transactionForm = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1), integerValidator()]]
    });
  }

  ngOnInit(): void {
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.transactionForm.invalid) {
      return;
    }

    const formValue = this.transactionForm.value;
    const payload = {}; // No additional payload needed as usages come from Product

    this.productService.createProductTransaction(this.data.productId, formValue.quantity, payload).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err: any) => {
        if (err.status === 409) {
          alert(err.error.message);
        } else {
          alert('Ocorreu um erro ao criar a transação.');
        }
      }
    });
  }
}