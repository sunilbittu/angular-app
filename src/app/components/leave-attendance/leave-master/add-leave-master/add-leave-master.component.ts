import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { Subscription } from 'rxjs';
import { ShareDataService } from 'src/app/services/sharaData.service';
import { FormGroup, FormControl, Validators, FormBuilder, NgForm } from '@angular/forms';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-add-leave-master',
  templateUrl: './add-leave-master.component.html',
  styleUrls: ['./add-leave-master.component.css']
})
export class AddLeaveMasterComponent implements OnInit {

  constructor(public location:Location,public leaveMasterDataService:ShareDataService,public fb: FormBuilder,
              private crudOperationsService:CrudOperationsService) { }
  public subscription:any;
  public leaveMasterData:any;
  public title:string="";
  public togglebtn:boolean=true;
  //multiselect
  public branches:any=['Vizag','Hyd','Pune','Bangalore','Delhi'];
  public grades:any=['A1','A2','B1','B2','C1','C2'];
  public divisions:any=['A','B','C','D','E'];

  dropdownList:any = [];
  dropdownList1:any = [];

  selectedItems:any = [];
  dropdownSettings:any = {};
  
  ngOnInit(): void {

    this.branches = [
      { id: 1, item_text: 'Mumbai' },
      { id: 2, item_text: 'Bangaluru' },
      { id: 3, item_text: 'Pune' },
      { id: 4, item_text: 'Navsari' },
      { id: 5, item_text: 'New Delhi' }
    ];
    this.grades = [
      { id: 1, item_text: 'A1' },
      { id: 2, item_text: 'A2' },
      { id: 3, item_text: 'V1' },
      { id: 4, item_text: 'V2' },
      { id: 5, item_text: 'B3' }
    ];
    this.divisions = [
      { id: 1, item_text: 'A' },
      { id: 2, item_text: 'B' },
      { id: 3, item_text: 'V' },
      { id: 4, item_text: 'C' },
      { id: 5, item_text: 'D' }
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: true
    };

    this.subscription = this.leaveMasterDataService.currentMessage.subscribe((message) =>{
      this.leaveMasterData = message
      console.log('data',this.leaveMasterData);
      
    });
    
    if(this.leaveMasterData=='Add'){
      this.title='Add';
      this.togglebtn=true;
      console.log('add',this.togglebtn);   

    }
    else{
      this.title='Update';
      this.togglebtn=false;
      console.log(this.togglebtn);   
    }
  }
 public form = this.fb.group({
    leaveType: ["", Validators.required],
    noDays: ["", Validators.required],
    leaveDescription: ["", Validators.required],
    Entitlement: ["", Validators.required],
    Accrual: ["", Validators.required],
    creditminDays: ["", Validators.required],
    creditLeaves: ["", Validators.required],
    availAfter: ["", Validators.required],
    donotClub: ["", Validators.required],
    leaveDays: ["", Validators.required],
    remark: ["", Validators.required],
    carryforward: [1, Validators.required],
    priorApproval: ["", Validators.required],
    InterveningWeekoff: ["", Validators.required],
    InterveningHolidays: ["", Validators.required],
    allowHalf: ["", Validators.required],
    allowNegative: ["", Validators.required],
    proRata: ["", Validators.required],
    allowEncash: ["", Validators.required],
    applyEss: ["", Validators.required],
    payslip: ["", Validators.required],
    CarryforwardLimit: ["", Validators.required],
    MaximumLeave: ["", Validators.required],
    minLeave: ["", Validators.required],
    maxLeavesMonth: ["", Validators.required],
    displayMsg: ["", Validators.required],
    ESIC: ["", Validators.required],
    Division: ["", Validators.required],


  });
  saveLeaveMaster(){
    console.log('form',this.form.value);
    this.crudOperationsService.create(this.form.value,'api').subscribe((data)=>{

    });
  }
  updateLeaveMaster(){
    this.crudOperationsService.update(this.form.value,'api').subscribe((data)=>{

    });
  }
  backClicked() {
    this.location.back();
  }
  onItemSelect(data:any){
    console.log('data',data);
  }
  onSelectAll(event:any){
    console.log('data',event);
  }
}
