import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { EmployeeMastersService } from '../../master/employee.masters.service';

@Component({
  selector: 'app-terminated-employee',
  templateUrl: './terminated-employee.component.html',
  styleUrls: ['./terminated-employee.component.css']
})
export class TerminatedEmployeeComponent implements OnInit {

  public companyId:any=Number(sessionStorage.getItem("companyId"));
  tenureReportList: any;

  constructor(private crudOperationsService:CrudOperationsService ,private employeMasterService: EmployeeMastersService
    ,private notification: NotifierService, private crureService: CrudOperationsService) { }

  ngOnInit(): void {
  this.fetchTenureReport();
  }

  public headers:any=["S.No", "Employee Code", "Employee Name" , "Branch" , "Department", "Grade","Designation"];


  
  fetchTenureReport(){
  let api="reports/terminationReportsDisplay/"+this.companyId;
  this.crudOperationsService.getList(api).subscribe((data:any)=>{
   this.tenureReportList=data.data.content;
     
 })

}

exportTable(type: string) {

  
  var fileType = '';
  let fileName='terminated-employee-report';
  if (type == 'EXCEL') {
    fileName=fileName+'.xls';
    fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  }
  else {
    fileName=fileName+'.pdf';
    fileType = 'application/pdf';
  }
  let api: any = "reports/terminationReport/" + type + "/" + this.companyId;
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

      anchor.click();
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
