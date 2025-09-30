import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-approver',
  templateUrl: './approver.component.html',
  styleUrls: ['./approver.component.css']
})
export class ApproverComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  public headers:any=["Sr.No","Reporting Head","Branch","Designation","Approver Level1","PApprover Level2","Approver Level3","Intimation Email On Final Approval"];
  public employees:any=[  {srno:'1',reportingHead:'Sourabh Hedaoo-101',branch:'Ahmedabad',designation:'HR MANAGER'},
                          {srno:'2',reportingHead:'Chander Shekhar Puri-102',branch:'BANGALORE',designation:'Assistant Manager-Supply Chain'}
  ]
}
