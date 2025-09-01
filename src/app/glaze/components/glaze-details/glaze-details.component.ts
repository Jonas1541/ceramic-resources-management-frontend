import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { GlazeService } from '../../services/glaze.service';
import { Glaze } from '../../models/glaze.model';
import { CommonModule, CurrencyPipe, DecimalPipe, PercentPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { DecimalFormatPipe } from '../../../shared/pipes/decimal-format.pipe';

@Component({
  selector: 'app-glaze-details',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatTableModule, MatIconModule, CurrencyPipe, DecimalFormatPipe, PercentPipe],
  providers: [DecimalPipe, PercentPipe],
  templateUrl: './glaze-details.component.html',
  styleUrls: ['./glaze-details.component.scss']
})
export class GlazeDetailsComponent implements OnInit {

  glaze: Glaze | null = null;
  resourceUsagesColumns: string[] = ['resourceName', 'quantity'];
  machineUsagesColumns: string[] = ['machineName', 'usageTime'];

  constructor(
    private glazeService: GlazeService,
    public dialogRef: MatDialogRef<GlazeDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { glazeId: string }
  ) { }

  ngOnInit(): void {
    this.loadGlazeDetails();
  }

  loadGlazeDetails(): void {
    this.glazeService.getGlaze(this.data.glazeId).subscribe(data => {
      this.glaze = data;
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}