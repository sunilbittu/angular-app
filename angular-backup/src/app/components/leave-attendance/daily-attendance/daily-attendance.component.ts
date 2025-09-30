import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-daily-attendance',
  templateUrl: './daily-attendance.component.html',
  styleUrls: ['./daily-attendance.component.css']
})
export class DailyAttendanceComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  public headers:any=["Employee Code","Employee Name","1", "2", "3","4", "5","6", "7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29"];
  public employees:any=[
    {empcode:'1235',empname:'Deepanjali Guin',department:'PG',reportingHead:'Paul',applicationDt:'12-04-2021',leavefrm:'12-04-2021',leaveto:'12-04-2021',leavedays:'2',applicationFor:'DL',status:'Cancelled',reason:'not good',statusOfApproval:'cancelled by anil',dtofApprovalRptHead:'02-03-2021',statusof:'cancelled by anil',dtofapproval:'N/A'},
    {sno:'2',empCode:'223',empname:'Mukesh',department:'PG',reportingHead:'Paul',applicationDt:'12-04-2021',leavefrm:'12-04-2021',leaveto:'12-04-2021',leavedays:'2',applicationFor:'DL',status:'Cancelled',reason:'not good',statusOfApproval:'cancelled by anil',dtofApprovalRptHead:'02-03-2021',statusof:'cancelled by anil',dtofapproval:'N/A'},
   ]
   public status: any = [
    {name: 'Time Shift'},
    {name: 'Online Application'},
    {name: 'Conflict'},
    {name: 'Conflict Separate'},
    {name: 'LWP Report'}
  ]

}
