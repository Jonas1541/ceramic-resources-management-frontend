import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { KilnService } from '../../services/kiln.service';
import { Kiln } from '../../models/kiln.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DecimalMaskDirective } from '../../../shared/directives/decimal-mask.directive';

import { TrimDirective } from '../../../shared/directives/trim.directive';

@Component({
  selector: 'app-kiln-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, DecimalMaskDirective, TrimDirective],
  templateUrl: './kiln-form.component.html',
  styleUrls: ['./kiln-form.component.scss']
})
export class KilnFormComponent implements OnInit {

  kilnForm: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private kilnService: KilnService,
    public dialogRef: MatDialogRef<KilnFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { kiln: Kiln }
  ) {
    this.kilnForm = this.fb.group({
      name: ['', Validators.required],
      power: ['', [Validators.required, Validators.min(0.01)]]
    });

    if (data && data.kiln) {
      this.isEditMode = true;
      this.kilnForm.patchValue(data.kiln);
    }
  }

  ngOnInit(): void { }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.kilnForm.invalid) {
      return;
    }

    const formData = this.kilnForm.value;

    if (this.isEditMode) {
      this.kilnService.updateKiln(this.data.kiln.id, formData).subscribe(() => {
        this.dialogRef.close(true);
      });
    } else {
      this.kilnService.createKiln(formData).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }
}
