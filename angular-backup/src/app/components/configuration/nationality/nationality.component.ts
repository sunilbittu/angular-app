import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../configuration.service';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import {Sort} from '@angular/material/sort';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-nationality',
  templateUrl: './nationality.component.html',
  styleUrls: ['./nationality.component.css']
})
export class NationalityComponent implements OnInit {

  public headers: any = ["Code", "Nationality", "Action"];
  public nationalites: any = [];
  public nationalityName: any = "";
  public nationalityObject: any="";
  public nationalityId: any = "";
  public nationalityName1: any = "";
  //public sortedData: any=[];

  public submitted = false;
  public isNationalityBlank: any = '';
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

  constructor( private configurationService:ConfigurationService, private notification: NotifierService,private crudOperationsService:CrudOperationsService,private spinner: NgxSpinnerService) {  }

  ngOnInit(): void {
    this.fetchNationalites();
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
    this.fetchNationalites();
  }


  createNationality() {
    if (this.nationalityName != '') {
      let object: any = { 'nationalityName': this.nationalityName, "company": { "companyId": sessionStorage.getItem("companyId") } };
      this.configurationService.createNationality(object).subscribe((data: any) => {
        window.scroll(0, 0);
        (<any>$('#myModal-add')).modal('hide');
        this.notification.notify('success', data.message);
        this.fetchNationalites();
        this.nationalityName = "";
      })
    }
    else {
      if (this.nationalityName == '') {
        this.isNationalityBlank = 'Nationality can\'t be blank';
      }
    }
  }

  // sortData(sort: Sort) {
  //   console.log("luck===============")
  //   this.sortedData=this.crudOperationsService.sortData(sort,this.nationalityObject);
         
  // }
  public searchModel='';
  fetchNationalites() {
    this.spinner.show();
    let api:any='nationality/list?search=' + this.searchModel+"&page=" + this.pageNumber + "&size=10";
    console.log(api);
    this.crudOperationsService.getList(api)
      .subscribe((data: any) => {
        this.spinner.hide();
        this.nationalityObject = data.data.content;
        this.handlePagination(data);
        //console.log(this.nationalityObject);
        //this.sortedData=data.data.content;
        this.nationalityObject.sort((a: any, b: any) => a.nationalityId - b.nationalityId);
    },
      (error) => {
        this.spinner.hide();
        this.notification.notify('error', 'Something went wrong!');
      })
  }

  editNationality(data: any) {
    this.nationalityId = data.nationalityId;
    this.nationalityName1 = data.nationalityName;


  }

  updateNationality() {
    this.submitted = true;
    if (this.nationalityName1 != "") {
      let object: any = { 'nationalityName': this.nationalityName1 }
      this.configurationService.updateNationality(this.nationalityId, object).subscribe((data: any) => {
        console.log(data);
        (<any>$('#myModal-edit')).modal('hide');
        
        this.notification.notify('success', 'Nationality updated successfully!');
        this.fetchNationalites();

      })
    }
    else {
      if (this.nationalityName1 == '') {
        this.isNationalityBlank = 'Nationality can\'t be blank';
      }
    }
  }

  removeNationality(data: any) {
    this.nationalityId = data.nationalityId;
  }

  deleteNationality() {
    this.configurationService.deleteNationality(this.nationalityId).subscribe((data: any) => {
      console.log(data)
      this.fetchNationalites();
    })
  }

  clear() {
    this.nationalityName = "";
    this.nationalityName1 = "";

  }

  handleNationality() {
    if (this.nationalityName != '') {
      this.isNationalityBlank = ''
    }
  }


practice(){
  this.crudOperationsService.getList('nationality/count').subscribe((data:any) => { 

  })
}
}
