import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MachineService } from '../../services/machine.service';
import { Machine } from '../../models/machine.model';
import { MachineFormComponent } from '../machine-form/machine-form.component';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { DecimalFormatPipe } from '../../../shared/pipes/decimal-format.pipe';

@Component({
  selector: 'app-machine-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatTableModule, MatIconModule, MatDialogModule, DecimalFormatPipe],
  providers: [DecimalPipe],
  templateUrl: './machine-list.component.html',
  styleUrls: ['./machine-list.component.scss']
})
export class MachineListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'power', 'actions'];
  machines: Machine[] = [];

  constructor(private machineService: MachineService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadMachines();
  }

  loadMachines(): void {
    this.machineService.getMachines().subscribe(data => {
      this.machines = data;
    });
  }

  openMachineForm(machine?: Machine): void {
    const dialogRef = this.dialog.open(MachineFormComponent, {
      width: '400px',
      data: { machine: machine }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadMachines();
      }
    });
  }

  deleteMachine(id: string): void {
    if (confirm('Tem certeza que deseja excluir esta máquina?')) {
      this.machineService.deleteMachine(id).subscribe({
        next: () => this.loadMachines(),
        error: (err) => {
          if (err.status === 409) {
            alert(err.error.message);
          } else {
            alert('Ocorreu um erro ao deletar a máquina.');
          }
        }
      });
    }
  }
}
