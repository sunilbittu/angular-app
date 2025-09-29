import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promotion-transfer',
  templateUrl: './promotion-transfer.component.html',
  styleUrls: ['./promotion-transfer.component.css']
})
export class PromotionTransferComponent implements OnInit {

  constructor() { }

  public headers:any=["Code","Name","Branch","Department","Designation","Grade","Category","Project","Action"];
  public employees:any=[
                      {code:'123',name:'rak',branch:'HYD',department:'IT',designation:'Developer',division:'A1',grade:'A',category:'Staff',project:'HRMS'},
                      
                      {code:'111',name:'mishra',branch:'HYD',department:'IT',designation:'Developer',division:'A1',grade:'A',category:'Staff',project:'CMS'}

                     ]
  public headers2:any=["Promotion/Transger Type","Transaction Date","Event Date","Effect Date","From Entity","To Entity","Remarks","Action"];

  public employees2:any=[ ]

  ngOnInit(): void {
  }

}
