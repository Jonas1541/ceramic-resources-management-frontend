import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-product-transaction-outgoing-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatSelectModule, MatOptionModule, MatButtonModule],
  templateUrl: './product-transaction-outgoing-form.component.html',
  styleUrls: ['./product-transaction-outgoing-form.component.scss']
})
export class ProductTransactionOutgoingFormComponent implements OnInit {

  outgoingForm: FormGroup;
  outgoingReasons = ['SOLD', 'DEFECT_DISPOSAL', 'DISCARDED'];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    public dialogRef: MatDialogRef<ProductTransactionOutgoingFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { productId: string, transactionId: string }
  ) {
    this.outgoingForm = this.fb.group({
      outgoingReason: ['', Validators.required]
    });
  }

  ngOnInit(): void { }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.outgoingForm.invalid) {
      return;
    }

    const outgoingReason = this.outgoingForm.value.outgoingReason;

    this.productService.outgoingProductTransaction(this.data.productId, this.data.transactionId, outgoingReason).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => alert(err.error.message || 'Ocorreu um erro ao registrar a saída.')
    });
  }
}
