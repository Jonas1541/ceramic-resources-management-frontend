import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { GlazeService } from '../../services/glaze.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

import { GlazeTransaction } from '../../models/glaze-transaction.model';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-glaze-transaction-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatOptionModule],
  templateUrl: './glaze-transaction-form.component.html',
  styleUrls: ['./glaze-transaction-form.component.scss']
})
export class GlazeTransactionFormComponent implements OnInit {

  transactionForm: FormGroup;
  isEditMode = false;
  transactionTypes = ['INCOMING', 'OUTGOING']; // TODO: Obter da API se possível

  constructor(
    private fb: FormBuilder,
    private glazeService: GlazeService,
    public dialogRef: MatDialogRef<GlazeTransactionFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { transaction: GlazeTransaction, glazeId: string }
  ) {
    this.transactionForm = this.fb.group({
      type: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(0.01)]]
    });

    if (data && data.transaction) {
      this.isEditMode = true;
      this.transactionForm.patchValue(data.transaction);
    }
  }

  ngOnInit(): void { }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.transactionForm.invalid) {
      return;
    }

    const formData = this.transactionForm.value;

    if (this.isEditMode) {
      this.glazeService.updateGlazeTransaction(this.data.glazeId, this.data.transaction.id, formData).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: any) => alert(err.error?.message || 'Ocorreu um erro ao atualizar a transação.')
      });
    } else {
      this.glazeService.createGlazeTransaction(this.data.glazeId, formData).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => alert(err.error?.message || 'Ocorreu um erro ao criar a transação.')
      });
    }
  }
}