import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {RouterModule , Routes} from '@angular/router';
import { SupplementaryPaymentComponent } from 'src/app/components/additional-payments/supplementary-payment/supplementary-payment.component';
import { BonusCalculationComponent } from 'src/app/components/additional-payments/bonus-calculation/bonus-calculation.component';
import { GratuityCalculationComponent } from 'src/app/components/additional-payments/gratuity-calculation/gratuity-calculation.component';
import { ReimbursementYearComponent } from 'src/app/components/additional-payments/reimbursement-year/reimbursement-year.component';
import { ReimbursementOpeningComponent } from 'src/app/components/additional-payments/reimbursement-opening/reimbursement-opening.component';
import { ReimbursementBillpaymentComponent } from 'src/app/components/additional-payments/reimbursement-billpayment/reimbursement-billpayment.component';
import { ReimbursementReportsComponent } from 'src/app/components/additional-payments/reimbursement-reports/reimbursement-reports.component';
import { LeaveEncashmentComponent } from 'src/app/components/additional-payments/leave-encashment/leave-encashment.component';
import { additionalpaymentsComponent } from './additional-payments.component';

const routes:Routes=[
  {path:'',component:additionalpaymentsComponent,children:[

  {path: 'supplementary-payment', component : SupplementaryPaymentComponent},
  {path: 'bonus-calculation', component : BonusCalculationComponent},
  {path: 'gratuity-calculation', component : GratuityCalculationComponent},
  {path: 'reimbursement-year', component : ReimbursementYearComponent},
  {path: 'reimbursement-opening', component : ReimbursementOpeningComponent},
  {path: 'reimbursement-billpayment', component : ReimbursementBillpaymentComponent},
  {path: 'reimbursement-reports', component : ReimbursementReportsComponent},
  {path: 'leave-encashment', component : LeaveEncashmentComponent},


]}
];

@NgModule({
  declarations: [
    additionalpaymentsComponent,
    // SupplementaryPaymentComponent,
    // BonusCalculationComponent,
    // GratuityCalculationComponent,
    // ReimbursementYearComponent,
    // ReimbursementOpeningComponent,
    // ReimbursementBillpaymentComponent,
    // ReimbursementReportsComponent,
    // LeaveEncashmentComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes), 

  ]
})
export class AdditionalPaymentsModule { }
