import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { EmployeeMastersService } from '../../master/employee.masters.service';
declare var $: any;


@Component({
  selector: 'app-technology-master',
  templateUrl: './technology-master.component.html',
  styleUrls: ['./technology-master.component.css']
})
export class TechnologyMasterComponent implements OnInit {


  
  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure you want delete';

  public headers: any = ["Technology Code", "Technology Name", "Action"];
 

  public exist:boolean=false;
  public exist2:boolean=false;
  public requiredErrorText = 'can\'t be blank';
  public submitted: boolean=false;


  public technologyMastersForm!: FormGroup;
  public editButtonEnable!: boolean;
  public currencyList!: any[];
  public currencyObject!: any;
  public technologyId!: any;
  public currencyMasterList!: any[];

  public companyId!: number;



  constructor(private formBuilder: FormBuilder, private employeMasterService: EmployeeMastersService,
    private notification: NotifierService,private crudOperationsService:CrudOperationsService) { }

  ngOnInit(): void {
console.log(this.editButtonEnable,"editbutton value")
    this.technologyMastersForm = this.formBuilder.group({

      technologyCode: ['', Validators.required],
      technologyName: ['', Validators.required]
    })

    //get currency list
    this.fetchCurrencyList();
  }


  get form_() { return this.technologyMastersForm.controls; };



  //clear form values
  modelShow() {
console.log(this.editButtonEnable,"editbutton value")

    this.exist=false;
    this.exist2=false;
    this.technologyMastersForm.reset();
    //hide edit button
    this.editButtonEnable = false;

  }

  //get currency list
  fetchCurrencyList() {
    //getting companyId from session-storage
    this.companyId = Number(sessionStorage.getItem('companyId'));
    this.employeMasterService.getTechnologyList( this.companyId )
      .subscribe((data: any) => {

        this.currencyList = data.data.content;
      },
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }

  checkIfalreadyExist2(typedCode:any){
console.log(this.editButtonEnable,"editbutton value")

    if(this.editButtonEnable == true){
      
let currencyList2:any[]=this.currencyList.filter(y=> y.technologyId != this.technologyId);

      let code:any[] =currencyList2.filter(
        x => x.technologyCode.toLowerCase() ==typedCode.toLowerCase() );
  
        if(code.length > 0){
          this.exist2=true;
        }else{
          this.exist2=false;
        }
    }else{
      let code:any[] =this.currencyList.filter(
        x => x.technologyCode.toLowerCase() ==typedCode.toLowerCase() );
  
        if(code.length > 0){
          this.exist2=true;
        }else{
          this.exist2=false;
        }
    }
   

  }
  

  checkIfalreadyExist(typedName:any){

    if(this.editButtonEnable == true){
      
let currencyList2:any[]=this.currencyList.filter(y=> y.technologyId != this.technologyId);
      let name:any[] =currencyList2.filter(
        x => x.technologyName.toLowerCase() ==typedName.toLowerCase() );
  
        if(name.length > 0){
          this.exist=true;
        }else{
          this.exist=false;
        }
    }else{
      let name:any[] =this.currencyList.filter(
        x => x.technologyName.toLowerCase() ==typedName.toLowerCase() );
  
        if(name.length > 0){
          this.exist=true;
        }else{
          this.exist=false;
        }
    }
  

 
  }


  //update currency master
  updateCurrencyMaster(id: number) {
console.log(this.editButtonEnable,"editbutton value")


    this.submitted=true;
  
    if(this.technologyMastersForm.valid == true && this.exist == false && this.exist2 == false){

    this.currencyObject =
    {

      "technologyId": this.technologyId,
      "technologyCode": this.technologyMastersForm.value.technologyCode,
      "technologyName": this.technologyMastersForm.value.technologyName,
     
      "company":{
          "companyId":  this.companyId
      }
  
  }

  this.employeMasterService.updateTechnologyMaster(this.technologyId,this.currencyObject)
  .subscribe((data:any)=>{
    this.submitted = false;

    this.notification.notify('success', data.message);
    $('#employeeModelPopup').modal('hide');
     //get currency list
     this.fetchCurrencyList();
  }
  ,
      (error) => {
        this.notification.notify('error', 'Something Went Worng');
      })

    }
  }


  //delete currencyMaster
  deleteCurrencyById(id:number){
console.log(this.editButtonEnable,"editbutton value")

    this.employeMasterService.deleteTechnologyListById(id)
    .subscribe((data:any)=>{
      this.notification.notify('success', data.message);
       //get currency list
     this.fetchCurrencyList();
    }
    ,
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }

  //append form controls
  editCurrency(id: number) {
console.log(this.editButtonEnable,"editbutton value")


    //show edit button
    this.editButtonEnable = true;

    this.technologyId = id

    this.employeMasterService.getTechnologyMasterById(id)
      .subscribe((data: any) => {
        const currencyListById = data.data[0]
        this.technologyMastersForm.patchValue({
          technologyCode: currencyListById.technologyCode,
          technologyName: currencyListById.technologyName
        })
      }
      ,
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }


  //submit form data
  onSubmit() {
console.log(this.editButtonEnable,"editbutton value")

    this.submitted = true;

    if (this.technologyMastersForm.valid == true && this.exist == false && this.exist2 == false) {

    $('#employeeModelPopup').modal('hide');

    this.currencyObject =
    {

      
      "technologyCode": this.technologyMastersForm.value.technologyCode,
      "technologyName": this.technologyMastersForm.value.technologyName,
     
      "company":{
          "companyId":  this.companyId
      }
  
  }

  console.log(this.currencyObject)

  this.employeMasterService.postTechnologyMaster(this.currencyObject)
  .subscribe((data:any)=>{
    this.notification.notify('success', data.message);
    this.submitted = false;

     //get currency list
     this.fetchCurrencyList();
  }
  ,

        (error) => {

          error instanceof HttpErrorResponse

          console.log(error)
          
         if(error.error.status == 406){

          this.notification.notify('error', 'technologyName/technologyCode Already Exits');
         }

         else{

          this.notification.notify('error', 'Something Went Wrong');

         }
      })
    }
  }
  
  getCurrencyListBySearchParam($event: any) {
console.log(this.editButtonEnable,"editbutton value")

    const param = $event.target.value;

    if (param.trim() == "") {
      //geting agents list
      this.fetchCurrencyList();
    }

    else {
      //alert($event.target.value);
      


      let api: any = "technologymaster/list_company/1?searchParam="+param;

      this.crudOperationsService.getList(api)
    .subscribe((data: any)=>{
      this.currencyList = data.data.content;

          
          //spinner hide
          //this.spinner.hide();

        },
          (error) => {

            console.log(error);

            //spinner hide
            //this.spinner.hide();

            


          })


    }




  }



}
