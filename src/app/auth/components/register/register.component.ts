import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

// Validador customizado para verificar se as senhas coincidem
export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.parent?.get('password'); // Acessa o campo 'password' através do pai
  const confirmPassword = control; // O próprio control é o 'confirmPassword'

  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { passwordMismatch: true };
  }

  return null;
};

import { TrimDirective } from '../../../shared/directives/trim.directive';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, RouterLink, TrimDirective],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cnpj: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', [Validators.required, passwordMatchValidator]]
    }); // Aplica o validador customizado no nível do FormGroup
  }

  ngOnInit(): void {
    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.registerForm.get('confirmPassword')?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    console.log('onSubmit called');
    if (this.registerForm.invalid) {
      console.log('Form is invalid');
      // Marca todos os campos como touched para exibir erros de validação imediatamente no submit
      this.registerForm.markAllAsTouched();
      return;
    }

    console.log('Form value:', this.registerForm.value);
    // Envia apenas o campo 'password', não 'confirmPassword'
    const { confirmPassword, ...formDataToSend } = this.registerForm.value;
    this.authService.register(formDataToSend).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        if (err.status === 409 && err.error && err.error.message) {
          const backendMessage = err.error.message;
          if (backendMessage.includes('Este email já está cadastrado.')) {
            alert('Este e-mail já está cadastrado. Por favor, use outro.');
          } else if (backendMessage.includes('Já existe um tenant registrado com o nome')) {
            alert('Já existe uma empresa com esse nome. Por favor, escolha outro.');
          } else if (backendMessage.includes('Este CNPJ já está cadastrado.')) {
            alert('Este CNPJ já está cadastrado. Por favor, verifique os dados.');
          } else {
            alert('Ocorreu um erro ao registrar. Por favor, tente novamente.');
          }
        } else {
          alert('Ocorreu um erro inesperado. Por favor, tente novamente.');
        }
      }
    });
  }
}
