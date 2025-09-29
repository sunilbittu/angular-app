import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-email-payslip',
  templateUrl: './email-payslip.component.html',
  styleUrls: ['./email-payslip.component.css']
})
export class EmailPayslipComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    (<any>$('#myModal-filter')).modal('show');
  }

}
