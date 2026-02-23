import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { RecordsComponent } from './components/records/records.component';
import { MoneyComponent } from './components/money/money.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {
        path: '',
        component: LayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: 'registros', component: RecordsComponent },
            { path: 'dinero', component: MoneyComponent },
            { path: '', redirectTo: 'registros', pathMatch: 'full' }
        ]
    },
    { path: '**', redirectTo: 'login' }
];
