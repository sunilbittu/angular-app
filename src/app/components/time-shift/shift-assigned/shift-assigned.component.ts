import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shift-assigned',
  templateUrl: './shift-assigned.component.html',
  styleUrls: ['./shift-assigned.component.css']
})
export class ShiftAssignedComponent implements OnInit {
  
  constructor() { }

  ngOnInit(): void {
  }
  public headers:any=["Code","Name","Branch", "Department","Designation","Category", "Division","Project","Cost Center","Action"];
  public employees:any=[
    {code:'123',name:'Science',branch:'Hyd',department:'tt',designation:'ff',category:'gg',division:'f',project:'s',costcenter:'222'},
    {code:'123',name:'Science',branch:'Hyd',department:'tt',designation:'ff',category:'gg',division:'f',project:'s',costcenter:'222'}  ]
}
