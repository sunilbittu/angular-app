import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ess-user',
  templateUrl: './ess-user.component.html',
  styleUrls: ['./ess-user.component.css']
})
export class EssUserComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }


  public headers:any=["Employee Name","Branch name","Department","Employee","Username","Password","Allow App","Lock/Unlock","Geo Fence","Reg Location"];
  public employees:any=[  
  ]

}
