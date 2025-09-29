import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule , Routes} from '@angular/router';
import { EditCompanyComponent } from 'src/app/components/company/edit-company/edit-company.component';
import { companyComponent } from './copanycomponent';
import { BankDetailsComponent } from 'src/app/components/company/bank-details/bank-details.component';
import { TANDetailsComponent } from 'src/app/components/company/tandetails/tandetails.component';

const routes:Routes=[
  {path:'',component:companyComponent,children:[
    {path: 'edit-company', component : EditCompanyComponent},
    {path: 'bank-details', component : BankDetailsComponent},
    {path: 'tan-details', component : TANDetailsComponent},


]}
];

@NgModule({
  declarations: [
    companyComponent,
    // EditCompanyComponent,
  ],
  imports: [ 
    CommonModule,
    RouterModule.forChild(routes), 

  ]
})
export class CompanyModule { }
