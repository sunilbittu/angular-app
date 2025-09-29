import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-monthly-closing-balance',
  templateUrl: './monthly-closing-balance.component.html',
  styleUrls: ['./monthly-closing-balance.component.css']
})
export class MonthlyClosingBalanceComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  public headers: any = ["Code", "Name", "Branch", "Department", "Designation", "Grade", "Category", "Division", "Cost Center"];
  public employees: any = [
    { code: '123', name: 'Science', branch: 'tt', department: '123', designation: 'dss', grade: 'dss', category: '123', division: 'dss', costCenter: 'dss' },
    { code: '123', name: 'Science', branch: 'tt', department: '123', designation: 'dss', grade: 'dss', category: '123', division: 'dss', costCenter: 'dss' }
  ]
  public leaveYear: any = [2021, 2020, 2019, 2018, 2017];

  public leaveHeader: any = ["S.No", "LEAVE", "CL", "H", "MTL", "OD", "PL", "RH", "SL"];
  public leaveData: any = [
    {sno: 1, leave: 'Opening', cl: 0, h: 0, mtl: 0, od: 0, pl: 0, rh: 0, sl: 0 },
    {sno: 2, leave: 'Increment', cl: 0, h: 0, mtl: 0, od: 0, pl: 0, rh: 0, sl: 0 }
  ]
}
