import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { BatchService } from '../../services/batch.service';
import { Batch } from '../../models/batch.model';
import { CommonModule, CurrencyPipe, DecimalPipe, PercentPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

import { DecimalFormatPipe } from '../../../shared/pipes/decimal-format.pipe';

@Component({
  selector: 'app-batch-details',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatTableModule, CurrencyPipe, DecimalFormatPipe, PercentPipe],
  providers: [DecimalPipe, PercentPipe],
  templateUrl: './batch-details.component.html',
  styleUrls: ['./batch-details.component.scss']
})
export class BatchDetailsComponent implements OnInit {

  batch: Batch | null = null;
  resourceUsagesColumns: string[] = ['name', 'initialQuantity', 'umidity', 'addedQuantity', 'totalQuantity', 'totalWater', 'totalCost'];
  machineUsagesColumns: string[] = ['name', 'usageTime', 'energyConsumption'];

  constructor(
    private batchService: BatchService,
    public dialogRef: MatDialogRef<BatchDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { batchId: string }
  ) { }

  ngOnInit(): void {
    this.loadBatchDetails();
  }

  loadBatchDetails(): void {
    this.batchService.getBatch(this.data.batchId).subscribe(data => {
      this.batch = data;
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
