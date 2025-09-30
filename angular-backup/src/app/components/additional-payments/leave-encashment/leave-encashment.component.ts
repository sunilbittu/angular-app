import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-leave-encashment',
  templateUrl: './leave-encashment.component.html',
  styleUrls: ['./leave-encashment.component.css']
})
export class LeaveEncashmentComponent implements OnInit {

  constructor() { }

  public headers:any=["Code","Name","Branch","Department","Designation","Grade","Category","Project"];
  public employees:any=[
                      
                     ]
  public headers2:any=["Leave Type","Payment Date","Days","Last Drawn Month","Last Draewn Salary","Amount"];

  public employees2:any=[ ]

  ngOnInit(): void {
  }

}
