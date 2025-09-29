import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  public headers:any=["Code","Name","Branch","Department","Designation","Division","Grade","Category","Project","Action"];
  public employees:any=[
                      {code:'123',name:'mishra',branch:'HYD',department:'IT',designation:'Developer',division:'A1',grade:'A',category:'Staff',project:'HRMS'},
                      {code:'111',name:'rak',branch:'HYD',department:'IT',designation:'Developer',division:'A1',grade:'A',category:'Staff',project:'CMS'}

  ]                    
}
