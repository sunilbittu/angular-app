import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reimbursement-year',
  templateUrl: './reimbursement-year.component.html',
  styleUrls: ['./reimbursement-year.component.css']
})
export class ReimbursementYearComponent implements OnInit {

  constructor() { }
  public headers1:any=["Year Type","From Year","To Year","#"];
  public employees1:any=[

   ]

   public headers2:any=["    ","Component Code","Component Description","Allow Negative", "Check Bills", "Bill limit","Make Payment For 0 opening"];
  public employees2:any=[

   ]
  ngOnInit(): void {
  }

}
 