import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-assign-reporting-head',
  templateUrl: './assign-reporting-head.component.html',
  styleUrls: ['./assign-reporting-head.component.css']
})
export class AssignReportingHeadComponent implements OnInit {
  reportingheadModel ='';
  filter2Model = '';
  filterModel = '';
  constructor() { }

  ngOnInit(): void {
  }
  public headers: any = ["Code", "Name", "Reporting Head", "Branch", "Department", "Designation", "Grade", "Project", "Division", "Cost Center", "Action"];
  public employees: any = [
    { code: '123', name: 'Science', reportinghead: 'Hyd', branch: 'tt', department: '123', designation: 'dss', grade: 'dss', project: '123', division: 'dss', costCenter: 'dss' },
    { code: '123', name: 'Science', reportinghead: 'Hyd', branch: 'tt', department: '123', designation: 'dss', grade: 'dss', project: '123', division: 'dss', costCenter: 'dss' }
  ]
  public master: any = [
    {name: 'Master A'},
    {name: 'Master B'},
  ]
  public filter2List: any = [
    {name: 'Sub Master 1'},
    {name: 'Sub Master 2'},
  ]
}
