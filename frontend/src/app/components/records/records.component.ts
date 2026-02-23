import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecordService } from '../../services/record.service';

@Component({
    selector: 'app-records',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="records-container">
      <div class="header">
        <h2>Listado de Registros</h2>
        <button class="btn-primary" (click)="showForm = !showForm">
          {{ showForm ? 'Cerrar' : '+ Agregar Nuevo' }}
        </button>
      </div>

      <div *ngIf="showForm" class="form-card glass">
        <h3>Agregar Registro</h3>
        <div class="form-grid">
          <input [(ngModel)]="newRecord.userOrEmail" placeholder="Usuario o Correo">
          <input [(ngModel)]="newRecord.password" type="password" placeholder="Contraseña">
          <input [(ngModel)]="newRecord.platform" placeholder="Plataforma">
          <input [(ngModel)]="newRecord.url" placeholder="URL de la página">
        </div>
        <button class="btn-submit" (click)="onAdd()">Guardar</button>
      </div>

      <div class="table-card glass">
        <table>
          <thead>
            <tr>
              <th>Usuario/Correo</th>
              <th>Contraseña</th>
              <th>Plataforma</th>
              <th>URL</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let record of records">
              <td>{{ record.userOrEmail }}</td>
              <td>●●●●●●</td>
              <td>{{ record.platform }}</td>
              <td><a [href]="record.url" target="_blank">{{ record.url }}</a></td>
              <td>
                <button class="btn-delete" (click)="onDelete(record._id)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
    styles: [`
    .records-container { padding: 1rem; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .form-card { padding: 1.5rem; margin-bottom: 2rem; border-radius: 12px; }
    .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1rem; }
    input { padding: 10px; border-radius: 6px; border: 1px solid rgba(255, 255, 255, 0.2); background: rgba(255, 255, 255, 0.05); color: white; }
    .table-card { border-radius: 12px; overflow: hidden; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 1rem; background: rgba(255, 255, 255, 0.1); color: #94a3b8; }
    td { padding: 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
    .btn-primary { background: #4facfe; border: none; color: white; padding: 10px 20px; border-radius: 6px; cursor: pointer; }
    .btn-submit { background: #10b981; border: none; color: white; padding: 10px 30px; border-radius: 6px; cursor: pointer; }
    .btn-delete { background: #ef4444; border: none; color: white; padding: 6px 12px; border-radius: 4px; cursor: pointer; }
    a { color: #4facfe; text-decoration: none; }
    .glass { background: rgba(30, 41, 59, 0.5); border: 1px solid rgba(255, 255, 255, 0.1); }
  `]
})
export class RecordsComponent implements OnInit {
    records: any[] = [];
    showForm = false;
    newRecord = { userOrEmail: '', password: '', platform: '', url: '' };

    private recordService = inject(RecordService);

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
        if (confirm('¿Eliminar este registro?')) {
            this.recordService.deleteRecord(id).subscribe(() => this.loadRecords());
        }
    }
}
