import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-employee-increment',
  templateUrl: './employee-increment.component.html',
  styleUrls: ['./employee-increment.component.css']
})
export class EmployeeIncrementComponent implements OnInit {

  constructor() { }

  public headers:any=["Code","Name","Branch","Department","Designation","Grade","Category","Project","Division","Cost Center","Action"];
  public employees:any=[ 

    
  ]

  ngOnInit(): void {
  }

}
 