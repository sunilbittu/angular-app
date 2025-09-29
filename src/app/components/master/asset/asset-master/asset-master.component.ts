import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {Location} from '@angular/common';
import {Sort} from '@angular/material/sort';

@Component({
  selector: 'app-asset-master',
  templateUrl: './asset-master.component.html',
  styleUrls: ['./asset-master.component.css']
})
export class AssetMasterComponent implements OnInit {
  public edit_masterassetsform!:FormGroup;
  public add_masterassetsform!:FormGroup;
  public addassign_masterassetsform!:FormGroup;


  public headers1:any=["Asst Code","Name","Asset Name","Invoice  Code", "Approx Asst value.", "Group Name","Serial No", 'Asset Details', "Action"];
  public employees:any=[
    {empCode:'123',name:'Rakesh',assetName:'PC',assetCode:'456',serialNo:'123',issueDt:'1204021',dueDt:'12-04-2021',recievedDt:'12-04-2021',remarks:'rr'},
    {empCode:'123',name:'Rakesh',assetName:'PC',assetCode:'456',serialNo:'123',issueDt:'12-04-2021',dueDt:'12-04-2021',recievedDt:'12-04-2021',remarks:'rr'},
   ]
  constructor(public router:Router,private formBuilder: FormBuilder,public location:Location,) { }

  ngOnInit(): void {

    

    this.edit_masterassetsform = this.formBuilder.group({
      update_asset_code:[''],
      update_asset_name:[''],
      update_asset_group:[''],
      update_asset_details:[''],
      update_invoice_no:[''],
      update_serial_no:[''],
      update_asset_value:['']
   
    })


    this.add_masterassetsform = this.formBuilder.group({
      add_asset_code:[''],
      add_asset_name:[''],
      add_asset_group:[''],
      add_asset_details:[''],
      add_invoice_no:[''],
      add_serial_no:[''],
     add_asset_approxvalue:['']
   
    })




    this.addassign_masterassetsform = this.formBuilder.group({
      assign_asset_code:[''],
      assign_asset_name:[''],
      assign_asset_group:[''],
      assign_asset_details:[''],
      assign_invoice_no:[''],
      assign_serial_no:[''],
      assign_asset_approxvalue:[''],
      assign_asset_employeecode:[''],
      assign_asset_issuedate:[''],
      assign_asset_duedate:[''],
      assign_asset_remarks:['']
    })

  }

//update assests  method add by naveen
  update_assest(){
  console.log('assetupdatevalues',this.edit_masterassetsform.value);

  }



//add assests save method add by naveen
  add_assests(){
    console.log('ADDassetvalues',this.add_masterassetsform.value);


  }

//assign assests save method addby naveen
  assign_save(){

    console.log('assignassetvalues',this.addassign_masterassetsform.value);

  }

  asset_masterimport(){

    this.router.navigateByUrl('HRMS/Master/import-asset');
  }

  goBack(){
    this.location.back();

  }

 
}


