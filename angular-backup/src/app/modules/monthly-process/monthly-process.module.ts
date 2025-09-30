import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import {RouterModule , Routes} from '@angular/router';
import { monthlyProcessComponent } from './monthy-process.component';
import { ReminderComponent } from 'src/app/components/master/reminder/reminder.component';
import { MonthlyVariablesComponent } from 'src/app/components/monthly-process/monthly-variables/monthly-variables.component';
import { ProcessSalaryComponent } from 'src/app/components/monthly-process/process-salary/process-salary.component';
import { ViewSalaryComponent } from 'src/app/components/monthly-process/view-salary/view-salary.component';
import { LoanAdvanceComponent } from 'src/app/components/monthly-process/loan-advance/loan-advance.component';
import { FfSettelmentComponent } from 'src/app/components/monthly-process/ff-settelment/ff-settelment.component';
import { PromotionTransferComponent } from 'src/app/components/monthly-process/promotion-transfer/promotion-transfer.component';
import { EmployeeIncrementComponent } from 'src/app/components/monthly-process/employee-increment/employee-increment.component';
import { ArearPaymentsComponent } from 'src/app/components/monthly-process/arear-payments/arear-payments.component';
import { GlStatementComponent } from 'src/app/components/monthly-process/gl-statement/gl-statement.component';
import { DisbursementPayymentComponent } from 'src/app/components/monthly-process/disbursement-payyment/disbursement-payyment.component';
import { SelectMonthComponent } from 'src/app/components/select-month/select-month.component';

const routes:Routes=[
  {path:'',component:monthlyProcessComponent,children:[
   {path: 'select-month', component : SelectMonthComponent},
  {path: 'monthly-variables', component : MonthlyVariablesComponent},
  {path: 'process-salary', component : ProcessSalaryComponent},
  {path: 'view-salary', component : ViewSalaryComponent},
  {path: 'loan-advance', component : LoanAdvanceComponent},
  {path: 'ff-settelment', component : FfSettelmentComponent},
  {path: 'promotion-transfer', component : PromotionTransferComponent},
  {path: 'employee-increment', component : EmployeeIncrementComponent},
  {path: 'arear-payments', component : ArearPaymentsComponent},
  {path: 'gl-statement', component : GlStatementComponent},
  {path: 'disbursement-payyment', component : DisbursementPayymentComponent},
  {path: 'reminder', component : ReminderComponent},


]}
];
@NgModule({
  declarations: [
    monthlyProcessComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes), 

  ],
  providers: [DatePipe]
})
export class MonthlyProcessModule { }
