import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../configuration.service';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
@Component({
  selector: 'app-race',
  templateUrl: './race.component.html',
  styleUrls: ['./race.component.css']
})
export class RaceComponent implements OnInit {

  public headers: any = ["Id", "Race", "Action"];
  public races: any = []
  public raceObject: any="";
  public raceName: any = "";
  public raceId: any = "";
  public raceName1: any = "";
  public isDeleted: any = "false";
  public isRaceNameBlank: any = '';

    //pagination
  public p: number = 1;
  itemsPerPage: any=10;
  totalItems: any;
  currentPage: any;
  totalElements: number = 0;
  showingFrom: number = 0;
  showingTo: number = 0;
  public pageNumber: Number = 0;
  public pageSize: number = 10;
 

  constructor(private configurationService: ConfigurationService, private notification: NotifierService,
    private spinner: NgxSpinnerService,private crudOperationsService: CrudOperationsService) { }

  ngOnInit(): void {
    this.fetchRace();
  }

  public handlePagination(data: any) {
    this.totalElements = data.data.totalElements;
    this.itemsPerPage = 10;
    this.currentPage = data.data.pageable.pageNumber + 1;
    this.totalItems = (data.data.totalPages) * this.itemsPerPage;
    this.showingFrom = (data.data.pageable.pageNumber * this.itemsPerPage) + 1;
    const to = (data.data.pageable.pageNumber + 1) * this.itemsPerPage;
    if (this.totalElements >= to) {
      this.showingTo = to;
    } else {
      this.showingTo = this.totalElements;
    }
  }
  public pageChanged(event: any): void {
    this.pageNumber = event - 1;
    this.fetchRace();
  }

  createRace() {
    if (this.raceName != '') {
      let object: any = { 'raceName': this.raceName, "company": { "companyId": sessionStorage.getItem("companyId") } }
      this.configurationService.createRace(object).subscribe((data: any) => {
        window.scroll(0, 0);
        (<any>$('#myModal-add')).modal('hide');
        this.notification.notify('success', data.message);
        this.fetchRace();
        this.raceName = "";
      })
    }
    else {
      if (this.raceName == '') {
        this.isRaceNameBlank = 'Race can\'t be blank';
      }
    }

  }

  public searchModel = '';
  fetchRace() {
    this.spinner.show();
    let api:any='race/list?search='+this.searchModel +"&page=" + this.pageNumber + "&size=10";
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.raceObject = data.data.content;
      this.handlePagination(data);
      this.raceObject.sort((a: any, b: any) => a.raceId - b.raceId);
    },
      (error) => {
        this.spinner.hide();
      })
  }

  editRace(data: any) {
    this.raceId = data.raceId;
    this.raceName1 = data.raceName;
  }

  updateRace() {
    if (this.raceName1 != '') {
      let object: any = { 'raceName': this.raceName1 }
      this.configurationService.updateRace(this.raceId, object).subscribe((data: any) => {
        // console.log(data)
        this.fetchRace();

      })
    }
    else {
      if (this.raceName1 == '') {
        this.isRaceNameBlank = 'Race can\'t be blank';
      }
    }
  }
  removeRace(data: any) {
    this.raceId = data.raceId;
  }


  deleteRace() {
    this.configurationService.deleteRace(this.raceId).subscribe((data: any) => {
      console.log(data)
      this.fetchRace();
    })
  }

  clear() {
    this.raceName = "";
    this.raceName1 = "";
  }

  handleRaceName() {
    if (this.raceName != '') {
      this.isRaceNameBlank = ''
    }

  }



}
