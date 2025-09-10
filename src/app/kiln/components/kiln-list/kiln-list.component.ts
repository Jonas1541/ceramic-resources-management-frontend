import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { KilnService } from '../../services/kiln.service';
import { Kiln } from '../../models/kiln.model';
import { KilnFormComponent } from '../kiln-form/kiln-form.component';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

import { BisqueFiringListComponent } from '../../../bisque-firing/components/bisque-firing-list/bisque-firing-list.component';
import { GlazeFiringListComponent } from '../../../glaze-firing/components/glaze-firing-list/glaze-firing-list.component';

import { DecimalFormatPipe } from '../../../shared/pipes/decimal-format.pipe';
import { KilnReportComponent } from '../kiln-report/kiln-report.component';

import { trigger, state, style, transition, animate } from '@angular/animations';
import { Machine } from '../../../machine/models/machine.model';

@Component({
  selector: 'app-kiln-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatTableModule, MatIconModule, MatDialogModule, DecimalFormatPipe],
  providers: [DecimalPipe],
  templateUrl: './kiln-list.component.html',
  styleUrls: ['./kiln-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class KilnListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'power', 'actions'];
  kilns: Kiln[] = [];
  expandedElement: Kiln | null = null;
  detailsCache = new Map<string, Machine[]>();

  constructor(private kilnService: KilnService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadKilns();
  }

  loadKilns(): void {
    this.kilnService.getKilns().subscribe(data => {
      this.kilns = data;
    });
  }

  toggleDetails(element: Kiln): void {
    this.expandedElement = this.expandedElement === element ? null : element;
    if (this.expandedElement && !this.detailsCache.has(element.id)) {
        this.kilnService.getKiln(element.id).subscribe(detailedKiln => {
            this.detailsCache.set(element.id, detailedKiln.machines);
        });
    }
  }

  openKilnForm(kiln?: Kiln): void {
    const dialogRef = this.dialog.open(KilnFormComponent, {
      width: '400px',
      data: { kiln: kiln }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (kiln) {
          this.detailsCache.delete(kiln.id);
          if (this.expandedElement && this.expandedElement.id === kiln.id) {
            this.expandedElement = null;
          }
        }
        this.loadKilns();
      }
    });
  }

  openBisqueFiringList(kilnId: string): void {
    this.dialog.open(BisqueFiringListComponent, {
      minWidth: '80vw',
      maxWidth: '95vw',
      data: { kilnId: kilnId }
    });
  }

  openGlazeFiringList(kilnId: string): void {
    this.dialog.open(GlazeFiringListComponent, {
      minWidth: '80vw',
      maxWidth: '95vw',
      data: { kilnId: kilnId }
    });
  }

  deleteKiln(id: string): void {
    if (confirm('Tem certeza que deseja excluir este forno?')) {
      this.kilnService.deleteKiln(id).subscribe({
        next: () => this.loadKilns(),
        error: (err) => {
          if (err.status === 409) {
            alert('Não é possível deletar este forno pois ele possui queimas associadas.');
          } else {
            alert(err.error.message);
          }
        }
      });
    }
  }

  openReport(kilnId: string): void {
    this.dialog.open(KilnReportComponent, {
      minWidth: '80vw',
      maxWidth: '1200px',
      data: { kilnId: kilnId }
    });
  }
}