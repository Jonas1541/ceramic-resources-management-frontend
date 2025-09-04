import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ResourceService } from '../../services/resource.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';

import { ResourceTransaction } from '../../models/resource-transaction.model';
import { DecimalMaskDirective } from '../../../shared/directives/decimal-mask.directive';

@Component({
  selector: 'app-resource-transaction-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatOptionModule, DecimalMaskDirective],
  templateUrl: './resource-transaction-form.component.html',
  styleUrls: ['./resource-transaction-form.component.scss']
})
export class ResourceTransactionFormComponent implements OnInit {

  transactionForm: FormGroup;
  isEditMode = false;
  transactionTypes = ['INCOMING', 'OUTGOING']; // TODO: Obter da API se possível

  constructor(
    private fb: FormBuilder,
    private resourceService: ResourceService,
    public dialogRef: MatDialogRef<ResourceTransactionFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { transaction: ResourceTransaction, resourceId: string }
  ) {
    this.transactionForm = this.fb.group({
      type: ['', Validators.required],
      quantity: ['', [Validators.required]]
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

    const formValue = this.transactionForm.value;
    const payload = {
      ...formValue,
      quantity: parseFloat(String(formValue.quantity).replace(',', '.'))
    };

    if (this.isEditMode) {
      this.resourceService.updateResourceTransaction(this.data.resourceId, String(this.data.transaction.id), payload).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => alert(err.error?.message || 'Ocorreu um erro ao atualizar a transação.')
      });
    } else {
      this.resourceService.createResourceTransaction(this.data.resourceId, payload).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => alert(err.error?.message || 'Ocorreu um erro ao criar a transação.')
      });
    }
  }
}
