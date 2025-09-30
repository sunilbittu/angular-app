import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-process-attendance',
  templateUrl: './process-attendance.component.html',
  styleUrls: ['./process-attendance.component.css']
})
export class ProcessAttendanceComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
public headers:any=["Code","Name","TotalWorking Hrs", "Total Present","Total Absent","WO/CO+", "Paid Holiday","No.of LateCome","No. of Early Go","OT Before","OT After","View"];
public employees:any=[
  {code:'123',name:'Science',totalWorkinghrs:'2',totalPresent:'56',totalAbsent:'6',woco:'6',paidHoliday:'5',noOfLatecome:'6',noOfEarlygo:'22',otbefore:'5',otAfetr:'6',view:'r'},
  {code:'123',name:'Science',totalWorkinghrs:'2',totalPresent:'56',totalAbsent:'6',woco:'6',paidHoliday:'5',noOfLatecome:'6',noOfEarlygo:'22',otbefore:'5',otAfetr:'6',view:'r'}
]
}
