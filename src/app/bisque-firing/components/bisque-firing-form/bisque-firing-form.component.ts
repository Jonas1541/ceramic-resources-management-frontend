
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
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
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DecimalMaskDirective } from '../../../shared/directives/decimal-mask.directive';

@Component({
  selector: 'app-bisque-firing-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatExpansionModule, MatCheckboxModule, DecimalMaskDirective],
  templateUrl: './bisque-firing-form.component.html',
  styleUrls: ['./bisque-firing-form.component.scss']
})
export class BisqueFiringFormComponent implements OnInit {

  bisqueFiringForm: FormGroup;
  isEditMode = false;
  groupedProducts = new Map<string, ProductTransaction[]>();
  productTransactions: ProductTransaction[] = [];

  constructor(
    private fb: FormBuilder,
    private bisqueFiringService: BisqueFiringService,
    private productService: ProductService,
    public dialogRef: MatDialogRef<BisqueFiringFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { bisqueFiring?: BisqueFiring, kilnId: string }
  ) {
    this.isEditMode = !!this.data.bisqueFiring;
    this.bisqueFiringForm = this.fb.group({
      temperature: [this.data.bisqueFiring?.temperature || '', [Validators.required, Validators.min(0)]],
      burnTime: [this.data.bisqueFiring?.burnTime || '', [Validators.required, Validators.min(0)]],
      coolingTime: [this.data.bisqueFiring?.coolingTime || '', [Validators.required, Validators.min(0)]],
      biscuits: [[] as string[], [Validators.required, Validators.minLength(1)]]
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
        
        this.groupProducts(this.productTransactions);
        this.biscuitControl.setValue(this.data.bisqueFiring.biscuits.map(b => b.id));
      }
      else {
        this.groupProducts(this.productTransactions);
      }
    });
  }

  private groupProducts(transactions: ProductTransaction[]): void {
    this.groupedProducts.clear();
    transactions.forEach(transaction => {
      const key = transaction.productName;
      if (!this.groupedProducts.has(key)) {
        this.groupedProducts.set(key, []);
      }
      this.groupedProducts.get(key)!.push(transaction);
    });
  }

  get biscuitControl(): FormControl {
    return this.bisqueFiringForm.get('biscuits') as FormControl;
  }

  isAllSelected(productGroup: ProductTransaction[]): boolean {
    const selectedIds = this.biscuitControl.value as string[];
    return productGroup.every(p => selectedIds.includes(p.id));
  }

  isSomeSelected(productGroup: ProductTransaction[]): boolean {
    const selectedIds = this.biscuitControl.value as string[];
    const groupIds = productGroup.map(p => p.id);
    const intersection = groupIds.filter(id => selectedIds.includes(id));
    return intersection.length > 0 && intersection.length < groupIds.length;
  }

  toggleAllForGroup(productGroup: ProductTransaction[], event: any): void {
    const selectedIds = new Set<string>(this.biscuitControl.value);
    const groupIds = productGroup.map(p => p.id);
    if (event.checked) {
      groupIds.forEach(id => selectedIds.add(id));
    } else {
      groupIds.forEach(id => selectedIds.delete(id));
    }
    this.biscuitControl.setValue(Array.from(selectedIds));
  }

  toggleSelection(transactionId: string, event: any): void {
    const selectedIds = new Set<string>(this.biscuitControl.value);
    if (event.checked) {
      selectedIds.add(transactionId);
    } else {
      selectedIds.delete(transactionId);
    }
    this.biscuitControl.setValue(Array.from(selectedIds));
  }

  asIsOrder(a: any, b: any): number { return 1; }

  onCancel(): void { this.dialogRef.close(); }

  onSubmit(): void {
    if (this.bisqueFiringForm.invalid) return;

    const formData = { ...this.bisqueFiringForm.value };
    if (typeof formData.temperature === 'string') formData.temperature = parseFloat(formData.temperature.replace(',', '.'));
    if (typeof formData.burnTime === 'string') formData.burnTime = parseFloat(formData.burnTime.replace(',', '.'));
    if (typeof formData.coolingTime === 'string') formData.coolingTime = parseFloat(formData.coolingTime.replace(',', '.'));

    const operation = this.isEditMode
      ? this.bisqueFiringService.updateBisqueFiring(this.data.kilnId, this.data.bisqueFiring!.id, formData)
      : this.bisqueFiringService.createBisqueFiring(this.data.kilnId, formData);

    operation.subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => {
        const message = err.error?.message || (this.isEditMode ? 'Ocorreu um erro ao atualizar a queima.' : 'Ocorreu um erro ao criar a queima.');
        alert(message);
      }
    });
  }
}
