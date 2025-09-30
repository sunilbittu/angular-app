import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Location} from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-asset-issues',
  templateUrl: './asset-issues.component.html',
  styleUrls: ['./asset-issues.component.css']
})
export class AssetIssuesComponent implements OnInit {
 public  issue_masterassetsform!:FormGroup
  public headers:any=["Code","Name","Branch","Department", "Designation", "Grade","Category", "Project","Devision", "Cost center","Action"];
  public employees:any=[
    {empCode:'123',name:'Rakesh',branch:"Hyd",designation:'Software Engineer',department:'IT',division:'A1',grade:'A',project:'CMS',remarks:'rr'},
    {empCode:'123',name:'Rakesh',branch:"Banglore",designation:'Marketing Head',department:'Sales',division:'A2',grade:'B',project:'HRMS',remarks:'rr'},
   ]

  constructor(public location:Location,private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.issue_masterassetsform = this.formBuilder.group({
      issue_asset_code:[''],
     issue_asset_issuedate:[''],
     issue_asset_duedate:[''],
     issue_asset_returndate:[''],
     issue_asset_remarkdate:['']
   
    })
  }
  issue_asign_assets(){
   console.log("issueassets",this.issue_masterassetsform.value)

  }
  goBack(){
    this.location.back();

  }
}
