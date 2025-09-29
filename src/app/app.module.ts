import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy  } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule, RoutingConstant } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SidenavbarComponent } from './components/sidenavbar/sidenavbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { NgxSpinnerModule } from "ngx-spinner";
import { HomepageComponent } from './components/homepage/homepage.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'; 

import { MaterialModule } from './material.module';
import { MainnavbarComponent } from './components/mainnavbar/mainnavbar.component';
import { RegisterOrgComponent } from './components/register-org/register-org.component';
import { EmployeeComponent } from './components/employee/employee.component';
import { EditCompanyComponent } from './components/company/edit-company/edit-company.component';
import { TANDetailsComponent } from './components/company/tandetails/tandetails.component';
import { BankDetailsComponent } from './components/company/bank-details/bank-details.component';
import { SelectMonthComponent } from './components/select-month/select-month.component';
import { DepartmentMasterComponent } from './components/master/department-master/department-master.component';
import { DesignationMasterComponent } from './components/master/designation-master/designation-master.component';
import { GradeMasterComponent } from './components/master/grade-master/grade-master.component';
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
import { SupplementaryPaymentComponent } from './components/additional-payments/supplementary-payment/supplementary-payment.component';
import { BonusCalculationComponent } from './components/additional-payments/bonus-calculation/bonus-calculation.component';
import { GratuityCalculationComponent } from './components/additional-payments/gratuity-calculation/gratuity-calculation.component';
import { ReimbursementYearComponent } from './components/additional-payments/reimbursement-year/reimbursement-year.component';
import { ReimbursementOpeningComponent } from './components/additional-payments/reimbursement-opening/reimbursement-opening.component';
import { ReimbursementBillpaymentComponent } from './components/additional-payments/reimbursement-billpayment/reimbursement-billpayment.component';
import { ReimbursementReportsComponent } from './components/additional-payments/reimbursement-reports/reimbursement-reports.component';
import { LeaveEncashmentComponent } from './components/additional-payments/leave-encashment/leave-encashment.component';
import { PayslipComponent } from './components/monthly-reports/payslip/payslip.component';
//import { PayslipAllowComponent } from './components/monthly-reports/payslip-allow/payslip-allow.component';
import { EmailPayslipComponent } from './components/monthly-reports/email-payslip/email-payslip.component';
import { SalarySheetComponent } from './components/monthly-reports/salary-sheet/salary-sheet.component';
import { SalarySheetverticalComponent } from './components/monthly-reports/salary-sheetvertical/salary-sheetvertical.component';
import { SalarySummaryComponent } from './components/monthly-reports/salary-summary/salary-summary.component';
import { BankStatementComponent } from './components/monthly-reports/bank-statement/bank-statement.component';
import { PfReportComponent } from './components/monthly-reports/pf-report/pf-report.component';
import { EsicReportsComponent } from './components/monthly-reports/esic-reports/esic-reports.component';
import { ProfessionalTaxComponent } from './components/monthly-reports/professional-tax/professional-tax.component';
import { SalaryOnholdComponent } from './components/monthly-reports/salary-onhold/salary-onhold.component';
import { AdvanceComponent } from './components/monthly-reports/loan/advance/advance.component';
import { TdsDeductedComponent } from './components/monthly-reports/tds-deducted/tds-deducted.component';
import { YearlySalaryregisterComponent } from './components/monthly-reports/yearly-salaryregister/yearly-salaryregister.component';
import { OtherReportsComponent } from './components/monthly-reports/other-reports/other-reports.component';
import { SaleryReconciliationComponent } from './components/monthly-reports/salary-reconciliation/salery-reconciliation.component';
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
// import { LetterTemplateComponent } from './components/master/letter-template/letter-template.component';
import { AssignLetterComponent } from './components/master/assign-letter/assign-letter.component';
import { OrganizationChartComponent } from './components/master/organization-chart/organization-chart.component';
import { LeaveMasterComponent } from './components/leave-attendance/leave-master/leave-master.component';
import { LeaveMasterIndivisualComponent } from './components/leave-attendance/leave-master-indivisual/leave-master-indivisual.component';
// import { ShiftMasterComponent } from './components/time-shift/shift-master/shift-master.component';
import { ShiftAssignedComponent } from './components/time-shift/shift-assigned/shift-assigned.component';
import { DailyLogImportComponent } from './components/time-shift/daily-log-import/daily-log-import.component';
import { LogHistoryComponent } from './components/time-shift/log-history/log-history.component';
import { ProcessAttendanceComponent } from './components/time-shift/process-attendance/process-attendance.component';
import { TimeInOutComponent } from './components/time-shift/time-in-out/time-in-out.component';
import { TimeShiftReportComponent } from './components/time-shift/time-shift-report/time-shift-report.component';
import { AttendanceMonthlyComponent } from './components/leave-attendance/attendance-monthly/attendance-monthly.component';
import { DailyAttendanceComponent } from './components/leave-attendance/daily-attendance/daily-attendance.component';
import { ProcessLeaveBalanceComponent } from './components/leave-attendance/process-leave-balance/process-leave-balance.component';
import { MonthlyClosingBalanceComponent } from './components/leave-attendance/monthly-closing-balance/monthly-closing-balance.component';
import { ReportsComponent } from './components/leave-attendance/reports/reports.component';
import { CreateLeaveYearComponent } from './components/leave-attendance/create-leave-year/create-leave-year.component';
import { HolidaysComponent } from './components/leave-attendance/holidays/holidays.component';
import { CommonEmployeeFilterComponent } from './components/common-filter/common-employee-filter/common-employee-filter.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgSelectModule } from '@ng-select/ng-select';
import { EmployeeModelPopupComponent } from './components/master/employee-model-popup/employee-model-popup.component';
import { HttpCalIInterceptor } from './Interceptors/Interceptor';
//import { CKEditorModule } from 'ng2-ckeditor';
import {NgxPaginationModule} from 'ngx-pagination'; 
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { PaginationRootComponent } from './components/pagination-root/pagination-root.component';

import { OrganizationHierarchyReportsComponent } from './components/monthly-reports/organization-hierarchy-reports/organization-hierarchy-reports.component';
import { OrgchartModule } from '@dabeng/ng-orgchart';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { ColorPickerModule } from 'ngx-color-picker';
import { VaccinationComponent } from './components/master/vaccination/vaccination.component';
import { AssetTypeComponent } from './components/asset-management/asset-type/asset-type.component';
import { TechnologyMasterComponent } from './components/training/technology-master/technology-master.component';
import { SortService } from './services/sort.service';
// import { SalaryIncrementReportComponent } from './components/monthly-reports/salary-increment-report/salary-increment-report.component';
// import { PayslipComponentReportComponent } from './components/monthly-reports/payslip-component-report/payslip-component-report.component';
// import { RewardsRecognitionReportComponent } from './components/monthly-reports/rewards-recognition-report/rewards-recognition-report.component';
// import { RewardsRecognitionComponent } from './components/master/rewards-recognition/rewards-recognition.component';
// import { HelpdeskReportComponent } from './components/monthly-reports/helpdesk-report/helpdesk-report.component';
// import { CreateTicketComponent } from './components/helpdesk/create-ticket/create-ticket.component';
// import { TrainingExamResultsReportComponent } from './components/monthly-reports/training-exam-results-report/training-exam-results-report.component';
// import { TrainersReportsComponent } from './components/monthly-reports/trainers-reports/trainers-reports.component';
// import { ManageResultsAssesmentComponent } from './components/training/manage-results-assesment/manage-results-assesment.component';
// import { UploadMaterialsComponent } from './components/training/upload-materials/upload-materials.component';
// import { VendorsComponent } from './components/asset-management/vendors/vendors.component';
// import { EmployeeRelieveComponent } from './components/performance-management/employee-relieve/employee-relieve.component';
// import { EmployeeRejoinComponent } from './components/performance-management/employee-rejoin/employee-rejoin.component';
// import { AssetCategoriesReportComponent } from './components/monthly-reports/asset-categories-report/asset-categories-report.component';
// import { AssetStatusReportComponent } from './components/monthly-reports/asset-status-report/asset-status-report.component';
// import { EmployeeLLoanAdvancesReportsComponent } from './components/monthly-reports/employee-l-loan-advances-reports/employee-l-loan-advances-reports.component';
// import { LoanTypeComponent } from './components/loan-and-advance/loan-type/loan-type.component';
// import { HrRoundComponent } from './components/employee-onBoarding/hr-round/hr-round.component';
// import { OfferletterRolloutComponent } from './components/employee-onBoarding/offerletter-rollout/offerletter-rollout.component';
// import { SearchPipe3 } from './modules/main-module/search.pipe';
// import { RolesComponent } from './components/configuration/roles/roles.component';
// import { EmployeePermissionsComponent } from './components/configuration/employee-permissions/employee-permissions.component';
// import { PasswordResetComponent } from './components/configuration/password-reset/password-reset.component';


/**
 * Custom angular notifier options
 */
 const customNotifierOptions: NotifierOptions = {
  position: {
		horizontal: {
			position: 'right',
			distance: 12
		},
		vertical: {
			position: 'top',
			distance: 12,
			gap: 10
		}
	},
  theme: 'material',
  behaviour: {
    autoHide: 3000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};

 
@NgModule({
  declarations: [
    RoutingConstant,
    AppComponent,
    SidenavbarComponent,
    HomepageComponent,
    MainnavbarComponent,
    RegisterOrgComponent,
    EmployeeComponent,
    EditCompanyComponent,
    TANDetailsComponent,
    BankDetailsComponent,
    SelectMonthComponent,
    DepartmentMasterComponent,
    DesignationMasterComponent,
    GradeMasterComponent,
    MonthlyVariablesComponent,
    ProcessSalaryComponent,
    ViewSalaryComponent,
    LoanAdvanceComponent,
    FfSettelmentComponent,
    PromotionTransferComponent,
    EmployeeIncrementComponent,
    ArearPaymentsComponent,
    GlStatementComponent,
    DisbursementPayymentComponent,
    SupplementaryPaymentComponent,
    BonusCalculationComponent,
    GratuityCalculationComponent,
    ReimbursementYearComponent,
    ReimbursementOpeningComponent,
    ReimbursementBillpaymentComponent,
    ReimbursementReportsComponent,
    LeaveEncashmentComponent,
    PayslipComponent,
   // PayslipAllowComponent,
    EmailPayslipComponent,
    SalarySheetComponent,
    SalarySheetverticalComponent,
    SalarySummaryComponent,
    BankStatementComponent,
    PfReportComponent,
    EsicReportsComponent,
    ProfessionalTaxComponent,
    SalaryOnholdComponent,
    AdvanceComponent,
    TdsDeductedComponent,
    OtherReportsComponent,
    SaleryReconciliationComponent,
    YearlySalaryregisterComponent,

    BranchMasterComponent,
    DivisionMasterComponent,
    CostCenterComponent,
    ProjectMasterComponent,
    CategoryMasterComponent,
    BankMasterComponent,
    SlabMasterComponent,
    DocumentMasterComponent,
    AssignReportingHeadComponent,
    ReportingHeadReportComponent,
    EmployeeMasterReportComponent,
    ReminderComponent,
    AssetComponent,
    AssignLetterComponent,
    OrganizationChartComponent,
    LeaveMasterComponent,
    LeaveMasterIndivisualComponent,
    // ShiftMasterComponent,
    ShiftAssignedComponent,
    DailyLogImportComponent,
    LogHistoryComponent,
    ProcessAttendanceComponent,
    TimeInOutComponent,
    TimeShiftReportComponent,
    AttendanceMonthlyComponent,
    DailyAttendanceComponent,
    ProcessLeaveBalanceComponent,
    MonthlyClosingBalanceComponent,
    ReportsComponent,
    CreateLeaveYearComponent,
    HolidaysComponent,
    CommonEmployeeFilterComponent,
    EmployeeModelPopupComponent,
    PaginationRootComponent,
    OrganizationHierarchyReportsComponent,
    VaccinationComponent,
    
    
  
    
    
    // SearchPipe3,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,   
    FlexLayoutModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    FormsModule, FlexLayoutModule, 
    MaterialModule,
    BsDatepickerModule.forRoot(),
    NotifierModule.withConfig(customNotifierOptions),
    NgSelectModule,
    NgMultiSelectDropDownModule.forRoot(),
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger', // set defaults here
    }),
    //CKEditorModule,
    NgxPaginationModule,
    OrgchartModule,
    NgxMaterialTimepickerModule,
    ColorPickerModule
  ],
  
  
  bootstrap: [AppComponent],

  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: HttpCalIInterceptor,
    multi: true
  },
  {provide : LocationStrategy , useClass: HashLocationStrategy},
  SortService],
  
  
})
export class AppModule { }
