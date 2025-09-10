
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { BisqueFiringService } from '../../services/bisque-firing.service';
import { BisqueFiring } from '../../models/bisque-firing.model';
import { ProductTransaction } from '../../../product/models/product-transaction.model';
import { ProductService } from '../../../product/services/product.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { DecimalMaskDirective } from '../../../shared/directives/decimal-mask.directive';
import { ChangeDetectorRef } from '@angular/core';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-bisque-firing-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatOptionModule, MatIconModule, DecimalMaskDirective],
  templateUrl: './bisque-firing-form.component.html',
  styleUrls: ['./bisque-firing-form.component.scss']
})
export class BisqueFiringFormComponent implements OnInit {

  bisqueFiringForm: FormGroup;
  isEditMode = false;
  productTransactions: ProductTransaction[] = [];

  constructor(
    private fb: FormBuilder,
    private bisqueFiringService: BisqueFiringService,
    private productService: ProductService,
    public dialogRef: MatDialogRef<BisqueFiringFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { bisqueFiring?: BisqueFiring, kilnId: string },
    private cdRef: ChangeDetectorRef
  ) {
    this.isEditMode = !!this.data.bisqueFiring;
    this.bisqueFiringForm = this.fb.group({
      temperature: [this.data.bisqueFiring?.temperature || '', [Validators.required, Validators.min(0)]],
      burnTime: [this.data.bisqueFiring?.burnTime || '', [Validators.required, Validators.min(0)]],
      coolingTime: [this.data.bisqueFiring?.coolingTime || '', [Validators.required, Validators.min(0)]],
      biscuits: this.fb.array([], [Validators.required, Validators.minLength(1)])
    });
  }

  ngOnInit(): void {
    this.productService.getProductTransactions('1', 'GREENWARE').subscribe(greenwareProducts => {
      this.productTransactions = greenwareProducts;

      if (this.isEditMode && this.data.bisqueFiring) {
        this.bisqueFiringForm.patchValue({
          temperature: this.data.bisqueFiring.temperature,
          burnTime: this.data.bisqueFiring.burnTime,
          coolingTime: this.data.bisqueFiring.coolingTime
        });

        const existingBiscuitProducts = this.data.bisqueFiring.biscuits.filter(biscuit =>
          !this.productTransactions.some(pt => pt.id === biscuit.id)
        );
        this.productTransactions = [...this.productTransactions, ...existingBiscuitProducts];

        this.data.bisqueFiring.biscuits.forEach(biscuit => {
          this.biscuits.push(new FormControl<string>(biscuit.id, { nonNullable: true }));
        });
      }
    });
  }

  get biscuits(): FormArray<FormControl<string | null>> {
    return this.bisqueFiringForm.get('biscuits') as FormArray<FormControl<string | null>>;
  }

  addBiscuit(): void {
    this.biscuits.push(new FormControl<string>('', { nonNullable: true }));
    this.cdRef.detectChanges();
  }

  removeBiscuit(index: number): void {
    this.biscuits.removeAt(index);
  }

  getAvailableProducts(currentIndex: number): ProductTransaction[] {
    const selectedProductTransactionIds = this.biscuits.controls
      .map((control, index) => index === currentIndex ? null : control.value)
      .filter(id => id !== null);
    return this.productTransactions.filter(transaction => !selectedProductTransactionIds.includes(transaction.id));
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.bisqueFiringForm.invalid) {
      return;
    }

    const formData = { ...this.bisqueFiringForm.value };

    if (typeof formData.temperature === 'string') {
      formData.temperature = parseFloat(formData.temperature.replace(',', '.'));
    }
    if (typeof formData.burnTime === 'string') {
      formData.burnTime = parseFloat(formData.burnTime.replace(',', '.'));
    }
    if (typeof formData.coolingTime === 'string') {
      formData.coolingTime = parseFloat(formData.coolingTime.replace(',', '.'));
    }

    if (this.isEditMode) {
      this.bisqueFiringService.updateBisqueFiring(this.data.kilnId, this.data.bisqueFiring!.id, formData).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => {
          if (err.status === 409) {
            alert(err.error.message);
          } else {
            alert('Ocorreu um erro ao atualizar a queima de biscoito.');
          }
        }
      });
    } else {
      this.bisqueFiringService.createBisqueFiring(this.data.kilnId, formData).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => {
          if (err.status === 404 && err.error.message) {
            alert(err.error.message);
          } else {
            alert('Ocorreu um erro ao criar a queima de biscoito.');
          }
        }
      });
    }
  }
}
