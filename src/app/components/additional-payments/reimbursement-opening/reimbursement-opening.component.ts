import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reimbursement-opening',
  templateUrl: './reimbursement-opening.component.html',
  styleUrls: ['./reimbursement-opening.component.css']
})
export class ReimbursementOpeningComponent implements OnInit {

  constructor() { }
  public headers1:any=["Code","Name","Branch","Department","Designation","Grade"];
  public employees1:any=[

   ]

  public headers2:any=["Description","TA DA","Conv reimbursment","Cab reimbursement"];
  public employees2:any=[

   ]
   public years:any=[]

   public description:any=["Opening Amount","Yearly Credit","Monthly Accured","Total Amount","Used Amount","Balance Amount"]

  ngOnInit(): void {
  }

}
