import { Component, OnInit } from '@angular/core';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-leave-apply-report',
  templateUrl: './leave-apply-report.component.html',
  styleUrls: ['./leave-apply-report.component.css']
})
export class LeaveApplyReportComponent implements OnInit {

  constructor(public crudOperationsService:CrudOperationsService) { }
  public leaveReports:any=[];
  public companyId:any=sessionStorage.getItem('companyId');
  ngOnInit(): void {
    this.crudOperationsService.getList('reports/employees_leave/PDF?companyId='+this.companyId).subscribe((data:any)=> {
      // this.leaveHeader=data.data;
      // this.eventsList=data.data.content;
      this.leaveReports=data;
      console.log('emp',data);
    });
   
  }
  public headers:any=["Sr.No","Emp Code","Emp Name","Department", "Reporting Head", "Application Date","Leave From", "Leave To","Leave Days", "Application For","Status","Reason","Status of Approval","Date of Approval Reporting Head","Status of","Date of Approval1"];
  // public employees:any=[
  //   {sno:'1',empCode:'123',empname:'Mukesh',department:'PG',reportingHead:'Paul',applicationDt:'12-04-2021',leavefrm:'12-04-2021',leaveto:'12-04-2021',leavedays:'2',applicationFor:'DL',status:'Cancelled',reason:'not good',statusOfApproval:'cancelled by anil',dtofApprovalRptHead:'02-03-2021',statusof:'cancelled by anil',dtofapproval:'N/A'},
  //   {sno:'2',empCode:'223',empname:'Mukesh',department:'PG',reportingHead:'Paul',applicationDt:'12-04-2021',leavefrm:'12-04-2021',leaveto:'12-04-2021',leavedays:'2',applicationFor:'DL',status:'Cancelled',reason:'not good',statusOfApproval:'cancelled by anil',dtofApprovalRptHead:'02-03-2021',statusof:'cancelled by anil',dtofapproval:'N/A'},
  //  ]
   public status: any = [
    {name: 'Approved'},
    {name: 'Cancelled'},
  ]
   public master: any = [
    {name: 'Master A'},
    {name: 'Master B'},
  ]
  public filter2List: any = [
    {name: 'Sub Master 1'},
    {name: 'Sub Master 2'},
  ]
}
