import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import {RouterModule , Routes} from '@angular/router';
import { monthlyReportsComponent } from './monthly-reports.components';
import { PayslipComponent } from 'src/app/components/monthly-reports/payslip/payslip.component';
import { DeletePayslipComponent } from 'src/app/components/monthly-reports/delete-payslip/payslip.component';
import { PayslipAllowComponent } from 'src/app/components/monthly-reports/payslip-allow/payslip-allow.component';
import { EmailPayslipComponent } from 'src/app/components/monthly-reports/email-payslip/email-payslip.component';
import { SalarySheetComponent } from 'src/app/components/monthly-reports/salary-sheet/salary-sheet.component';
import { SalarySheetverticalComponent } from 'src/app/components/monthly-reports/salary-sheetvertical/salary-sheetvertical.component';
import { SalarySummaryComponent } from 'src/app/components/monthly-reports/salary-summary/salary-summary.component';
import { BankStatementComponent } from 'src/app/components/monthly-reports/bank-statement/bank-statement.component';
import { CtcReportComponent } from 'src/app/components/monthly-reports/ctc-report/ctc-report.component';
import { PfReportComponent } from 'src/app/components/monthly-reports/pf-report/pf-report.component';
import { EsicReportsComponent } from 'src/app/components/monthly-reports/esic-reports/esic-reports.component';
import { ProfessionalTaxComponent } from 'src/app/components/monthly-reports/professional-tax/professional-tax.component';
import { SalaryOnholdComponent } from 'src/app/components/monthly-reports/salary-onhold/salary-onhold.component';
import { AdvanceComponent } from 'src/app/components/monthly-reports/loan/advance/advance.component';
import { TdsDeductedComponent } from 'src/app/components/monthly-reports/tds-deducted/tds-deducted.component';
import { YearlySalaryregisterComponent } from 'src/app/components/monthly-reports/yearly-salaryregister/yearly-salaryregister.component';
import { OtherReportsComponent } from 'src/app/components/monthly-reports/other-reports/other-reports.component';
import { SaleryReconciliationComponent } from 'src/app/components/monthly-reports/salary-reconciliation/salery-reconciliation.component';
import { LeaveApplyReportComponent } from 'src/app/components/leave-attendance/leave-apply-report/leave-apply-report.component';
import { VisitApplicationReportComponent } from 'src/app/components/leave-attendance/visit-application-report/visit-application-report.component';
import { EmployeeModelPopupComponent } from 'src/app/components/master/employee-model-popup/employee-model-popup.component';
import { CommonEmployeeFilterComponent } from 'src/app/components/common-filter/common-employee-filter/common-employee-filter.component';
import { PaginationRootComponent } from 'src/app/components/pagination-root/pagination-root.component';
import { EmployeeMasterReportsComponent } from 'src/app/components/monthly-reports/employee-master-reports/employee-master-reports.component';
import { ReportingHeadReportsComponent } from 'src/app/components/monthly-reports/reporting-head-reports/reporting-head-reports.component';
import { AttendanceReportsComponent } from 'src/app/components/monthly-reports/attendance-reports/attendance-reports.component';
import { LeavesReportsComponent } from 'src/app/components/monthly-reports/leaves-reports/leaves-reports.component';
import { HolidaysReportsComponent } from 'src/app/components/monthly-reports/holidays-reports/holidays-reports.component';
import { EmployeeOnboardingReportsComponent } from 'src/app/components/monthly-reports/employee-onboarding-reports/employee-onboarding-reports.component';
import { PayrollReportsComponent } from 'src/app/components/monthly-reports/payroll-reports/payroll-reports.component';
import { PerformanceReportsComponent } from 'src/app/components/monthly-reports/performance-reports/performance-reports.component';
import { LeaveAttendanceReportsComponent } from 'src/app/components/monthly-reports/leave-attendance-reports/leave-attendance-reports.component';
import { TaxReportsComponent } from 'src/app/components/monthly-reports/tax-reports/tax-reports.component';
import { OrganizationHierarchyReportsComponent } from 'src/app/components/monthly-reports/organization-hierarchy-reports/organization-hierarchy-reports.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'; 
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BranchViewComponent } from 'src/app/components/monthly-reports/employee-master-reports/branch-view/branch-view.component';
import { ViewDepartmentComponent } from 'src/app/components/monthly-reports/employee-master-reports/view-department/view-department.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ViewGradeComponent } from 'src/app/components/monthly-reports/employee-master-reports/view-grade/view-grade.component';
import { ViewProjectComponent } from 'src/app/components/monthly-reports/employee-master-reports/view-project/view-project.component';
import { ViewCostcenterComponent } from 'src/app/components/monthly-reports/employee-master-reports/view-costcenter/view-costcenter.component';
import { EmployeeEducationWiseReportComponent } from 'src/app/components/monthly-reports/employee-education-wise-report/employee-education-wise-report.component';
import { EmployeeEducationSummaryReportComponent } from 'src/app/components/monthly-reports/employee-education-wise-report/employee-education-summary-report/employee-education-summary-report.component';
import { CategoryViewComponent } from 'src/app/components/monthly-reports/employee-master-reports/category-view/category-view.component';
import { EmployeeEducationDetailsComponent } from 'src/app/components/monthly-reports/employee-education-wise-report/employee-education-details/employee-education-details.component';
import { EmployeeSkillbasedReportComponent } from 'src/app/components/monthly-reports/employee-skillbased-report/employee-skillbased-report.component';
import { EmployeeBirthdayReportComponent } from 'src/app/components/monthly-reports/employee-master-reports/employee-birthday-report/employee-birthday-report.component';
import { EmployeeAnniversaryReportComponent } from 'src/app/components/monthly-reports/employee-master-reports/employee-anniversary-report/employee-anniversary-report.component';
import { DeptWiseGoalReportComponent } from 'src/app/components/monthly-reports/dept-wise-goal-report/dept-wise-goal-report.component';
import { EmpWiseGoalReportComponent } from 'src/app/components/monthly-reports/emp-wise-goal-report/emp-wise-goal-report.component';
import { TimeSheetComponent } from 'src/app/components/monthly-reports/time-sheet/time-sheet.component';
import { AtsJobsComponent } from 'src/app/components/monthly-reports/ats-jobs/ats-jobs.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { ShiftReportViewComponent } from 'src/app/components/monthly-reports/employee-master-reports/shift-view/shift-report-view/shift-report-view.component';
import { EmployeeVacinationReportComponent } from 'src/app/components/monthly-reports/employee-vacination-report/employee-vacination-report.component';
import { EmployeeTenureReportsComponent } from 'src/app/components/monthly-reports/employee-tenure-reports/employee-tenure-reports.component';
import { EmployeeLeaderboardReportsComponent } from 'src/app/components/monthly-reports/employee-leaderboard-reports/employee-leaderboard-reports.component';
import { TerminatedEmployeeComponent } from 'src/app/components/monthly-reports/terminated-employee/terminated-employee.component';
import { ExpenseReportComponent } from 'src/app/components/monthly-reports/expense-report/expense-report.component';
import { EmployeeLLoanAdvancesReportsComponent } from 'src/app/components/monthly-reports/employee-l-loan-advances-reports/employee-l-loan-advances-reports.component';
import { AssetCategoriesReportComponent } from 'src/app/components/monthly-reports/asset-categories-report/asset-categories-report.component';
import { AssetStatusReportComponent } from 'src/app/components/monthly-reports/asset-status-report/asset-status-report.component';
import { VendorAssetReportComponent } from 'src/app/components/monthly-reports/vendor-asset-report/vendor-asset-report.component';
import { EmployeeResignationReportComponent } from 'src/app/components/monthly-reports/employee-resignation-report/employee-resignation-report.component';
import { TrainersReportsComponent } from 'src/app/components/monthly-reports/trainers-reports/trainers-reports.component';
import { TrainingReportComponent } from 'src/app/components/monthly-reports/training-report/training-report.component';
import { TrainingExamResultsReportComponent } from 'src/app/components/monthly-reports/training-exam-results-report/training-exam-results-report.component';
import { HelpdeskReportComponent } from 'src/app/components/monthly-reports/helpdesk-report/helpdesk-report.component';
import { RewardRecognizationFilterReportComponent } from 'src/app/components/monthly-reports/reward-recognization-filter-report/reward-recognization-filter-report.component';
import { RewardsRecognitionReportComponent } from 'src/app/components/monthly-reports/rewards-recognition-report/rewards-recognition-report.component';
import { PayslipComponentReportComponent } from 'src/app/components/monthly-reports/payslip-component-report/payslip-component-report.component';
import { PayslipComponentMtdReportComponent } from 'src/app/components/monthly-reports/payslip-component-mtd-report/payslip-component-mtd-report.component';
import { PayslipComponentEpfReportComponent } from 'src/app/components/monthly-reports/payslip-component-epf-report/payslip-component-epf-report.component';
import { PayslipComponentSocsoReportComponent } from 'src/app/components/monthly-reports/payslip-component-socso-report/payslip-component-socso-report.component';
import { ArrearsPaymentReportComponent } from 'src/app/components/monthly-reports/arrears-payment-report/arrears-payment-report.component';
import { SalaryIncrementReportComponent } from 'src/app/components/monthly-reports/salary-increment-report/salary-increment-report.component';
import { ClientReportsComponent } from 'src/app/components/monthly-reports/client-reports/client-reports.component';
import { AtsCandidateReportComponent } from 'src/app/components/monthly-reports/ats-candidate-report/ats-candidate-report.component';

import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { SortableTableDirective } from 'src/app/components/application-tracking-system/sortable-table.directive';
import { SortableColumnComponent } from 'src/app/components/application-tracking-system/sortable-column/sortable-column.component';
import { AtsDropedCandidateReportComponent } from 'src/app/components/monthly-reports/ats-droped-candidate-report/ats-droped-candidate-report.component';
import { CandidateInfoDbReportComponent } from 'src/app/components/monthly-reports/candidate-info-db-report/candidate-info-db-report.component';

FullCalendarModule.registerPlugins([ 
  interactionPlugin,
  dayGridPlugin
]);


const routes:Routes=[
  {path:'',component:monthlyReportsComponent,children:[
    // {path: 'edit-company', component : EditCompanyComponent},

  {path: 'payslip', component : PayslipComponent},
  {path: 'payslip-delete', component : DeletePayslipComponent},
  {path: 'payslip-allow', component : PayslipAllowComponent},
  // {path: 'email-payslip', component : EmailPayslipComponent},
  // {path: 'salary-sheet', component : SalarySheetComponent},
  // {path: 'salary-sheetvertical', component : SalarySheetverticalComponent},
  // {path: 'salary-summary', component : SalarySummaryComponent},
  // {path: 'bank-statement', component : BankStatementComponent},
  // {path: 'pf-report', component : PfReportComponent},
  // {path: 'esic-reports', component : EsicReportsComponent},
  // {path: 'professional-tax', component : ProfessionalTaxComponent},
  // {path: 'salary-onhold', component : SalaryOnholdComponent},
  // {path: 'loan/advance', component : AdvanceComponent},
  // {path: 'tds-deducted', component : TdsDeductedComponent},
  // {path: 'yearly-salaryregister', component : YearlySalaryregisterComponent},
  // {path: 'other-reports', component : OtherReportsComponent},
  // {path: 'salary-reconciliation', component : SaleryReconciliationComponent},
  {path: 'ctc-report', component : CtcReportComponent},

  {path: 'leave-apply-reports', component : LeaveApplyReportComponent},
  {path: 'visit-application-reports', component : VisitApplicationReportComponent},
  {path: 'employee-master-reports', component : EmployeeMasterReportsComponent},
  {path: 'reporting-head-reports', component : ReportingHeadReportsComponent},
  {path: 'attendance-reports', component : AttendanceReportsComponent},
  {path: 'holiday-reports', component : HolidaysReportsComponent},
  {path: 'employee-onboarding-reports', component : EmployeeOnboardingReportsComponent},
  {path: 'payroll-reports', component : PayrollReportsComponent},
  {path: 'performance-reports', component : EmployeeTenureReportsComponent},
  {path: 'performance-leaderboard-reports', component : EmployeeLeaderboardReportsComponent},
  {path: 'leave-attendance-reports', component : LeaveAttendanceReportsComponent},
  {path: 'tax-reports', component : TaxReportsComponent},
  {path: 'Organization-Hierarchy-reports', component : OrganizationHierarchyReportsComponent},
  {path: 'employee-education-reports', component : EmployeeEducationWiseReportComponent},
  {path: 'employee-skillbaseed-reports', component : EmployeeSkillbasedReportComponent},
  {path: 'emp-wise-goal-report', component : EmpWiseGoalReportComponent},
  {path: 'dept-wise-goal-report', component : DeptWiseGoalReportComponent},
  {path: 'time-sheet-report', component : TimeSheetComponent},
  {path: 'ats-jobs-report', component : AtsJobsComponent},
  {path: 'shift-report', component : ShiftReportViewComponent},
  {path: 'vaccination-report', component: EmployeeVacinationReportComponent},
  {path: 'expense-report', component: ExpenseReportComponent},
  {path: 'terminated-employee-report', component: TerminatedEmployeeComponent},
  {path: 'employee-loan-advance-report', component: EmployeeLLoanAdvancesReportsComponent},
  {path: 'asset-categories-report', component: AssetCategoriesReportComponent},
  {path: 'asset-status-report', component: AssetStatusReportComponent},
  {path: 'vendor-asset-report', component: VendorAssetReportComponent},
  {path: 'employee-resignation-report', component: EmployeeResignationReportComponent},
  {path: 'trainers-reports', component: TrainersReportsComponent},
  { path: 'training-reports', component: TrainingReportComponent },
  { path: 'training-exam-result', component: TrainingExamResultsReportComponent },
  { path: 'helpdesk-report', component: HelpdeskReportComponent },
  { path: 'reward-recognization-filter-report', component: RewardRecognizationFilterReportComponent },
  { path: 'rewards-recognition', component: RewardsRecognitionReportComponent },
  { path: 'payslip-component-report', component: PayslipComponentReportComponent },
  { path: 'payslip-component-mtd-report', component: PayslipComponentMtdReportComponent },
  { path: 'payslip-component-epf-report', component: PayslipComponentEpfReportComponent },
  { path: 'payslip-component-socso-report', component: PayslipComponentSocsoReportComponent },
  { path: 'arrears-payment-report', component: ArrearsPaymentReportComponent },
  { path: 'salary-increment-report', component: SalaryIncrementReportComponent },
  { path: 'client-report', component: ClientReportsComponent },
  { path: 'candidate-report', component: AtsCandidateReportComponent },
  { path: 'candidate-drop-report', component: AtsDropedCandidateReportComponent },
  { path: 'candidate-info-report', component: CandidateInfoDbReportComponent },
]}
];
@NgModule({
  declarations: [
    monthlyReportsComponent,
    LeaveApplyReportComponent,
    VisitApplicationReportComponent,
    EmployeeMasterReportsComponent,
    ReportingHeadReportsComponent,
    AttendanceReportsComponent,
    LeavesReportsComponent,
    HolidaysReportsComponent,
    EmployeeOnboardingReportsComponent,
    PayrollReportsComponent,
    PerformanceReportsComponent,
    LeaveAttendanceReportsComponent,
    TaxReportsComponent,
    CtcReportComponent,
    BranchViewComponent,
    ViewDepartmentComponent,
    ViewGradeComponent,
    ViewProjectComponent,
    ViewCostcenterComponent,
    EmployeeEducationWiseReportComponent,
    EmployeeEducationSummaryReportComponent,
    CategoryViewComponent,
    EmployeeEducationDetailsComponent,
    EmployeeSkillbasedReportComponent,
    EmployeeBirthdayReportComponent,
    EmployeeAnniversaryReportComponent,
    EmpWiseGoalReportComponent,
    DeptWiseGoalReportComponent,
    TimeSheetComponent,
    AtsJobsComponent,
    ShiftReportViewComponent,
    EmployeeVacinationReportComponent,
    EmployeeTenureReportsComponent,
    EmployeeLeaderboardReportsComponent,
    ExpenseReportComponent,
    TerminatedEmployeeComponent,
    EmployeeLLoanAdvancesReportsComponent,
    AssetCategoriesReportComponent,
    AssetStatusReportComponent,
    VendorAssetReportComponent,
    EmployeeResignationReportComponent,
    TrainersReportsComponent,
    TrainingReportComponent,
    TrainingExamResultsReportComponent,
    HelpdeskReportComponent,
    RewardRecognizationFilterReportComponent,
    RewardsRecognitionReportComponent,
    PayslipComponentReportComponent,
    PayslipComponentMtdReportComponent,
    PayslipComponentEpfReportComponent,
    PayslipComponentSocsoReportComponent,
    ArrearsPaymentReportComponent,
    SalaryIncrementReportComponent,
    PayslipAllowComponent,
    DeletePayslipComponent,
    ClientReportsComponent,
    AtsCandidateReportComponent,
    AtsDropedCandidateReportComponent,
    CandidateInfoDbReportComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule, 
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    NgxPaginationModule,
    FullCalendarModule,
    MatMenuModule,
    MatIconModule
  ],
  providers: [DatePipe, SortableTableDirective]
})
export class MonthlyReportsModule { }
