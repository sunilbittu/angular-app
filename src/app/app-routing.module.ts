import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SidenavbarComponent } from './components/sidenavbar/sidenavbar.component';
import { LoginComponent } from './components/login/login.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { MainnavbarComponent } from './components/mainnavbar/mainnavbar.component';
import { RegisterOrgComponent } from './components/register-org/register-org.component'
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EmployeeComponent } from './components/employee/employee.component';
import { SelectCompanyComponent } from './components/company/select-company/select-company.component';
import { EditCompanyComponent } from './components/company/edit-company/edit-company.component';
import { TANDetailsComponent } from './components/company/tandetails/tandetails.component';
import { BankDetailsComponent } from './components/company/bank-details/bank-details.component';
import { SelectMonthComponent } from './components/select-month/select-month.component';
import { EmployeeSalaryStructureComponent } from './components/master/employee-salary-structure/employee-salary-structure.component';
import { DepartmentMasterComponent } from './components/master/department-master/department-master.component';
import { EmployeeMasterComponent } from './components/master/employee-master/employee-master.component';
import { DesignationMasterComponent } from './components/master/designation-master/designation-master.component';
import { GradeMasterComponent } from './components/master/grade-master/grade-master.component';
import { FundsRealizedComponent } from './components/master/funds-realized/funds-realized.component';
import { InvestmentsComponent } from './components/incometax/investments/investments.component';
import { InvestmentReportComponent } from './components/incometax/investment-report/investment-report.component';
import { TdsProjectionComponent } from './components/incometax/tds-projection/tds-projection.component';
import { MonthlyVariablesComponent } from './components/monthly-process/monthly-variables/monthly-variables.component';
import { ProcessSalaryComponent } from './components/monthly-process/process-salary/process-salary.component';
import { ViewSalaryComponent } from './components/monthly-process/view-salary/view-salary.component';
import { LoanAdvanceComponent } from './components/monthly-process/loan-advance/loan-advance.component';
import { FfSettelmentComponent } from './components/monthly-process/ff-settelment/ff-settelment.component';
import { PromotionTransferComponent } from './components/monthly-process/promotion-transfer/promotion-transfer.component';
import { EmployeeIncrementComponent } from './components/monthly-process/employee-increment/employee-increment.component';
import { ArearPaymentsComponent } from './components/monthly-process/arear-payments/arear-payments.component';
import { GlStatementComponent } from './components/monthly-process/gl-statement/gl-statement.component';
import { DisbursementPayymentComponent } from './components/monthly-process/disbursement-payyment/disbursement-payyment.component';
import { ChallanDepositeComponent } from './components/incometax/challan-deposite/challan-deposite.component';
import { TDSQuaterlyReturnComponent } from './components/incometax/tdsquaterly-return/tdsquaterly-return.component';
import { Form16Component } from './components/incometax/form16/form16.component';
import { TDSYearComponent } from './components/incometax/tdsyear/tdsyear.component';

import { SalaryComponentMasterComponent } from './components/utilities/salary-component-master/salary-component-master.component';
import { LeaveTypeComponent } from './components/utilities/leave-type/leave-type.component';
import { EmailSettingsComponent } from './components/utilities/email-settings/email-settings.component';
import { LockUnlockMonthComponent } from './components/utilities/lock-unlock-month/lock-unlock-month.component';
import { ImportFromExcelComponent } from './components/utilities/import-from-excel/import-from-excel.component';
import { EssRoleAssignComponent } from './components/utilities/ess-role-assign/ess-role-assign.component';
import { EssUserRightsComponent } from './components/utilities/ess-user-rights/ess-user-rights.component';
import { ImportProcessedSalaryComponent } from './components/utilities/import-processed-salary/import-processed-salary.component';
import { VerifyDatabaseComponent } from './components/utilities/verify-database/verify-database.component';
import { ImportReimbursmentBillComponent } from './components/utilities/import-reimbursment-bill/import-reimbursment-bill.component';






import { BranchMasterComponent } from './components/master/branch-master/branch-master.component';
import { DivisionMasterComponent } from './components/master/division-master/division-master.component';
import { CostCenterComponent } from './components/master/cost-center/cost-center.component';
import { ProjectMasterComponent } from './components/master/project-master/project-master.component';
import { CategoryMasterComponent } from './components/master/category-master/category-master.component';
import { BankMasterComponent } from './components/master/bank-master/bank-master.component';
import { SlabMasterComponent } from './components/master/slab-master/slab-master.component';
import { DocumentMasterComponent } from './components/master/document-master/document-master.component';
import { AssignReportingHeadComponent } from './components/master/assign-reporting-head/assign-reporting-head.component';
import { ReportingHeadReportComponent } from './components/master/reporting-head-report/reporting-head-report.component';
import { EmployeeMasterReportComponent } from './components/master/employee-master-report/employee-master-report.component';
import { ReminderComponent } from './components/master/reminder/reminder.component';
import { AssetComponent } from './components/master/asset/asset.component';
import { LetterTemplateComponent } from './components/master/letter-template/letter-template.component';
import { AssignLetterComponent } from './components/master/assign-letter/assign-letter.component';
import { OrganizationChartComponent } from './components/master/organization-chart/organization-chart.component';
import { LeaveMasterComponent } from './components/leave-attendance/leave-master/leave-master.component';
import { LeaveMasterIndivisualComponent } from './components/leave-attendance/leave-master-indivisual/leave-master-indivisual.component';
import { TimeInOutComponent } from './components/time-shift/time-in-out/time-in-out.component';
import { TimeShiftReportComponent } from './components/time-shift/time-shift-report/time-shift-report.component';
// import { ShiftMasterComponent } from './components/time-shift/shift-master/shift-master.component';
import { ShiftAssignedComponent } from './components/time-shift/shift-assigned/shift-assigned.component';
import { DailyLogImportComponent } from './components/time-shift/daily-log-import/daily-log-import.component';
import { LogHistoryComponent } from './components/time-shift/log-history/log-history.component';
import { ProcessAttendanceComponent } from './components/time-shift/process-attendance/process-attendance.component';
import { AttendanceMonthlyComponent } from './components/leave-attendance/attendance-monthly/attendance-monthly.component';
import { DailyAttendanceComponent } from './components/leave-attendance/daily-attendance/daily-attendance.component';
import { ProcessLeaveBalanceComponent } from './components/leave-attendance/process-leave-balance/process-leave-balance.component';
import { MonthlyClosingBalanceComponent } from './components/leave-attendance/monthly-closing-balance/monthly-closing-balance.component';
import { ReportsComponent } from './components/leave-attendance/reports/reports.component';
import { CreateLeaveYearComponent } from './components/leave-attendance/create-leave-year/create-leave-year.component';
import { HolidaysComponent } from './components/leave-attendance/holidays/holidays.component';
import { LeaveApplyReportComponent } from './components/leave-attendance/leave-apply-report/leave-apply-report.component';
import { VisitApplicationReportComponent } from './components/leave-attendance/visit-application-report/visit-application-report.component';
import { PreloadAllModules } from '@angular/router';

const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},  
    {path: 'login', component : LoginComponent},

    {path: 'homepage' , component : HomepageComponent},
    { path: '', loadChildren: () => import('./modules/main-module/main-module.module').then(m => m.MainModuleModule) },
  
    {path: 'select-company', component : SelectCompanyComponent},
    // {path: 'mainnavbar', component : MainnavbarComponent},
  //   {path: 'dashboard', component : DashboardComponent,children:[
  //   {path: 'employee', component : EmployeeComponent},
  //   {path: 'edit-company', component : EditCompanyComponent},
  //   {path: 'select-month', component : SelectMonthComponent},

  //  //Master
  //  {path: 'emp-sal-structure', component : EmployeeSalaryStructureComponent},
  //  {path: 'department-master', component : DepartmentMasterComponent},
  //  {path: 'employee-master', component : EmployeeMasterComponent},
  //  {path: 'branch-master', component : BranchMasterComponent},
  //  {path: 'designation-master', component : DesignationMasterComponent},
  //  {path: 'division-master', component : DivisionMasterComponent},
  //  {path: 'grade-master', component : GradeMasterComponent},
  //  {path: 'cost-center', component :    CostCenterComponent},
  //  {path: 'project-master', component :    ProjectMasterComponent},
  //  {path: 'category-master', component :    CategoryMasterComponent},
  //  {path: 'bank-master', component :    BankMasterComponent},
  //  {path: 'slab-master', component :    SlabMasterComponent},
  //  {path: 'document-master', component :    DocumentMasterComponent},
  //  {path: 'assign-reporting-head', component :    AssignReportingHeadComponent},
  //  {path: 'reporting-head-report', component :    ReportingHeadReportComponent},
  //  {path: 'employee-master-report', component :    EmployeeMasterReportComponent},
  //  {path: 'reminder', component :    ReminderComponent},
  //  {path: 'asset', component :    AssetComponent},
  //  {path: 'letter-template', component :    LetterTemplateComponent},
  //  {path: 'assign-letter', component :    AssignLetterComponent},
  //  {path: 'organization-chart', component :    OrganizationChartComponent},

  //  //leave attendance
  //  {path: 'leave-master', component :    LeaveMasterComponent},
  //  {path: 'leave-master-indivisual', component :    LeaveMasterIndivisualComponent},
  //  {path: 'attendance-monthly', component :    AttendanceMonthlyComponent},
  //  {path: 'daily-attendance', component :    DailyAttendanceComponent},
  //  {path: 'process-leave-balance', component :    ProcessLeaveBalanceComponent},
  //  {path: 'monthly-closing-balance', component :    MonthlyClosingBalanceComponent},
  //  {path: 'reports', component :    ReportsComponent},
  //  {path: 'create-leave-year', component :    CreateLeaveYearComponent},
  //  {path: 'holidays', component :    HolidaysComponent},
  //  {path: 'leave-apply-report', component :    LeaveApplyReportComponent},
  //  {path: 'visit-application-report', component :    VisitApplicationReportComponent},

  //  //time shift
  //  {path: 'time-in-out', component :    TimeInOutComponent},
  //  {path: 'time-shift-report', component :    TimeShiftReportComponent},
  //  {path: 'shift-master', component :    ShiftMasterComponent},
  //  {path: 'shift-assigned', component :    ShiftAssignedComponent},
  //  {path: 'daily-log-import', component :    DailyLogImportComponent},
  //  {path: 'log-history', component :    LogHistoryComponent},
  //  {path: 'process-attendance', component :    ProcessAttendanceComponent},
  
  //  // monthly process

  //  {path: 'select-month', component : SelectMonthComponent},
  // {path: 'monthly-variables', component : MonthlyVariablesComponent},
  // {path: 'process-salary', component : ProcessSalaryComponent},
  // {path: 'view-salary', component : ViewSalaryComponent},
  // {path: 'loan-advance', component : LoanAdvanceComponent},
  // {path: 'ff-settelment', component : FfSettelmentComponent},
  // {path: 'promotion-transfer', component : PromotionTransferComponent},
  // {path: 'employee-increment', component : EmployeeIncrementComponent},
  // {path: 'arear-payments', component : ArearPaymentsComponent},
  // {path: 'gl-statement', component : GlStatementComponent},
  // {path: 'disbursement-payyment', component : DisbursementPayymentComponent},
  // {path: 'reminder', component : ReminderComponent},

  // //additional payments

  // {path: 'supplementary-payment', component : SupplementaryPaymentComponent},
  // {path: 'bonus-calculation', component : BonusCalculationComponent},
  // {path: 'gratuity-calculation', component : GratuityCalculationComponent},
  // {path: 'reimbursement-year', component : ReimbursementYearComponent},
  // {path: 'reimbursement-opening', component : ReimbursementOpeningComponent},
  // {path: 'reimbursement-billpayment', component : ReimbursementBillpaymentComponent},
  // {path: 'reimbursement-reports', component : ReimbursementReportsComponent},
  // {path: 'leave-encashment', component : LeaveEncashmentComponent},

  // // Monthly Reports

  // {path: 'payslip', component : PayslipComponent},
  // {path: 'email-payslip', component : EmailPayslipComponent},
  // {path: 'salary-sheet', component : SalarySheetComponent},
  // {path: 'salary-sheetvertical', component : SalarySheetverticalComponent},
  // {path: 'salary-summary', component : SalarySummaryComponent},
  // {path: 'bank-statement', component : BankStatementComponent},
  // {path: 'ctc-report', component : CtcReportComponent},
  // {path: 'pf-report', component : PfReportComponent},
  // {path: 'esic-reports', component : EsicReportsComponent},
  // {path: 'professional-tax', component : ProfessionalTaxComponent},
  // {path: 'salary-onhold', component : SalaryOnholdComponent},
  // {path: 'loan/advance', component : AdvanceComponent},
  // {path: 'tds-deducted', component : TdsDeductedComponent},
  // {path: 'yearly-salaryregister', component : YearlySalaryregisterComponent},
  // {path: 'other-reports', component : OtherReportsComponent},
  // {path: 'salary-reconciliation', component : SaleryReconciliationComponent},





  // ]},
  
   {path: 'registerOrg', component : RegisterOrgComponent},
  

  // {path: 'registerOrg', component : EmployeeSalaryStructureComponent},
  // {path: 'department-master', component : DepartmentMasterComponent},

  
 

];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    {
      preloadingStrategy: PreloadAllModules
    }
    )],
  exports: [RouterModule] 
})
export class AppRoutingModule { }
export const RoutingConstant=[
  LoginComponent,
  SelectCompanyComponent
]