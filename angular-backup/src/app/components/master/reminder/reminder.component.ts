import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reminder',
  templateUrl: './reminder.component.html',
  styleUrls: ['./reminder.component.css']
})
export class ReminderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  public headers: any = [" ", "Employee Code", "Employee Name", "Birth Date", "Days To Go", "Branch Date", "Dept Name", "Email Status", "Action"];
  public employees: any = [
    { code: '123', name: 'Science', birthDate: 'Hyd', daysToGo: '123', branchDate: 'dss', deptName: 'dss', emailStatus: '123' },
    { code: '123', name: 'Science', birthDate: 'Hyd', daysToGo: '123', branchDate: 'dss', deptName: 'dss', emailStatus: '123' }
  ]
  
}
