import { Routes } from '@angular/router';

import { FormComponent } from '../../pages/form/form.component';
import { TablesComponent } from '../../pages/tables/tables.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'tables',         component: TablesComponent },
    { path: 'form',           component: FormComponent }
];
