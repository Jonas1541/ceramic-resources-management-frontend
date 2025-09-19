
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ProductService } from '../../services/product.service';
import { ProductTransaction } from '../../models/product-transaction.model';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { DecimalFormatPipe } from '../../../shared/pipes/decimal-format.pipe';
import { TranslateProductStatePipe } from '../../../shared/pipes/translate-product-state.pipe';
import { TranslateOutgoingReasonPipe } from '../../../shared/pipes/translate-outgoing-reason.pipe';

@Component({
  selector: 'app-product-transaction-details',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatTableModule, MatIconModule, CurrencyPipe, DatePipe, DecimalFormatPipe, TranslateProductStatePipe, TranslateOutgoingReasonPipe],
  providers: [DecimalPipe],
  templateUrl: './product-transaction-details.component.html',
  styleUrls: ['./product-transaction-details.component.scss']
})
export class ProductTransactionDetailsComponent implements OnInit {

  transaction: ProductTransaction | null = null;
  employeeUsagesColumns: string[] = ['employeeName', 'usageTime', 'employeeCost'];

  constructor(
    private productService: ProductService,
    public dialogRef: MatDialogRef<ProductTransactionDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { productId: string, transactionId: string }
  ) { }

  ngOnInit(): void {
    this.loadTransactionDetails();
  }

  loadTransactionDetails(): void {
    this.productService.getProductTransactionById(this.data.productId, this.data.transactionId).subscribe(data => {
      this.transaction = data;
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
