import { Routes } from '@angular/router';

import { Login } from './pages/login/login.component';
import { Main } from './pages/main/main.component';
import { Profile } from './pages/profile/profile.component';
import { GoalsComponent } from './pages/goals/goals.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { ActionsComponent } from './pages/actions/actions.component';


export const routes: Routes = [
    { path: 'login', component: Login },
    { path: 'profile', component: Profile },
    { path: '', component: Main },
    { path: 'goals', component: GoalsComponent },
    { path: 'categories', component: CategoriesComponent },
    { path: 'actions', component: ActionsComponent }
];
