import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-exit-template',
  templateUrl: './exit-template.component.html',
  styleUrls: ['./exit-template.component.css']
})
export class ExitTemplateComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }


  public headers:any=["Temp.Code","Temp.Name","Header Name","Action"];
  public employees:any=[  {tempCode:'03',tempName:'Exit Form Testing',headerName:'Exit Interview Form'},
                          {tempCode:'03',tempName:'Exit Form Testing',headerName:'Exit Interview Form'},
                          
  ]

}
