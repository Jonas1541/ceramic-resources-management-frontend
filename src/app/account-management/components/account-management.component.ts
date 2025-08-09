import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-account-management',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.component.scss']
})
export class AccountManagementComponent implements OnInit {

  deletionStatus: any = null;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loadDeletionStatus();
  }

  loadDeletionStatus(): void {
    this.authService.getOwnDeletionStatus().subscribe(data => {
      console.log('Deletion status:', data);
      this.deletionStatus = data;
    });
  }

  scheduleDeletion(): void {
    if (confirm('Tem certeza que deseja agendar a exclusão da sua conta?')) {
      this.authService.scheduleOwnAccountDeletion().subscribe({
        next: () => this.loadDeletionStatus(),
        error: (err) => {
          alert(err.error.message);
          this.loadDeletionStatus();
        }
      });
    }
  }

  cancelDeletion(): void {
    this.authService.cancelOwnAccountDeletion().subscribe(() => {
      this.loadDeletionStatus();
    });
  }
}
