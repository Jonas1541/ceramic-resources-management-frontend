import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ProductLineService } from '../../services/product-line.service';
import { ProductLine } from '../../models/product-line.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { TrimDirective } from '../../../shared/directives/trim.directive';

@Component({
  selector: 'app-product-line-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, TrimDirective],
  templateUrl: './product-line-form.component.html',
  styleUrls: ['./product-line-form.component.scss']
})
export class ProductLineFormComponent implements OnInit {

  productLineForm: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private productLineService: ProductLineService,
    public dialogRef: MatDialogRef<ProductLineFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { productLine: ProductLine }
  ) {
    this.productLineForm = this.fb.group({
      name: ['', Validators.required]
    });

    if (data && data.productLine) {
      this.isEditMode = true;
      this.productLineForm.patchValue(data.productLine);
    }
  }

  ngOnInit(): void { }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.productLineForm.invalid) {
      return;
    }

    const formData = this.productLineForm.value;

    if (this.isEditMode) {
      this.productLineService.updateProductLine(this.data.productLine.id, formData).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => {
          if (err.status === 409 && err.error?.message) {
            alert(err.error.message); // Repassa a mensagem do backend
          } else {
            alert('Ocorreu um erro ao atualizar a linha de produto.'); // Mensagem genérica
          }
        }
      });
    } else {
      this.productLineService.createProductLine(formData).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => {
          if (err.status === 409 && err.error?.message) {
            alert(err.error.message); // Repassa a mensagem do backend
          } else {
            alert('Ocorreu um erro ao criar a linha de produto.'); // Mensagem genérica
          }
        }
      });
    }
  }
}