import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { GlazeFiringService } from '../../services/glaze-firing.service';
import { GlazeFiring } from '../../models/glaze-firing.model';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

import { DecimalFormatPipe } from '../../../shared/pipes/decimal-format.pipe';

@Component({
  selector: 'app-glaze-firing-details',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatTableModule, CurrencyPipe, DecimalFormatPipe],
  providers: [DecimalPipe],
  templateUrl: './glaze-firing-details.component.html',
  styleUrls: ['./glaze-firing-details.component.scss']
})
export class GlazeFiringDetailsComponent implements OnInit {

  glazeFiring: GlazeFiring | null = null;
  glostsColumns: string[] = ['productName', 'glazeColor', 'quantity']; // Colunas para exibir os produtos esmaltados
  machineUsagesColumns: string[] = ['machineName', 'usageTime']; // Colunas para exibir o uso de máquinas

  constructor(
    private glazeFiringService: GlazeFiringService,
    public dialogRef: MatDialogRef<GlazeFiringDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { kilnId: string, glazeFiringId: string }
  ) { }

  ngOnInit(): void {
    this.loadGlazeFiringDetails();
  }

  loadGlazeFiringDetails(): void {
    this.glazeFiringService.getGlazeFiring(this.data.kilnId, this.data.glazeFiringId).subscribe(data => {
      this.glazeFiring = data;
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
