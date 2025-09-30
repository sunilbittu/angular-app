import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { expensesComponent } from './expenses.component';
import { CreateManageExpensesTypeComponent } from 'src/app/components/expenses/create-manage-expenses-type/create-manage-expenses-type.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { ApplyManageReimbursementsComponent } from 'src/app/components/expenses/apply-manage-reimbursements/apply-manage-reimbursements.component';
import { ApproveManageReimbursementsComponent } from 'src/app/components/expenses/approve-manage-reimbursements/approve-manage-reimbursements.component';

const routes: Routes = [
  {
    path: '', component: expensesComponent, children: [
      { path: 'create-manage-expenses-type', component: CreateManageExpensesTypeComponent },
      { path: 'apply-manage-reimbursements', component: ApplyManageReimbursementsComponent },
      { path: 'approve-manage-reimbursements', component: ApproveManageReimbursementsComponent }
    ]
  }
];

@NgModule({
  declarations: [
    expensesComponent,
    CreateManageExpensesTypeComponent,
    ApplyManageReimbursementsComponent,
    ApproveManageReimbursementsComponent
  ],
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
export class ExpensesModule { }
