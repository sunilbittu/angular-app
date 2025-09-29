import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ManageTicketsComponent } from 'src/app/components/helpdesk/manage-tickets/manage-tickets.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgxPaginationModule } from 'ngx-pagination';
import { HelpdeskComponent } from './helpdesk.component';
import { CreateTicketComponent } from 'src/app/components/helpdesk/create-ticket/create-ticket.component';

const routes: Routes = [
  {
    path: '', component: HelpdeskComponent, children: [
      { path: 'create-ticket', component: CreateTicketComponent },
      { path: 'manage-tickets', component: ManageTicketsComponent },
    ]
  }
];

@NgModule({
  declarations: [
    HelpdeskComponent,
    ManageTicketsComponent,
    CreateTicketComponent,
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
    NgxMaterialTimepickerModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxPaginationModule
  ],
  providers: [DatePipe]
})
export class HelpdeskModule { }
