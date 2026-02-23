import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="app-shell">
      <!-- Sidebar -->
      <aside class="sidebar">
        <!-- Brand -->
        <div class="brand">
          <div class="brand-icon">
            <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="7" fill="url(#lg-brand)"/>
              <path d="M7 14h14M14 7v14" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
              <defs>
                <linearGradient id="lg-brand" x1="0" y1="0" x2="28" y2="28">
                  <stop stop-color="#3d8bff"/>
                  <stop offset="1" stop-color="#00d4b4"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <div class="brand-title">Digital Wallet</div>
            <div class="brand-sub">Panel de Control</div>
          </div>
        </div>

        <!-- Divider -->
        <div class="divider"></div>

        <!-- Navigation label -->
        <span class="nav-label">Navegación</span>

        <!-- Nav Links -->
        <nav class="nav-list">
          <a routerLink="/registros" routerLinkActive="nav-active" class="nav-item">
            <span class="nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/>
                <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/>
                <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/>
                <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/>
              </svg>
            </span>
            <span class="nav-text">Registros</span>
            <span class="nav-arrow">›</span>
          </a>

          <a routerLink="/dinero" routerLinkActive="nav-active" class="nav-item">
            <span class="nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/>
                <path d="M12 7v2m0 6v2M9.5 9.5c0-1 1.12-1.5 2.5-1.5s2.5.5 2.5 1.5-1 1.5-2.5 1.5-2.5.5-2.5 1.5 1.12 1.5 2.5 1.5 2.5-.5 2.5-1.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </span>
            <span class="nav-text">Finanzas</span>
            <span class="nav-arrow">›</span>
          </a>
        </nav>

        <!-- Spacer -->
        <div class="flex-spacer"></div>

        <!-- Divider -->
        <div class="divider"></div>

        <!-- Logout -->
        <button class="btn-logout" (click)="onLogout()">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            <path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Cerrar Sesión
        </button>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-shell {
      display: flex;
      height: 100vh;
      background: #060d1a;
      overflow: hidden;
    }

    /* ─── Sidebar ─── */
    .sidebar {
      width: 248px;
      min-width: 248px;
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 1.5rem 1rem;
      background: rgba(9, 18, 34, 0.95);
      border-right: 1px solid rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(12px);
      position: relative;
      z-index: 10;
    }

    /* Brand */
    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 0.5rem;
      margin-bottom: 0.5rem;
    }
    .brand-icon {
      width: 40px; height: 40px;
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      background: rgba(61, 139, 255, 0.1);
      border: 1px solid rgba(61, 139, 255, 0.2);
      flex-shrink: 0;
    }
    .brand-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: #f0f6ff;
      letter-spacing: -0.2px;
      line-height: 1.2;
    }
    .brand-sub {
      font-size: 0.7rem;
      color: #3d5272;
      font-weight: 500;
      margin-top: 1px;
    }

    /* Divider */
    .divider {
      height: 1px;
      background: rgba(255,255,255,0.05);
      margin: 1rem 0.5rem;
    }
    .flex-spacer { flex: 1; }

    /* Nav label */
    .nav-label {
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      color: #2d4060;
      padding: 0 0.75rem;
      margin-bottom: 0.4rem;
    }

    /* Nav items */
    .nav-list {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.7rem 0.75rem;
      border-radius: 10px;
      text-decoration: none;
      color: #5a7299;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.2s ease;
      position: relative;
      cursor: pointer;
    }
    .nav-item:hover {
      background: rgba(255,255,255,0.04);
      color: #c0d0e8;
    }
    .nav-item.nav-active {
      background: rgba(61, 139, 255, 0.1);
      color: #3d8bff;
      font-weight: 600;
    }
    .nav-item.nav-active::before {
      content: '';
      position: absolute;
      left: 0; top: 50%;
      transform: translateY(-50%);
      width: 3px; height: 60%;
      background: linear-gradient(#3d8bff, #00d4b4);
      border-radius: 0 3px 3px 0;
    }
    .nav-icon {
      display: flex; align-items: center; justify-content: center;
      width: 32px; height: 32px;
      border-radius: 8px;
      background: rgba(255,255,255,0.04);
      transition: all 0.2s;
      flex-shrink: 0;
    }
    .nav-item.nav-active .nav-icon {
      background: rgba(61,139,255,0.15);
    }
    .nav-text { flex: 1; }
    .nav-arrow {
      font-size: 1rem;
      opacity: 0;
      transform: translateX(-4px);
      transition: all 0.2s;
      color: #3d8bff;
    }
    .nav-item:hover .nav-arrow,
    .nav-item.nav-active .nav-arrow { opacity: 1; transform: translateX(0); }

    /* Logout button */
    .btn-logout {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.7rem 0.75rem;
      border-radius: 10px;
      border: none;
      background: transparent;
      color: #5a7299;
      font-family: inherit;
      font-size: 0.88rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      width: 100%;
      text-align: left;
    }
    .btn-logout:hover {
      background: rgba(255, 77, 106, 0.08);
      color: #ff4d6a;
    }

    /* ─── Main Content ─── */
    .main-content {
      flex: 1;
      overflow-y: auto;
      background: #060d1a;
    }
  `]
})
export class LayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
