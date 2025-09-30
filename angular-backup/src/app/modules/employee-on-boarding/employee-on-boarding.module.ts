import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { employeeOnBoardingComponent } from './employee-onBoarding.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { RouterModule,Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RequestProcessingComponent } from 'src/app/components/employee-onBoarding/request-processing/request-processing.component';
import { MappingComponent } from 'src/app/components/employee-onBoarding/InternalJob-movement/mapping/mapping.component';
import { ReferralRecruitmentComponent } from 'src/app/components/employee-onBoarding/referral-recruitment/referral-recruitment.component';
import { ShortListedCandidatesComponent } from 'src/app/components/employee-onBoarding/short-listed-candidates/short-listed-candidates.component';
import { OnboardingEmployeeMailComponent } from 'src/app/components/employee-onBoarding/short-listed-candidates/onboarding-employee-mail/onboarding-employee-mail.component';
import { BackgroundVerificationComponent } from 'src/app/components/employee-onBoarding/background-verification/background-verification.component';

import { NewResorceIndentRequestComponent } from 'src/app/components/employee-onBoarding/new-resorce-indent-request/new-resorce-indent-request.component';
import { BudgetApprovalComponent } from 'src/app/components/employee-onBoarding/budget-approval/budget-approval.component';
import { OnboardingEmployeeComponent } from 'src/app/components/employee-onBoarding/onboarding-employee/onboarding-employee.component';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { ManageOnBoardingEmployeesComponent } from 'src/app/components/employee-onBoarding/manage-on-boarding-employees/manage-on-boarding-employees.component';
import { ManageEmployeeResignationComponent } from 'src/app/components/employee-onBoarding/manage-employee-resignation/manage-employee-resignation.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { OfferletterRolloutComponent } from 'src/app/components/employee-onBoarding/offerletter-rollout/offerletter-rollout.component';
import { AlignForInterviewComponent } from 'src/app/components/employee-onBoarding/align-for-interview/align-for-interview.component';
import { ScreeningCandidatesComponent } from 'src/app/components/employee-onBoarding/screening-candidates/screening-candidates.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { HrRoundComponent } from 'src/app/components/employee-onBoarding/hr-round/hr-round.component';
import { TechnicalRoundComponent } from 'src/app/components/employee-onBoarding/technical-round/technical-round.component';
import { NgxPaginationModule } from 'ngx-pagination';

const routes: Routes = [
 {path: '', component: employeeOnBoardingComponent, children: [
  { path: 'requesting-process', component: RequestProcessingComponent },
  { path: 'manage-onboarding-employees', component: ManageOnBoardingEmployeesComponent },
  { path: 'manage-employee-resignation', component: ManageEmployeeResignationComponent },
  { path: 'internal-jobMovement', component: MappingComponent },
  { path: 'referral-Recruitment', component: ReferralRecruitmentComponent },
  { path: 'shortListed-candidates', component: ShortListedCandidatesComponent },
  // { path: 'onboarding-employee', component: OnboardingEmployeeMailComponent },
  { path: 'background-verification', component: BackgroundVerificationComponent },
  { path: 'onboarding-employee-mails', component: OnboardingEmployeeMailComponent },
  { path: 'new-Resorce-IndentRequest', component: NewResorceIndentRequestComponent },
  { path: 'budget-approval', component: BudgetApprovalComponent },
  { path: 'onboarding-employee', component: OnboardingEmployeeComponent },
  { path: 'onboarding-offer-letter-rollout', component: OfferletterRolloutComponent },
  { path: 'screening-candidate', component: ScreeningCandidatesComponent },
  { path: 'align-for-interview', component: AlignForInterviewComponent},
  { path: 'technical-round', component: TechnicalRoundComponent},
  { path: 'hr-round', component: HrRoundComponent }
  ]}

]
@NgModule({
  declarations: [
    employeeOnBoardingComponent,
    RequestProcessingComponent,
    MappingComponent,
    ReferralRecruitmentComponent,
    ShortListedCandidatesComponent,
    OnboardingEmployeeMailComponent,
    BackgroundVerificationComponent,
    NewResorceIndentRequestComponent,
    BudgetApprovalComponent,
    OnboardingEmployeeComponent,
    ManageOnBoardingEmployeesComponent,
    ManageEmployeeResignationComponent,
    OfferletterRolloutComponent,
    ScreeningCandidatesComponent,
    AlignForInterviewComponent,
    HrRoundComponent,
    TechnicalRoundComponent
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
    NgMultiSelectDropDownModule.forRoot(),
    NgxMaterialTimepickerModule,
    NgxPaginationModule
  ],
  providers:[DatePipe]
})
export class EmployeeOnBoardingModule { }
