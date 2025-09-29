import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-query-management',
  templateUrl: './query-management.component.html',
  styleUrls: ['./query-management.component.css']
})
export class QueryManagementComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }



  public headers:any=["Departments","Employee Name","Action"];
  public employees:any=[
                      {department:'Learning And Development',name:'Sourabh  Hedaoo---101'},
                      {department:'Finance',name:'Anita Bhumi ---106'},
]


}
