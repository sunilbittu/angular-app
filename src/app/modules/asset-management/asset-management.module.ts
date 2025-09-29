import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AssetManagementComponent } from './asset-management.component';
import { ApplyAssetManagemntComponent } from 'src/app/components/asset-management/apply-asset-managemnt/apply-asset-managemnt.component';
import { ApproveAssetManagemntComponent } from 'src/app/components/asset-management/approve-asset-management/approve-asset-managemnt.component';
import { AssetTypeComponent } from 'src/app/components/asset-management/asset-type/asset-type.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { IssuingAssetComponent } from 'src/app/components/asset-management/issuing-asset/issuing-asset.component';
import { DamageAssetComponent } from 'src/app/components/asset-management/damage-asset/damage-asset.component';
import { RetriveAssetComponent } from 'src/app/components/asset-management/retrive-asset/retrive-asset.component';
import { VendorsComponent } from 'src/app/components/asset-management/vendors/vendors.component';
import { RepairRequestComponent } from 'src/app/components/asset-management/repair-request/repair-request.component';
import { CloseRepairRequestComponent } from 'src/app/components/asset-management/close-repair-request/close-repair-request.component';
import { NgxPaginationModule } from 'ngx-pagination';

const routes: Routes = [
  {
    path: '', component: AssetManagementComponent, children: [
      { path: 'asset-type', component: AssetTypeComponent },
      { path: 'apply-asset', component: ApplyAssetManagemntComponent },
      { path: 'approve-asset-management', component: ApproveAssetManagemntComponent },
      { path: 'issuing-asset', component: IssuingAssetComponent },
      { path: 'damage-asset', component: DamageAssetComponent },
      { path: 'retrive-asset', component: RetriveAssetComponent },
      { path: 'vendors', component: VendorsComponent },
      { path: 'repair-request', component: RepairRequestComponent },
      { path: 'close-repair-request', component: CloseRepairRequestComponent },
    ]
  }
];

@NgModule({
  declarations: [
    AssetManagementComponent,
    ApplyAssetManagemntComponent,
    AssetTypeComponent,
    ApproveAssetManagemntComponent,
    IssuingAssetComponent,
    DamageAssetComponent,
    RetriveAssetComponent,
    VendorsComponent,
    RepairRequestComponent,
    CloseRepairRequestComponent

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    BsDatepickerModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger', // set defaults here
    }),
    NgxPaginationModule
  ],
  providers: [DatePipe]
})
export class AssetManagementModule { }
