import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { EmployeeMastersService } from '../../master/employee.masters.service';

@Component({
  selector: 'app-onboarding-employee',
  templateUrl: './onboarding-employee.component.html',
  styleUrls: ['./onboarding-employee.component.css']
})
export class OnboardingEmployeeComponent implements OnInit {
  public branchDetailsList: any;
  public isFileSelected: boolean=false;
  public isDateOfJoiningEntered: boolean=false;
  public isDateOfBirthEntered: boolean=false;
  public submitted: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  


  constructor(public fb: FormBuilder,public datePipe:DatePipe,public crudOperationsService:CrudOperationsService,public employeMasterService:EmployeeMastersService) { }

   public companyId = Number(sessionStorage.getItem("companyId"));
   public employeeId = Number(sessionStorage.getItem("empId"));
   public selectedFile:any;
  public form 
  = this.fb.group({
    firstName: ["", Validators.required],
    middleName: [""],
    lastName: ["", Validators.required],
    gender: ["", Validators.required],
    fatherName: ["", Validators.required],
    motherName: [""],
    panNo: ["", Validators.required],
    adhaarNo: ["", Validators.required],
    voterId: [""],
   dob: ["", Validators.required],
   doj: ["", Validators.required],
    //digitalSignature: ["", Validators.required],
    mobileNo: ["", Validators.required],
    email: ["", Validators.required],
    alternativeEmail: [""],
    currentAddress: ["", Validators.required],
    parmanentAddress: ["", Validators.required]
  });

  public dropdownList:any;
  public dropdownSettingsBranch:any;
  public jobId:any;
  public dropdownSettings:any;
  public selectedItemsBranch:any = [];
  public docuentTypeModel:any="";
  public docuentNameModel:any="";
  public documentTypes:any="";
  public selectedDocument1:any="";
  public selectedDocument2:any="";
  public selectedDocument:any;
  public docuentFileModel:any="";
  public documentNames:any=[];
  public documentsList:any=[];
  public EmployeeData:any={};
  public employeeOnbordingId:any;
  public digFile:any={};
  public togglebtn:boolean=true;
  ngOnInit(): void {
    // this.docuentFileModel="tds1_1_04-06-2021_04-08-39.PNG"


    this.selectedDocument1="No file choosen";
    this.selectedDocument2="No file choosen";

    let api:any='documenttype/dropdownList?companyId='+sessionStorage.getItem("companyId") + '&search=&page=&size=';
    this.crudOperationsService.getList(api).subscribe((data:any)=> {
      this.documentTypes=data.data;

    })
    let listUrl="onboardingemployee/"+sessionStorage.getItem("empId");
    this.crudOperationsService.getList(listUrl).subscribe((data:any)=> {
      // this.documentsList=data.data.content;
      console.log(data);

      this.EmployeeData=data.data;
      console.log('aaa',this.EmployeeData);
      if(this.EmployeeData.onBoardingEmployeeId != null){
        this.togglebtn=false;
        this.employeeOnbordingId=this.EmployeeData.onBoardingEmployeeId;
      // this.digFile={
      //   name:this.EmployeeData.fileName,
      //   // type:
      // }
      this.selectedDocument2 = this.EmployeeData.fileName;
        this.otherInfoModel=  this.EmployeeData.otherInfo;
        this.termsModel= this.EmployeeData.acceptedTerms;
      this.form = this.fb.group({
        firstName: [this.EmployeeData.firstName, Validators.required],
        middleName: [this.EmployeeData.middleName],
        lastName: [this.EmployeeData.lastName, Validators.required],
        gender: [this.EmployeeData.gender, Validators.required],
        fatherName: [this.EmployeeData.fatherName, Validators.required],
        motherName: [this.EmployeeData.motherName],
        panNo: [this.EmployeeData.panNo, Validators.required],
        adhaarNo: [this.EmployeeData.adhaarNo, Validators.required],
        voterId: [this.EmployeeData.voterId],
       dob: [this.EmployeeData.dob, Validators.required],
       doj: [this.EmployeeData.doj, Validators.required],
        //digitalSignature: ["", Validators.required],
        mobileNo: [this.EmployeeData.mobileNo, Validators.required],
        email: [this.EmployeeData.email, Validators.required],
        alternativeEmail: [this.EmployeeData.alternativeEmail],
        currentAddress: [this.EmployeeData.currentAddress, Validators.required],
        parmanentAddress: [this.EmployeeData.parmanentAddress, Validators.required]
      });
      }

    },(error)=>{

    })

    
    let api1='onboardingemployeedocuments/list/'+sessionStorage.getItem("empId");
    this.crudOperationsService.getList(api1).subscribe((data:any)=> {
      this.documentsList=data.data.content;
      
    })

    this.getJobIdOnwhichThisEmployeeIsOnboarding();
  }

  get form_() { return this.form.controls; };

  
  onChangeDocType(){
    let url="documentmaster/dropdown_list_by_document_type/"+Number(this.docuentTypeModel);
    this.crudOperationsService.getList(url).subscribe((data:any)=> {
      // this.documentTypes=data.data;
      console.log('aaa',data);
      this.documentNames=data.data;

    })
  }


  getJobIdOnwhichThisEmployeeIsOnboarding(){
    let api:any="referralrecruitment/jobId_based_on_emailid/"+this.employeeId;
    this.crudOperationsService.getList(api).subscribe((data:any)=> {
      console.log('jobId',data);
      this.jobId=data.data;

    })
  }
  
  public documentId:any;
  public toggleUploadbtn:boolean=true;
  editDocuments(data:any){
    this.docuentTypeModel=data.documentTypeId;
    this.onChangeDocType()
    this.toggleUploadbtn=false;
    this.documentId=data.onBoardingEmployeeDocumentId;
    console.log(data);
    this.docuentNameModel=data.documentId;
    this.selectedDocument1=data.fileName;
  }
  uploadDocumnet(){
      let companyId=sessionStorage.getItem("companyId");
      let employeeId=sessionStorage.getItem("empId");
      let obj ={
        documentType:{
          documentTypeId:Number(this.docuentTypeModel)
        },
        documentMaster:{
          documentId:Number(this.docuentNameModel)
        },
        company:{
          companyId:Number(companyId)
        },
        
        onBoardingEmployee:{
          onBoardingEmployeeId:Number(employeeId)
        },
        onBoardingEmployeeDocumentId:this.documentId

      }
      let str=JSON.stringify(obj)
    console.log('str',str)
    const formData = new FormData();
    formData.append('file', this.selectedDocument);
    formData.append('onBoardingEmployeeDocumentDTO', str);
    if(this.toggleUploadbtn){
    this.crudOperationsService.uploadeDocument1('onboardingemployeedocuments',formData).subscribe((data)=>{
      this.ngOnInit();
      this.docuentTypeModel="";
      this.docuentNameModel="";
      this.docuentFileModel="";
    });
    }
    else{
      this.crudOperationsService.updateDocument('onboardingemployeedocuments/'+this.documentId,formData).subscribe((data)=>{
        this.ngOnInit();
        this.docuentTypeModel="";
        this.docuentNameModel="";
        this.docuentFileModel="";
      });
    }
    
  }
  public dob_date:any;
  public doj_date:any;

  onDobChange(event:any){
    if(event != null){
      this.isDateOfBirthEntered=true;
    }else{
      this.isDateOfBirthEntered=false;

    }
    let selectedDate = new Date(event);
    this.dob_date = event;
  } 
  onDojChange(event:any){
    if(event != null){
      this.isDateOfJoiningEntered=true;
    }else{
      this.isDateOfJoiningEntered=false;

    }
    let selectedDate = new Date(event);
    this.doj_date = event;
    
  }

  onFileChanged(event: any) {
    //Select File
    this.isFileSelected=true;
    console.log('kkkkkk')
    this.selectedFile = event.target.files[0];
    this.selectedDocument2 = event.target.files[0].name;

    console.log('file',this.selectedFile);
  }
  uploadFileDocuments(event: any) {
    //Select File
    console.log('aaaaa')
    this.selectedDocument = event.target.files[0];
    this.selectedDocument1 = event.target.files[0].name;

    console.log('file',this.selectedDocument);
  }

  saveOnBoardingEmployee(){
this.submitted=true;
if(this.form.valid==true && this.isDateOfBirthEntered==true && this.isDateOfJoiningEntered==true && this.isFileSelected==true){
  
 this.form.value.dob =this.dob_date;
 this.form.value.doj =this.doj_date;
 this.form.value.company={companyId:this.companyId};
 this.form.value.onBoardingEmployeeId=this.employeeId;
 this.form.value.resourceIndentRequest={jobId:this.jobId};

 let str=JSON.stringify(this.form.value)
 console.log('str',str)
 const formData = new FormData();
 formData.append('file', this.selectedFile);
 formData.append('onBoardingEmployeeDTO', str);
 let api="onboardingemployee";
 this.crudOperationsService.create(formData,api).subscribe((data)=>{

 })
    console.log('form',this.form.value);
  }}
  updateOnBoardingEmployee(){
    if(this.form.valid==true){
    this.form.value.onBoardingEmployeeId=this.employeeId;
    this.form.value.dob =this.dob_date;
    this.form.value.doj =this.doj_date;
    
 this.form.value.company={companyId:this.companyId};
 let str=JSON.stringify(this.form.value);
 console.log('str',str)
 const formData = new FormData();
 formData.append('file', this.selectedFile);
 formData.append('onBoardingEmployeeDTO', str);
 let api="onboardingemployee/"+this.employeeOnbordingId;
    this.crudOperationsService.update(formData,api).subscribe((data)=>{
    })
  }
  }
  public otherInfoModel:any="";
  public termsModel:boolean=false;
  submitOnboarding(){
    if(this.termsModel==true){
      let url="onboardingemployee/update_accepted_terms/"+this.employeeId+"?otherInfo="+this.otherInfoModel+"&&acceptedTerms="+this.termsModel;
      this.crudOperationsService.update("",url).subscribe((data)=>{
  
      })

    }
  }
  public docId:any;
  deleteItem(id:any){
    this.docId=id;
    console.log(id)
  }
  cancel(){

  }
  public docval:any;
  
  deleteDocument(){

    let url="onboardingemployeedocuments/"+this.docId;
    this.crudOperationsService.delete(url).subscribe((data)=>{
      this.ngOnInit();
    })
  }
  downloadFile(filpath:any){
    let downloadApi = 'onboardingemployeedocuments/on_board_employee_doc_download?filePath=' + filpath;
  this.crudOperationsService.downloadDocument(downloadApi)
    .subscribe((response: any) => {
      let blob: any = new Blob([response], { type: "application/octet-stream" }); // must match the Accept type
      const filename = filpath;
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.download = filename;
      anchor.href = url;
      anchor.click();
    }
    )
  }
}
