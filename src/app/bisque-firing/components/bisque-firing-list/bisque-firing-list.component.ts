import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { BisqueFiringService } from '../../services/bisque-firing.service';
import { BisqueFiring } from '../../models/bisque-firing.model';
import { BisqueFiringFormComponent } from '../bisque-firing-form/bisque-firing-form.component';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

import { DecimalFormatPipe } from '../../../shared/pipes/decimal-format.pipe';

@Component({
  selector: 'app-bisque-firing-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatTableModule, MatIconModule, MatDialogModule, CurrencyPipe, DecimalFormatPipe],
  templateUrl: './bisque-firing-list.component.html',
  styleUrls: ['./bisque-firing-list.component.scss']
})
export class BisqueFiringListComponent implements OnInit {

  displayedColumns: string[] = ['temperature', 'burnTime', 'coolingTime', 'gasConsumption', 'kiln', 'costAtTime', 'actions'];
  bisqueFirings: BisqueFiring[] = [];

  constructor(
    private bisqueFiringService: BisqueFiringService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<BisqueFiringListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { kilnId: string }
  ) { }

  ngOnInit(): void {
    this.loadBisqueFirings();
  }

  loadBisqueFirings(): void {
    this.bisqueFiringService.getBisqueFirings(this.data.kilnId).subscribe(data => {
      this.bisqueFirings = data;
    });
  }

  openBisqueFiringForm(bisqueFiring?: BisqueFiring): void {
    const dialogRef = this.dialog.open(BisqueFiringFormComponent, {
      width: '400px',
      data: { bisqueFiring: bisqueFiring, kilnId: this.data.kilnId }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.loadBisqueFirings();
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  deleteBisqueFiring(id: string): void {
    if (confirm('Tem certeza que deseja excluir esta queima de biscoito?')) {
      this.bisqueFiringService.deleteBisqueFiring(id).subscribe({
        next: () => this.loadBisqueFirings(),
        error: (err) => {
          if (err.status === 409) {
            alert('Não é possível deletar esta queima de biscoito pois ela possui transações associadas.');
          } else {
            alert(err.error.message);
          }
        }
      });
    }
  }
}
