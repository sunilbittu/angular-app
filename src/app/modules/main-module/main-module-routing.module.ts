import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from 'src/app/components/dashboard/dashboard.component';
import { AtsDashboardComponent } from 'src/app/components/application-tracking-system/ats-dashboard/ats-dashboard.component';
import { EmployeeOnBoardingModule } from '../employee-on-boarding/employee-on-boarding.module';
import { MainModuleComponent } from './main-module.component';
const routes: Routes = [{ path: 'HRMS', component: MainModuleComponent ,children:[
  { path : 'dashboard' , component : DashboardComponent },
  { path : 'ats-dashboard' , component : AtsDashboardComponent },
  { path: 'Company', loadChildren: () => import('../company/company.module').then(m => m.CompanyModule) },
  { path: 'Master', loadChildren: () => import('../masters/masters.module').then(m => m.MastersModule) },
  { path: 'Leave-attendance', loadChildren: () => import('../leave-attendance/leave-attendance.module').then(m => m.LeaveAttendanceModule) },
  { path: 'Time-shifts', loadChildren: () => import('../time-shifts/time-shifts.module').then(m => m.TimeShiftsModule) },
  { path: 'Monthly-process', loadChildren: () => import('../monthly-process/monthly-process.module').then(m => m.MonthlyProcessModule) },
  { path: 'Additional-payments', loadChildren: () => import('../additional-payments/additional-payments.module').then(m => m.AdditionalPaymentsModule) },
  { path: 'Monthly-reports', loadChildren: () => import('../monthly-reports/monthly-reports.module').then(m => m.MonthlyReportsModule) },
  { path: 'Income-tax', loadChildren: () => import('../income-tax/income-tax.module').then(m => m.IncomeTaxModule) },
  { path: 'Utilities', loadChildren: () => import('../utilities/utilities.module').then(m => m.UtilitiesModule) },
  { path: 'Admin', loadChildren: () => import('../admin/admin.module').then(m => m.AdminModule) },
  { path: 'Configuration', loadChildren: () => import('../configuration/configuration.module').then(m => m.ConfigurationModule) },
  { path: 'Employee-Onboarding', loadChildren: () => import('../employee-on-boarding/employee-on-boarding.module').then(m => m.EmployeeOnBoardingModule) },
  { path: 'Expenses', loadChildren: () => import('../expenses/expenses.module').then(m => m.ExpensesModule) },
  { path: 'Loan-and-Advance', loadChildren: () => import('../loan-and-advance/loan-and-advance.module').then(m => m.LoanAndAdvanceModule) },
  { path: 'performance-management', loadChildren: () => import('../performance-management/performance-management.module').then(m => m.PerformanceManagementModule) },
  { path: 'Asset-Mangement', loadChildren: () => import('../asset-management/asset-management.module').then(m => m.AssetManagementModule) },
  { path: 'Training', loadChildren: () => import('../training/training.module').then(m => m.TrainingModule) },
  { path: 'Helpdesk', loadChildren: () => import('../helpdesk/helpdesk.module').then(m => m.HelpdeskModule) },
  { path: 'Rewards-recognization', loadChildren: () => import('../rewards-recognization/rewards-recognization.module').then(m => m.RewardsRecognizationModule) },
  { path: 'ATS', loadChildren: () => import('../application-tracking-system/application-tracking-system.module').then(m => m.ApplicationTrackingSystemModule) }
]}
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainModuleRoutingModule { }
export const RoutingConstant=[
  MainModuleComponent,
  DashboardComponent,
  AtsDashboardComponent
]
