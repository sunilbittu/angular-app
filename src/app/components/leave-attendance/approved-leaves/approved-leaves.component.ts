import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-approved-leaves',
  templateUrl: './approved-leaves.component.html',
  styleUrls: ['./approved-leaves.component.css']
})
export class ApprovedLeavesComponent implements OnInit {

  constructor() { }
  public headers:any=['Employee Id','Employee Name','Leave Type','Start Date','End Date','No Of Days','Status','Action'];
  ngOnInit(): void {
  }
  deleteSelected(){
    
  }
}
