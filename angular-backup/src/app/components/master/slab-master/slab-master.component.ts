import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-slab-master',
  templateUrl: './slab-master.component.html',
  styleUrls: ['./slab-master.component.css']
})
export class SlabMasterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  public headers:any=["#","Slab Name","Action"];
  public employees:any=[
                      {slno:'1',slabName:'hyd'},
                      {slno:'2',slabName:'bbsr'},
                     ]
}
