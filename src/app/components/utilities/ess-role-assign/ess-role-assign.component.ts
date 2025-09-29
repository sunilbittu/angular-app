import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ess-role-assign',
  templateUrl: './ess-role-assign.component.html',
  styleUrls: ['./ess-role-assign.component.css']
})
export class EssRoleAssignComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }


  public headers:any=["Employee Code","Employee Name","Branch","Department","Designation","Master Update"];
  public employees:any=[
                      {code:'123',name:'bharath',branch:'HYD',department:'IT',designation:'Developer',division:'A1',grade:'A',category:'Staff',project:'HRMS'},
                      {code:'111',name:'bhargav',branch:'HYD',department:'IT',designation:'Developer',division:'A1',grade:'A',category:'Staff',project:'CMS'}

                     ]

}
