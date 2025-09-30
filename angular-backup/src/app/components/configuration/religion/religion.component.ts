import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../configuration.service';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-religion',
  templateUrl: './religion.component.html',
  styleUrls: ['./religion.component.css']
})
export class ReligionComponent implements OnInit {

  public headers: any = ["Code", "Religion", "Action"];
  public religions: any = [];
  public religionObject: any = "";
  public religionName: any = "";
  public religionId: any = "";
  public religionName1: any = "";
  public isDeleted: any = "false";
  public isreligionNameBlank: any = '';
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
  constructor(private configurationService: ConfigurationService, private crudOperationsService: CrudOperationsService ,private notification: NotifierService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.fetchReligion();
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
    this.fetchReligion();
  }
  createReligion() {
    if (this.religionName != '') {
      let object: any = { 'religionName': this.religionName, "company": { "companyId": sessionStorage.getItem("companyId") } }
      this.configurationService.createReligion(object).subscribe((data: any) => {
        this.notification.notify('success', data.message);
        this.fetchReligion();
        this.religionName = "";
      })
    }
    else {
      if (this.religionName == '') {
        this.isreligionNameBlank = 'Religion can\'t be blank';
      }
    }

  }

  public searchModel='';
  fetchReligion() {
    this.spinner.show();
    let api:any='religion/list?search='+this.searchModel+'&page='+this.pageNumber+'&size=10';
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.religionObject = data.data.content;
      this.handlePagination(data);
      this.religionObject.sort((a: any, b: any) => a.religionId - b.religionId);
    },
      (error) => {
        this.spinner.hide();
      })
  }

  editReligion(data: any) {
    this.religionId = data.religionId;
    this.religionName1 = data.religionName;
  }

  updateReligion() {
    if (this.religionName1 != '') {
      let object: any = { 'religionName': this.religionName1 }
      this.configurationService.updateReligion(this.religionId, object).subscribe((data: any) => {
        // console.log(data)
        this.notification.notify('success', 'Religion updated successfully!');
        this.fetchReligion();

      })
    }
    else {
      if (this.religionName1 == '') {
        this.isreligionNameBlank = 'Religion can\'t be blank';
      }
    }
  }

  removeReligion(data: any) {
    this.religionId = data.religionId;
  }


  deleteReligion() {
    this.configurationService.deleteReligion(this.religionId).subscribe((data: any) => {
      console.log(data)
      this.fetchReligion();
    })
  }

  clear() {
    this.religionName = "";
    this.religionName1 = "";

  }

  handleReligionName() {
    if (this.religionName != '') {
      this.isreligionNameBlank = ''
    }

  }
}
