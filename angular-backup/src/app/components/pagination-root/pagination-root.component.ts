import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';



@Component({
  selector: 'app-pagination-root',
  templateUrl: './pagination-root.component.html',
  styleUrls: ['./pagination-root.component.css']
})
export class PaginationRootComponent implements OnInit, OnChanges {


  @Input() items!: Array<any>;
  @Output() changePage = new EventEmitter<any>(true);
  @Input() initialPage = 1;
  @Input() pageSize = 10;
  @Input() maxPages = 10;

  pager: any = {};


 
  ngOnInit(): void {


  }


  ngOnChanges(changes: SimpleChanges) {

  }



}


