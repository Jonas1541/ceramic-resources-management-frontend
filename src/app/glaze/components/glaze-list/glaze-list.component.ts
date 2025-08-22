import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { GlazeService } from '../../services/glaze.service';
import { Glaze } from '../../models/glaze.model';
import { GlazeFormComponent } from '../glaze-form/glaze-form.component';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';

import { GlazeTransactionListComponent } from '../glaze-transaction-list/glaze-transaction-list.component';

import { DecimalFormatPipe } from '../../../shared/pipes/decimal-format.pipe';

@Component({
  selector: 'app-glaze-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatTableModule, MatIconModule, MatDialogModule, MatOptionModule, CurrencyPipe, DecimalFormatPipe],
  providers: [DecimalPipe],
  templateUrl: './glaze-list.component.html',
  styleUrls: ['./glaze-list.component.scss']
})
export class GlazeListComponent implements OnInit {

  displayedColumns: string[] = ['color', 'unitValue', 'currentQuantity', 'unitCost', 'actions'];
  glazes: Glaze[] = [];

  constructor(
    private glazeService: GlazeService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadGlazes();
  }

  loadGlazes(): void {
    this.glazeService.getGlazes().subscribe(data => {
      this.glazes = data;
    });
  }

  openGlazeForm(glaze?: Glaze): void {
    const dialogRef = this.dialog.open(GlazeFormComponent, {
      width: '700px',
      data: { glaze: glaze }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadGlazes();
      }
    });
  }

  openTransactionList(glazeId: string): void {
    const dialogRef = this.dialog.open(GlazeTransactionListComponent, {
      minWidth: '80vw',
      maxWidth: '95vw',
      data: { glazeId: glazeId }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadGlazes();
    });
  }

  deleteGlaze(id: string): void {
    if (confirm('Tem certeza que deseja excluir esta glasura?')) {
      this.glazeService.deleteGlaze(id).subscribe({
        next: () => this.loadGlazes(),
        error: (err) => {
          if (err.status === 409) {
            alert('Não é possível deletar esta glasura pois ela possui transações associadas.');
          }
        }
      });
    }
  }
}
