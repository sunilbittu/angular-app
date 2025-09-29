import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-audit-trails',
  templateUrl: './audit-trails.component.html',
  styleUrls: ['./audit-trails.component.css']
})
export class AuditTrailsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  public headers:any=["Emp Code","Menu Name","Date Time","Action Performed","User Name","User IP","Old Value","New Value"];
  public employees:any=[
                   
]

}
