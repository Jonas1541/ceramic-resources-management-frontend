import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { BatchService } from '../../services/batch.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-batch-transaction-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatOptionModule],
  templateUrl: './batch-transaction-form.component.html',
  styleUrls: ['./batch-transaction-form.component.scss']
})
export class BatchTransactionFormComponent implements OnInit {

  transactionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private batchService: BatchService,
    public dialogRef: MatDialogRef<BatchTransactionFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { batchId: string }
  ) {
    this.transactionForm = this.fb.group({
      quantity: ['', [Validators.required, Validators.min(0.01)]]
    });
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
  }
}
