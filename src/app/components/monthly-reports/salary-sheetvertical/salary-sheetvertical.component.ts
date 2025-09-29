import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-salary-sheetvertical',
  templateUrl: './salary-sheetvertical.component.html',
  styleUrls: ['./salary-sheetvertical.component.css']
})
export class SalarySheetverticalComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    (<any>$('#myModal-filter')).modal('show');
  }

}
