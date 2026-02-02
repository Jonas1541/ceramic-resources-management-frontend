import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BatchService } from '../../services/batch.service';
import { BatchList } from '../../models/batch-list.model';
import { BatchFormComponent } from '../batch-form/batch-form.component';
import { BatchTransactionFormComponent } from '../batch-transaction-form/batch-transaction-form.component';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatSort, MatSortModule } from '@angular/material/sort';

import { BatchDetailsComponent } from '../batch-details/batch-details.component';
import { BatchReportComponent } from '../batch-report/batch-report.component';

@Component({
  selector: 'app-batch-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatTableModule, MatIconModule, MatDialogModule, MatOptionModule, MatSortModule, CurrencyPipe],
  templateUrl: './batch-list.component.html',
  styleUrls: ['./batch-list.component.scss']
})
export class BatchListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'createdAt', 'updatedAt', 'batchFinalCost', 'actions'];
  dataSource = new MatTableDataSource<BatchList>([]);

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private batchService: BatchService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadBatches();
  }

  loadBatches(): void {
    this.batchService.getBatches().subscribe((data: BatchList[]) => {
      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
    });
  }

  openBatchForm(batch?: BatchList): void {
    if (batch) {
      // Modo de edição: buscar o lote completo antes de abrir o diálogo
      this.batchService.getBatch(batch.id).subscribe(fullBatch => {
        const dialogRef = this.dialog.open(BatchFormComponent, {
          width: '700px',
          data: { batch: fullBatch }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.loadBatches();
          }
        });
      });
    } else {
      // Modo de criação: abrir o diálogo sem dados
      const dialogRef = this.dialog.open(BatchFormComponent, {
        width: '700px',
        data: {}
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadBatches();
        }
      });
    }
  }

  openBatchReport(): void {
    this.dialog.open(BatchReportComponent, {
      minWidth: '80vw',
      maxWidth: '1200px'
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
            alert(err.error.message);
          } else {
            alert('Ocorreu um erro ao deletar a batelada.');
          }
        }
      });
    }
  }
}
