import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reimbursement-billpayment',
  templateUrl: './reimbursement-billpayment.component.html',
  styleUrls: ['./reimbursement-billpayment.component.css']
})
export class ReimbursementBillpaymentComponent implements OnInit {

  constructor() { }

  public headers1:any=["Code","Name","Branch","Department","Designation","Grade"];
  public employees1:any=[

   ]

  public headers2:any=["Reimb. Type","Date","Bill Amount","Payment","Auto Clear Balance"];
  public employees2:any=[

   ]
   public years:any=[]

   public rtype:any=[]

  ngOnInit(): void {
  }

}
