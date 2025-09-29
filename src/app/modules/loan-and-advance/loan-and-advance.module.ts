import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { loanAndAdvanceComponent } from './loan-and-advance.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { LoanMappingComponent } from 'src/app/components/loan-and-advance/loan-mapping/loan-mapping.component';
import { LoanTypeComponent } from 'src/app/components/loan-and-advance/loan-type/loan-type.component';
import { SearchPipe } from 'src/app/components/loan-and-advance/loan-mapping/search.pipe';
import { ApplyLoanAdvanceComponent } from 'src/app/components/loan-and-advance/apply-loan-advance/apply-loan-advance.component';
import { ApproveLoanAdvanceComponent } from 'src/app/components/loan-and-advance/approve-loan-advance/approve-loan-advance.component';
import { LoanAdvanceComponent } from 'src/app/components/monthly-process/loan-advance/loan-advance.component';

const routes: Routes = [
  {
    path: '', component: loanAndAdvanceComponent, children: [
      { path: 'loan-mapping', component: LoanMappingComponent },
      { path: 'loan-type', component: LoanTypeComponent },
      { path: 'apply-loan-advance', component: ApplyLoanAdvanceComponent },
      { path: 'approve-loan-advance', component: ApproveLoanAdvanceComponent },
      { path: 'close-loan-advance', component: LoanAdvanceComponent },
    ]
  }
];

@NgModule({
  declarations: [loanAndAdvanceComponent,
    LoanMappingComponent,
    LoanTypeComponent,
    SearchPipe,
    ApplyLoanAdvanceComponent,
    ApproveLoanAdvanceComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    BsDatepickerModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger', // set defaults here
    }),
  ],
  providers: [DatePipe]
})
export class LoanAndAdvanceModule { }
