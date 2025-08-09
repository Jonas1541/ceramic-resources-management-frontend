import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { DryingRoomService } from '../../services/drying-room.service';
import { DryingSession } from '../../models/drying-session.model';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { DryingSessionFormComponent } from '../drying-session-form/drying-session-form.component';

import { DecimalFormatPipe } from '../../../shared/pipes/decimal-format.pipe';

@Component({
  selector: 'app-drying-session-list',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatTableModule, MatIconModule, CurrencyPipe, DecimalFormatPipe],
  providers: [DecimalPipe],
  templateUrl: './drying-session-list.component.html',
  styleUrls: ['./drying-session-list.component.scss']
})
export class DryingSessionListComponent implements OnInit {

  sessions: DryingSession[] = [];
  displayedColumns: string[] = ['id', 'hours', 'createdAt', 'updatedAt', 'costAtTime', 'actions'];

  constructor(
    private dryingRoomService: DryingRoomService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DryingSessionListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { dryingRoomId: string }
  ) { }

  ngOnInit(): void {
    this.loadSessions();
  }

  loadSessions(): void {
    this.dryingRoomService.getDryingSessions(this.data.dryingRoomId).subscribe(data => {
      this.sessions = data;
    });
  }

  openSessionForm(session?: DryingSession): void {
    const dialogRef = this.dialog.open(DryingSessionFormComponent, {
      width: '400px',
      data: { session: session, dryingRoomId: this.data.dryingRoomId }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.loadSessions();
      }
    });
  }

  deleteSession(sessionId: string): void {
    if (confirm('Tem certeza que deseja excluir este uso?')) {
      this.dryingRoomService.deleteDryingSession(this.data.dryingRoomId, sessionId).subscribe(() => {
        this.loadSessions();
      });
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}