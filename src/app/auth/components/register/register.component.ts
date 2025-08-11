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

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, RouterLink],
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
    this.authService.register(formDataToSend).subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
