import { Routes } from '@angular/router';
import { Ucc2stlComponent } from './components/ucc2stl/ucc2stl.component';

export const routes: Routes = [
    {
        path: 'ucc2stl',
        component: Ucc2stlComponent,
    },
    { path: '', component: Ucc2stlComponent },
];
