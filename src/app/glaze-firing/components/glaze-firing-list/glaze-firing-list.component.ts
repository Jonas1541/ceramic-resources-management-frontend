import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { GlazeFiringService } from '../../services/glaze-firing.service';
import { GlazeFiring } from '../../models/glaze-firing.model';
import { GlazeFiringFormComponent } from '../glaze-firing-form/glaze-firing-form.component';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

import { DecimalFormatPipe } from '../../../shared/pipes/decimal-format.pipe';

import { GlazeFiringDetailsComponent } from '../glaze-firing-details/glaze-firing-details.component';

@Component({
  selector: 'app-glaze-firing-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatTableModule, MatIconModule, MatDialogModule, CurrencyPipe, DecimalFormatPipe],
  providers: [DecimalPipe],
  templateUrl: './glaze-firing-list.component.html',
  styleUrls: ['./glaze-firing-list.component.scss']
})
export class GlazeFiringListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'createdAt', 'updatedAt', 'temperature', 'burnTime', 'coolingTime', 'gasConsumption', 'cost', 'actions'];
  glazeFirings: GlazeFiring[] = [];

  constructor(
    private glazeFiringService: GlazeFiringService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<GlazeFiringListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { kilnId: string }
  ) { }

  ngOnInit(): void {
    this.loadGlazeFirings();
  }

  loadGlazeFirings(): void {
    this.glazeFiringService.getGlazeFirings(this.data.kilnId).subscribe(data => {
      this.glazeFirings = data;
    });
  }

  openGlazeFiringForm(glazeFiring?: GlazeFiring): void {
    if (glazeFiring) {
      this.glazeFiringService.getGlazeFiring(this.data.kilnId, glazeFiring.id).subscribe(fullGlazeFiring => {
        const dialogRef = this.dialog.open(GlazeFiringFormComponent, {
          width: '700px',
          data: { glazeFiring: fullGlazeFiring, kilnId: this.data.kilnId }
        });

        dialogRef.afterClosed().subscribe((result: boolean) => {
          if (result) {
            this.loadGlazeFirings();
          }
        });
      });
    } else {
      const dialogRef = this.dialog.open(GlazeFiringFormComponent, {
        width: '700px',
        data: { kilnId: this.data.kilnId }
      });

      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.loadGlazeFirings();
        }
      });
    }
  }

  openGlazeFiringDetails(glazeFiringId: string): void {
    this.dialog.open(GlazeFiringDetailsComponent, {
      minWidth: '40vw',
      maxWidth: '60vw',
      data: { kilnId: this.data.kilnId, glazeFiringId: glazeFiringId }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  deleteGlazeFiring(id: string): void {
    if (confirm('Tem certeza que deseja excluir esta queima de esmalte?')) {
      this.glazeFiringService.deleteGlazeFiring(id).subscribe({
        next: () => this.loadGlazeFirings(),
        error: (err) => {
          if (err.status === 409) {
            alert('Não é possível deletar esta queima de esmalte pois ela possui transações associadas.');
          } else {
            alert(err.error.message);
          }
        }
      });
    }
  }
}