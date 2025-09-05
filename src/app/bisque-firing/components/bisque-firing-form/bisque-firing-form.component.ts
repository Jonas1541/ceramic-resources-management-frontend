import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { BisqueFiringService } from '../../services/bisque-firing.service';
import { BisqueFiring } from '../../models/bisque-firing.model';
import { Kiln } from '../../../kiln/models/kiln.model';
import { Machine } from '../../../machine/models/machine.model';
import { ProductTransaction } from '../../../product/models/product-transaction.model';
import { KilnService } from '../../../kiln/services/kiln.service';
import { MachineService } from '../../../machine/services/machine.service';
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
  kilns: Kiln[] = [];
  machines: Machine[] = [];
  productTransactions: ProductTransaction[] = [];

  constructor(
    private fb: FormBuilder,
    private bisqueFiringService: BisqueFiringService,
    private machineService: MachineService,
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
      gasConsumption: [this.data.bisqueFiring?.gasConsumption || '', [Validators.required, Validators.min(0)]],
      biscuits: this.fb.array([], [Validators.required, Validators.minLength(1)]),
      machineUsages: this.fb.array([], [Validators.required, Validators.minLength(1)])
    });
  }

  ngOnInit(): void {
    forkJoin({
      machines: this.machineService.getMachines(),
      greenwareProducts: this.productService.getProductTransactions('1', 'GREENWARE')
    }).subscribe(({ machines, greenwareProducts }) => {
      this.machines = machines;
      this.productTransactions = greenwareProducts;

      if (this.isEditMode && this.data.bisqueFiring) {
        // Adiciona os produtos BISCUIT que já estão na queima, se não estiverem na lista de greenware
        const existingBiscuitProducts = this.data.bisqueFiring.biscuits.filter(biscuit =>
          !this.productTransactions.some(pt => pt.id === biscuit.id)
        );
        this.productTransactions = [...this.productTransactions, ...existingBiscuitProducts];

        // Preencher os FormArrays com os dados existentes
        this.data.bisqueFiring.biscuits.forEach(biscuit => {
          this.biscuits.push(new FormControl<string>(biscuit.id, { nonNullable: true }));
        });
        this.data.bisqueFiring.machineUsages.forEach(usage => {
            this.machineUsages.push(this.fb.group({
                machineId: [usage.machineId, Validators.required],
                usageTime: [usage.usageTime, Validators.required]
            }));
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

  get machineUsages(): FormArray {
    return this.bisqueFiringForm.get('machineUsages') as FormArray;
  }

  addMachineUsage(): void {
    setTimeout(() => {
      const machineUsageForm = this.fb.group({
        machineId: ['', Validators.required],
        usageTime: ['', Validators.required]
      });
      this.machineUsages.push(machineUsageForm);
    });
  }

  removeMachineUsage(index: number): void {
    this.machineUsages.removeAt(index);
  }

  getAvailableMachines(currentIndex: number): Machine[] {
    const selectedMachineIds = this.machineUsages.controls
      .map((control, index) => index === currentIndex ? null : control.get('machineId')?.value)
      .filter(id => id !== null);
    return this.machines.filter(machine => !selectedMachineIds.includes(machine.id));
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

    // Converte campos numéricos
    if (typeof formData.temperature === 'string') {
      formData.temperature = parseFloat(formData.temperature.replace(',', '.'));
    }
    if (typeof formData.burnTime === 'string') {
      formData.burnTime = parseFloat(formData.burnTime.replace(',', '.'));
    }
    if (typeof formData.coolingTime === 'string') {
      formData.coolingTime = parseFloat(formData.coolingTime.replace(',', '.'));
    }
    if (typeof formData.gasConsumption === 'string') {
      formData.gasConsumption = parseFloat(formData.gasConsumption.replace(',', '.'));
    }

    // Converte usageTime dentro de machineUsages
    formData.machineUsages = formData.machineUsages.map((usage: any) => ({
      ...usage,
      usageTime: typeof usage.usageTime === 'string' ? parseFloat(usage.usageTime.replace(',', '.')) : usage.usageTime
    }));

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