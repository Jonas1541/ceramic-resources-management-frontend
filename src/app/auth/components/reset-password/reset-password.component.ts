import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  message: string = '';
  token: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });

    this.route.params.subscribe(params => {
      this.token = params['token'];
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    return password && confirmPassword && password.value === confirmPassword.value ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid) {
      const { password } = this.resetPasswordForm.value;
      this.authService.resetPassword({ token: this.token, password })
        .subscribe(
          () => {
            this.message = 'Sua senha foi redefinida com sucesso.';
            setTimeout(() => this.router.navigate(['/login']), 3000);
          },
          () => {
            this.message = 'Ocorreu um erro ao tentar redefinir sua senha. Por favor, tente novamente mais tarde.';
          }
        );
    }
  }
}
