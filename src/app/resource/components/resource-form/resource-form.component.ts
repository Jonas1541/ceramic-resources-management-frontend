import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ResourceService } from '../../services/resource.service';
import { Resource } from '../../models/resource.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { DecimalMaskDirective } from '../../../shared/directives/decimal-mask.directive';

import { TrimDirective } from '../../../shared/directives/trim.directive';

@Component({
  selector: 'app-resource-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatOptionModule, DecimalMaskDirective, TrimDirective],
  templateUrl: './resource-form.component.html',
  styleUrls: ['./resource-form.component.scss']
})
export class ResourceFormComponent implements OnInit {

  resourceForm: FormGroup;
  isEditMode = false;
  categories = [
    { value: 'ELECTRICITY', viewValue: 'Eletricidade' },
    { value: 'WATER', viewValue: 'Água' },
    { value: 'GAS', viewValue: 'Gás' },
    { value: 'RAW_MATERIAL', viewValue: 'Matéria-prima' },
    { value: 'SILICATE', viewValue: 'Silicato' },
    { value: 'COMPONENT', viewValue: 'Componente' },
    { value: 'RETAIL', viewValue: 'Retalho' }
  ];

  constructor(
    private fb: FormBuilder,
    private resourceService: ResourceService,
    public dialogRef: MatDialogRef<ResourceFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { resource: Resource }
  ) {
    this.resourceForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      unitValue: ['', [Validators.required]]
    });

    if (data && data.resource) {
      this.isEditMode = true;
      this.resourceForm.patchValue(data.resource);
    }
  }

  ngOnInit(): void { }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.resourceForm.invalid) {
      return;
    }

    const formData = { ...this.resourceForm.value };
    if (typeof formData.unitValue === 'string') {
      formData.unitValue = parseFloat(formData.unitValue.replace(',', '.'));
    }

    const operation = this.isEditMode
      ? this.resourceService.updateResource(this.data.resource.id, formData)
      : this.resourceService.createResource(formData);

    operation.subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => {
        if (err.status === 409 && err.error?.message) {
          alert(err.error.message); // Exibe a mensagem específica do backend
        } else {
          alert('Ocorreu um erro ao salvar o recurso.'); // Mensagem genérica
        }
      }
    });
  }
}
