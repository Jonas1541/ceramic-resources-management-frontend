import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BatchService } from '../../services/batch.service';
import { BatchList } from '../../models/batch-list.model';
import { BatchFormComponent } from '../batch-form/batch-form.component';
import { BatchTransactionFormComponent } from '../batch-transaction-form/batch-transaction-form.component';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';

import { BatchDetailsComponent } from '../batch-details/batch-details.component';

@Component({
  selector: 'app-batch-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatTableModule, MatIconModule, MatDialogModule, MatOptionModule, CurrencyPipe],
  templateUrl: './batch-list.component.html',
  styleUrls: ['./batch-list.component.scss']
})
export class BatchListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'createdAt', 'updatedAt', 'batchFinalCost', 'actions'];
  batches: BatchList[] = [];

  constructor(private batchService: BatchService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadBatches();
  }

  loadBatches(): void {
    this.batchService.getBatches().subscribe((data: BatchList[]) => {
      this.batches = data;
    });
  }

  openBatchForm(batch?: BatchList): void {
    const dialogRef = this.dialog.open(BatchFormComponent, {
      width: '400px',
      data: { batch: batch }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadBatches();
      }
    });
  }

  openBatchDetails(batchId: string): void {
    this.dialog.open(BatchDetailsComponent, {
      minWidth: '70vw',
      maxWidth: '90vw',
      data: { batchId: batchId }
    });
  }

  deleteBatch(id: string): void {
    if (confirm('Tem certeza que deseja excluir esta batelada?')) {
      this.batchService.deleteBatch(id).subscribe({
        next: () => this.loadBatches(),
        error: (err) => {
          if (err.status === 409) {
            alert('Não é possível deletar esta batelada pois ela possui transações associadas.');
          } else {
            alert(err.error.message);
          }
        }
      });
    }
  }
}
