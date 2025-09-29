import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-arear-payments',
  templateUrl: './arear-payments.component.html',
  styleUrls: ['./arear-payments.component.css']
})
export class ArearPaymentsComponent implements OnInit {

  constructor() { }

  public headers:any=["Date of Process","No. of Employees","From Date","To Date","Paid in Month","Remarks"];
  public arrears:any=[ 

    
  ]

  ngOnInit(): void {
  }

}
