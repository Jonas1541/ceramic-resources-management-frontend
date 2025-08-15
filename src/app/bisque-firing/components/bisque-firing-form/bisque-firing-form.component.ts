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
    @Inject(MAT_DIALOG_DATA) public data: { bisqueFiring?: BisqueFiring, kilnId: string }
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
  }

  removeBiscuit(index: number): void {
    this.biscuits.removeAt(index);
  }

  get machineUsages(): FormArray {
    return this.bisqueFiringForm.get('machineUsages') as FormArray;
  }

  addMachineUsage(): void {
    const machineUsageForm = this.fb.group({
      machineId: ['', Validators.required],
      usageTime: ['', Validators.required]
    });
    this.machineUsages.push(machineUsageForm);
  }

  removeMachineUsage(index: number): void {
    this.machineUsages.removeAt(index);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.bisqueFiringForm.invalid) {
      return;
    }

    const formData = this.bisqueFiringForm.value;

    if (this.isEditMode) {
      this.bisqueFiringService.updateBisqueFiring(this.data.kilnId, this.data.bisqueFiring!.id, formData).subscribe(() => {
        this.dialogRef.close(true);
      });
    } else {
      this.bisqueFiringService.createBisqueFiring(this.data.kilnId, formData).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }
}