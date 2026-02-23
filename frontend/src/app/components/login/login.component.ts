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
    <div class="login-bg">
      <!-- Animated mesh blobs -->
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>

      <div class="login-wrapper">
        <!-- Logo / Brand -->
        <div class="brand" style="animation-delay: 0s">
          <div class="logo-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="url(#lg1)"/>
              <path d="M7 14h14M14 7v14" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
              <defs>
                <linearGradient id="lg1" x1="0" y1="0" x2="28" y2="28">
                  <stop stop-color="#3d8bff"/>
                  <stop offset="1" stop-color="#00d4b4"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span class="brand-name">Digital Wallet</span>
        </div>

        <div class="card" style="animation-delay: 0.1s">
          <div class="card-header">
            <h1>Bienvenido</h1>
            <p>Ingresa tu código de acceso para continuar</p>
          </div>

          <div class="form-group">
            <label for="access-code">Código de Acceso</label>
            <div class="input-wrapper" [class.focused]="inputFocused" [class.has-error]="!!error">
              <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="1.8"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
              <input
                id="access-code"
                type="password"
                [(ngModel)]="code"
                placeholder="••••••••••••"
                (focus)="inputFocused=true"
                (blur)="inputFocused=false"
                (keyup.enter)="onLogin()"
                autocomplete="current-password"
              >
            </div>
            <div class="error-msg" *ngIf="error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8"/>
                <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
              {{ error }}
            </div>
          </div>

          <button class="btn-login" (click)="onLogin()" [disabled]="isLoading">
            <span *ngIf="!isLoading">Acceder al Panel</span>
            <span *ngIf="isLoading" class="spinner-row">
              <span class="spinner"></span> Verificando...
            </span>
          </button>

          <p class="hint">Plataforma segura — acceso privado</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-bg {
      min-height: 100vh;
      background: #060d1a;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }

    /* Gradient mesh blobs */
    .blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(90px);
      opacity: 0.18;
      pointer-events: none;
    }
    .blob-1 {
      width: 600px; height: 600px;
      background: radial-gradient(circle, #3d8bff, transparent 70%);
      top: -200px; left: -200px;
      animation: blobFloat 18s ease-in-out infinite;
    }
    .blob-2 {
      width: 500px; height: 500px;
      background: radial-gradient(circle, #00d4b4, transparent 70%);
      bottom: -150px; right: -100px;
      animation: blobFloat 22s ease-in-out infinite reverse;
    }
    .blob-3 {
      width: 350px; height: 350px;
      background: radial-gradient(circle, #7c3aed, transparent 70%);
      top: 50%; left: 55%;
      animation: blobFloat 15s ease-in-out infinite 3s;
    }
    @keyframes blobFloat {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(30px, -20px) scale(1.05); }
      66% { transform: translate(-20px, 30px) scale(0.95); }
    }

    .login-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      width: 100%;
      max-width: 420px;
      padding: 1.5rem;
      z-index: 1;
    }

    /* Brand */
    .brand {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      animation: fadeInUp 0.4s ease both;
    }
    .logo-icon {
      width: 44px; height: 44px;
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      background: rgba(61, 139, 255, 0.1);
      border: 1px solid rgba(61, 139, 255, 0.25);
    }
    .brand-name {
      font-size: 1.2rem;
      font-weight: 700;
      letter-spacing: -0.3px;
      background: linear-gradient(135deg, #f0f6ff, #7a92b8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    /* Card */
    .card {
      background: rgba(12, 24, 41, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 24px;
      padding: 2.5rem;
      width: 100%;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      box-shadow: 0 8px 48px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255,255,255,0.05);
      animation: fadeInUp 0.5s ease both;
    }

    .card-header { margin-bottom: 2rem; }
    .card-header h1 {
      font-size: 1.75rem;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #f0f6ff;
      margin-bottom: 0.4rem;
    }
    .card-header p {
      color: #5a7299;
      font-size: 0.9rem;
      font-weight: 400;
    }

    /* Form */
    .form-group { margin-bottom: 1.5rem; }
    label {
      display: block;
      font-size: 0.8rem;
      font-weight: 600;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      color: #5a7299;
      margin-bottom: 0.6rem;
    }
    .input-wrapper {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      padding: 0 1rem;
      transition: var(--transition);
    }
    .input-wrapper.focused {
      border-color: #3d8bff;
      background: rgba(61,139,255,0.06);
      box-shadow: 0 0 0 3px rgba(61,139,255,0.12);
    }
    .input-wrapper.has-error {
      border-color: #ff4d6a;
      background: rgba(255,77,106,0.05);
    }
    .input-icon { color: #3d5272; flex-shrink: 0; transition: color 0.2s; }
    .input-wrapper.focused .input-icon { color: #3d8bff; }
    input {
      flex: 1;
      background: none;
      border: none;
      outline: none;
      padding: 0.9rem 0;
      font-size: 1rem;
      color: #f0f6ff;
      font-family: inherit;
      letter-spacing: 0.1em;
    }
    input::placeholder { color: #2d4060; letter-spacing: 0.05em; }

    .error-msg {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      color: #ff4d6a;
      font-size: 0.82rem;
      margin-top: 0.6rem;
      font-weight: 500;
    }

    /* Button */
    .btn-login {
      width: 100%;
      padding: 0.9rem;
      border-radius: 12px;
      border: none;
      background: linear-gradient(135deg, #3d8bff, #00d4b4);
      color: white;
      font-family: inherit;
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
      transition: var(--transition);
      letter-spacing: 0.2px;
      position: relative;
      overflow: hidden;
    }
    .btn-login::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, #5aa5ff, #00ecd0);
      opacity: 0;
      transition: opacity 0.25s;
    }
    .btn-login:hover:not(:disabled)::before { opacity: 1; }
    .btn-login:active:not(:disabled) { transform: scale(0.98); }
    .btn-login:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-login span { position: relative; z-index: 1; }

    .spinner-row { display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
    .spinner {
      width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .hint {
      text-align: center;
      font-size: 0.75rem;
      color: #2d4060;
      margin-top: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
    }
    .hint::before, .hint::after {
      content: '';
      width: 32px; height: 1px;
      background: rgba(255,255,255,0.08);
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class LoginComponent {
  code = '';
  isLoading = false;
  error = '';
  inputFocused = false;
  private authService = inject(AuthService);
  private router = inject(Router);

  onLogin() {
    if (!this.code) return;
    this.isLoading = true;
    this.error = '';
    this.authService.login(this.code).subscribe({
      next: () => this.router.navigate(['/registros']),
      error: () => {
        this.error = 'Código incorrecto. Intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }
}
