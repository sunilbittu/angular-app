import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-organization-chart',
  templateUrl: './organization-chart.component.html',
  styleUrls: ['./organization-chart.component.css']
})
export class OrganizationChartComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  public header: any = ["Department"];
  public data: any = [
    { name: 'Accounts' },
    { name: 'Admin' },
    { name: 'Administration' },
    { name: 'Business Development' }
  ]
}
