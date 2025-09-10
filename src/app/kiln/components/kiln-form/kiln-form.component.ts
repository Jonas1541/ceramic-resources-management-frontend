import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { KilnService } from '../../services/kiln.service';
import { Kiln } from '../../models/kiln.model';
import { Machine } from '../../../machine/models/machine.model';
import { MachineService } from '../../../machine/services/machine.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { TrimDirective } from '../../../shared/directives/trim.directive';

@Component({
  selector: 'app-kiln-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatOptionModule, MatIconModule, TrimDirective],
  templateUrl: './kiln-form.component.html',
  styleUrls: ['./kiln-form.component.scss']
})
export class KilnFormComponent implements OnInit {

  kilnForm: FormGroup;
  isEditMode = false;
  machines: Machine[] = [];

  constructor(
    private fb: FormBuilder,
    private kilnService: KilnService,
    private machineService: MachineService,
    public dialogRef: MatDialogRef<KilnFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { kiln: Kiln },
    private cdr: ChangeDetectorRef
  ) {
    this.kilnForm = this.fb.group({
      name: ['', Validators.required],
      gasConsumptionPerHour: ['', Validators.required],
      machineIds: this.fb.array([])
    });

    if (data && data.kiln) {
      this.isEditMode = true;
      this.kilnForm.patchValue({
        name: data.kiln.name,
        gasConsumptionPerHour: data.kiln.gasConsumptionPerHour
      });
    }
  }

  ngOnInit(): void {
    this.machineService.getMachines().subscribe((machines) => {
      this.machines = machines;
      if (this.isEditMode && this.data.kiln.machines) {
        this.data.kiln.machines.forEach(machine => {
          this.machineIds.push(new FormControl<string>(machine.id, { nonNullable: true }));
        });
        this.cdr.detectChanges();
      }
    });
  }

  get machineIds(): FormArray<FormControl<string>> {
    return this.kilnForm.get('machineIds') as FormArray<FormControl<string>>;
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
    if (this.kilnForm.invalid) {
      return;
    }

    const formValue = { ...this.kilnForm.value };
    if (typeof formValue.gasConsumptionPerHour === 'string') {
      formValue.gasConsumptionPerHour = parseFloat(formValue.gasConsumptionPerHour.replace(',', '.'));
    }

    const payload = {
      name: formValue.name,
      gasConsumptionPerHour: formValue.gasConsumptionPerHour,
      machines: formValue.machineIds.map((id: string) => Number(id))
    };

    if (this.isEditMode) {
      this.kilnService.updateKiln(this.data.kiln.id, payload).subscribe(() => {
        this.dialogRef.close(true);
      });
    } else {
      this.kilnService.createKiln(payload).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }
}
