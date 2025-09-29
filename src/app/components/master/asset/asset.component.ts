import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AssetIssuesComponent } from './asset-issues/asset-issues.component';

@Component({
  selector: 'app-asset',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.css']
})
export class AssetComponent implements OnInit {
  public assetmovement!: FormGroup;

  
  constructor(public router:Router,private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.assetmovement = this.formBuilder.group({
      asset_title:[''],
      issue_date:[''],
      due_date:[''],
      return_date:[''],
      remarks:[''],
      empcode:[''],
    tranfer_issuedate:[''],
    transfer_duedate:[''],
   transfer_remarks: ['']

    })
   


  }

assets_assign(){


  console.log(this.assetmovement.value);
}



  asset_master(){
    
      this.router.navigateByUrl('HRMS/Master/asset-master');

      // {path: 'import-asset', component :ImportAssetsComponent},
      // {path: 'asset-master', component :AssetMasterComponent},
      // {path: 'asset-issues', component :AssetIssuesComponent},

  }
asset_issues(){

  this.router.navigateByUrl('HRMS/Master/asset-issues');
}

asset_import(){
  this.router.navigateByUrl('HRMS/Master/import-asset');

}



  public headers:any=["Emp Code","Name","Asset Name","Asset Code", "Serial No.", "Issue Date","Due Date", "Received Date","Remarks", "Action"];
  public employees:any=[
    {empCode:'123',name:'Rakesh',assetName:'PC',assetCode:'456',serialNo:'123',issueDt:'12-04-2021',dueDt:'12-04-2021',recievedDt:'12-04-2021',remarks:'rr'},
    {empCode:'123',name:'Rakesh',assetName:'PC',assetCode:'456',serialNo:'123',issueDt:'12-04-2021',dueDt:'12-04-2021',recievedDt:'12-04-2021',remarks:'rr'},
   ]
}
