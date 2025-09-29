import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { AddEmployeeService } from '../../addEmplyee.service';
import { EmployeeMastersService } from '../../../master/employee.masters.service';
declare var $: any;

@Component({
  selector: 'app-other-info',
  templateUrl: './other-info.component.html',
  styleUrls: ['./other-info.component.css']
})



export class OtherInfoComponent implements OnInit {
  public companyId: any = Number(sessionStorage.getItem("companyId"));
  selectedItemsWeek1: any = [];
  selectedItemsWeek2: any = [];
  public dropdownSettings: any = [];
  public dropdownList: any = [];
  public otherInfoForm: any;
  public weekOffDayValue1: any = [];
  public weekOffDayValue2!: any[];
  public otherInfoObject!: any;
  public employeeId!: number;
  public reportingList!: any[];
  public reportingOfficer: any;
  public enableEditButton: any;
  public enableShiftEditButton: any;
  public EmployeeShiftById!: any;
  public submitted: boolean=false;
  public submitted2: boolean=false;
  public requiredErrorText = 'can\'t be blank';

  public listOfEmployeeResults1:any[]=[];
  public successCount: any;
  public showErrorMsg: boolean=false;
  public errorCount: any;
  public editEmployeeId:any=sessionStorage.getItem("Edit-employeeId");
  public showSuccessMsg: boolean=false;
  public employeeContractForm: any;
  public employeeVaccineForm: any;
  public vaccinationList: any =[];
  public employeeContractObject!: any;
  public employeeContractList!: any[];
  public employeeVaccineList!: any[];
  public contractById: any;
  public cancelClicked: any;

  public pageNumbers: any;
  public selectedPageNumber: number = 0;

  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure you want delete';
  public isfileSelected: boolean=false;
  public isDateSelected: boolean=false;

  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe,private employeMasterService: EmployeeMastersService,
    private notificationService: NotifierService, private crudeService: CrudOperationsService,
    private addEmployeeService: AddEmployeeService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    //load multiselector data
    this.loadMultiSelectorValue();

    //getting reporting head details
    //this.getReportingEmployeesById(this.employeeId);

    //get employee Record If Exits
    this.getEmployeeById(this.employeeId);

    //get employeeContractList
    this.fetchEmployeeContract(this.employeeId);

    this.fetchEmployeeVaccine(this.employeeId);
    
    this.fetchVaccinationList();

    this.otherInfoForm = this.formBuilder.group({

      shiftName: [],
      weekDay1: ['Default'],

      weekDay2: ['Default'],

      punch: [],
      otApplicable: [],
      otReportingHead: ['']
    })

    this.employeeContractForm = this.formBuilder.group({

      employeeOncontract: ['',Validators.required],
      fromDate: [],
      toDate: [],
      contractDetailsRemarks: ['',Validators.required]
    })

    this.employeeVaccineForm = this.formBuilder.group({

      employeeOncontract: ['',Validators.required],
      fromDate: [],
      doseType: [],
      documentFile: [],
      contractDetailsRemarks: []
    })

  }

  get form_() { return this.employeeContractForm.controls; };
  get form2_() { return this.employeeVaccineForm.controls; };


  //check employee Record Exits
  getEmployeeById(id: number) {
    let api: any = "employeeshiftandcontractdetail/list_by_employee/" + id
    this.crudeService.getList(api)
      .subscribe((data: any) => {
        this.EmployeeShiftById = data.data;
        if (this.EmployeeShiftById != null) {

          //enable Edit button
          this.enableShiftEditButton = true;

          this.otherInfoForm.patchValue({
            shiftName: this.EmployeeShiftById.shiftName,
            weekDay1: this.EmployeeShiftById.weekOff1,

            weekDay2: this.EmployeeShiftById.weekOff2,

            punch: this.EmployeeShiftById.punch,
            otApplicable: this.EmployeeShiftById.otApplicable,
            otReportingHead: this.EmployeeShiftById.otReportingHead
          })
        }

      })
  }

  //getting reporting head details
  // getReportingEmployeesById(id:number){
  //   return this.addEmployeeService.getReportingEmployeeById(id)
  //   .subscribe((data:any)=>{
  //     this.reportingList = data.data;

  //   })
  // }


  loadMultiSelectorValue() {

    //getting employeeId from sessionStorage
    this.employeeId = Number(sessionStorage.getItem('Edit-employeeId'));

    this.dropdownList = [
      { "id": 1, "itemName": "All" },
      { "id": 2, "itemName": "First" },
      { "id": 3, "itemName": "Second" },
      { "id": 4, "itemName": "Third" },
      { "id": 5, "itemName": "Fourth" },
      { "id": 6, "itemName": "Fifth" },

    ];

    this.dropdownSettings = {
      singleSelection: false,
      enableCheckAll: false,
      idField: 'id',
      textField: 'itemName',
      selectAllText: false,
      unSelectAllText: false,
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }





  //getting reporting officerText
  getReportingOfficerText($event: any) {

    this.reportingOfficer = $event.target.options[$event.target.options.selectedIndex].text;

    //alert(this.reportingOfficer); 

  }

  onItemSelectWeek1(data: any) {
    // console.log(this.selectedItemsWeek1);
    this.weekOffDayValue1 = [];
    this.selectedItemsWeek1.forEach((element: any) => {
      this.weekOffDayValue1.push(element.itemName);

    });
  }

  onItemDeSelectWeek1(data: any) {
    //console.log(this.selectedItemsWeek1);
    this.weekOffDayValue1 = [];
    this.selectedItemsWeek1.forEach((element: any) => {
      this.weekOffDayValue1.push(element.itemName);

    });
  }



  onItemSelectWeek2(data: any) {

    // console.log(this.selectedItemsWeek2);
    this.weekOffDayValue2 = [];
    this.selectedItemsWeek2.forEach((element: any) => {
      this.weekOffDayValue2.push(element.itemName);

    });
  }

  onItemDeSelectWeek2(data: any) {

    //console.log(this.selectedItemsWeek2);
    this.weekOffDayValue2 = [];
    this.selectedItemsWeek2.forEach((element: any) => {
      this.weekOffDayValue2.push(element.itemName);

    });
  }


  updateShiftDetails() {

    this.otherInfoObject =


    {

      "shiftId": this.EmployeeShiftById.shiftId,
      "shiftName": this.otherInfoForm.value.shiftName,
      "otApplicable": this.otherInfoForm.value.otApplicable,
      "otReportingHead": this.otherInfoForm.value.otReportingHead,
      "punch": this.otherInfoForm.value.punch,
      "weekOff1": this.otherInfoForm.value.weekDay1,
      "weekOff1Value": this.weekOffDayValue1.toString(),
      "weekOff2": this.otherInfoForm.value.weekDay2,
      "weekOff2Value": this.weekOffDayValue2.toString(),
      "createdBy": this.EmployeeShiftById.createdBy,
      "createdDate": this.EmployeeShiftById.createdDate,
      "isDeleted": this.EmployeeShiftById.isDeleted,
      "employee": {
        "employeeId": this.employeeId
      }
    }


    let api: any = "employeeshiftandcontractdetail/" + this.EmployeeShiftById.shiftId
    this.crudeService.update(this.otherInfoObject, api)
      .subscribe((data: any) => {
        this.notificationService.notify('success', data.message);

        //call getById function
        this.getEmployeeById(this.employeeId);
      },
        (error) => {
          this.notificationService.notify('error', 'Something Went Wrong');
           //show hide
           this.spinner.hide();
        })



  }


  onSubmit() {

    this.otherInfoObject =


    {

      "shiftName": this.otherInfoForm.value.shiftName,
      "otApplicable": this.otherInfoForm.value.otApplicable,
      "otReportingHead": this.otherInfoForm.value.otReportingHead,
      "punch": this.otherInfoForm.value.punch,
      "weekOff1": this.otherInfoForm.value.weekDay1,
      "weekOff1Value": this.weekOffDayValue1.toString(),
      "weekOff2": this.otherInfoForm.value.weekDay2,
      "weekOff2Value": this.weekOffDayValue2.toString(),
      "employee": {
        "employeeId": this.employeeId
      }
    }


    let api: any = "employeeshiftandcontractdetail"
    this.crudeService.create(this.otherInfoObject, api)
      .subscribe((data: any) => {
        this.notificationService.notify('success', data.message);

      },
        (error) => {
          this.notificationService.notify('error', 'Something Went Wrong');
           //show hide
           this.spinner.hide();
        })


  }



  //employee contract details block


  fetchEmployeeContract(id: number) {

    let api: any = "employeescontractdetail/list_by_employee/" + id
    this.crudeService.getList(api)
      .subscribe((data: any) => {
        this.employeeContractList = data.data.content;
        this.pageNumbers = new Array(data.data.totalPages);
        console.log('totalPages ' + this.pageNumbers);
      })
  }

  fetchEmployeeVaccine(id: number) {

    let api: any = "employeescontractdetail/getEmployeeVaccineDetails/" + id
    this.crudeService.getList(api)
      .subscribe((data: any) => {
        this.employeeVaccineList = data.data.content;
        this.pageNumbers = new Array(data.data.totalPages);
        console.log('totalPages ' + this.pageNumbers);
      })
  }


  //pagination function
  pageChange(id: number) {
    //alert(id);

    this.selectedPageNumber = id;

    let api: any = "employeescontractdetail/list_by_employee/" + this.employeeId


    this.crudeService.getPaginationList(api, id)
      .subscribe((data: any) => {
        this.employeeContractList = data.data.content;
      })

  }



  //nextPage click
  nextPage() {

    //alert(this.selectedPageNumber);

    let page = this.selectedPageNumber + 1;

    let api: any = "employeescontractdetail/list_by_employee/" + this.employeeId


    this.crudeService.getPaginationList(api, page)
      .subscribe((data: any) => {
        this.employeeContractList = data.data.content;
      })

  }
  public selectedFile:any;
  onFileChanged(event :any){
    this.isfileSelected=true;
    this.selectedFile = event.target.files[0];
    console.log('file',this.selectedFile);
  }

  fetchVaccinationList() {
    this.employeMasterService.getVaccinationList(this.companyId)
      .subscribe((data: any) => {
        this.vaccinationList = data.data.content;
      },
        (error) => {
          this.notificationService.notify('error', 'Something Went Worng');
        })
  }

  downloadDocumentAttachment(filePath: string, fileName: string) {
    let downloadApi = 'employeeinvestment/investmentresourcedownload?filePath=' + filePath;
    this.crudeService.downloadDocument(downloadApi)
      .subscribe((response: any) => {
        let blob: any = new Blob([response], { type: "application/octet-stream" }); // must match the Accept type
        const filename = fileName;
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        console.log(fileName)
        anchor.download = filename;
        anchor.href = url;
        anchor.click();
      },
        (error) => {
          this.notificationService.notify('error', 'Error while downloading the file');
        }
      )
  }


  //previous function

  previousPage() {


    let page = this.selectedPageNumber - 1;



    let api: any = "employeescontractdetail/list_by_employee/" + this.employeeId + "/?page=" + page
    this.crudeService.getList(api)
      .subscribe((data: any) => {
        this.employeeContractList = data.data.content;

      })

  }



  editEmployeeContract(id: number) {

    //spinner show
    this.spinner.show();


    this.enableEditButton = true;

    let api: any = "employeescontractdetail/" + id;
    this.crudeService.getList(api)
      .subscribe((data: any) => {
        this.contractById = data.data;

        //spinner hide
        this.spinner.hide();
        
        let fromDate = new Date(this.contractById.contractFrom)
        let toDate = new Date(this.contractById.contractTo)

        this.employeeContractForm.patchValue({


          employeeOncontract: this.contractById.employeeOnContract,
          fromDate: fromDate,
          toDate: toDate,
          contractDetailsRemarks: this.contractById.contractDetailsRemarks

        })
      },
      (error:any)=>{
         //show hide
         this.spinner.hide();
      })
  }


  updateEmployeeContract() {

    //spinner show
    this.spinner.show();

    let fromDate = new Date(this.employeeContractForm.value.fromDate)
    let toDate = new Date(this.employeeContractForm.value.toDate)
    this.employeeContractObject =

    {
      "EmployeeContractId": this.contractById.employeeContractId,
      "employeeOnContract": this.employeeContractForm.value.employeeOncontract,
      "contractFrom": fromDate,

      "contractTo": toDate,
      "contractDetailsRemarks": this.employeeContractForm.value.contractDetailsRemarks,
      "employee": {
        "employeeId": this.employeeId
      }
    }


    let api: any = "employeescontractdetail/" + this.contractById.employeeContractId
    this.crudeService.update(this.employeeContractObject, api)
      .subscribe((data: any) => {
        this.notificationService.notify('success', data.message);
        this.employeeContractForm.reset();
        //spinner hide
        this.spinner.hide();
        this.fetchEmployeeContract(this.employeeId);
      },
        (error) => {
          this.notificationService.notify('error', 'Something Went Wrong');
           //show hide
           this.spinner.hide();
        })
  }


  deleteEmployeeContract(id: number) {

    //spinner show
    this.spinner.show();

    let api: any = "employeescontractdetail/" + id
    this.crudeService.delete(api)
      .subscribe((data: any) => {
        this.notificationService.notify('success', data.message);

        //spinner hide
        this.spinner.hide();
        this.fetchEmployeeContract(this.employeeId);
      },
        (error) => {
          this.notificationService.notify('error', 'Something Went Wrong');
           //show hide
           this.spinner.hide();
        })
  }

  deleteEmployeeVaccine(id: number) {

    //spinner show
    this.spinner.show();

    let api: any = "employeescontractdetail/deleteVaccine/" + id
    this.crudeService.delete(api)
      .subscribe((data: any) => {
        this.notificationService.notify('success', data.message);

        //spinner hide
        this.spinner.hide();
        this.fetchEmployeeVaccine(this.employeeId);
      },
        (error) => {
          this.notificationService.notify('error', 'Something Went Wrong');
           //show hide
           this.spinner.hide();
        })
  }


  onContractSubmit() {

    this.submitted=true;
    if(this.employeeContractForm.valid){
    //spinner show
    this.spinner.show();


    let fromDate = new Date(this.employeeContractForm.value.fromDate)
    let toDate = new Date(this.employeeContractForm.value.toDate)

    this.employeeContractObject =

    {
      "employeeOnContract": this.employeeContractForm.value.employeeOncontract,
      "contractFrom": fromDate,
      "contractTo": toDate,
      "contractDetailsRemarks": this.employeeContractForm.value.contractDetailsRemarks,
      "employee": {
        "employeeId": this.employeeId
      }
    }


    let api: any = "employeescontractdetail"
    this.crudeService.create(this.employeeContractObject, api)
      .subscribe((data: any) => {
        this.notificationService.notify('success', data.message);
        this.employeeContractForm.reset();
        //spinner hide
        this.submitted=false;
        this.spinner.hide();
        this.fetchEmployeeContract(this.employeeId);
      },
        (error) => {
          this.notificationService.notify('error', 'Something Went Wrong');
           //show hide
           this.spinner.hide();
        })

      }
  }

  datechange(event:any){
    if(event == null){
    this.isDateSelected=false;

    }else{
    this.isDateSelected=true;
    }
  }

  onVaccineSubmit() {
    this.submitted2=true;
    console.log(this.employeeVaccineForm.valid ,this.isDateSelected ,this.isfileSelected)
    if( this.isDateSelected==true && this.isfileSelected==true){
    
    //spinner show
    this.spinner.show();


    let fromDate = new Date(this.employeeVaccineForm.value.fromDate)
   // let doseType = new Date(this.employeeVaccineForm.value.doseType)

    this.employeeContractObject =

    {
      "vaccineName": this.employeeVaccineForm.value.employeeOncontract,
      "vaccineDate": fromDate,
      "vaccineDoseType": this.employeeVaccineForm.value.doseType,
      "vaccineFileName": this.employeeVaccineForm.value.documentFile,
      "vaccineDetailsRemarks": this.employeeVaccineForm.value.contractDetailsRemarks,
      "employee": {
        "employeeId": this.employeeId
      }
    }


    let api: any = "employeescontractdetail/saveEmployeeVaccine"
    // this.crudeService.create(this.employeeContractObject, api)
    //   .subscribe((data: any) => {
    //     this.notificationService.notify('success', data.message);
    //     this.employeeVaccineForm.reset();
    //     //spinner hide
    //     this.spinner.hide();
    //     this.fetchEmployeeContract(this.employeeId);
    //   },
    //     (error) => {
    //       this.notificationService.notify('error', 'Something Went Wrong');
    //        //show hide
    //        this.spinner.hide();
    //     })
    let str=JSON.stringify(this.employeeContractObject)
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('employeeVaccineDetailsDTO', str);
    this.crudeService.uploadeDocument1(api,formData).subscribe((data: any) => {
           this.notificationService.notify('success', data.message);
           this.employeeVaccineForm.reset();
           //spinner hide
           this.spinner.hide();
           this.submitted2=false;
           this.isDateSelected=false;
           this.isfileSelected=false;

           this.fetchEmployeeVaccine(this.employeeId);
         },
           (error) => {
             this.notificationService.notify('error', 'Something Went Wrong');
              //show hide
              this.spinner.hide();
           })


  }
  }



public importFileData1:any = null;

importFileSkill(event:any){
  if (event.target.files && event.target.files[0]) {
    console.log(event.target.files[0].type);
    
    if(event.target.files[0].type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
      this.importFileData1 = event.target.files[0];
    }
    }else{
    
    }

  } 


  submitImportSkill(){
    if(this.importFileData1 != null){
       let compId:any =sessionStorage.getItem('companyId');
      let form = new FormData();
      form.append("file",this.importFileData1);
      form.append("companyId",compId);
      form.append('employeeId',this.editEmployeeId);

      let api:any="employee/employeeContractDetailsImport/"+this.editEmployeeId;
      this.crudeService.create(form,api).subscribe((data:any) => {
    this.fetchEmployeeContract(this.employeeId);

        this.listOfEmployeeResults1 = [];
        this.listOfEmployeeResults1 = data.data;
        
       this.successCount = (this.listOfEmployeeResults1[(this.listOfEmployeeResults1.length-1)])["importSucessCount"];
       this.errorCount = (this.listOfEmployeeResults1[(this.listOfEmployeeResults1.length-1)])["importErrorCount"];
      console.log(this.successCount);
      console.log(this.errorCount);
        if(this.successCount > 0){
          this.showSuccessMsg = true;
       
        }
        if(this.errorCount > 0){
          this.showErrorMsg = true;
      
        

      }
    })
  }
}


}
