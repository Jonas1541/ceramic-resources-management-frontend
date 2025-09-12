import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ProductService } from '../../services/product.service';
import { ProductTransaction } from '../../models/product-transaction.model';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

import { ProductTransactionFormComponent } from '../product-transaction-form/product-transaction-form.component';
import { ProductTransactionOutgoingFormComponent } from '../product-transaction-outgoing-form/product-transaction-outgoing-form.component';

import { DecimalFormatPipe } from '../../../shared/pipes/decimal-format.pipe';

import { TranslateProductStatePipe } from '../../../shared/pipes/translate-product-state.pipe';

import { TranslateOutgoingReasonPipe } from '../../../shared/pipes/translate-outgoing-reason.pipe';

import { ProductTransactionBulkCancelFormComponent } from '../product-transaction-bulk-cancel-form/product-transaction-bulk-cancel-form.component';
import { ProductTransactionBulkOutgoingFormComponent } from '../product-transaction-bulk-outgoing-form/product-transaction-bulk-outgoing-form.component';

@Component({
  selector: 'app-product-transaction-list',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatTableModule, CurrencyPipe, MatIconModule, DecimalFormatPipe, TranslateProductStatePipe, TranslateOutgoingReasonPipe],
  providers: [DecimalPipe],
  templateUrl: './product-transaction-list.component.html',
  styleUrls: ['./product-transaction-list.component.scss']
})
export class ProductTransactionListComponent implements OnInit {

  transactions: ProductTransaction[] = [];
  displayedColumns: string[] = ['id', 'productName', 'state', 'glazeColor', 'glazeQuantity', 'cost', 'profit', 'createdAt', 'outgoingAt', 'outgoingReason', 'actions'];

  constructor(
    private productService: ProductService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ProductTransactionListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { productId: string }
  ) { }

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.productService.getProductTransactions(this.data.productId).subscribe(data => {
      this.transactions = data;
    });
  }

  outgoingTransaction(transactionId: string): void {
    const dialogRef = this.dialog.open(ProductTransactionOutgoingFormComponent, {
      width: '400px',
      data: { productId: this.data.productId, transactionId: transactionId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTransactions();
      }
    });
  }

  cancelOutgoingProductTransaction(transactionId: string): void {
    if (confirm('Tem certeza que deseja cancelar a saída desta unidade?')) {
      this.productService.cancelOutgoingProductTransaction(this.data.productId, transactionId).subscribe(() => {
        this.loadTransactions();
      });
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  deleteTransaction(transactionId: string): void {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      this.productService.deleteProductTransaction(this.data.productId, transactionId).subscribe(() => {
        this.loadTransactions();
      });
    }
  }

  openTransactionForm(): void {
    const dialogRef = this.dialog.open(ProductTransactionFormComponent, {
      width: '400px',
      data: { productId: this.data.productId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTransactions();
      }
    });
  }

  openBulkOutgoingForm(): void {
    const dialogRef = this.dialog.open(ProductTransactionBulkOutgoingFormComponent, {
      width: '400px',
      data: { productId: this.data.productId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTransactions();
      }
    });
  }

  openBulkCancelForm(): void {
    const dialogRef = this.dialog.open(ProductTransactionBulkCancelFormComponent, {
      width: '400px',
      data: { productId: this.data.productId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTransactions();
      }
    });
  }
}