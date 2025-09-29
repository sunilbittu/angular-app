import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-disbursement-payyment',
  templateUrl: './disbursement-payyment.component.html',
  styleUrls: ['./disbursement-payyment.component.css']
})
export class DisbursementPayymentComponent implements OnInit {

  constructor() { }
  public headers:any=["Sr. No","Employee Code","Employee Name","Department","Net Payable","Payment Code","Paid Amount","Balance","Disburse Date","Balance Paid","Date","Remarks"];
  public disbursements:any=[ 

    
  ]
  ngOnInit(): void {
  }

}
