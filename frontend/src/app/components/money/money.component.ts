import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MoneyService } from '../../services/money.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-money',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  template: `
    <div class="page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="page-header-left">
          <div class="page-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/>
              <path d="M12 7v2m0 6v2M9.5 9.5c0-1 1.12-1.5 2.5-1.5s2.5.5 2.5 1.5-1 1.5-2.5 1.5-2.5.5-2.5 1.5 1.12 1.5 2.5 1.5 2.5-.5 2.5-1.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
          </div>
          <div>
            <h1>Finanzas</h1>
            <p>Control de ingresos, gastos y balance</p>
          </div>
        </div>
        <button class="btn-primary" (click)="showForm = !showForm" [class.active]="showForm">
          <svg *ngIf="!showForm" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
          </svg>
          <svg *ngIf="showForm" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
          </svg>
          {{ showForm ? 'Cancelar' : 'Nueva Transacción' }}
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card income-card">
          <div class="stat-card-inner">
            <div class="stat-label">Ingresos Totales</div>
            <div class="stat-amount income-amount">S/ {{ totalIncome | number:'1.2-2' }}</div>
            <div class="stat-sub">{{ countType('INGRESO') }} transacciones</div>
          </div>
          <div class="stat-icon-wrap green">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>

        <div class="stat-card expense-card">
          <div class="stat-card-inner">
            <div class="stat-label">Gastos Totales</div>
            <div class="stat-amount expense-amount">S/ {{ totalExpense | number:'1.2-2' }}</div>
            <div class="stat-sub">{{ countType('GASTO') }} transacciones</div>
          </div>
          <div class="stat-icon-wrap red">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>

        <div class="stat-card" [class.balance-pos]="balance >= 0" [class.balance-neg]="balance < 0">
          <div class="stat-card-inner">
            <div class="stat-label">Balance Neto</div>
            <div class="stat-amount" [class.income-amount]="balance >= 0" [class.expense-amount]="balance < 0">
              S/ {{ balance | number:'1.2-2' }}
            </div>
            <div class="stat-sub">{{ balance >= 0 ? 'Superávit' : 'Déficit' }}</div>
          </div>
          <div class="stat-icon-wrap" [class.blue]="balance >= 0" [class.orange]="balance < 0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>

        <div class="stat-card chart-stat-card">
          <div class="chart-title">Distribución</div>
          <div class="chart-wrap">
            <canvas baseChart
              [data]="pieChartData"
              [options]="pieChartOptions"
              type="doughnut">
            </canvas>
          </div>
        </div>
      </div>

      <!-- Form Panel -->
      <div class="form-panel" *ngIf="showForm">
        <div class="form-panel-header">
          <h3>Nueva Transacción</h3>
          <p>Registra un ingreso o gasto</p>
        </div>

        <div class="type-selector">
          <button [class.type-active-income]="newTx.type === 'INGRESO'" (click)="newTx.type = 'INGRESO'" class="type-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Ingreso
          </button>
          <button [class.type-active-expense]="newTx.type === 'GASTO'" (click)="newTx.type = 'GASTO'" class="type-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Gasto
          </button>
        </div>

        <div class="form-grid">
          <div class="field-group">
            <label>Nombre</label>
            <div class="input-box">
              <input [(ngModel)]="newTx.name" placeholder="Ej: Inversión, TV, Mercado">
            </div>
          </div>
          <div class="field-group">
            <label>Plataforma</label>
            <div class="input-box">
              <input [(ngModel)]="newTx.platform" placeholder="Ej: Makro, Falabella">
            </div>
          </div>
          <div class="field-group">
            <label>Monto (S/)</label>
            <div class="input-box">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/>
                <path d="M12 7v2m0 6v2M9.5 9.5c0-1 1.12-1.5 2.5-1.5s2.5.5 2.5 1.5-1 1.5-2.5 1.5-2.5.5-2.5 1.5 1.12 1.5 2.5 1.5 2.5-.5 2.5-1.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
              <input [(ngModel)]="newTx.amount" type="number" placeholder="0.00">
            </div>
          </div>
          <div class="field-group">
            <label>N° Operación</label>
            <div class="input-box">
              <input [(ngModel)]="newTx.opNumber" placeholder="Opcional">
            </div>
          </div>
          <div class="field-group">
            <label>Fecha</label>
            <div class="input-box">
              <input [(ngModel)]="newTx.date" type="date">
            </div>
          </div>
          <div class="field-group">
            <label>Método de Depósito</label>
            <div class="input-box">
              <select [(ngModel)]="newTx.depositMethod">
                <option *ngFor="let m of methods" [value]="m">{{ m }}</option>
              </select>
            </div>
          </div>
          <div class="field-group">
            <label>Tipo de Tarjeta</label>
            <div class="input-box">
              <select [(ngModel)]="newTx.cardType">
                <option *ngFor="let t of cardTypes" [value]="t">{{ t }}</option>
              </select>
            </div>
          </div>
          <div class="field-group field-span">
            <label>Descripción</label>
            <div class="input-box textarea-box">
              <textarea [(ngModel)]="newTx.description" placeholder="Notas adicionales..." rows="2"></textarea>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button class="btn-cancel" (click)="showForm = false">Cancelar</button>
          <button class="btn-save" (click)="onAdd()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke="currentColor" stroke-width="1.8"/>
              <path d="M17 21v-8H7v8M7 3v5h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
            Guardar Transacción
          </button>
        </div>
      </div>

      <!-- Transactions Table -->
      <div class="table-container">
        <div class="table-top">
          <span class="table-title">Historial de Transacciones</span>
          <span class="table-count">{{ transactions.length }} registros</span>
        </div>

        <div class="empty-state" *ngIf="transactions.length === 0">
          <div class="empty-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5" opacity="0.4"/>
              <path d="M12 7v2m0 6v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>
            </svg>
          </div>
          <p>Sin transacciones registradas</p>
          <span>Usa el botón "Nueva Transacción" para empezar</span>
        </div>

        <div class="table-scroll" *ngIf="transactions.length > 0">
          <table>
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Nombre</th>
                <th>Plataforma</th>
                <th>Monto</th>
                <th>Método</th>
                <th>Tarjeta</th>
                <th>Fecha</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let tx of transactions" class="table-row">
                <td>
                  <span class="badge" [class.badge-income]="tx.type === 'INGRESO'" [class.badge-expense]="tx.type === 'GASTO'">
                    {{ tx.type }}
                  </span>
                </td>
                <td class="tx-name">{{ tx.name }}</td>
                <td class="tx-platform">{{ tx.platform }}</td>
                <td [class.amount-income]="tx.type === 'INGRESO'" [class.amount-expense]="tx.type === 'GASTO'" class="tx-amount">
                  {{ tx.type === 'INGRESO' ? '+' : '-' }} S/ {{ tx.amount | number:'1.2-2' }}
                </td>
                <td class="tx-meta">{{ tx.depositMethod }}</td>
                <td>
                  <span class="card-chip">{{ tx.cardType }}</span>
                </td>
                <td class="tx-date">{{ tx.date | date:'dd/MM/yy' }}</td>
                <td>
                  <button class="btn-delete" (click)="onDelete(tx._id)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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
      to   { opacity:1; transform: translateY(0); }
    }

    /* ─── Header ─── */
    .page-header {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 1.75rem;
    }
    .page-header-left { display: flex; align-items: center; gap: 1rem; }
    .page-icon {
      width: 44px; height: 44px; border-radius: 12px;
      background: rgba(0, 212, 180, 0.1);
      border: 1px solid rgba(0, 212, 180, 0.2);
      display: flex; align-items: center; justify-content: center;
      color: #00d4b4;
    }
    h1 { font-size: 1.45rem; font-weight: 800; color: #f0f6ff; letter-spacing: -0.4px; }
    .page-header p { font-size: 0.82rem; color: #3d5272; margin-top: 2px; }

    .btn-primary {
      display: flex; align-items: center; gap: 0.5rem;
      padding: 0.6rem 1.1rem; border-radius: 10px; border: none;
      background: linear-gradient(135deg, #3d8bff, #00d4b4);
      color: white; font-family: inherit; font-size: 0.88rem;
      font-weight: 600; cursor: pointer; transition: all 0.2s;
    }
    .btn-primary:hover { filter: brightness(1.12); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(61,139,255,0.25); }
    .btn-primary.active { background: rgba(255,255,255,0.07); box-shadow: none; filter: none; }

    /* ─── Stats Grid ─── */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.25rem;
      margin-bottom: 1.75rem;
    }
    .stat-card {
      background: rgba(12, 24, 41, 0.7);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 18px;
      padding: 1.5rem;
      display: flex; align-items: center; justify-content: space-between;
      gap: 1rem;
      transition: all 0.2s;
    }
    .stat-card:hover { border-color: rgba(255,255,255,0.1); transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.25); }
    .income-card { background: rgba(0, 200, 150, 0.05); border-color: rgba(0,200,150,0.12); }
    .expense-card { background: rgba(255, 77, 106, 0.05); border-color: rgba(255,77,106,0.12); }
    .balance-pos { background: rgba(61,139,255,0.05); border-color: rgba(61,139,255,0.12); }
    .balance-neg { background: rgba(255,140,66,0.05); border-color: rgba(255,140,66,0.12); }

    .stat-card-inner .stat-label {
      font-size: 0.75rem; font-weight: 600; text-transform: uppercase;
      letter-spacing: 0.6px; color: #3d5272; margin-bottom: 0.4rem;
    }
    .stat-amount {
      font-size: 1.65rem; font-weight: 800; letter-spacing: -0.5px;
      line-height: 1; margin-bottom: 0.3rem;
    }
    .income-amount { color: #00c896; }
    .expense-amount { color: #ff4d6a; }
    .stat-sub { font-size: 0.75rem; color: #3d5272; }

    .stat-icon-wrap {
      width: 48px; height: 48px; border-radius: 12px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }
    .stat-icon-wrap.green { background: rgba(0,200,150,0.15); color: #00c896; }
    .stat-icon-wrap.red   { background: rgba(255,77,106,0.15); color: #ff4d6a; }
    .stat-icon-wrap.blue  { background: rgba(61,139,255,0.15); color: #3d8bff; }
    .stat-icon-wrap.orange{ background: rgba(255,140,66,0.15); color: #ff8c42; }

    /* Chart card */
    .chart-stat-card {
      flex-direction: column; align-items: stretch;
      justify-content: flex-start; padding: 1.25rem 1.5rem;
    }
    .chart-title {
      font-size: 0.75rem; font-weight: 600; text-transform: uppercase;
      letter-spacing: 0.6px; color: #3d5272; margin-bottom: 0.75rem;
    }
    .chart-wrap { height: 160px; display: flex; align-items: center; justify-content: center; }

    /* ─── Form Panel ─── */
    .form-panel {
      background: rgba(12, 24, 41, 0.8);
      border: 1px solid rgba(61,139,255,0.15);
      border-radius: 18px; padding: 1.75rem;
      margin-bottom: 1.5rem;
      animation: slideDown 0.25s ease both;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    }
    @keyframes slideDown {
      from { opacity:0; transform: translateY(-10px); }
      to { opacity:1; transform: translateY(0); }
    }
    .form-panel-header { margin-bottom: 1.2rem; }
    .form-panel-header h3 { font-size: 1rem; font-weight: 700; color: #f0f6ff; }
    .form-panel-header p { font-size: 0.8rem; color: #3d5272; margin-top: 2px; }

    .type-selector { display: flex; gap: 0.6rem; margin-bottom: 1.25rem; }
    .type-btn {
      display: flex; align-items: center; gap: 0.45rem;
      flex: 1; padding: 0.6rem 1rem;
      border-radius: 10px; border: 1px solid rgba(255,255,255,0.07);
      background: rgba(255,255,255,0.03); color: #5a7299;
      font-family: inherit; font-size: 0.88rem; font-weight: 500;
      cursor: pointer; transition: all 0.2s; justify-content: center;
    }
    .type-btn:hover { border-color: rgba(255,255,255,0.15); color: #c0d0e8; }
    .type-active-income { background: rgba(0,200,150,0.1) !important; border-color: rgba(0,200,150,0.35) !important; color: #00c896 !important; font-weight: 600 !important; }
    .type-active-expense { background: rgba(255,77,106,0.1) !important; border-color: rgba(255,77,106,0.35) !important; color: #ff4d6a !important; font-weight: 600 !important; }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem; margin-bottom: 1.25rem;
    }
    .field-span { grid-column: 1 / -1; }
    .field-group label {
      display: block; font-size: 0.72rem; font-weight: 600;
      text-transform: uppercase; letter-spacing: 0.6px; color: #3d5272; margin-bottom: 0.45rem;
    }
    .input-box {
      display: flex; align-items: center; gap: 0.55rem;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 10px; padding: 0 0.75rem;
      color: #3d5272; transition: all 0.2s;
    }
    .input-box:focus-within {
      border-color: rgba(61,139,255,0.4);
      background: rgba(61,139,255,0.05);
      color: #3d8bff;
      box-shadow: 0 0 0 3px rgba(61,139,255,0.08);
    }
    .input-box input, .input-box select, .input-box textarea {
      flex: 1; background: none; border: none; outline: none;
      padding: 0.7rem 0; font-size: 0.87rem; color: #f0f6ff;
      font-family: inherit; width: 100%;
    }
    .input-box input::placeholder, .input-box textarea::placeholder { color: #2d4060; }
    .input-box select option { background: #0c1829; }
    .textarea-box { align-items: flex-start; padding-top: 0.6rem; padding-bottom: 0.6rem; }
    .input-box textarea { resize: none; }

    .form-actions { display: flex; gap: 0.75rem; justify-content: flex-end; }
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
      border-radius: 18px; overflow: hidden;
    }
    .table-top {
      display: flex; align-items: center; justify-content: space-between;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .table-title { font-size: 0.88rem; font-weight: 700; color: #7a92b8; }
    .table-count {
      font-size: 0.75rem; font-weight: 600;
      background: rgba(255,255,255,0.06); border-radius: 99px;
      padding: 0.2rem 0.65rem; color: #3d5272;
    }
    .table-scroll { overflow-x: auto; }
    .empty-state {
      display: flex; flex-direction: column; align-items: center;
      padding: 3.5rem 2rem; gap: 0.65rem; color: #2d4060;
    }
    .empty-icon { opacity: 0.4; }
    .empty-state p { font-size: 1rem; font-weight: 600; color: #3d5272; }
    .empty-state span { font-size: 0.82rem; }

    table { width: 100%; border-collapse: collapse; min-width: 720px; }
    thead tr {
      background: rgba(255,255,255,0.02);
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    th {
      padding: 0.8rem 1.2rem; text-align: left;
      font-size: 0.7rem; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.7px; color: #2d4060;
    }
    .table-row {
      border-bottom: 1px solid rgba(255,255,255,0.03);
      transition: background 0.15s;
    }
    .table-row:last-child { border-bottom: none; }
    .table-row:hover { background: rgba(255,255,255,0.02); }
    td { padding: 0.85rem 1.2rem; font-size: 0.86rem; color: #c0d0e8; vertical-align: middle; }

    .badge {
      display: inline-block; padding: 3px 9px; border-radius: 6px;
      font-size: 0.7rem; font-weight: 700; letter-spacing: 0.4px;
    }
    .badge-income { background: rgba(0,200,150,0.15); color: #00c896; }
    .badge-expense { background: rgba(255,77,106,0.15); color: #ff4d6a; }

    .tx-name { font-weight: 600; color: #e0eaff; }
    .tx-platform { color: #5a7299; font-size: 0.83rem; }
    .tx-amount { font-weight: 700; font-size: 0.95rem; }
    .amount-income { color: #00c896; }
    .amount-expense { color: #ff4d6a; }
    .tx-meta { color: #5a7299; font-size: 0.82rem; }
    .tx-date { color: #3d5272; font-size: 0.82rem; }

    .card-chip {
      display: inline-block; padding: 2px 8px; border-radius: 5px;
      font-size: 0.7rem; font-weight: 600;
      background: rgba(255,255,255,0.06); color: #5a7299;
    }

    .btn-delete {
      background: none; border: none; cursor: pointer; color: #3d5272;
      padding: 6px; border-radius: 7px; transition: all 0.2s;
      display: flex; align-items: center;
    }
    .btn-delete:hover { color: #ff4d6a; background: rgba(255,77,106,0.1); }
  `]
})
export class MoneyComponent {
  transactions: any[] = [];
  showForm = false;
  totalIncome = 0;
  totalExpense = 0;
  balance = 0;

  methods = ['TRANSFERENCIA', 'YAPE', 'PLIN', 'LIGO', 'INTERBANK', 'BCP', 'CAJA AREQUIPA', 'PREXPE', 'BANCO FALABELLA', 'TAKENOS', 'GLOBAL 66'];
  cardTypes = ['PREPAGO', 'CREDITO', 'DEBITO'];

  newTx = this.emptyTx();

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: { color: '#5a7299', font: { size: 11 }, padding: 12, usePointStyle: true, pointStyleWidth: 8 }
      },
      tooltip: {
        callbacks: {
          label: (ctx: { raw: unknown }) => ` S/ ${Number(ctx.raw).toFixed(2)}`
        }
      }
    }
  } as any;


  public pieChartData: ChartConfiguration['data'] = {
    labels: ['Ingresos', 'Gastos'],
    datasets: [{
      data: [0, 0],
      backgroundColor: ['rgba(0,200,150,0.8)', 'rgba(255,77,106,0.8)'],
      hoverBackgroundColor: ['#00c896', '#ff4d6a'],
      borderWidth: 0,
      hoverOffset: 4
    }]
  };

  private moneyService = inject(MoneyService);

  constructor() { this.loadTransactions(); }

  loadTransactions() {
    this.moneyService.getTransactions().subscribe(res => {
      this.transactions = res;
      this.calculateStats();
    });
  }

  calculateStats() {
    this.totalIncome = this.transactions
      .filter(t => t.type === 'INGRESO')
      .reduce((acc, cur) => acc + cur.amount, 0);
    this.totalExpense = this.transactions
      .filter(t => t.type === 'GASTO')
      .reduce((acc, cur) => acc + cur.amount, 0);
    this.balance = this.totalIncome - this.totalExpense;
    this.pieChartData = {
      ...this.pieChartData,
      datasets: [{ ...this.pieChartData.datasets[0], data: [this.totalIncome, this.totalExpense] }]
    };
  }

  onAdd() {
    if (!this.newTx.name || !this.newTx.amount) return;
    this.moneyService.addTransaction(this.newTx).subscribe(() => {
      this.loadTransactions();
      this.showForm = false;
      this.newTx = this.emptyTx();
    });
  }

  onDelete(id: string) {
    Swal.fire({
      title: '¿Eliminar transacción?',
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
        this.moneyService.deleteTransaction(id).subscribe(() => {
          this.loadTransactions();
          Swal.fire({
            title: '¡Eliminado!',
            text: 'La transacción fue eliminada.',
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

  countType(type: string): number {
    return this.transactions.filter(t => t.type === type).length;
  }

  emptyTx() {
    return {
      type: 'INGRESO',
      name: '',
      platform: '',
      amount: 0,
      opNumber: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      depositMethod: 'TRANSFERENCIA',
      cardType: 'DEBITO'
    };
  }
}
