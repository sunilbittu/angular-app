import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {RouterModule , Routes} from '@angular/router';
import { masterComponent } from './masters.component';
import { EmployeeSalaryStructureComponent } from 'src/app/components/master/employee-salary-structure/employee-salary-structure.component';
import { EmployeeMasterComponent } from 'src/app/components/master/employee-master/employee-master.component';
import { DepartmentMasterComponent } from 'src/app/components/master/department-master/department-master.component';
import { BranchMasterComponent } from 'src/app/components/master/branch-master/branch-master.component';
import { DesignationMasterComponent } from 'src/app/components/master/designation-master/designation-master.component';
import { DivisionMasterComponent } from 'src/app/components/master/division-master/division-master.component';
import { GradeMasterComponent } from 'src/app/components/master/grade-master/grade-master.component';
import { FundsRealizedComponent } from 'src/app/components/master/funds-realized/funds-realized.component';
import { CostCenterComponent } from 'src/app/components/master/cost-center/cost-center.component';
import { ProjectMasterComponent } from 'src/app/components/master/project-master/project-master.component';
import { CategoryMasterComponent } from 'src/app/components/master/category-master/category-master.component';
import { BankMasterComponent } from 'src/app/components/master/bank-master/bank-master.component';
import { SlabMasterComponent } from 'src/app/components/master/slab-master/slab-master.component';
import { DocumentMasterComponent } from 'src/app/components/master/document-master/document-master.component';
import { AssignReportingHeadComponent } from 'src/app/components/master/assign-reporting-head/assign-reporting-head.component';
import { ReportingHeadReportComponent } from 'src/app/components/master/reporting-head-report/reporting-head-report.component';
import { EmployeeMasterReportComponent } from 'src/app/components/master/employee-master-report/employee-master-report.component';
import { ReminderComponent } from 'src/app/components/master/reminder/reminder.component';
import { AssetComponent } from 'src/app/components/master/asset/asset.component';
import { LetterTemplateComponent } from 'src/app/components/master/letter-template/letter-template.component';
import { AssignLetterComponent } from 'src/app/components/master/assign-letter/assign-letter.component';
import { OrganizationChartComponent } from 'src/app/components/master/organization-chart/organization-chart.component';
import { AddEmployeeComponent } from 'src/app/components/master/employee-master/add-employee/add-employee.component';
import { ViewEmployeeComponent } from 'src/app/components/master/view-employee/view-employee.component';
import { PersonalDetailsComponent } from 'src/app/components/master/view-employee/personal-details/personal-details.component';
import { PassportDlComponent } from 'src/app/components/master/view-employee/passport-dl/passport-dl.component';
import { QualificationComponent } from 'src/app/components/master/view-employee/qualification/qualification.component';
import { FamilyMembersComponent } from 'src/app/components/master/view-employee/family-members/family-members.component';
import { WorkExperianceComponent } from 'src/app/components/master/view-employee/work-experiance/work-experiance.component';
import { DocumentComponent } from 'src/app/components/master/view-employee/document/document.component';
import { SkillHobbiesComponent } from 'src/app/components/master/view-employee/skill-hobbies/skill-hobbies.component';
import { OtherInfoComponent } from 'src/app/components/master/view-employee/other-info/other-info.component';
import { MedicalInsuranceComponent } from 'src/app/components/master/view-employee/medical-insurance/medical-insurance.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'; 
import { AssetMasterComponent } from 'src/app/components/master/asset/asset-master/asset-master.component';
import { AssetIssuesComponent } from 'src/app/components/master/asset/asset-issues/asset-issues.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ImportAssetsComponent } from 'src/app/components/master/asset/import-assets/import-assets.component';
import { EditEmployeeComponent } from 'src/app/components/master/employee-master/edit-employee/edit-employee.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
// import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {NgxPaginationModule} from 'ngx-pagination';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { VaccinationComponent } from 'src/app/components/master/vaccination/vaccination.component';
import { EmployeeResignationComponent } from 'src/app/components/master/employee-resignation/employee-resignation.component';
import { RewardsRecognitionComponent } from 'src/app/components/master/rewards-recognition/rewards-recognition.component';
//import { CKEditorModule } from 'ng2-ckeditor';
import { SalaryIncrementArrearsPaymentComponent } from 'src/app/components/master/salary-increment-arrears-payment/salary-increment-arrears-payment.component';
import { SortableTableDirective } from 'src/app/components/master/employee-master/sortable-table.directive';
import { SortableColumnComponent } from 'src/app/components/master/employee-master/sortable-column/sortable-column.component';
const routes:Routes=[
  {path:'',component:masterComponent,children:[
   {path: 'emp-sal-structure', component : EmployeeSalaryStructureComponent},
   {path: 'department-master', component : DepartmentMasterComponent},
   {path: 'employee-master', component : EmployeeMasterComponent},
   {path: 'branch-master', component : BranchMasterComponent},
   {path: 'designation-master', component : DesignationMasterComponent},
   {path: 'division-master', component : DivisionMasterComponent},
   {path: 'grade-master', component : GradeMasterComponent},
   {path: 'funds-realized', component: FundsRealizedComponent},
   {path: 'cost-center', component : CostCenterComponent},
   {path: 'project-master', component :ProjectMasterComponent},
   {path: 'category-master', component :CategoryMasterComponent},
   {path: 'bank-master', component :BankMasterComponent},
   {path: 'slab-master', component :SlabMasterComponent},
   {path: 'document-master', component :DocumentMasterComponent},
   {path: 'assign-reporting-head', component :AssignReportingHeadComponent},
   {path: 'reporting-head-report', component :ReportingHeadReportComponent},
   {path: 'employee-master-report', component :EmployeeMasterReportComponent},
   {path: 'reminder', component :ReminderComponent},
   {path: 'asset', component :AssetComponent},
   {path: 'letter-template', component :LetterTemplateComponent},
   {path: 'assign-letter', component : AssignLetterComponent},
   {path: 'organization-chart', component :OrganizationChartComponent},
   {path: 'add-employee', component :AddEmployeeComponent},
   {path: 'view-employee/:id', component :ViewEmployeeComponent},
   {path: 'import-asset', component :ImportAssetsComponent},
   {path: 'asset-master', component :AssetMasterComponent},
   {path: 'asset-issues', component :AssetIssuesComponent},
   {path: 'vaccination-master', component :VaccinationComponent},
   {path: 'employee-resignation', component :EmployeeResignationComponent},
   {path: 'rewards-recognition', component :RewardsRecognitionComponent},
   {path: 'salary-increment-arrears', component :SalaryIncrementArrearsPaymentComponent},
]}
]
@NgModule({
  declarations: [
    masterComponent,
    AddEmployeeComponent,
    EditEmployeeComponent,
    ViewEmployeeComponent,
    PersonalDetailsComponent,
    FundsRealizedComponent,
    PassportDlComponent,
    QualificationComponent,
    FamilyMembersComponent,
    WorkExperianceComponent,
    DocumentComponent,
    SkillHobbiesComponent,
    OtherInfoComponent,
    MedicalInsuranceComponent,
    ImportAssetsComponent,
    AssetMasterComponent,
    AssetIssuesComponent,
    EmployeeResignationComponent,
    LetterTemplateComponent,
    RewardsRecognitionComponent,
    SalaryIncrementArrearsPaymentComponent,
    EmployeeSalaryStructureComponent,
    EmployeeMasterComponent,
    SortableColumnComponent,
    SortableTableDirective,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    RouterModule.forChild(routes), 
    FormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger', // set defaults here
    }),
    NgSelectModule,
    //CKEditorModule,
    NgxPaginationModule

    
  ],
  providers:[DatePipe,
    AddEmployeeComponent
  ],
})
export class MastersModule { }
