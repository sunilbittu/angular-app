import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-supplementary-payment',
  templateUrl: './supplementary-payment.component.html',
  styleUrls: ['./supplementary-payment.component.css']
})
export class SupplementaryPaymentComponent implements OnInit {

  constructor() { }
  public headers:any=["Code","Name","Branch","Department","Designation","Division","Action"];
public supplementaryEmployees:any=[

]
public headers2:any=["Code","Name","Branch","Department","Designation","Division"];
public arrearEmployees:any=[
]
public reimbursementEmployees:any=[
]
  ngOnInit(): void {
  }

}
