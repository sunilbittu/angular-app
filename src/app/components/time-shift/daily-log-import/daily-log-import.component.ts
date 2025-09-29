import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-daily-log-import',
  templateUrl: './daily-log-import.component.html',
  styleUrls: ['./daily-log-import.component.css']
})
export class DailyLogImportComponent implements OnInit {

  logReports: any = [
    {
      name: 'Time Log',
      value: 'Employee Code,Employee Name,Date,Punch Time'
    },
    {
      name: 'Time In Out',
      value: 'Employee Code,Employee Name,Date,Time In,Time Out'
    },
    {
      name: 'Time In Out with Status',
      value: 'Employee Code,Employee Name,Date,Time In,Time Out,Status,OT Hours'
    }
  ];
  radioSel: any;
  radioSelected: string;
  // radioSelectedString: string;
  itemsList: any;
  constructor() {
    this.itemsList = this.logReports;
    this.radioSelected = 'Time Log';
    this.getSelecteditem();
  }
  ngOnInit(): void {
  }
  
  getSelecteditem() {
    this.radioSel = this.logReports.find((Item: { name: string; }) => Item.name === this.radioSelected);
  }

  onItemChange(item: any) {
    this.getSelecteditem();
  }

}