import { Component, OnInit } from '@angular/core';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { EmployeeMastersService } from '../../master/employee.masters.service';

@Component({
  selector: 'app-employee-onboarding-reports',
  templateUrl: './employee-onboarding-reports.component.html',
  styleUrls: ['./employee-onboarding-reports.component.css']
})
export class EmployeeOnboardingReportsComponent implements OnInit {
  public departmentData: any;
  public companyId: number=Number(sessionStorage.getItem("companyId"));
  public branchData: any;
  public branchModel: any;
  public toggleScreen:boolean = false;
  public toggleScreen1:boolean = false;
  public toggleScreen2:boolean = false;
  public toggleScreen3:boolean = false;
  public toggleScreen4:boolean = false;
  public toggleScreen5:boolean = false;
  public toggleScreen6:boolean = false;
  public toggleScreen7:boolean = false;
  public toggleScreen8:boolean = false;
  public onboardingReportCount: any;
  public departmentModel: any;
  public fromDateModel: any;
  public toDateModel: any;
  public employeeList1: any;
  public employeeList2: any;
  public employeeList3: any;
  public employeeList4: any;
  public employeeList5: any;
  public employeeList6: any;
  public employeeList7: any;
  public employeeList8: any;
  public filetype1:any="application/pdf";
  public filetype2:any="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  public tempDepId:any;
  public headers4:any =["Candidate Id","Candidate Name","Phone Number","Email Id","Status","BGV Status"];
  public headers2:any =["Job Id","Resource Title","Number Required","Project Name","Raised By","Raised Date","Budget Approving Authority","Budget Approving Status","Acquired Through"];
  public headers3:any =["Candidate Id","Candidate Name","Phone Number","Email Id","Status"];
  public headers1:any =["Job Id","Resource Title","Number Required","Project Name","Raised By","Raised Date","Budget Approving Authority","Budget Approving Status"];
  public submitted: boolean=false;
  public isbranchNameSelected: boolean=false;
  public isDateSelected: boolean=false;


  constructor(public crudOperationsService: CrudOperationsService, public employeeMastersService: EmployeeMastersService) { }

  ngOnInit(): void {
    this.fetchBranch();
  
  }



  fetchBranch(){
    this.employeeMastersService.getBranchMaster(this.companyId)
    .subscribe((data: any) => {

      this.branchData = data.data.content;
     
  })
}

fetchDepaetmentsByBranch(){
    this.isbranchNameSelected=true;
  this.departmentModel="";
  let api1:any ="department/dropdownList_departments/"+this.branchModel;
  this.crudOperationsService.getList(api1).subscribe((response:any)=>{
    this.departmentData=response.data;
    console.log(response)
  })
}

changeDate(){
  this.isDateSelected=true;
}

  getEmployeeOnboardingDetails(){
    this.submitted=true;
    if(this.isbranchNameSelected==true && this.isDateSelected==true){
    this.toggleScreen = true;
    let apiCount :any ="referralrecruitment/employee-onboarding-report/"+this.companyId+"/?companyBranchDetailsId="+this.branchModel+(this.departmentModel!=null?"&departmentId="+this.departmentModel : "")+"&fromDate="+this.fromDateModel+(this.toDateModel==null?"":"&toDate="+this.toDateModel);
    this.crudOperationsService.getList(apiCount).subscribe((response:any)=>{
      this.onboardingReportCount=response.data;
      this.isbranchNameSelected=false;
      this.isDateSelected=false;
      this.submitted=false;
    })
  }
  }
  clearData(){
    this.toggleScreen = false;
    this.toggleScreen1 = false;
    this.toggleScreen2 = false;
    this.toggleScreen3 = false;
    this.toggleScreen4 = false;
    this.toggleScreen5 = false;
    this.toggleScreen6 = false;
    this.toggleScreen7 = false;
    this.toggleScreen8 = false;
    this.toDateModel="";
    this.fromDateModel="";
    this.branchModel="";
    this.departmentModel="";
    this.employeeList1=[];
    this.employeeList2=[];
    this.employeeList3=[];
    this.employeeList4=[];
    this.employeeList5=[];
    this.employeeList6=[];
    this.employeeList7=[];
    this.employeeList8=[];
    this.onboardingReportCount=[];
    this.tempDepId="";
  }

  totalRaisedRequests(data:any){
    this.tempDepId=data.departmentId;
    this.toggleScreen1 = true;
    this.toggleScreen = false;
    let apiRIR :any ="referralrecruitment/employee-onboarding-report-rir/"+this.companyId+"/?companyBranchDetailsId="+this.branchModel+"&departmentId="+data.departmentId+"&fromDate="+this.fromDateModel+(this.toDateModel==null?"":"&toDate="+this.toDateModel);
    this.crudOperationsService.getList(apiRIR).subscribe((response:any)=>{
      this.employeeList1=response.data;
      console.log(this.employeeList1)
    })
  }


  totalApprovedRequests(data:any){
    this.tempDepId=data.departmentId;
    this.toggleScreen2 = true;
    this.toggleScreen = false;
    let apiAppr :any ="referralrecruitment/employee-onboarding-report-approved/"+this.companyId+"/?companyBranchDetailsId="+this.branchModel+"&departmentId="+data.departmentId+"&fromDate="+this.fromDateModel+(this.toDateModel==null?"":"&toDate="+this.toDateModel);
    this.crudOperationsService.getList(apiAppr).subscribe((response:any)=>{
      this.employeeList2=response.data;
      console.log(this.employeeList2)

    })

  }
  
  totalDeniedRequests(data:any){
    this.tempDepId=data.departmentId;
    this.toggleScreen3 = true;
    this.toggleScreen = false;
    let apiDeny :any ="referralrecruitment/employee-onboarding-report-deny/"+this.companyId+"/?companyBranchDetailsId="+this.branchModel+"&departmentId="+data.departmentId+"&fromDate="+this.fromDateModel+(this.toDateModel==null?"":"&toDate="+this.toDateModel);
    this.crudOperationsService.getList(apiDeny).subscribe((response:any)=>{
      this.employeeList3=response.data;
      console.log(this.employeeList1)

    })
  } 

  totalResourceGathered(data:any){
    this.tempDepId=data.departmentId;
    this.toggleScreen4 = true;
    this.toggleScreen = false;
    let apiRG :any ="referralrecruitment/employee-onboarding-report-rrcandidates/"+this.companyId+"/?companyBranchDetailsId="+this.branchModel+"&departmentId="+data.departmentId+"&fromDate="+this.fromDateModel+(this.toDateModel==null?"":"&toDate="+this.toDateModel);
    this.crudOperationsService.getList(apiRG).subscribe((response:any)=>{
      this.employeeList4=response.data;
      console.log(this.employeeList3)

    })
  }

  totalNewJoinees(data:any){
    this.tempDepId=data.departmentId;
    this.toggleScreen5 = true;
    this.toggleScreen = false;
    let apiJoinees :any ="referralrecruitment/employee-onboarding-report-newjoinees/"+this.companyId+"/?companyBranchDetailsId="+this.branchModel+"&departmentId="+data.departmentId+"&fromDate="+this.fromDateModel+(this.toDateModel==null?"":"&toDate="+this.toDateModel);
    this.crudOperationsService.getList(apiJoinees).subscribe((response:any)=>{
      this.employeeList5=response.data;
      console.log(this.employeeList3)

    })
  }

  totalInProgress(data:any){
    this.tempDepId=data.departmentId;
    this.toggleScreen6 = true;
    this.toggleScreen = false;
    let apiInProgress :any ="referralrecruitment/employee-onboarding-report-inprogress/"+this.companyId+"/?companyBranchDetailsId="+this.branchModel+"&departmentId="+data.departmentId+"&fromDate="+this.fromDateModel+(this.toDateModel==null?"":"&toDate="+this.toDateModel);
    this.crudOperationsService.getList(apiInProgress).subscribe((response:any)=>{
      this.employeeList6=response.data;
      console.log(this.employeeList4)

    })
  }

  totalGreen(data:any){
    this.tempDepId=data.departmentId;
    this.toggleScreen7 = true;
    this.toggleScreen = false;
    let apiGreen :any ="referralrecruitment/employee-onboarding-report-green/"+this.companyId+"/?companyBranchDetailsId="+this.branchModel+"&departmentId="+data.departmentId+"&fromDate="+this.fromDateModel+(this.toDateModel==null?"":"&toDate="+this.toDateModel);
    this.crudOperationsService.getList(apiGreen).subscribe((response:any)=>{
      this.employeeList7=response.data;
      console.log(this.employeeList4)

    })
  }

  totalRed(data:any){
    this.tempDepId=data.departmentId;
    this.toggleScreen8 = true;
    this.toggleScreen = false;
    let apiRed :any ="referralrecruitment/employee-onboarding-report-red/"+this.companyId+"/?companyBranchDetailsId="+this.branchModel+"&departmentId="+data.departmentId+"&fromDate="+this.fromDateModel+(this.toDateModel==null?"":"&toDate="+this.toDateModel);
    this.crudOperationsService.getList(apiRed).subscribe((response:any)=>{
      this.employeeList8=response.data;
      console.log(this.employeeList4)

    })
  }

  backToFirstPage(){
    this.toggleScreen = false;
    this.toggleScreen8 = false;
    this.toggleScreen7 = false;
    this.toggleScreen6 = false;
    this.toggleScreen5 = false;
    this.toggleScreen4 = false;
    this.toggleScreen3 = false;
    this.toggleScreen2 = false;
    this.toggleScreen1 = false;
    this.toggleScreen = true;
    this.employeeList1=[];
    this.employeeList2=[];
    this.employeeList3=[];
    this.employeeList4=[];
    this.employeeList5=[];
    this.employeeList6=[];
    this.employeeList7=[];
    this.employeeList8=[];
    this.tempDepId="";
  }

  exportToPDFCountReport(){

    let api:any="referralrecruitment/employee-onboarding-report_download/PDF/"+this.companyId+"/?companyBranchDetailsId="+this.branchModel+(this.departmentModel!=null?"&departmentId="+this.departmentModel : "")+"&fromDate="+this.fromDateModel+(this.toDateModel==null?"":"&toDate="+this.toDateModel);
 this.crudOperationsService.downloadDocument(api).subscribe((response:any)=>{
  let blob: any = new Blob([response], { type: this.filetype1 });
  const url = window.URL.createObjectURL(blob);
  window.open(url);
 })
  }

  exportToEXCELCountReport(){
    let api:any="referralrecruitment/employee-onboarding-report_download/EXCEL/"+this.companyId+"/?companyBranchDetailsId="+this.branchModel+(this.departmentModel!=null?"&departmentId="+this.departmentModel : "")+"&fromDate="+this.fromDateModel+(this.toDateModel==null?"":"&toDate="+this.toDateModel);
    this.crudOperationsService.downloadDocument(api).subscribe((response:any)=>{
      let blob: any = new Blob([response], { type: this.filetype2 });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
     })
  }

  exportToPDF1(){
    let api:any="referralrecruitment/employee-onboarding-report-rir/PDF/"+this.companyId+"/?companyBranchDetailsId="+this.branchModel+"&departmentId="+this.tempDepId+"&fromDate="+this.fromDateModel+(this.toDateModel==null?"":"&toDate="+this.toDateModel);
    this.crudOperationsService.downloadDocument(api).subscribe((response:any)=>{
      let blob: any = new Blob([response], { type: this.filetype1 });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
     })
  }

  exportToEXCEL1(){
    let api:any="referralrecruitment/employee-onboarding-report-rir/EXCEL/"+this.companyId+"/?companyBranchDetailsId="+this.branchModel+"&departmentId="+this.tempDepId+"&fromDate="+this.fromDateModel+(this.toDateModel==null?"":"&toDate="+this.toDateModel);
    this.crudOperationsService.downloadDocument(api).subscribe((response:any)=>{
      let blob: any = new Blob([response], { type: this.filetype2 });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
     })
  }

  exportToPDF2(){
    let api:any="referralrecruitment/employee-onboarding-report-approved/PDF/"+this.companyId+"/?companyBranchDetailsId="+this.branchModel+"&departmentId="+this.tempDepId+"&fromDate="+this.fromDateModel+(this.toDateModel==null?"":"&toDate="+this.toDateModel);
    this.crudOperationsService.downloadDocument(api).subscribe((response:any)=>{
      let blob: any = new Blob([response], { type: this.filetype1 });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
     })
  }

  exportToEXCEL2(){
    let api:any="referralrecruitment/employee-onboarding-report-approved/EXCEL/"+this.companyId+"/?companyBranchDetailsId="+this.branchModel+"&departmentId="+this.tempDepId+"&fromDate="+this.fromDateModel+(this.toDateModel==null?"":"&toDate="+this.toDateModel);
    this.crudOperationsService.downloadDocument(api).subscribe((response:any)=>{
      let blob: any = new Blob([response], { type: this.filetype2 });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
     })
  }

  exportToPDF3(){
    let api:any="referralrecruitment/employee-onboarding-report-deny/PDF/"+this.companyId+"/?companyBranchDetailsId="+this.branchModel+"&departmentId="+this.tempDepId+"&fromDate="+this.fromDateModel+(this.toDateModel==null?"":"&toDate="+this.toDateModel);
    this.crudOperationsService.downloadDocument(api).subscribe((response:any)=>{
      let blob: any = new Blob([response], { type: this.filetype1 });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
     })
  }

  exportToEXCEL3(){
    let api:any="referralrecruitment/employee-onboarding-report-deny/EXCEL/"+this.companyId+"/?companyBranchDetailsId="+this.branchModel+"&departmentId="+this.tempDepId+"&fromDate="+this.fromDateModel+(this.toDateModel==null?"":"&toDate="+this.toDateModel);
    this.crudOperationsService.downloadDocument(api).subscribe((response:any)=>{
      let blob: any = new Blob([response], { type: this.filetype2 });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
     })
  }

  exportToPDF4(){
    let api:any="referralrecruitment/employee-onboarding-report-rrcandidates/PDF/"+this.companyId+"/?companyBranchDetailsId="+this.branchModel+"&departmentId="+this.tempDepId+"&fromDate="+this.fromDateModel+(this.toDateModel==null?"":"&toDate="+this.toDateModel);
    this.crudOperationsService.downloadDocument(api).subscribe((response:any)=>{
      let blob: any = new Blob([response], { type: this.filetype1 });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
     })
  }

  exportToEXCEL4(){
    let api:any="referralrecruitment/employee-onboarding-report-rrcandidates/EXCEL/"+this.companyId+"/?companyBranchDetailsId="+this.branchModel+"&departmentId="+this.tempDepId+"&fromDate="+this.fromDateModel+(this.toDateModel==null?"":"&toDate="+this.toDateModel);
    this.crudOperationsService.downloadDocument(api).subscribe((response:any)=>{
      let blob: any = new Blob([response], { type: this.filetype2 });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
     })
  }

  exportToPDF5(){
    let api:any="referralrecruitment/employee-onboarding-report-newjoinees/PDF/"+this.companyId+"/?companyBranchDetailsId="+this.branchModel+"&departmentId="+this.tempDepId+"&fromDate="+this.fromDateModel+(this.toDateModel==null?"":"&toDate="+this.toDateModel);
    this.crudOperationsService.downloadDocument(api).subscribe((response:any)=>{
      let blob: any = new Blob([response], { type: this.filetype1 });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
     })
  }

  exportToEXCEL5(){
    let api:any="referralrecruitment/employee-onboarding-report-newjoinees/EXCEL/"+this.companyId+"/?companyBranchDetailsId="+this.branchModel+"&departmentId="+this.tempDepId+"&fromDate="+this.fromDateModel+(this.toDateModel==null?"":"&toDate="+this.toDateModel);
    this.crudOperationsService.downloadDocument(api).subscribe((response:any)=>{
      let blob: any = new Blob([response], { type: this.filetype2 });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
     })
  }

  exportToPDF6(){
    let api:any="referralrecruitment/employee-onboarding-report-inprogress/PDF/"+this.companyId+"/?companyBranchDetailsId="+this.branchModel+"&departmentId="+this.tempDepId+"&fromDate="+this.fromDateModel+(this.toDateModel==null?"":"&toDate="+this.toDateModel);
    this.crudOperationsService.downloadDocument(api).subscribe((response:any)=>{
      let blob: any = new Blob([response], { type: this.filetype1 });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
     })
  }

  exportToEXCEL6(){
    let api:any="referralrecruitment/employee-onboarding-report-inprogress/EXCEL/"+this.companyId+"/?companyBranchDetailsId="+this.branchModel+"&departmentId="+this.tempDepId+"&fromDate="+this.fromDateModel+(this.toDateModel==null?"":"&toDate="+this.toDateModel);
    this.crudOperationsService.downloadDocument(api).subscribe((response:any)=>{
      let blob: any = new Blob([response], { type: this.filetype2 });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
     })
  }

  exportToPDF7(){
    let api:any="referralrecruitment/employee-onboarding-report-red/PDF/"+this.companyId+"/?companyBranchDetailsId="+this.branchModel+"&departmentId="+this.tempDepId+"&fromDate="+this.fromDateModel+(this.toDateModel==null?"":"&toDate="+this.toDateModel);
    this.crudOperationsService.downloadDocument(api).subscribe((response:any)=>{
      let blob: any = new Blob([response], { type: this.filetype1 });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
     })
  }

  exportToEXCEL7(){
    let api:any="referralrecruitment/employee-onboarding-report-red/EXCEL/"+this.companyId+"/?companyBranchDetailsId="+this.branchModel+"&departmentId="+this.tempDepId+"&fromDate="+this.fromDateModel+(this.toDateModel==null?"":"&toDate="+this.toDateModel);
    this.crudOperationsService.downloadDocument(api).subscribe((response:any)=>{
      let blob: any = new Blob([response], { type: this.filetype2 });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
     })
  }

  exportToPDF8(){
    let api:any="referralrecruitment/employee-onboarding-report-green/PDF/"+this.companyId+"/?companyBranchDetailsId="+this.branchModel+"&departmentId="+this.tempDepId+"&fromDate="+this.fromDateModel+(this.toDateModel==null?"":"&toDate="+this.toDateModel);
    this.crudOperationsService.downloadDocument(api).subscribe((response:any)=>{
      let blob: any = new Blob([response], { type: this.filetype1 });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
     })
  }

  exportToEXCEL8(){
    let api:any="referralrecruitment/employee-onboarding-report-green/EXCEL/"+this.companyId+"/?companyBranchDetailsId="+this.branchModel+"&departmentId="+this.tempDepId+"&fromDate="+this.fromDateModel+(this.toDateModel==null?"":"&toDate="+this.toDateModel);
    this.crudOperationsService.downloadDocument(api).subscribe((response:any)=>{
      let blob: any = new Blob([response], { type: this.filetype2 });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
     })
  }

}
