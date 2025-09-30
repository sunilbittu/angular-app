import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-employee-master-reports',
  templateUrl: './employee-master-reports.component.html',
  styleUrls: ['./employee-master-reports.component.css']
})
export class EmployeeMasterReportsComponent implements OnInit {

 public msgOnChildCompInit!: String;

  constructor() { }

  ngOnInit(): void {
  }
  

}
