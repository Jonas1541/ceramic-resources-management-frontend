import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
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
        @Inject(MAT_DIALOG_DATA) public data: { glazeFiring?: GlazeFiring, kilnId: string },
        private cdr: ChangeDetectorRef
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
    }

    ngOnInit(): void {
        // 1. Busca os dados iniciais (máquinas, glasuras e produtos 'BISCUIT' que podem ser adicionados)
        forkJoin({
            machines: this.machineService.getMachines(),
            biscuitProducts: this.productService.getProductTransactions('1', 'BISCUIT'),
            glazes: this.glazeService.getGlazes()
        }).subscribe(({ machines, biscuitProducts, glazes }) => {
            this.machines = machines;
            this.glazes = glazes;
            // Define a lista inicial de produtos selecionáveis
            this.productTransactions = biscuitProducts;

            // 2. Se estiver no modo de edição, busca os dados completos dos produtos já existentes na queima
            if (this.isEditMode && this.data.glazeFiring) {

                // Popula os campos simples do formulário
                this.glazeFiringForm.patchValue({
                    temperature: this.data.glazeFiring.temperature,
                    burnTime: this.data.glazeFiring.burnTime,
                    coolingTime: this.data.glazeFiring.coolingTime,
                    gasConsumption: this.data.glazeFiring.gasConsumption,
                });

                // Prepara as chamadas para buscar cada produto 'GLAZED' pelo seu ID
                const existingGlazedProductObservables = this.data.glazeFiring.glosts.map(glost =>
                    this.productService.getProductTransactionById(glost.productId, glost.productTxId)
                );

                // Se houver produtos para buscar, executa todas as chamadas em paralelo
                if (existingGlazedProductObservables.length > 0) {
                    forkJoin(existingGlazedProductObservables).subscribe(existingGlazedProducts => {

                        // 3. Combina a lista de produtos 'BISCUIT' com os 'GLAZED' que acabamos de buscar
                        this.productTransactions = [...this.productTransactions, ...existingGlazedProducts];

                        // 4. Agora, com a lista de produtos completa, popula os FormArrays
                        this.populateFormArrays();
                    });
                } else {
                    // Se não houver produtos na queima, apenas popula os outros FormArrays
                    this.populateFormArrays();
                }

            }
        });
    }

    // MÉTODO AUXILIAR PARA MANTER O CÓDIGO LIMPO
    private populateFormArrays(): void {
        if (!this.data.glazeFiring) return;

        // Popula o FormArray de 'glosts'
        this.data.glazeFiring.glosts.forEach(glost => {

            const glaze = this.glazes.find(g => g.color === glost.glazeColor);
            this.glosts.push(this.fb.group({
                productTransactionId: [glost.productTxId, Validators.required],
                glazeId: [glaze ? glaze.id : '', Validators.required],
                quantity: [glost.quantity, [Validators.required, Validators.min(0.01)]]
            }));
        });

        // Popula o FormArray de 'machineUsages'
        this.data.glazeFiring.machineUsages.forEach(usage => {
            this.machineUsages.push(this.fb.group({
                machineId: [usage.machineId, Validators.required],
                usageTime: [usage.usageTime, Validators.required]
            }));
        });
        this.cdr.detectChanges(); // Forçar detecção de alterações
    }

    get glosts(): FormArray {
        return this.glazeFiringForm.get('glosts') as FormArray;
    }

    addGlost(): void {
        const glostForm = this.fb.group({
            productTransactionId: ['', Validators.required],
            glazeId: ['', Validators.required],
            quantity: ['', [Validators.required]]
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

    getAvailableMachines(currentIndex: number): Machine[] {
    const selectedIds = this.machineUsages.controls
        .map((c, i) => i === currentIndex ? null : c.get('machineId')?.value)
        .filter(Boolean);

    return this.machines.filter(m => !selectedIds.includes(m.id));
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    onSubmit(): void {
        if (this.glazeFiringForm.invalid) {
            return;
        }

        const formData = { ...this.glazeFiringForm.value };

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

        // Converte quantity dentro de glosts
        formData.glosts = formData.glosts.map((glost: any) => ({
            ...glost,
            quantity: typeof glost.quantity === 'string' ? parseFloat(glost.quantity.replace(',', '.')) : glost.quantity
        }));

        // Converte usageTime dentro de machineUsages
        formData.machineUsages = formData.machineUsages.map((usage: any) => ({
            ...usage,
            usageTime: typeof usage.usageTime === 'string' ? parseFloat(usage.usageTime.replace(',', '.')) : usage.usageTime
        }));

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