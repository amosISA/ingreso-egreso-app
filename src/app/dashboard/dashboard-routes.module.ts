import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../services/auth.guard';
import { dashboardRoutes } from './dasboard.routes';
import { DashboardComponent } from './dashboard.component';

const rutasHijas: Routes = [
  { 
    path: '',
    component: DashboardComponent,
    children: dashboardRoutes,
    // canActivate: [ AuthGuard ]
  },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(rutasHijas)
  ],
  exports: [
    RouterModule
  ]
})
export class DashboardRoutesModule { }
