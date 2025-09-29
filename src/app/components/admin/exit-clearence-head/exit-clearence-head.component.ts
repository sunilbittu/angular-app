import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-exit-clearence-head',
  templateUrl: './exit-clearence-head.component.html',
  styleUrls: ['./exit-clearence-head.component.css']
})
export class ExitClearenceHeadComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  public headers:any=["Departments","Branches","Employee","Action"];
  public employees:any=[
                      {department:'Finance',Branches:'All Branch',Employee:'Vinod K'},
                      {department:'Accounts',Branches:'All Branch',Employee:'Sourabh  Hedaoo'},
]


}
