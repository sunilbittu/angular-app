import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-assign-punch-location',
  templateUrl: './assign-punch-location.component.html',
  styleUrls: ['./assign-punch-location.component.css']
})
export class AssignPunchLocationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }


  public headers:any=["Code","Name2","Reporting Head","Branch","Department","Designation","Distance","Location","Latitude","Longitude"];
  public employees:any=[
                     
]

}
