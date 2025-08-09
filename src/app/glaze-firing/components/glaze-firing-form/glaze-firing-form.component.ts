import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { GlazeFiringService } from '../../services/glaze-firing.service';
import { GlazeFiring } from '../../models/glaze-firing.model';
import { Machine } from '../../../machine/models/machine.model';
import { MachineService } from '../../../machine/services/machine.service';
import { ProductTransaction } from '../../../product/models/product-transaction.model';
import { ProductService } from '../../../product/services/product.service';
import { Glaze } from '../../../glaze/models/glaze.model';
import { GlazeService } from '../../../glaze/services/glaze.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { DecimalMaskDirective } from '../../../shared/directives/decimal-mask.directive';

@Component({
  selector: 'app-glaze-firing-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatOptionModule, MatIconModule, DecimalMaskDirective],
  templateUrl: './glaze-firing-form.component.html',
  styleUrls: ['./glaze-firing-form.component.scss']
})
export class GlazeFiringFormComponent implements OnInit {

  glazeFiringForm: FormGroup;
  isEditMode = false;
  machines: Machine[] = [];
  productTransactions: ProductTransaction[] = [];
  glazes: Glaze[] = [];

  constructor(
    private fb: FormBuilder,
    private glazeFiringService: GlazeFiringService,
    private machineService: MachineService,
    private productService: ProductService,
    private glazeService: GlazeService,
    public dialogRef: MatDialogRef<GlazeFiringFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { glazeFiring?: GlazeFiring, kilnId: string }
  ) {
    this.isEditMode = !!this.data.glazeFiring;
    this.glazeFiringForm = this.fb.group({
      temperature: [this.data.glazeFiring?.temperature || '', [Validators.required, Validators.min(0)]],
      burnTime: [this.data.glazeFiring?.burnTime || '', [Validators.required, Validators.min(0)]],
      coolingTime: [this.data.glazeFiring?.coolingTime || '', [Validators.required, Validators.min(0)]],
      gasConsumption: [this.data.glazeFiring?.gasConsumption || '', [Validators.required, Validators.min(0)]],
      glosts: this.fb.array([], [Validators.required, Validators.minLength(1)]),
      machineUsages: this.fb.array([], [Validators.required, Validators.minLength(1)])
    });

    if (this.isEditMode) {
      // TODO: Preencher os FormArrays com os dados existentes
    }
  }

  ngOnInit(): void {
    this.loadMachines();
    this.loadProductTransactions();
    this.loadGlazes();
  }

  loadMachines(): void {
    this.machineService.getMachines().subscribe(data => {
      this.machines = data;
    });
  }

  loadProductTransactions(): void {
    this.productService.getProductTransactions('1', 'BISCUIT').subscribe(data => {
      this.productTransactions = data;
    });
  }

  loadGlazes(): void {
    this.glazeService.getGlazes().subscribe(data => {
      this.glazes = data;
    });
  }

  get glosts(): FormArray {
    return this.glazeFiringForm.get('glosts') as FormArray;
  }

  addGlost(): void {
    const glostForm = this.fb.group({
      productTransactionId: ['', Validators.required],
      glazeId: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(0.01)]]
    });
    this.glosts.push(glostForm);
  }

  removeGlost(index: number): void {
    this.glosts.removeAt(index);
  }

  get machineUsages(): FormArray {
    return this.glazeFiringForm.get('machineUsages') as FormArray;
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
    if (this.glazeFiringForm.invalid) {
      return;
    }

    const formData = this.glazeFiringForm.value;

    if (this.isEditMode) {
      this.glazeFiringService.updateGlazeFiring(this.data.kilnId, this.data.glazeFiring!.id, formData).subscribe(() => {
        this.dialogRef.close(true);
      });
    } else {
      this.glazeFiringService.createGlazeFiring(this.data.kilnId, formData).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }
}