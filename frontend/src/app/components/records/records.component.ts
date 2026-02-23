import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecordService } from '../../services/record.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-records',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="page-header-left">
          <div class="page-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/>
              <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/>
              <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/>
              <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/>
            </svg>
          </div>
          <div>
            <h1>Registros</h1>
            <p>Gestiona tus credenciales y accesos</p>
          </div>
        </div>
        <button class="btn-primary" (click)="toggleForm()" [class.active]="showForm">
          <svg *ngIf="!showForm" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
          </svg>
          <svg *ngIf="showForm" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
          </svg>
          {{ showForm ? 'Cancelar' : 'Nuevo Registro' }}
        </button>
      </div>

      <!-- Stats Bar -->
      <div class="stats-bar">
        <div class="stat-chip">
          <span class="stat-dot blue"></span>
          <span class="stat-value">{{ records.length }}</span>
          <span class="stat-label">registros totales</span>
        </div>
      </div>

      <!-- Add Form -->
      <div class="form-panel" *ngIf="showForm">
        <div class="form-panel-header">
          <h3>Nuevo Registro</h3>
          <p>Completa los campos para agregar un acceso</p>
        </div>
        <div class="form-grid">
          <div class="field-group">
            <label>Usuario / Correo</label>
            <div class="input-box">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.8"/>
                <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
              <input [(ngModel)]="newRecord.userOrEmail" placeholder="usuario@email.com">
            </div>
          </div>
          <div class="field-group">
            <label>Contraseña</label>
            <div class="input-box">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="1.8"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
              <input [(ngModel)]="newRecord.password" type="password" placeholder="••••••••">
            </div>
          </div>
          <div class="field-group">
            <label>Plataforma</label>
            <div class="input-box">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.8"/>
                <path d="M8 21h8M12 17v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
              <input [(ngModel)]="newRecord.platform" placeholder="Netflix, Gmail, etc.">
            </div>
          </div>
          <div class="field-group">
            <label>URL</label>
            <div class="input-box">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/>
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10A15.3 15.3 0 0 1 8 12 15.3 15.3 0 0 1 12 2z" stroke="currentColor" stroke-width="1.8"/>
              </svg>
              <input [(ngModel)]="newRecord.url" placeholder="https://...">
            </div>
          </div>
        </div>
        <div class="form-actions">
          <button class="btn-cancel" (click)="toggleForm()">Cancelar</button>
          <button class="btn-save" (click)="onAdd()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke="currentColor" stroke-width="1.8"/>
              <path d="M17 21v-8H7v8M7 3v5h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
            Guardar Registro
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="table-container">
        <div class="empty-state" *ngIf="records.length === 0">
          <div class="empty-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5" opacity="0.5"/>
              <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5" opacity="0.3"/>
              <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5" opacity="0.3"/>
              <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5" opacity="0.15"/>
            </svg>
          </div>
          <p>No hay registros aún</p>
          <span>Haz clic en "Nuevo Registro" para agregar tu primera credencial</span>
        </div>

        <table *ngIf="records.length > 0">
          <thead>
            <tr>
              <th>Plataforma</th>
              <th>Usuario / Correo</th>
              <th>Contraseña</th>
              <th>URL</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let record of records; let i = index" class="table-row">
              <td>
                <div class="platform-cell">
                  <div class="platform-avatar" [style.background]="getColor(record.platform)">
                    {{ record.platform?.charAt(0)?.toUpperCase() || '?' }}
                  </div>
                  <span>{{ record.platform }}</span>
                </div>
              </td>
              <td class="email-cell">{{ record.userOrEmail }}</td>
              <td>
                <div class="password-cell">
                  <span class="pw-dots">●●●●●●●●</span>
                  <button class="icon-btn" title="Copiar contraseña" (click)="copyPassword(record.password)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="1.8"/>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                    </svg>
                  </button>
                </div>
              </td>
              <td>
                <a [href]="record.url" target="_blank" class="url-link" *ngIf="record.url">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                    <path d="M15 3h6v6M10 14L21 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  {{ record.url | slice:0:30 }}{{ record.url?.length > 30 ? '…' : '' }}
                </a>
                <span class="no-url" *ngIf="!record.url">—</span>
              </td>
              <td>
                <button class="btn-delete" (click)="onDelete(record._id)" title="Eliminar">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path d="M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page {
      padding: 2rem 2.5rem;
      max-width: 1400px;
      animation: fadeInUp 0.35s ease both;
    }
    @keyframes fadeInUp {
      from { opacity:0; transform: translateY(12px); }
      to { opacity:1; transform: translateY(0); }
    }

    /* ─── Header ─── */
    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.25rem;
    }
    .page-header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .page-icon {
      width: 44px; height: 44px;
      background: rgba(61, 139, 255, 0.1);
      border: 1px solid rgba(61, 139, 255, 0.2);
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      color: #3d8bff;
    }
    h1 {
      font-size: 1.45rem;
      font-weight: 800;
      color: #f0f6ff;
      letter-spacing: -0.4px;
    }
    .page-header p {
      font-size: 0.82rem;
      color: #3d5272;
      margin-top: 2px;
    }

    /* btn-primary */
    .btn-primary {
      display: flex; align-items: center; gap: 0.5rem;
      padding: 0.6rem 1.1rem;
      border-radius: 10px;
      border: none;
      background: linear-gradient(135deg, #3d8bff, #00d4b4);
      color: white;
      font-family: inherit;
      font-size: 0.88rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      letter-spacing: 0.1px;
    }
    .btn-primary:hover { filter: brightness(1.12); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(61,139,255,0.25); }
    .btn-primary.active { background: rgba(255,255,255,0.08); box-shadow: none; filter: none; }

    /* Stats bar */
    .stats-bar {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }
    .stat-chip {
      display: flex; align-items: center; gap: 0.45rem;
      padding: 0.35rem 0.75rem;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 99px;
      font-size: 0.82rem;
    }
    .stat-dot { width: 7px; height: 7px; border-radius: 50%; }
    .stat-dot.blue { background: #3d8bff; box-shadow: 0 0 6px #3d8bff; }
    .stat-value { font-weight: 700; color: #f0f6ff; }
    .stat-label { color: #3d5272; }

    /* ─── Form Panel ─── */
    .form-panel {
      background: rgba(12, 24, 41, 0.8);
      border: 1px solid rgba(61, 139, 255, 0.15);
      border-radius: 18px;
      padding: 1.75rem;
      margin-bottom: 1.5rem;
      animation: slideDown 0.25s ease both;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    }
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .form-panel-header { margin-bottom: 1.25rem; }
    .form-panel-header h3 { font-size: 1rem; font-weight: 700; color: #f0f6ff; }
    .form-panel-header p { font-size: 0.8rem; color: #3d5272; margin-top: 2px; }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
      margin-bottom: 1.25rem;
    }
    .field-group label {
      display: block;
      font-size: 0.72rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: #3d5272;
      margin-bottom: 0.45rem;
    }
    .input-box {
      display: flex; align-items: center; gap: 0.6rem;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 10px;
      padding: 0 0.75rem;
      color: #3d5272;
      transition: all 0.2s;
    }
    .input-box:focus-within {
      border-color: rgba(61,139,255,0.4);
      background: rgba(61,139,255,0.05);
      color: #3d8bff;
      box-shadow: 0 0 0 3px rgba(61,139,255,0.08);
    }
    .input-box input {
      flex: 1; background: none; border: none; outline: none;
      padding: 0.7rem 0;
      font-size: 0.88rem; color: #f0f6ff; font-family: inherit;
    }
    .input-box input::placeholder { color: #2d4060; }

    .form-actions {
      display: flex; gap: 0.75rem; justify-content: flex-end;
    }
    .btn-cancel {
      padding: 0.65rem 1.25rem; border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.08);
      background: transparent; color: #5a7299;
      font-family: inherit; font-size: 0.88rem; font-weight: 500; cursor: pointer;
      transition: all 0.2s;
    }
    .btn-cancel:hover { background: rgba(255,255,255,0.05); color: #f0f6ff; }
    .btn-save {
      display: flex; align-items: center; gap: 0.5rem;
      padding: 0.65rem 1.3rem; border-radius: 10px; border: none;
      background: linear-gradient(135deg, #3d8bff, #00d4b4);
      color: white; font-family: inherit; font-size: 0.88rem;
      font-weight: 600; cursor: pointer; transition: all 0.2s;
    }
    .btn-save:hover { filter: brightness(1.1); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(61,139,255,0.28); }

    /* ─── Table ─── */
    .table-container {
      background: rgba(12, 24, 41, 0.6);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 18px;
      overflow: hidden;
    }
    .empty-state {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; padding: 4rem 2rem; gap: 0.75rem;
      color: #2d4060;
    }
    .empty-icon { opacity: 0.5; }
    .empty-state p { font-size: 1rem; font-weight: 600; color: #3d5272; }
    .empty-state span { font-size: 0.82rem; text-align: center; }

    table { width: 100%; border-collapse: collapse; }
    thead tr {
      background: rgba(255,255,255,0.03);
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    th {
      padding: 0.85rem 1.2rem;
      text-align: left;
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.7px;
      color: #3d5272;
    }
    .table-row {
      border-bottom: 1px solid rgba(255,255,255,0.04);
      transition: background 0.15s;
    }
    .table-row:last-child { border-bottom: none; }
    .table-row:hover { background: rgba(255,255,255,0.025); }
    td {
      padding: 0.9rem 1.2rem;
      font-size: 0.87rem;
      color: #c0d0e8;
    }

    .platform-cell {
      display: flex; align-items: center; gap: 0.65rem;
    }
    .platform-avatar {
      width: 30px; height: 30px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.75rem; font-weight: 800; color: white;
      flex-shrink: 0;
    }
    .email-cell { color: #7a92b8; font-size: 0.85rem; }
    .password-cell {
      display: flex; align-items: center; gap: 0.5rem;
    }
    .pw-dots { color: #3d5272; letter-spacing: 2px; font-size: 0.7rem; }
    .icon-btn {
      background: none; border: none; cursor: pointer;
      color: #3d5272; padding: 4px; border-radius: 5px;
      transition: all 0.15s; display: flex; align-items: center;
    }
    .icon-btn:hover { color: #3d8bff; background: rgba(61,139,255,0.1); }

    .url-link {
      display: flex; align-items: center; gap: 0.35rem;
      color: #3d8bff; text-decoration: none; font-size: 0.83rem;
      transition: color 0.15s;
    }
    .url-link:hover { color: #00d4b4; }
    .no-url { color: #2d4060; }

    .btn-delete {
      background: none; border: none; cursor: pointer;
      color: #3d5272; padding: 6px; border-radius: 7px;
      transition: all 0.2s; display: flex; align-items: center;
    }
    .btn-delete:hover {
      color: #ff4d6a;
      background: rgba(255,77,106,0.1);
    }
  `]
})
export class RecordsComponent implements OnInit {
  records: any[] = [];
  showForm = false;
  newRecord = { userOrEmail: '', password: '', platform: '', url: '' };

  private recordService = inject(RecordService);

  private colors = ['#3d8bff', '#00d4b4', '#7c3aed', '#f59e0b', '#10b981', '#ef4444', '#ec4899', '#14b8a6'];

  getColor(name: string): string {
    if (!name) return '#3d5272';
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return this.colors[Math.abs(hash) % this.colors.length];
  }

  copyPassword(password: string) {
    navigator.clipboard.writeText(password).catch(() => { });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) this.newRecord = { userOrEmail: '', password: '', platform: '', url: '' };
  }

  ngOnInit() {
    this.loadRecords();
  }

  loadRecords() {
    this.recordService.getRecords().subscribe(res => this.records = res);
  }

  onAdd() {
    this.recordService.addRecord(this.newRecord).subscribe(() => {
      this.loadRecords();
      this.showForm = false;
      this.newRecord = { userOrEmail: '', password: '', platform: '', url: '' };
    });
  }

  onDelete(id: string) {
    Swal.fire({
      title: '¿Eliminar registro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#0c1829',
      color: '#f0f6ff',
      confirmButtonColor: '#ff4d6a',
      cancelButtonColor: '#1e2f4a',
      iconColor: '#ff4d6a',
      customClass: { popup: 'swal-custom-popup' }
    }).then(result => {
      if (result.isConfirmed) {
        this.recordService.deleteRecord(id).subscribe(() => {
          this.loadRecords();
          Swal.fire({
            title: '¡Eliminado!',
            text: 'El registro fue eliminado correctamente.',
            icon: 'success',
            background: '#0c1829',
            color: '#f0f6ff',
            confirmButtonColor: '#3d8bff',
            iconColor: '#00c896',
            timer: 2000,
            showConfirmButton: false,
            customClass: { popup: 'swal-custom-popup' }
          });
        });
      }
    });
  }
}
