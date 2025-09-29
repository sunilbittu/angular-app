import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxPaginationModule } from 'ngx-pagination';
import { applicationTrackingSystemComponent } from './application-tracking-system.component';
import { ClientsComponent } from 'src/app/components/application-tracking-system/clients/clients.component';
import { JobsComponent } from 'src/app/components/application-tracking-system/jobs/jobs.component';
import { CandidatesComponent } from 'src/app/components/application-tracking-system/candidates/candidates.component';
//import { CKEditorModule } from 'ng2-ckeditor';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { ArchiveComponent } from 'src/app/components/application-tracking-system/archive/archive.component';
import { ReferralComponent } from 'src/app/components/application-tracking-system/referral/referral.component';
import { HiringPerformanceComponent } from 'src/app/components/application-tracking-system/hiring-performance/hiring-performance.component';
import { MatTableModule } from '@angular/material/table';
import { SortableTableDirective } from 'src/app/components/application-tracking-system/sortable-table.directive';
import { SortableColumnComponent } from 'src/app/components/application-tracking-system/sortable-column/sortable-column.component';
import { NgSelectModule } from '@ng-select/ng-select';

const routes: Routes = [
  {
    path: '', component: applicationTrackingSystemComponent, children: [
      { path: 'clients', component: ClientsComponent },
      { path: 'jobs', component: JobsComponent },
      { path: 'candidates', component: CandidatesComponent },
      { path: 'referral', component: ReferralComponent },
      { path: 'archive', component: ArchiveComponent },
      { path: 'hiring-performance', component: HiringPerformanceComponent }
    ]
  }
];

@NgModule({
  declarations: [
    applicationTrackingSystemComponent,
    ClientsComponent,
    JobsComponent,
    CandidatesComponent,
    ArchiveComponent,
    ReferralComponent,
    HiringPerformanceComponent,
    SortableColumnComponent,
    SortableTableDirective,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    BsDatepickerModule.forRoot(),
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger', // set defaults here
    }),
    NgxPaginationModule,
   // CKEditorModule,
    MatMenuModule,
    MatIconModule,
    MatTableModule
  ],
  exports: [
    MatMenuModule,
  ],
  providers: [DatePipe]
})
export class ApplicationTrackingSystemModule { }
