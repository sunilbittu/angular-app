import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NationalityComponent } from 'src/app/components/configuration/nationality/nationality.component';
import { NotificationComponent } from 'src/app/components/configuration/notification/notification.component';
import { CountryComponent } from 'src/app/components/configuration/country/country.component';
import { StateComponent } from 'src/app/components/configuration/state/state.component';
import { CityComponent } from 'src/app/components/configuration/city/city.component';
import { RaceComponent } from 'src/app/components/configuration/race/race.component';
import { ReligionComponent } from 'src/app/components/configuration/religion/religion.component';
import { configurationComponent } from './configuration.component';
import {RouterModule , Routes} from '@angular/router';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'; 
import { CompanyComponent } from 'src/app/components/configuration/company/company.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddEditCompaniesComponent } from 'src/app/components/configuration/company/add-edit-companies/add-edit-companies.component';
import { FinancialYearComponent } from 'src/app/components/configuration/financial-year/financial-year.component';
import { SourceChannelComponent } from 'src/app/components/configuration/source-channel/source-channel.component';
import { DocumentTypeComponent } from 'src/app/components/configuration/document-type/document-type.component';
import { InsuranceCompanyMasterComponent } from 'src/app/components/configuration/insurance-company-master/insurance-company-master.component';
import { KPIMasterComponent } from 'src/app/components/configuration/kpi-master/kpi-master.component';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { BenchResourceMappingComponent } from 'src/app/components/configuration/bench-resource-mapping/bench-resource-mapping.component';
import { TimeShiftMappingComponent } from 'src/app/components/configuration/time-shift-mapping/time-shift-mapping.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SearchPipe } from 'src/app/components/configuration/bench-resource-mapping/search.pipe';
import { CurrencyTypeComponent } from 'src/app/components/configuration/currency-type/currency-type.component';
import { PasswordResetComponent } from 'src/app/components/configuration/password-reset/password-reset.component';
import { EmployeeLockUnlockComponent } from 'src/app/components/configuration/employee-lock-unlock/employee-lock-unlock.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { EmployeePermissionsComponent } from 'src/app/components/configuration/employee-permissions/employee-permissions.component';
import { RolesComponent } from 'src/app/components/configuration/roles/roles.component';
import { EventRolesComponent } from 'src/app/components/configuration/event-roles/roles.component';
import { SearchPipe2 } from 'src/app/components/configuration/time-shift-mapping/search2.pipe';

import { ApprovalWorkFlowComponent } from 'src/app/components/configuration/approval-work-flow/approval-work-flow.component';
import { EmailSettingsComponent } from 'src/app/components/configuration/email-settings/email-settings.component';
import { LanguageComponent } from 'src/app/components/configuration/language/language.component';
import { ParentSkillMasterComponent } from 'src/app/components/configuration/parent-skill-master/parent-skill-master.component';
import { IndustryMasterComponent } from 'src/app/components/configuration/industry-master/industry-master.component';
import { CronSettingComponent } from 'src/app/components/configuration/cron-setting/cron-setting.component';

const routes:Routes=[
  {path:'',component:configurationComponent,children:[
    {path: 'nationality', component : NationalityComponent},
    {path: 'notification', component : NotificationComponent},
    {path: 'country', component : CountryComponent},
    {path: 'state', component : StateComponent},
    {path: 'city', component : CityComponent},
    {path: 'race', component : RaceComponent},
    {path: 'religion', component : ReligionComponent},
    {path: 'company', component : CompanyComponent},
    {path: 'add-edit-company', component : AddEditCompaniesComponent},
    {path: 'financial-year', component : FinancialYearComponent},
    {path: 'sourcing-channel', component : SourceChannelComponent},
    {path: 'document-type', component : DocumentTypeComponent},
    {path: 'currency-type', component : CurrencyTypeComponent},
    {path: 'insurance-company-master', component : InsuranceCompanyMasterComponent},
    {path: 'kpi-master', component : KPIMasterComponent},
    {path: 'bench-resource-mapping', component : BenchResourceMappingComponent},
    {path: 'time-shift-mapping', component : TimeShiftMappingComponent},
    {path: 'password-reset', component : PasswordResetComponent},
    {path: 'employee-lock-unlock', component : EmployeeLockUnlockComponent},
    {path: 'employee-permissions', component : EmployeePermissionsComponent},
    {path: 'roles', component : RolesComponent},
    {path: 'event-roles', component : EventRolesComponent},
    {path: 'approval-work-flow', component : ApprovalWorkFlowComponent},
    {path: 'email-settings', component : EmailSettingsComponent},
    {path: 'language', component : LanguageComponent},
    { path: 'skill-master', component : ParentSkillMasterComponent },
    { path: 'industry-master', component : IndustryMasterComponent },
    { path: 'cron-settings', component : CronSettingComponent }
]}
];

@NgModule({
  declarations: [
    configurationComponent,
    NationalityComponent,
    NotificationComponent,
    CountryComponent,
    StateComponent,
    CityComponent,
    RaceComponent,
    ReligionComponent,
    CompanyComponent,
    AddEditCompaniesComponent,
    FinancialYearComponent,
    SourceChannelComponent,
    DocumentTypeComponent,

    InsuranceCompanyMasterComponent,
    KPIMasterComponent,
    BenchResourceMappingComponent,
    TimeShiftMappingComponent,
    SearchPipe,
    CurrencyTypeComponent,
    PasswordResetComponent,
    EmployeeLockUnlockComponent,
    ApprovalWorkFlowComponent,
    EmployeePermissionsComponent,
    RolesComponent,
    EventRolesComponent,
    SearchPipe2,
    EmailSettingsComponent,
    LanguageComponent,
    ParentSkillMasterComponent,
    IndustryMasterComponent,
    CronSettingComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes), 
    BsDatepickerModule.forRoot(),
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger', // set defaults here
    }),
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgMultiSelectDropDownModule.forRoot(),
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger', // set defaults here
    })
  ]
})
export class ConfigurationModule { }
