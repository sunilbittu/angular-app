import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TrainingComponent } from './training.component';
import { ManageTrainersComponent } from 'src/app/components/training/manage-trainers/manage-trainers.component';
import { TechnologyMasterComponent } from 'src/app/components/training/technology-master/technology-master.component';
import { ManageTrainingComponent } from 'src/app/components/training/manage-training/manage-training.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ManageAttandenceComponent } from 'src/app/components/training/manage-attandence/manage-attandence.component';
import { UploadMaterialsComponent } from 'src/app/components/training/upload-materials/upload-materials.component';
import { ManageResultsAssesmentComponent } from 'src/app/components/training/manage-results-assesment/manage-results-assesment.component';
import { FeedbackComponent } from 'src/app/components/training/feedback/feedback.component';
import { FeedbackListComponent } from 'src/app/components/training/feedback-list/feedback-list.component';
import { NgxPaginationModule } from 'ngx-pagination';

const routes: Routes = [
  {
    path: '', component: TrainingComponent, children: [
      { path: 'manage-trainers', component: ManageTrainersComponent },
      { path: 'technology-master', component: TechnologyMasterComponent },
      { path: 'manage-training', component: ManageTrainingComponent },
      { path: 'upload-material', component: UploadMaterialsComponent },
      { path: 'manage-results-assessment', component: ManageResultsAssesmentComponent },
	  { path: 'manage-attandence', component: ManageAttandenceComponent },
      { path: 'training-feedback', component: FeedbackComponent },
      { path: 'feedback-list', component: FeedbackListComponent },
    ]
  }
];

@NgModule({
  declarations: [
    TrainingComponent,
    TechnologyMasterComponent,
    ManageTrainersComponent,
    ManageTrainingComponent,
    UploadMaterialsComponent,
	ManageAttandenceComponent,
    ManageResultsAssesmentComponent,
    FeedbackComponent,
    FeedbackListComponent,
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
export class TrainingModule { }
