import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { DryingRoomService } from '../../services/drying-room.service';
import { DryingSession } from '../../models/drying-session.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { DecimalMaskDirective } from '../../../shared/directives/decimal-mask.directive';

@Component({
  selector: 'app-drying-session-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, DecimalMaskDirective],
  templateUrl: './drying-session-form.component.html',
  styleUrls: ['./drying-session-form.component.scss']
})
export class DryingSessionFormComponent implements OnInit {

  sessionForm: FormGroup;
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    private dryingRoomService: DryingRoomService,
    public dialogRef: MatDialogRef<DryingSessionFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { session?: DryingSession, dryingRoomId: string }
  ) {
    this.isEditMode = !!this.data.session;
    this.sessionForm = this.fb.group({
      hours: [this.data.session?.hours || '', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void { }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.sessionForm.invalid) {
      return;
    }

    const formValue = this.sessionForm.value;

    if (this.isEditMode) {
      this.dryingRoomService.updateDryingSession(this.data.dryingRoomId, this.data.session!.id, formValue).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => {
          if (err.status === 404) {
            alert(err.error.message);
          } else {
            alert('Ocorreu um erro ao atualizar o uso da estufa.');
          }
        }
      });
    } else {
      this.dryingRoomService.createDryingSession(this.data.dryingRoomId, formValue).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => {
          if (err.status === 404) {
            alert(err.error.message);
          } else {
            alert('Ocorreu um erro ao criar o uso da estufa.');
          }
        }
      });
    }
  }
}