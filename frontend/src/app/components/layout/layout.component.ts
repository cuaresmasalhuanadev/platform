import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="layout-container">
      <nav class="sidebar glass">
        <div class="brand">
          <h1>Wallet</h1>
        </div>
        <ul class="nav-links">
          <li><a routerLink="/registros" routerLinkActive="active">Registros</a></li>
          <li><a routerLink="/dinero" routerLinkActive="active">Dinero</a></li>
        </ul>
        <div class="logout">
          <button (click)="onLogout()">Cerrar Sesión</button>
        </div>
      </nav>
      <main class="content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
    styles: [`
    .layout-container {
      display: flex;
      height: 100vh;
      background: #0f172a;
      color: white;
    }
    .sidebar {
      width: 260px;
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 2rem;
      border-right: 1px solid rgba(255, 255, 255, 0.1);
    }
    .brand h1 { font-size: 1.5rem; margin-bottom: 3rem; background: linear-gradient(to right, #4facfe, #00f2fe); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .nav-links { list-style: none; flex: 1; }
    .nav-links li { margin: 1rem 0; }
    .nav-links a { color: #94a3b8; text-decoration: none; font-size: 1.1rem; transition: color 0.3s; }
    .nav-links a.active { color: white; border-left: 3px solid #4facfe; padding-left: 10px; }
    .logout button { background: none; border: 1px solid #4facfe; color: #4facfe; padding: 10px 20px; border-radius: 8px; cursor: pointer; width: 100%; transition: all 0.3s; }
    .logout button:hover { background: #4facfe; color: white; }
    .content { flex: 1; padding: 2rem; overflow-y: auto; }
    .glass { background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(12px); }
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
