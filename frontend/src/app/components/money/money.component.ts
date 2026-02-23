import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MoneyService } from '../../services/money.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-money',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  template: `
    <div class="money-container">
      <div class="header">
        <h2>Gestión de Dinero</h2>
        <button class="btn-primary" (click)="showForm = !showForm">
          {{ showForm ? 'Cerrar' : '+ Agregar Transacción' }}
        </button>
      </div>

      <div class="stats-grid">
        <div class="card glass income">
          <h3>Ingresos Totales</h3>
          <p class="amount">S/ {{ totalIncome | number:'1.2-2' }}</p>
        </div>
        <div class="card glass expense">
          <h3>Gastos Totales</h3>
          <p class="amount">S/ {{ totalExpense | number:'1.2-2' }}</p>
        </div>
        <div class="card glass balance" [class.positive]="balance >= 0" [class.negative]="balance < 0">
          <h3>Balance</h3>
          <p class="amount">S/ {{ balance | number:'1.2-2' }}</p>
        </div>
        <div class="card glass chart-card">
          <canvas baseChart
            [data]="pieChartData"
            [options]="pieChartOptions"
            type="pie">
          </canvas>
        </div>
      </div>

      <div *ngIf="showForm" class="form-card glass">
        <h3>Nueva Transacción</h3>
        <div class="type-selector">
          <button [class.active-income]="newTx.type === 'INGRESO'" (click)="newTx.type = 'INGRESO'">✅ Ingreso</button>
          <button [class.active-expense]="newTx.type === 'GASTO'" (click)="newTx.type = 'GASTO'">❌ Gasto</button>
        </div>
        <div class="form-grid">
          <input [(ngModel)]="newTx.name" placeholder="Nombre (ej: Inversión, TV)">
          <input [(ngModel)]="newTx.platform" placeholder="Plataforma (ej: Makro, Falabella)">
          <input [(ngModel)]="newTx.amount" type="number" placeholder="Monto (S/)">
          <input [(ngModel)]="newTx.opNumber" placeholder="N° Operación">
          <input [(ngModel)]="newTx.date" type="date">
          <select [(ngModel)]="newTx.depositMethod">
            <option *ngFor="let m of methods" [value]="m">{{ m }}</option>
          </select>
          <select [(ngModel)]="newTx.cardType">
            <option *ngFor="let t of cardTypes" [value]="t">{{ t }}</option>
          </select>
        </div>
        <textarea [(ngModel)]="newTx.description" placeholder="Descripción"></textarea>
        <button class="btn-submit" (click)="onAdd()">Guardar</button>
      </div>

      <div class="table-card glass">
        <div *ngIf="transactions.length === 0" class="empty-state">
          No hay transacciones aún. ¡Agrega una!
        </div>
        <table *ngIf="transactions.length > 0">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Nombre</th>
              <th>Plataforma</th>
              <th>Monto</th>
              <th>Método</th>
              <th>Tarjeta</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let tx of transactions">
              <td><span [class]="'badge ' + tx.type.toLowerCase()">{{ tx.type }}</span></td>
              <td>{{ tx.name }}</td>
              <td>{{ tx.platform }}</td>
              <td [class]="tx.type === 'INGRESO' ? 'income-text' : 'expense-text'">S/ {{ tx.amount | number:'1.2-2' }}</td>
              <td>{{ tx.depositMethod }}</td>
              <td>{{ tx.cardType }}</td>
              <td>{{ tx.date | date:'dd/MM/yy' }}</td>
              <td>
                <button class="btn-delete" (click)="onDelete(tx._id)">🗑</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .money-container { padding: 1rem; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    h2 { font-size: 1.6rem; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2.5rem; }
    .card { padding: 1.5rem; border-radius: 16px; text-align: center; }
    .amount { font-size: 1.8rem; font-weight: bold; margin-top: 0.8rem; }
    .income .amount { color: #10b981; }
    .expense .amount { color: #ef4444; }
    .balance.positive .amount { color: #4facfe; }
    .balance.negative .amount { color: #f97316; }
    .chart-card { min-height: 220px; display: flex; align-items: center; justify-content: center; }
    .form-card { padding: 2rem; margin-bottom: 2rem; border-radius: 12px; }
    .type-selector { display: flex; gap: 1rem; margin-bottom: 1rem; }
    .type-selector button { flex: 1; padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: transparent; color: white; cursor: pointer; transition: all 0.2s; }
    .type-selector button.active-income { background: rgba(16, 185, 129, 0.3); border-color: #10b981; }
    .type-selector button.active-expense { background: rgba(239, 68, 68, 0.3); border-color: #ef4444; }
    .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 1rem; }
    input, select, textarea { padding: 10px; border-radius: 6px; border: 1px solid rgba(255, 255, 255, 0.2); background: rgba(255, 255, 255, 0.05); color: white; width: 100%; box-sizing: border-box; }
    select option { background: #1e293b; }
    textarea { margin-top: 1rem; height: 80px; }
    .btn-submit { background: #10b981; border: none; color: white; padding: 12px 40px; border-radius: 6px; cursor: pointer; margin-top: 1rem; font-size: 1rem; }
    .table-card { border-radius: 12px; overflow: auto; margin-top: 2rem; }
    .empty-state { text-align: center; padding: 3rem; color: #64748b; }
    table { width: 100%; border-collapse: collapse; min-width: 700px; }
    th { text-align: left; padding: 1rem; background: rgba(255, 255, 255, 0.1); color: #94a3b8; font-size: 0.85rem; }
    td { padding: 0.9rem 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); font-size: 0.9rem; }
    .badge { padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold; }
    .badge.ingreso { background: rgba(16, 185, 129, 0.2); color: #10b981; }
    .badge.gasto { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
    .income-text { color: #10b981; font-weight: bold; }
    .expense-text { color: #ef4444; font-weight: bold; }
    .glass { background: rgba(30, 41, 59, 0.5); border: 1px solid rgba(255, 255, 255, 0.1); }
    .btn-primary { background: #4facfe; border: none; color: white; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 0.95rem; }
    .btn-delete { background: none; border: none; cursor: pointer; font-size: 1.1rem; transition: transform 0.2s; }
    .btn-delete:hover { transform: scale(1.3); }
  `]
})
export class MoneyComponent {
  transactions: any[] = [];
  showForm = false;
  totalIncome = 0;
  totalExpense = 0;
  balance = 0;

  methods = ['TRANSFERENCIA', 'YAPE', 'PLIN', 'LIGO', 'INTERBANK', 'BCP', 'CAJA AREQUIPA', 'PREXPE', 'BANCO FALLABELA', 'TAKENOS', 'GLOBAL 66'];
  cardTypes = ['PREPAGO', 'CREDITO', 'DEBITO'];

  newTx = this.emptyTx();

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'bottom', labels: { color: '#f1f5f9' } },
    }
  };
  public pieChartData: ChartConfiguration['data'] = {
    labels: ['Ingresos', 'Gastos'],
    datasets: [{
      data: [0, 0],
      backgroundColor: ['#10b981', '#ef4444'],
      hoverBackgroundColor: ['#059669', '#dc2626'],
      borderWidth: 0
    }]
  };

  private moneyService = inject(MoneyService);

  constructor() {
    this.loadTransactions();
  }

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
    // Mutate data so ng2-charts detects the change
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
    if (confirm('¿Eliminar esta transacción?')) {
      this.moneyService.deleteTransaction(id).subscribe(() => this.loadTransactions());
    }
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
