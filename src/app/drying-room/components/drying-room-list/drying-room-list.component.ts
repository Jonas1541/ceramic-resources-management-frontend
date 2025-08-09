import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DryingRoomService } from '../../services/drying-room.service';
import { DryingRoom } from '../../models/drying-room.model';
import { DryingRoomFormComponent } from '../drying-room-form/drying-room-form.component';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

import { DryingSessionListComponent } from '../drying-session-list/drying-session-list.component';

import { DecimalFormatPipe } from '../../../shared/pipes/decimal-format.pipe';

@Component({
  selector: 'app-drying-room-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatTableModule, MatIconModule, MatDialogModule, DecimalFormatPipe],
  providers: [DecimalPipe],
  templateUrl: './drying-room-list.component.html',
  styleUrls: ['./drying-room-list.component.scss']
})
export class DryingRoomListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'gasConsumptionPerHour', 'uses', 'actions'];
  dryingRooms: DryingRoom[] = [];

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

  openDryingRoomForm(dryingRoom?: DryingRoom): void {
    const dialogRef = this.dialog.open(DryingRoomFormComponent, {
      width: '400px',
      data: { dryingRoom: dryingRoom }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDryingRooms();
      }
    });
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
}