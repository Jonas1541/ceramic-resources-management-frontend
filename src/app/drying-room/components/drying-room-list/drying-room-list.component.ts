import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DryingRoomService } from '../../services/drying-room.service';
import { DryingRoom } from '../../models/drying-room.model';
import { DryingRoomFormComponent } from '../drying-room-form/drying-room-form.component';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { DryingSessionListComponent } from '../drying-session-list/drying-session-list.component';

import { DecimalFormatPipe } from '../../../shared/pipes/decimal-format.pipe';
import { DryingRoomReportComponent } from '../drying-room-report/drying-room-report.component';
import { Machine } from '../../../machine/models/machine.model';

@Component({
  selector: 'app-drying-room-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatTableModule, MatIconModule, MatDialogModule, DecimalFormatPipe],
  providers: [DecimalPipe],
  templateUrl: './drying-room-list.component.html',
  styleUrls: ['./drying-room-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DryingRoomListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'gasConsumptionPerHour', 'actions'];
  dryingRooms: DryingRoom[] = [];
  expandedElement: DryingRoom | null = null;
  detailsCache = new Map<string, Machine[]>();

  constructor(
    private dryingRoomService: DryingRoomService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadDryingRooms();
  }

  loadDryingRooms(): void {
    this.dryingRoomService.getDryingRooms().subscribe(data => {
      this.dryingRooms = data;
    });
  }

  toggleDetails(element: DryingRoom): void {
    this.expandedElement = this.expandedElement === element ? null : element;
    if (this.expandedElement && !this.detailsCache.has(element.id)) {
        this.dryingRoomService.getDryingRoom(element.id).subscribe(detailedDryingRoom => {
            this.detailsCache.set(element.id, detailedDryingRoom.machines);
        });
    }
  }

  openDryingRoomForm(dryingRoom?: DryingRoom): void {
    if (dryingRoom) {
      // EDIT MODE: Fetch full details first
      this.dryingRoomService.getDryingRoom(dryingRoom.id).subscribe(fullDryingRoom => {
        const dialogRef = this.dialog.open(DryingRoomFormComponent, {
          width: '700px',
          data: { dryingRoom: fullDryingRoom }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.detailsCache.delete(fullDryingRoom.id);
            if (this.expandedElement && this.expandedElement.id === fullDryingRoom.id) {
              this.expandedElement = null;
            }
            this.loadDryingRooms();
          }
        });
      });
    } else {
      // CREATE MODE
      const dialogRef = this.dialog.open(DryingRoomFormComponent, {
        width: '700px',
        data: { dryingRoom: undefined } // Explicitly pass undefined
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadDryingRooms();
        }
      });
    }
  }

  openSessionList(dryingRoomId: string): void {
    this.dialog.open(DryingSessionListComponent, {
      minWidth: '80vw',
      maxWidth: '95vw',
      data: { dryingRoomId: dryingRoomId }
    });
  }

  deleteDryingRoom(id: string): void {
    if (confirm('Tem certeza que deseja excluir esta estufa?')) {
      this.dryingRoomService.deleteDryingRoom(id).subscribe({
        next: () => this.loadDryingRooms(),
        error: (err) => {
          if (err.status === 409) {
            alert('Não é possível deletar esta estufa pois ela possui sessões associadas.');
          } else {
            alert(err.error.message);
          }
        }
      });
    }
  }

  openReport(dryingRoomId: string): void {
    this.dialog.open(DryingRoomReportComponent, {
      minWidth: '80vw',
      maxWidth: '1200px',
      data: { dryingRoomId: dryingRoomId }
    });
  }
}
