import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { EmployeeMastersService } from '../../master/employee.masters.service';

@Component({
  selector: 'app-employee-leaderboard-reports',
  templateUrl: './employee-leaderboard-reports.component.html',
  styleUrls: ['./employee-leaderboard-reports.component.css']
})
export class EmployeeLeaderboardReportsComponent implements OnInit {

  public companyId:any=Number(sessionStorage.getItem("companyId"));
  tenureReportList: any;
  candidateReportList: any;
  recruitmentReportList: any;
  jobReportList: any;
  public branchDetailsList!: any[];
  public departmentsList: any;
  public departmentModel: any;
  public leaderboardModel: any;
  public departmentId: any;
  public submitted: boolean=false;
  public isbranchNameSelected: boolean=false;
  public isDepartmentSelected: boolean=false;

  constructor(private crudOperationsService:CrudOperationsService ,private employeMasterService: EmployeeMastersService
    ,private notification: NotifierService, private crureService: CrudOperationsService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
  
    this.fetchBranchDetailsList();
  }
  public leaderBoardList:any=['Candidate','Recruitment','Job'];
  public candidateHeaders:any=["S.No", "Employee Code", "Employee Name" , "Created By Candidates", "Submitted", "Placed" ];
  public recruitmentHeaders:any=["S.No", "Employee Code", "Employee Name" , "Matches Candidates","Placements Candidates", "Droped Candidates"];
  public jobHeaders:any=["S.No", "Employee Code", "Employee Name" , "Created Jobs","Active", "Completed", "Cancelled", "On Hold"];
  
  fetchTenureReport(id:number,leaderboard:String){
  let api="employee/leaderboardreport/"+this.companyId+"/"+this.departmentModel;
  this.crudOperationsService.getList(api).subscribe((data:any)=>{
   console.log(data,"===data");
   if(this.leaderboardModel == 'Candidate') this.candidateReportList=data.data;
   if(this.leaderboardModel == 'Recruitment') this.recruitmentReportList=data.data;
   if(this.leaderboardModel == 'Job') this.jobReportList=data.data;
   
     
 })

}

fetchBranchDetailsList() {
  this.spinner.show();
  //getting companyId from session-storage
  this.companyId = Number(sessionStorage.getItem('companyId'));
  return this.employeMasterService.getBranchMaster(this.companyId)
    .subscribe((data: any) => {
      this.spinner.hide();
      this.branchDetailsList = data.data.content;
         
    }
      ,
      (error) => {
        this.spinner.show();
        this.notification.notify('error', 'Something Went Worng');
      })
}

search() {
  //alert(this.leaderboardModel);
  this.submitted=true;
  let empList = [];
  if(this.isbranchNameSelected && this.isDepartmentSelected){
  this.fetchTenureReport(this.departmentModel,this.leaderboardModel);
  this.submitted=false;

  }
}

//calling departmments based on branchId
onchangeBranch(id:number){
this.isbranchNameSelected=true;
  this.fetchEmployeesDePartments(id);
}

//get Department List 
fetchEmployeesDePartments(id:number) {
  //get companyId
  let api: any = "department/dropdownList_departments/" +id;
  this.crudOperationsService.getList(api)
    .subscribe((data: any) => {

      this.departmentsList = data.data;

    },
      (error) => {
        this.notification.notify('error', 'Something Went Wrong');
      })
}

onDepartmentChange()
{
  this.isDepartmentSelected=true;
}
onLeaderboardChange()
{
  this.isDepartmentSelected=true;
}

exportTable(type: string) {

  
  var fileType = '';
  let fileName='employee-leaderboard-report';
  if (type == 'EXCEL') {
    fileName=fileName+'.xls';
    fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  }
  else {
    fileName=fileName+'.pdf';
    fileType = 'application/pdf';
  }
  let api: any = "reports/employee_leaderboard_report/" + type + "?companyId=" + this.companyId +'&'+"departmentId=" +this.departmentModel;
  this.crureService.downloadDocument(api)
    .subscribe((response: any) => {
      

      let blob: any = new Blob([response], { type: fileType });
      const url = window.URL.createObjectURL(blob);
      if(type!='EXCEL'){
        window.open(url);
      }
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = fileName;

      anchor.click();;
      //window.location.href = response.url;
      //this._FileSaverService.save(blob,'Employee_Branch_Report');
    },

      (error) => {
        this.notification.notify('error', 'Something Went Worng');
        //spinner hide
      
      }

    )
}


}
