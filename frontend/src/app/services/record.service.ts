import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class RecordService {
    private api = inject(ApiService);

    getRecords() {
        return this.api.get<any[]>('records');
    }

    addRecord(record: any) {
        return this.api.post('records', record);
    }

    deleteRecord(id: string) {
        return this.api.delete('records', id);
    }
}
