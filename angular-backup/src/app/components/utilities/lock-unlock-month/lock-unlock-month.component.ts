import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lock-unlock-month',
  templateUrl: './lock-unlock-month.component.html',
  styleUrls: ['./lock-unlock-month.component.css']
})
export class LockUnlockMonthComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }



  public headers:any=["Start Month","End Month","Month","Lock/Unlock","Lock Shift"];
  public employees:any=[
                      {start:'01/04/2021',end:'30/04/2021',month:'April-2021',lock:'yes',unlock:'no'},
                      {start:'01/04/2021',end:'30/04/2021',month:'April-2021',lock:'yes',unlock:'no'},
                      {start:'01/04/2021',end:'30/04/2021',month:'April-2021',lock:'yes',unlock:'no'},
                      {start:'01/04/2021',end:'30/04/2021',month:'April-2021',lock:'yes',unlock:'no'}
                     ]

}
