import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { BisqueFiringService } from '../../services/bisque-firing.service';
import { BisqueFiring } from '../../models/bisque-firing.model';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

import { DecimalFormatPipe } from '../../../shared/pipes/decimal-format.pipe';

@Component({
  selector: 'app-bisque-firing-details',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatTableModule, CurrencyPipe, DecimalFormatPipe],
  providers: [DecimalPipe],
  templateUrl: './bisque-firing-details.component.html',
  styleUrls: ['./bisque-firing-details.component.scss']
})
export class BisqueFiringDetailsComponent implements OnInit {

  bisqueFiring: BisqueFiring | null = null;
  biscuitsColumns: string[] = ['product']; // Colunas para exibir os produtos
  employeeUsagesColumns: string[] = ['employeeName', 'usageTime', 'employeeCost'];

  constructor(
    private bisqueFiringService: BisqueFiringService,
    public dialogRef: MatDialogRef<BisqueFiringDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { kilnId: string, bisqueFiringId: string }
  ) { }

  ngOnInit(): void {
    this.loadBisqueFiringDetails();
  }

  loadBisqueFiringDetails(): void {
    this.bisqueFiringService.getBisqueFiring(this.data.kilnId, this.data.bisqueFiringId).subscribe(data => {
      this.bisqueFiring = data;
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
