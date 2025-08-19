import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { DryingRoomService } from '../../services/drying-room.service';
import { DryingRoom } from '../../models/drying-room.model';
import { Machine } from '../../../machine/models/machine.model';
import { MachineService } from '../../../machine/services/machine.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { DecimalMaskDirective } from '../../../shared/directives/decimal-mask.directive';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-drying-room-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatOptionModule, MatIconModule, DecimalMaskDirective],
  templateUrl: './drying-room-form.component.html',
  styleUrls: ['./drying-room-form.component.scss']
})
export class DryingRoomFormComponent implements OnInit {

  dryingRoomForm: FormGroup;
  isEditMode = false;
  machines: Machine[] = [];

  constructor(
    private fb: FormBuilder,
    private dryingRoomService: DryingRoomService,
    private machineService: MachineService,
    public dialogRef: MatDialogRef<DryingRoomFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { dryingRoom: DryingRoom },
    private cdr: ChangeDetectorRef
  ) {
    this.dryingRoomForm = this.fb.group({
      name: ['', Validators.required],
      gasConsumptionPerHour: ['', [Validators.required, Validators.min(0)]],
      machineIds: this.fb.array([])
    });

    if (data && data.dryingRoom) {
      this.isEditMode = true;
      this.dryingRoomForm.patchValue(data.dryingRoom);
    }
  }

  ngOnInit(): void {
    this.machineService.getMachines().subscribe((machines) => {
      this.machines = machines;
      if (this.isEditMode && this.data.dryingRoom.machines) {
        this.data.dryingRoom.machines.forEach(machine => {
          this.machineIds.push(new FormControl<string>(machine.id, { nonNullable: true }));
        });
        this.cdr.detectChanges(); // Forçar detecção de alterações
      }
    });
  }

  get machineIds(): FormArray<FormControl<string>> {
    return this.dryingRoomForm.get('machineIds') as FormArray<FormControl<string>>;
  }

  addMachineId(): void {
    this.machineIds.push(new FormControl<string>('', { nonNullable: true }));
    this.cdr.detectChanges();
  }

  removeMachineId(index: number): void {
    this.machineIds.removeAt(index);
  }

  getAvailableMachines(currentIndex: number): Machine[] {
    const selectedMachineIds = this.machineIds.controls
      .map((control, index) => index === currentIndex ? null : control.value)
      .filter(id => id !== null);
    return this.machines.filter(machine => !selectedMachineIds.includes(machine.id));
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.dryingRoomForm.invalid) {
      return;
    }

    const formData = this.dryingRoomForm.value;

    if (this.isEditMode) {
      this.dryingRoomService.updateDryingRoom(this.data.dryingRoom.id, formData).subscribe(() => {
        this.dialogRef.close(true);
      });
    } else {
      this.dryingRoomService.createDryingRoom(formData).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }
}