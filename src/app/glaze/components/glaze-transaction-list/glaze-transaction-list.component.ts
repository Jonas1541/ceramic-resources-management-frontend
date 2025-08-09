import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { GlazeService } from '../../services/glaze.service';
import { GlazeTransaction } from '../../models/glaze-transaction.model';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

import { GlazeTransactionFormComponent } from '../glaze-transaction-form/glaze-transaction-form.component';

import { DecimalFormatPipe } from '../../../shared/pipes/decimal-format.pipe';

@Component({
  selector: 'app-glaze-transaction-list',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatTableModule, CurrencyPipe, MatIconModule, DecimalFormatPipe],
  providers: [DecimalPipe],
  templateUrl: './glaze-transaction-list.component.html',
  styleUrls: ['./glaze-transaction-list.component.scss']
})
export class GlazeTransactionListComponent implements OnInit {

  transactions: GlazeTransaction[] = [];
  displayedColumns: string[] = ['id', 'type', 'quantity', 'glazeColor', 'resourceTotalCostAtTime', 'machineEnergyConsumptionCostAtTime', 'glazeFinalCostAtTime', 'createdAt', 'actions'];

  constructor(
    private glazeService: GlazeService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<GlazeTransactionListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { glazeId: string }
  ) { }

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.glazeService.getGlazeTransactions(this.data.glazeId).subscribe(data => {
      this.transactions = data;
    });
  }

  openTransactionForm(transaction?: GlazeTransaction): void {
    const dialogRef = this.dialog.open(GlazeTransactionFormComponent, {
      width: '400px',
      data: { transaction: transaction, glazeId: this.data.glazeId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTransactions();
      }
    });
  }

    deleteTransaction(transactionId: string): void {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      this.glazeService.deleteGlazeTransaction(this.data.glazeId, transactionId).subscribe(() => {
        this.loadTransactions();
      });
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
