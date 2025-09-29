import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-employee-education-wise-report',
  templateUrl: './employee-education-wise-report.component.html',
  styleUrls: ['./employee-education-wise-report.component.css']
})
export class EmployeeEducationWiseReportComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.spinner.hide();
  }

}
