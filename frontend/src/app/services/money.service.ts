import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class MoneyService {
    private api = inject(ApiService);

    getTransactions() {
        return this.api.get<any[]>('money');
    }

    addTransaction(transaction: any) {
        return this.api.post('money', transaction);
    }

    deleteTransaction(id: string) {
        return this.api.delete('money', id);
    }
}
