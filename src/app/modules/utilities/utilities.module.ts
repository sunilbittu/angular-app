import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {RouterModule , Routes} from '@angular/router';
import { utilitiesComponent } from './utilities.component';
import { ImportReimbursmentBillComponent } from 'src/app/components/utilities/import-reimbursment-bill/import-reimbursment-bill.component';
import { VerifyDatabaseComponent } from 'src/app/components/utilities/verify-database/verify-database.component';
import { EssUserRightsComponent } from 'src/app/components/utilities/ess-user-rights/ess-user-rights.component';
import { ImportProcessedSalaryComponent } from 'src/app/components/utilities/import-processed-salary/import-processed-salary.component';
import { EssRoleAssignComponent } from 'src/app/components/utilities/ess-role-assign/ess-role-assign.component';
import { ImportFromExcelComponent } from 'src/app/components/utilities/import-from-excel/import-from-excel.component';
import { LockUnlockMonthComponent } from 'src/app/components/utilities/lock-unlock-month/lock-unlock-month.component';
import { EmailSettingsComponent } from 'src/app/components/utilities/email-settings/email-settings.component';
import { LeaveTypeComponent } from 'src/app/components/utilities/leave-type/leave-type.component';
import { SalaryComponentMasterComponent } from 'src/app/components/utilities/salary-component-master/salary-component-master.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SalaryMappingComponent } from 'src/app/components/utilities/salary-mapping/salary-mapping.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

const routes:Routes=[
  {path:'',component:utilitiesComponent,children:[
    // {path: 'edit-company', component : EditCompanyComponent},

    {path: 'salary-master', component : SalaryComponentMasterComponent},
    {path: 'leave-type', component : LeaveTypeComponent},
    {path: 'email-setting', component : EmailSettingsComponent},
    {path: 'lock-month', component : LockUnlockMonthComponent},
    {path: 'import-excel', component : ImportFromExcelComponent},
    {path: 'ess-role-assign', component : EssRoleAssignComponent},
    {path: 'ess-user-rights', component : EssUserRightsComponent},
    {path: 'import-processed-salary', component : ImportProcessedSalaryComponent},
    {path: 'verify-database', component : VerifyDatabaseComponent},
    {path: 'import-reimbursementBill', component : ImportReimbursmentBillComponent},
    {path: 'salary-mapping', component : SalaryMappingComponent},
 
]}
];
@NgModule({
  declarations: [
    utilitiesComponent,
    SalaryComponentMasterComponent,
    LeaveTypeComponent,
    EmailSettingsComponent,
    LockUnlockMonthComponent,
    ImportFromExcelComponent,
    EssRoleAssignComponent,
    ImportProcessedSalaryComponent,
    EssUserRightsComponent,
    VerifyDatabaseComponent,
    ImportReimbursmentBillComponent,
    SalaryMappingComponent

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes), 
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgSelectModule
  ]
})
export class UtilitiesModule { }
