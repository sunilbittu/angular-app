import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-log-history',
  templateUrl: './log-history.component.html',
  styleUrls: ['./log-history.component.css']
})
export class LogHistoryComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  public headers: any = ["Employee Code", "Name", "Date", "Log Time", "In-Out", "Machine Code", "Branch", "Department", "Designation", "Grade", "Action"];
  public employees: any = [
    { code: '123', name: 'Science', date: '01/01/2021', logTime: '10.56', out: '6', machineCode: '5', branch: 'Hyd', department: 'IT', designation: 'HOD', grade: '6' },
    { code: '123', name: 'Science', date: '01/01/2021', logTime: '9.56', out: '6', machineCode: '5', branch: 'Pune', department: 'MGMT', designation: 'Manager', grade: '6' }
  ]
  public employeesNames: any = ["John", "Roy", "Tagore", "Tuds", "Harry" ];
}
