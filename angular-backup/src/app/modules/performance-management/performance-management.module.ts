import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { performanceManagementComponent } from './performance-management-component';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeGoalSettingComponent } from 'src/app/components/performance-management/employee-goal-setting/employee-goal-setting.component';
import { KpaCreationHrComponent } from 'src/app/components/performance-management/kpa-creation-hr/kpa-creation-hr.component';
import { AppraisalCycleCreationComponent } from 'src/app/components/performance-management/appraisal-cycle-creation/appraisal-cycle-creation.component';
import { EmployeeAppraisalComponent } from 'src/app/components/performance-management/employee-appraisal/employee-appraisal.component';
import { ManagerReviewMenuComponent } from 'src/app/components/performance-management/manager-review-menu/manager-review-menu.component';
import { DepartmentHeadReviewComponent } from 'src/app/components/performance-management/department-head-review/department-head-review.component';
import { ManagerViewEmpGoalSettingComponent } from 'src/app/components/performance-management/manager-view-emp-goal-setting/manager-view-emp-goal-setting.component';
import { HrTeamAppraisalStatusComponent } from 'src/app/components/performance-management/hr-team-appraisal-status/hr-team-appraisal-status.component';
import { ManagerReviewScreenComponent } from 'src/app/components/performance-management/manager-review-screen/manager-review-screen.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ManagerGoalsReviewComponent } from 'src/app/components/performance-management/manager-goals-review/manager-goals-review.component';
import { PromotionsComponent } from 'src/app/components/performance-management/promotions/promotions.component';
import { TerminationComponent } from 'src/app/components/performance-management/termination/termination.component';
import { IncentivesComponent } from 'src/app/components/performance-management/incentives/incentives.component';
import { IncentivesReportComponent } from 'src/app/components/performance-management/incentives-report/incentives-report.component';
import { InvoicesReportComponent } from 'src/app/components/performance-management/invoices-report/invoices-report.component';
import { EmployeeRelieveComponent } from 'src/app/components/performance-management/employee-relieve/employee-relieve.component';
import { EmployeeRejoinComponent } from 'src/app/components/performance-management/employee-rejoin/employee-rejoin.component';


const routes:Routes=[
  {path:'',component:performanceManagementComponent,children:[
  {path: 'emp-goal-settings', component : EmployeeGoalSettingComponent},
  {path: 'kpa-creation', component : KpaCreationHrComponent},
  {path: 'appraisal-cycle', component : AppraisalCycleCreationComponent},
  {path: 'manager-golas-review', component : ManagerGoalsReviewComponent},
  {path: 'manager-review-screen', component : ManagerReviewScreenComponent},
  {path: 'manager-review-menu', component :ManagerReviewMenuComponent },
  {path: 'emp-appraisal', component : EmployeeAppraisalComponent},
  {path: 'department-head-review', component : DepartmentHeadReviewComponent},
  {path: 'manager-vew-emp-goal', component : ManagerViewEmpGoalSettingComponent},
  {path: 'hr-team-appraisal-status', component : HrTeamAppraisalStatusComponent},
  {path: 'promotions', component : PromotionsComponent},
  {path: 'termination', component : TerminationComponent},
  {path: 'incentives', component : IncentivesComponent},
  {path: 'incentives-report', component : IncentivesReportComponent},
  {path: 'invoices-report', component : InvoicesReportComponent},
  {path: 'relieve', component : EmployeeRelieveComponent},
  {path: 'rejoin', component : EmployeeRejoinComponent},


  


  ]} 
  ]
@NgModule({
  declarations: [
    performanceManagementComponent,
    EmployeeGoalSettingComponent,
    KpaCreationHrComponent,
    AppraisalCycleCreationComponent,
    ManagerReviewScreenComponent,
    EmployeeAppraisalComponent,
    ManagerReviewMenuComponent,
    DepartmentHeadReviewComponent,
    ManagerViewEmpGoalSettingComponent,
    HrTeamAppraisalStatusComponent,
    ManagerGoalsReviewComponent,
    PromotionsComponent,
    TerminationComponent,
    IncentivesComponent,
    IncentivesReportComponent,
    InvoicesReportComponent,
    EmployeeRelieveComponent,
    EmployeeRejoinComponent,


    
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    FormsModule,
    RouterModule.forChild(routes), 
    NgMultiSelectDropDownModule.forRoot(),
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger', // set defaults here
    }),
    NgxPaginationModule

  ],
  providers:[DatePipe]
})
export class PerformanceManagementModule { }
