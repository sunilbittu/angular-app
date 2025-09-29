import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-assign-letter',
  templateUrl: './assign-letter.component.html',
  styleUrls: ['./assign-letter.component.css']
})
export class AssignLetterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  public letterAssignHeaders: any = ["Code", "Name", "Branch", "Department", "Designation", "Division", "Action"];
  public letterAssignData: any = [
    { code: '123', name: 'Science', branch: 'tt', department: '123', designation: 'dss', division: 'dss' },
    { code: '123', name: 'Science', branch: 'tt', department: '123', designation: 'dss', division: 'dss' }
  ]

  public assignHeader: any = ["Date", "Doc. Name", "View", "Action"];
  public assignData: any = [ ];
}
