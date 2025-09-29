import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-attendance-monthly',
  templateUrl: './attendance-monthly.component.html',
  styleUrls: ['./attendance-monthly.component.css']
})
export class AttendanceMonthlyComponent implements OnInit {

  constructor() { }
  public Headers:any=['EMP CODE','NAME','DAYS','DAYS PAID','DAYS PRESENT','WEEK OFF','PH','JOIN LEFT AB','LWP','AB','OT HOURS','CL','CO','CO CREDIT','O_H','H','MTL','OD','PL','RH','SL','LATE MARKS'];
  public AttendanceData:any=[{empCode:'111',name:'bharath',days:30,daysPaid:30,daysPresent:30,weekOff:0,ph:0,joinLeft:0,lwp:0,ab:0,otHours:0,cl:0,co:0,coCredit:0,oh:0,h:0,mtl:0,od:0,pl:0,rh:0,sl:0,lateMarks:0},
  {empCode:'222',name:'Bhargav',days:30,daysPaid:30,daysPresent:30,weekOff:0,ph:0,joinLeft:0,lwp:0,ab:0,otHours:0,cl:0,co:0,coCredit:0,oh:0,h:0,mtl:0,od:0,pl:0,rh:0,sl:0,lateMarks:0}]
  ngOnInit(): void {
  }

}
