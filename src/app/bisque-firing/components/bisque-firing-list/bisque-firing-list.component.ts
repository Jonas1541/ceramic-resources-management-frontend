import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { BisqueFiringService } from '../../services/bisque-firing.service';
import { BisqueFiring } from '../../models/bisque-firing.model';
import { BisqueFiringFormComponent } from '../bisque-firing-form/bisque-firing-form.component';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

import { DecimalFormatPipe } from '../../../shared/pipes/decimal-format.pipe';

import { BisqueFiringDetailsComponent } from '../bisque-firing-details/bisque-firing-details.component';

@Component({
  selector: 'app-bisque-firing-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatTableModule, MatIconModule, MatDialogModule, CurrencyPipe, DecimalFormatPipe],
  providers: [DecimalPipe],
  templateUrl: './bisque-firing-list.component.html',
  styleUrls: ['./bisque-firing-list.component.scss']
})
export class BisqueFiringListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'createdAt', 'updatedAt', 'temperature', 'burnTime', 'coolingTime', 'gasConsumption', 'cost', 'actions'];
  bisqueFirings: BisqueFiring[] = [];

  errorMessages: { [key: string]: string } = {
    'A queima não pode ser apagada pois há um produto que já passou pela 2° queima.': 'Não é possível deletar esta queima de biscoito pois há um produto que já passou pela 2° queima.'
  };

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
    if (bisqueFiring) {
      this.bisqueFiringService.getBisqueFiring(this.data.kilnId, bisqueFiring.id).subscribe(fullBisqueFiring => {
        const dialogRef = this.dialog.open(BisqueFiringFormComponent, {
          width: '700px',
          data: { bisqueFiring: fullBisqueFiring, kilnId: this.data.kilnId }
        });

        dialogRef.afterClosed().subscribe((result: boolean) => {
          if (result) {
            this.loadBisqueFirings();
          }
        });
      });
    } else {
      const dialogRef = this.dialog.open(BisqueFiringFormComponent, {
        width: '700px',
        data: { kilnId: this.data.kilnId }
      });

      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.loadBisqueFirings();
        }
      });
    }
  }

  openBisqueFiringDetails(bisqueFiringId: string): void {
    this.dialog.open(BisqueFiringDetailsComponent, {
      minWidth: '40vw',
      maxWidth: '60vw',
      data: { kilnId: this.data.kilnId, bisqueFiringId: bisqueFiringId }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  deleteBisqueFiring(id: string): void {
    if (confirm('Tem certeza que deseja excluir esta queima de biscoito?')) {
      this.bisqueFiringService.deleteBisqueFiring(this.data.kilnId, id).subscribe({
        next: () => this.loadBisqueFirings(),
        error: (err) => {
          const serverMessage = err.error?.message;
          const message = this.errorMessages[serverMessage] || serverMessage || 'Ocorreu um erro ao deletar a queima de biscoito.';
          alert(message);
        }
      });
    }
  }
}
