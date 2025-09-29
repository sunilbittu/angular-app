import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { incometaxComponent } from './incometax.component';
import { InvestmentsComponent } from 'src/app/components/incometax/investments/investments.component';
import { InvestmentReportComponent } from 'src/app/components/incometax/investment-report/investment-report.component';
import { TdsProjectionComponent } from 'src/app/components/incometax/tds-projection/tds-projection.component';
import { ChallanDepositeComponent } from 'src/app/components/incometax/challan-deposite/challan-deposite.component';
import { TDSQuaterlyReturnComponent } from 'src/app/components/incometax/tdsquaterly-return/tdsquaterly-return.component';
import { Form16Component } from 'src/app/components/incometax/form16/form16.component';
import { TDSYearComponent } from 'src/app/components/incometax/tdsyear/tdsyear.component';
import { CheckInvestmentComponent } from 'src/app/components/incometax/investments/check-investment/check-investment.component';
import { AddInvestmentComponent } from 'src/app/components/incometax/investments/add-investment/add-investment.component';
import { InvestmentTableComponent } from 'src/app/components/incometax/investments/investment-table/investment-table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TdsInvestmentComponent } from 'src/app/components/incometax/tds-investment/tds-investment.component';
import { ViewTdsDetailsComponent } from 'src/app/components/incometax/tdsquaterly-return/view-tds-details/view-tds-details.component';
import { AddChallanComponent } from 'src/app/components/incometax/challan-deposite/add-challan/add-challan.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { UploadForm16Component } from 'src/app/components/incometax/upload-form16/upload-form16.component';
import { IncometaxSlabComponent } from 'src/app/components/incometax/incometax-slab/incometax-slab.component';
import { EISSlabComponent } from 'src/app/components/incometax/eis-slab/eis-slab.component';
import { EPFSlabComponent } from 'src/app/components/incometax/epf-slab/epf-slab.component';
import { SOCSOSlabComponent } from 'src/app/components/incometax/socso-slab/socso-slab.component';
import { KPISlabComponent } from 'src/app/components/incometax/kpi-slab/kpi-slab.component';
const routes: Routes = [
  {
    path: '', component: incometaxComponent, children: [
      //Income-Tax Module
      { path: 'investments', component: InvestmentsComponent },
      {
        path: 'check-investments', component: CheckInvestmentComponent, children: [
          { path: 'investments-table', component: InvestmentTableComponent },
          { path: 'add-investments', component: AddInvestmentComponent },
        ]
      },
      { path: 'investments-reports', component: InvestmentReportComponent },
      { path: 'tds-projection', component: TdsProjectionComponent },
      { path: 'challan-deposite', component: ChallanDepositeComponent },
      { path: 'tds-quaterly', component: TDSQuaterlyReturnComponent },
      { path: 'form-16', component: Form16Component },
      { path: 'tds-year', component: TDSYearComponent },
      { path: 'tds-investment', component: TdsInvestmentComponent },
      { path: 'tds-details', component: ViewTdsDetailsComponent },
      { path: 'add-challan', component: AddChallanComponent },
      { path: 'upload-form16', component: UploadForm16Component },
      { path: 'incometax-slab', component: IncometaxSlabComponent },
      { path: 'eis-slab', component: EISSlabComponent },
      { path: 'epf-slab', component: EPFSlabComponent },
      { path: 'socso-slab', component: SOCSOSlabComponent },
      { path: 'kpi-slab', component: KPISlabComponent },



    ]
  }
];
@NgModule({
  declarations: [
    incometaxComponent,
    InvestmentsComponent,
    InvestmentReportComponent,
    TdsProjectionComponent,
    ChallanDepositeComponent,
    TDSQuaterlyReturnComponent,
    Form16Component,
    TDSYearComponent,
    CheckInvestmentComponent,
    AddInvestmentComponent,
    InvestmentTableComponent,
    TdsInvestmentComponent,
    ViewTdsDetailsComponent,
    AddChallanComponent,
    UploadForm16Component,
    IncometaxSlabComponent,
    EISSlabComponent,
    EPFSlabComponent,
    SOCSOSlabComponent,
    KPISlabComponent,

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    BsDatepickerModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    NgSelectModule,
  ],
  providers: [DatePipe]

})
export class IncomeTaxModule { }
