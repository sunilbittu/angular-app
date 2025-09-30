import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {RouterModule , Routes} from '@angular/router';
import { leaveAttendanceComponent } from './leave-attendance.component';
import { LeaveMasterComponent } from 'src/app/components/leave-attendance/leave-master/leave-master.component';
import { LeaveMasterIndivisualComponent } from 'src/app/components/leave-attendance/leave-master-indivisual/leave-master-indivisual.component';
import { AttendanceMonthlyComponent } from 'src/app/components/leave-attendance/attendance-monthly/attendance-monthly.component';
import { DailyAttendanceComponent } from 'src/app/components/leave-attendance/daily-attendance/daily-attendance.component';
import { ProcessLeaveBalanceComponent } from 'src/app/components/leave-attendance/process-leave-balance/process-leave-balance.component';
import { MonthlyClosingBalanceComponent } from 'src/app/components/leave-attendance/monthly-closing-balance/monthly-closing-balance.component';
import { ReportsComponent } from 'src/app/components/leave-attendance/reports/reports.component';
import { CreateLeaveYearComponent } from 'src/app/components/leave-attendance/create-leave-year/create-leave-year.component';
import { HolidaysComponent } from 'src/app/components/leave-attendance/holidays/holidays.component';
import { LeaveApplyReportComponent } from 'src/app/components/leave-attendance/leave-apply-report/leave-apply-report.component';
import { VisitApplicationReportComponent } from 'src/app/components/leave-attendance/visit-application-report/visit-application-report.component';
import { AddLeaveMasterComponent } from 'src/app/components/leave-attendance/leave-master/add-leave-master/add-leave-master.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgSelectModule } from '@ng-select/ng-select';
import { ManageLeavesComponent } from 'src/app/components/leave-attendance/manage-leaves/manage-leaves.component';
import { ApprovedLeavesComponent } from 'src/app/components/leave-attendance/approved-leaves/approved-leaves.component';
import { ApplyLeaveComponent } from 'src/app/components/leave-attendance/apply-leave/apply-leave.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
// import { CKEditorModule } from 'ckeditor4-angular';
import { MonthlyLeaveBalanceComponent } from 'src/app/components/leave-attendance/reports/monthly-leave-balance/monthly-leave-balance.component';
import { YearlyLeaveBalanceComponent } from 'src/app/components/leave-attendance/reports/yearly-leave-balance/yearly-leave-balance.component';
import { YearlySummaryComponent } from 'src/app/components/leave-attendance/reports/yearly-summary/yearly-summary.component';
import { AttendanceTimeSheetComponent } from 'src/app/components/leave-attendance/attendance-time-sheet/attendance-time-sheet.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { LeaveMappingComponent } from 'src/app/components/leave-attendance/leave-mapping/leave-mapping.component';
import { SearchPipe } from 'src/app/components/leave-attendance/leave-mapping/search.pipe';
import { SearchPipe4 } from 'src/app/components/leave-attendance/leave-mapping/search.pipe';
import { TodaysLeaveEmployeeComponent } from 'src/app/components/leave-attendance/todays-leave-employee/todays-leave-employee.component';
import { NgxPaginationModule } from 'ngx-pagination';
FullCalendarModule.registerPlugins([ 
  interactionPlugin,
  dayGridPlugin
]);

const routes:Routes=[
  {path:'',component:leaveAttendanceComponent,children:[
   {path: 'leave-master', component :LeaveMasterComponent},
   {path: 'leave-master-indivisual', component :LeaveMasterIndivisualComponent},
   {path: 'leave-mapping', component :LeaveMappingComponent},
   {path: 'attendance-monthly', component :AttendanceMonthlyComponent},
   {path: 'daily-attendance', component : DailyAttendanceComponent},
   {path: 'process-leave-balance', component :ProcessLeaveBalanceComponent},
   {path: 'monthly-closing-balance', component : MonthlyClosingBalanceComponent},
   {path: 'reports', component :ReportsComponent,children:[
       {path: 'monthly-leaves', component : MonthlyLeaveBalanceComponent},
       {path: 'yearly-leaves', component : YearlyLeaveBalanceComponent},
       {path: 'yearly-leaves-summary', component : YearlySummaryComponent},

   ]},
   {path: 'create-leave-year', component : CreateLeaveYearComponent},
   {path: 'holidays', component : HolidaysComponent},
   {path: 'leave-apply-report', component : LeaveApplyReportComponent},
   {path: 'visit-application-report', component : VisitApplicationReportComponent},
   {path: 'add-leave-master', component : AddLeaveMasterComponent},
   {path: 'apply-leave', component : ApplyLeaveComponent},
   {path: 'approved-leaves', component : ApprovedLeavesComponent},
   {path: 'manage-leaves', component : ManageLeavesComponent},
   {path: 'Time-sheet', component : AttendanceTimeSheetComponent},
   {path: 'todays-leave', component : TodaysLeaveEmployeeComponent}
]}
];
@NgModule({
  declarations: [
    leaveAttendanceComponent,
    AddLeaveMasterComponent,
    ApplyLeaveComponent,
    ApprovedLeavesComponent,
    ManageLeavesComponent,
    MonthlyLeaveBalanceComponent,
    YearlyLeaveBalanceComponent,
    YearlySummaryComponent,
    AttendanceTimeSheetComponent,
    LeaveMappingComponent,
    SearchPipe,
    SearchPipe4,
    TodaysLeaveEmployeeComponent
    // LeaveMasterComponent,
    // LeaveMasterIndivisualComponent,
    // AttendanceMonthlyComponent,
    // DailyAttendanceComponent,
    // ProcessLeaveBalanceComponent,
    // MonthlyClosingBalanceComponent,
    // ReportsComponent,
    // CreateLeaveYearComponent,
    // HolidaysComponent,
    // LeaveApplyReportComponent,
    // VisitApplicationReportComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes), 
    ReactiveFormsModule,
    FormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgSelectModule,
    BsDatepickerModule.forRoot(),
    FullCalendarModule,
    NgxPaginationModule
    // CKEditorModule
  ],
  providers:[DatePipe]
})
export class LeaveAttendanceModule { }
