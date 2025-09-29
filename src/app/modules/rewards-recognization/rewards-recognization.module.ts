import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RewardsRecognizationComponent } from './rewards-recognization';
import { ManageRewardsAndRecognizationComponent } from 'src/app/components/rewards-recognization/manage-rewards-and-recognization/manage-rewards-and-recognization.component';
import { ApproveRewardsAndRecognizationComponent } from 'src/app/components/approve-rewards-and-recognization/approve-rewards-and-recognization.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgxPaginationModule } from 'ngx-pagination';

const routes: Routes = [
  {
    path: '', component: RewardsRecognizationComponent, children: [
      { path: 'manage-rewards-recognization', component: ManageRewardsAndRecognizationComponent },
      { path: 'approve-rewards-recognization', component: ApproveRewardsAndRecognizationComponent },
    ]
  }
];

@NgModule({
  declarations: [RewardsRecognizationComponent, ManageRewardsAndRecognizationComponent, ApproveRewardsAndRecognizationComponent],
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
export class RewardsRecognizationModule { }
