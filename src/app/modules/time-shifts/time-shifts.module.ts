import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule , Routes} from '@angular/router';
import { timeShiftsComponent } from './time-shifts.component';
import { TimeInOutComponent } from 'src/app/components/time-shift/time-in-out/time-in-out.component';
import { TimeShiftReportComponent } from 'src/app/components/time-shift/time-shift-report/time-shift-report.component';
import { ShiftAssignedComponent } from 'src/app/components/time-shift/shift-assigned/shift-assigned.component';
import { DailyLogImportComponent } from 'src/app/components/time-shift/daily-log-import/daily-log-import.component';
import { LogHistoryComponent } from 'src/app/components/time-shift/log-history/log-history.component';
import { ProcessAttendanceComponent } from 'src/app/components/time-shift/process-attendance/process-attendance.component';
import { ShiftMasterComponent } from 'src/app/components/time-shift/shift-master/shift-master.component';
import { TimeShiftManageComponent } from 'src/app/components/time-shift/manage-time-shift/time-shift-manage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxPaginationModule } from 'ngx-pagination';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { ColorPickerModule } from 'ngx-color-picker';
import { SearchPipe } from 'src/app/components/time-shift/manage-time-shift/search.pipe';

const routes:Routes=[
  {path:'',component:timeShiftsComponent,children:[
   {path: 'time-in-out', component :    TimeInOutComponent},
   {path: 'time-shift-report', component :    TimeShiftReportComponent},
   {path: 'shift-master', component :    ShiftMasterComponent},
   {path: 'app-time-shift-manage', component :    TimeShiftManageComponent},
   {path: 'shift-assigned', component :    ShiftAssignedComponent},
   {path: 'daily-log-import', component :    DailyLogImportComponent},
   {path: 'log-history', component :    LogHistoryComponent},
   {path: 'process-attendance', component :    ProcessAttendanceComponent},
  

]}
]
@NgModule({
  declarations: [
    timeShiftsComponent,
    // TimeInOutComponent,
    // TimeShiftReportComponent,
    ShiftMasterComponent,
    TimeShiftManageComponent,
    SearchPipe
    // ShiftAssignedComponent,
    // DailyLogImportComponent,
    // LogHistoryComponent,
    // ProcessAttendanceComponent
  ],
  imports: [
    ColorPickerModule,
    NgxMaterialTimepickerModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    FormsModule,
    RouterModule.forChild(routes), 
    NgMultiSelectDropDownModule.forRoot(),
    CommonModule,
    RouterModule.forChild(routes), 
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger', // set defaults here
    }),
    NgxPaginationModule

  ]
})
export class TimeShiftsModule { }
