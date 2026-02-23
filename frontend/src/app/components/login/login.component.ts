import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="login-container">
      <div class="login-card glass">
        <h2>Digital Wallet</h2>
        <p>Ingrese su código de acceso</p>
        <div class="form-group">
          <input 
            type="password" 
            [(ngModel)]="code" 
            placeholder="Código de Acceso"
            (keyup.enter)="onLogin()"
          >
        </div>
        <button (click)="onLogin()" [disabled]="isLoading">
          {{ isLoading ? 'Cargando...' : 'Entrar' }}
        </button>
        <p *ngIf="error" class="error">{{ error }}</p>
      </div>
    </div>
  `,
    styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: radial-gradient(circle at top right, #1a2a6c, #b21f1f, #fdbb2d);
      background-size: 400% 400%;
      animation: gradient 15s ease infinite;
    }
    .login-card {
      padding: 2.5rem;
      border-radius: 20px;
      width: 100%;
      max-width: 400px;
      text-align: center;
      color: white;
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    }
    .glass {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.18);
    }
    input {
      width: 100%;
      padding: 12px;
      margin: 1rem 0;
      border-radius: 8px;
      border: none;
      background: rgba(255, 255, 255, 0.2);
      color: white;
      font-size: 1.1rem;
      outline: none;
    }
    input::placeholder { color: rgba(255, 255, 255, 0.6); }
    button {
      width: 100%;
      padding: 12px;
      border-radius: 8px;
      border: none;
      background: #4facfe;
      background-image: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
      color: white;
      font-weight: bold;
      cursor: pointer;
      transition: transform 0.2s;
    }
    button:hover { transform: scale(1.02); }
    button:disabled { opacity: 0.7; }
    .error { color: #ff6b6b; margin-top: 1rem; }
    @keyframes gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `]
})
export class LoginComponent {
    code = '';
    isLoading = false;
    error = '';
    private authService = inject(AuthService);
    private router = inject(Router);

    onLogin() {
        if (!this.code) return;
        this.isLoading = true;
        this.error = '';
        this.authService.login(this.code).subscribe({
            next: () => this.router.navigate(['/registros']),
            error: () => {
                this.error = 'Código incorrecto';
                this.isLoading = false;
            }
        });
    }
}
