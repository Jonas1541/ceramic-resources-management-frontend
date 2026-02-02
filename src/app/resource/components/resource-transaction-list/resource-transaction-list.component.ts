import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ResourceService } from '../../services/resource.service';
import { ResourceTransaction } from '../../models/resource-transaction.model';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule } from '@angular/material/sort';

import { ResourceTransactionFormComponent } from '../resource-transaction-form/resource-transaction-form.component';

import { DecimalFormatPipe } from '../../../shared/pipes/decimal-format.pipe';

@Component({
  selector: 'app-resource-transaction-list',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatTableModule, CurrencyPipe, MatIconModule, MatSortModule, DecimalFormatPipe],
  providers: [DecimalPipe],
  templateUrl: './resource-transaction-list.component.html',
  styleUrls: ['./resource-transaction-list.component.scss']
})
export class ResourceTransactionListComponent implements OnInit {

  dataSource = new MatTableDataSource<ResourceTransaction>([]);
  displayedColumns: string[] = ['id', 'type', 'quantity', 'cost', 'createdAt', 'updatedAt', 'actions'];

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private resourceService: ResourceService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ResourceTransactionListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { resourceId: string }
  ) { }

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.resourceService.getResourceTransactions(this.data.resourceId).subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
    });
  }

  openTransactionForm(transaction?: ResourceTransaction): void {
    const dialogRef = this.dialog.open(ResourceTransactionFormComponent, {
      width: '400px',
      data: { transaction: transaction, resourceId: this.data.resourceId }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.loadTransactions();
      }
    });
  }

  deleteTransaction(transactionId: string): void {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      this.resourceService.deleteResourceTransaction(this.data.resourceId, transactionId).subscribe(() => {
        this.loadTransactions();
      });
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
