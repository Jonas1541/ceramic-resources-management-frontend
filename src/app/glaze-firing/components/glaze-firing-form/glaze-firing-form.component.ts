
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { GlazeFiringService } from '../../services/glaze-firing.service';
import { GlazeFiring } from '../../models/glaze-firing.model';
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
import { forkJoin } from 'rxjs';

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
    productTransactions: ProductTransaction[] = [];
    glazes: Glaze[] = [];

    constructor(
        private fb: FormBuilder,
        private glazeFiringService: GlazeFiringService,
        private productService: ProductService,
        private glazeService: GlazeService,
        public dialogRef: MatDialogRef<GlazeFiringFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { glazeFiring?: GlazeFiring, kilnId: string },
        private cdr: ChangeDetectorRef
    ) {
        this.isEditMode = !!this.data.glazeFiring;
        this.glazeFiringForm = this.fb.group({
            temperature: [this.data.glazeFiring?.temperature || '', [Validators.required, Validators.min(0)]],
            burnTime: [this.data.glazeFiring?.burnTime || '', [Validators.required, Validators.min(0)]],
            coolingTime: [this.data.glazeFiring?.coolingTime || '', [Validators.required, Validators.min(0)]],
            glosts: this.fb.array([], [Validators.required, Validators.minLength(1)])
        });
    }

    ngOnInit(): void {
        forkJoin({
            biscuitProducts: this.productService.getProductTransactions('1', 'BISCUIT'),
            glazes: this.glazeService.getGlazes()
        }).subscribe(({ biscuitProducts, glazes }) => {
            this.glazes = glazes;
            this.productTransactions = biscuitProducts;

            if (this.isEditMode && this.data.glazeFiring) {
                this.glazeFiringForm.patchValue({
                    temperature: this.data.glazeFiring.temperature,
                    burnTime: this.data.glazeFiring.burnTime,
                    coolingTime: this.data.glazeFiring.coolingTime
                });

                const existingGlazedProductObservables = this.data.glazeFiring.glosts.map(glost =>
                    this.productService.getProductTransactionById(glost.productId, glost.productTxId)
                );

                if (existingGlazedProductObservables.length > 0) {
                    forkJoin(existingGlazedProductObservables).subscribe(existingGlazedProducts => {
                        this.productTransactions = [...this.productTransactions, ...existingGlazedProducts];
                        this.populateFormArrays();
                    });
                } else {
                    this.populateFormArrays();
                }
            }
        });
    }

    private populateFormArrays(): void {
        if (!this.data.glazeFiring) return;

        this.data.glazeFiring.glosts.forEach(glost => {
            const glaze = this.glazes.find(g => g.color === glost.glazeColor);
            this.glosts.push(this.fb.group({
                productTransactionId: [glost.productTxId, Validators.required],
                glazeId: [glaze ? glaze.id : '', Validators.required]
            }));
        });
        this.cdr.detectChanges();
    }

    get glosts(): FormArray {
        return this.glazeFiringForm.get('glosts') as FormArray;
    }

    addGlost(): void {
        const glostForm = this.fb.group({
            productTransactionId: ['', Validators.required],
            glazeId: ['', Validators.required]
        });
        this.glosts.push(glostForm);
    }

    removeGlost(index: number): void {
        this.glosts.removeAt(index);
    }

    getAvailableProducts(currentIndex: number): ProductTransaction[] {
        const selectedIds = this.glosts.controls
            .map((c, i) => i === currentIndex ? null : c.get('productTransactionId')?.value)
            .filter(Boolean);
        return this.productTransactions.filter(t => !selectedIds.includes(t.id));
    }

    getAvailableGlazes(currentIndex: number): Glaze[] {
        const selectedIds = this.glosts.controls
            .map((c, i) => i === currentIndex ? null : c.get('glazeId')?.value)
            .filter(Boolean);
        return this.glazes.filter(g => !selectedIds.includes(g.id));
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    onSubmit(): void {
        if (this.glazeFiringForm.invalid) {
            return;
        }

        const formData = { ...this.glazeFiringForm.value };

        if (typeof formData.temperature === 'string') {
            formData.temperature = parseFloat(formData.temperature.replace(',', '.'));
        }
        if (typeof formData.burnTime === 'string') {
            formData.burnTime = parseFloat(formData.burnTime.replace(',', '.'));
        }
        if (typeof formData.coolingTime === 'string') {
            formData.coolingTime = parseFloat(formData.coolingTime.replace(',', '.'));
        }

        formData.glosts = formData.glosts.map((glost: any) => ({
            ...glost,
            quantity: typeof glost.quantity === 'string' ? parseFloat(glost.quantity.replace(',', '.')) : glost.quantity
        }));

        if (this.isEditMode) {
            this.glazeFiringService.updateGlazeFiring(this.data.kilnId, this.data.glazeFiring!.id, formData).subscribe({
                next: () => this.dialogRef.close(true),
                error: (err) => {
                    alert(err.error?.message || 'Ocorreu um erro ao atualizar a queima de esmalte.');
                }
            });
        } else {
            this.glazeFiringService.createGlazeFiring(this.data.kilnId, formData).subscribe({
                next: () => this.dialogRef.close(true),
                error: (err) => {
                    alert(err.error?.message || 'Ocorreu um erro ao criar a queima de esmalte.');
                }
            });
        }
    }
}
