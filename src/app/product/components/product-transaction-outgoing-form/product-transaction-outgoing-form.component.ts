import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslateOutgoingReasonPipe } from '../../../shared/pipes/translate-outgoing-reason.pipe';

@Component({
  selector: 'app-product-transaction-outgoing-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatButtonModule, MatSelectModule, TranslateOutgoingReasonPipe],
  templateUrl: './product-transaction-outgoing-form.component.html',
})
export class ProductTransactionOutgoingFormComponent implements OnInit {

  form: FormGroup;
  outgoingReasons: string[] = [];
  private allReasons = ['SOLD', 'DEFECT_DISPOSAL'];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    public dialogRef: MatDialogRef<ProductTransactionOutgoingFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { productId: string, transactionId: string, state: string }
  ) {
    this.form = this.fb.group({
      outgoingReason: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data.state === 'GREENWARE') {
      this.outgoingReasons = ['DEFECT_DISPOSAL'];
    } else {
      this.outgoingReasons = this.allReasons;
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const { outgoingReason } = this.form.value;
    this.productService.outgoingProductTransaction(this.data.productId, this.data.transactionId, outgoingReason).subscribe(() => {
      this.dialogRef.close(true);
    });
  }
}
