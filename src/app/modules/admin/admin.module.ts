import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {RouterModule , Routes} from '@angular/router';
import { adminComponent } from './admin.component';
import { QualificationMasterComponent } from 'src/app/components/admin/qualification-master/qualification-master.component';
import { EventMappingComponent } from 'src/app/components/admin/event-mapping/qualification-master.component';
import { DocumentsCenterComponent } from 'src/app/components/admin/documents-center/documents-center.component';
import { MailerComponent } from 'src/app/components/admin/mailer/mailer.component';
import { QueryManagementComponent } from 'src/app/components/admin/query-management/query-management.component';
import { ExitClearenceHeadComponent } from 'src/app/components/admin/exit-clearence-head/exit-clearence-head.component';
import { EventMasterComponent } from 'src/app/components/admin/event-master/event-master.component';
import { GalleryMasterComponent } from 'src/app/components/admin/gallery-master/gallery-master.component';
import { AssignPunchLocationComponent } from 'src/app/components/admin/assign-punch-location/assign-punch-location.component';
import { AuditTrailsComponent } from 'src/app/components/admin/audit-trails/audit-trails.component';
import { NewsComponent } from 'src/app/components/admin/news/news.component';
import { ExitTemplateComponent } from 'src/app/components/admin/exit-template/exit-template.component';
import { GeneralSettingComponent } from 'src/app/components/admin/general-setting/general-setting.component';
import { EssUserComponent } from 'src/app/components/admin/ess-user/ess-user.component';
import { ApproverComponent } from 'src/app/components/admin/approver/approver.component';
import { GuidelinesComponent } from 'src/app/components/admin/guidelines/guidelines.component';
import { AnouncementComponent } from 'src/app/components/admin/anouncement/anouncement.component';
import { EventAnouncementComponent } from 'src/app/components/admin/event-anouncement/anouncement.component';
import { MailerSettingComponent } from 'src/app/components/admin/mailer-setting/mailer-setting.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxPaginationModule } from 'ngx-pagination';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';


const routes:Routes=[
  {path:'',component:adminComponent,children:[
    {path: 'qualification-master', component : QualificationMasterComponent},
    {path: 'event-mapping', component : EventMappingComponent},
    {path: 'document-center', component : DocumentsCenterComponent},
    {path: 'mailer', component : MailerComponent},
    {path: 'query-management', component : QueryManagementComponent},
    {path: 'exit-clearence', component : ExitClearenceHeadComponent},
    {path: 'event-master', component : EventMasterComponent},
    {path: 'gallery-master', component : GalleryMasterComponent},
    {path: 'assignpunch-location', component : AssignPunchLocationComponent},
    {path: 'audit-trails', component : AuditTrailsComponent},
    {path: 'news', component : NewsComponent},
    {path: 'exit-template', component : ExitTemplateComponent}, 
    {path: 'general-settings', component : GeneralSettingComponent},
    {path: 'ess-user', component : EssUserComponent},
    {path: 'approver', component : ApproverComponent},
    {path: 'guidelines', component : GuidelinesComponent},
    {path: 'anouncement', component : AnouncementComponent},
    {path: 'event-anouncement', component : EventAnouncementComponent},
    {path: 'mailer-setting', component : MailerSettingComponent},



]}

]
@NgModule({
  declarations: [
    adminComponent,
    QualificationMasterComponent,
    EventMappingComponent,
    DocumentsCenterComponent,
    MailerComponent,
    QueryManagementComponent,
    ExitClearenceHeadComponent,
    EventMasterComponent,
    GalleryMasterComponent,
    AssignPunchLocationComponent,
    AuditTrailsComponent,
    NewsComponent,
    ExitTemplateComponent,
    GeneralSettingComponent,
    EssUserComponent,
    ApproverComponent,
    GuidelinesComponent,
    AnouncementComponent,
    EventAnouncementComponent,
    MailerSettingComponent,
   

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes), 
    BsDatepickerModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger', // set defaults here
    })
  ],

  providers:[DatePipe]

})
export class AdminModule { }
