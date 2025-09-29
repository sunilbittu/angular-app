import { Component, OnInit } from '@angular/core';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotifierService } from 'angular-notifier';
@Component({
  selector: 'app-letter-template',
  templateUrl: './letter-template.component.html',
  styleUrls: ['./letter-template.component.css']
})
export class LetterTemplateComponent implements OnInit {

  constructor(public crudOperationsService: CrudOperationsService, private spinner: NgxSpinnerService, private notification: NotifierService) { }

  ngOnInit(): void {
    this.fetchAllLetterTemplate();
  }
  public letterTemplateHeaders: any = ["Letter Name", "Letter Subject", "Action"];
  public letterTemplateData: any = [];

  public ckeditorContent: any;
  public onChange!: (value: any) => {};
  public onTouched!: () => {};
  public templateName1: any = '';
  public isAppointmentLetter1: any;
  public templateSubject1: any = '';
  public dateFormat1: any = '';
  public ckeditorContent1: any;
  public templateName2: any = '';
  public isAppointmentLetter2: any;
  public fileUpload2: any;
  public templateSubject2: any = '';
  public submitted = false;
  public dateFormat2: any;
  public ckeditorContent2: any;
  public templateId: any;
  public companyId: any = sessionStorage.getItem("companyId");



  save() {
    this.submitted = true;
    let object: any = {
      "templateName": this.templateName1,
      "isAppoitmentLetter": this.isAppointmentLetter1,
      "templateSubject": this.templateSubject1,
      "useDateFormat": this.dateFormat1,
      "letterTemplate": this.ckeditorContent1,
      "company": { "companyId": this.companyId }
    }
    if (this.templateName1 != '' && this.templateSubject1 != '') {
      let api: any = 'lettertemplatecreation'
      this.crudOperationsService.create(object, api).subscribe((data: any) => {
        this.fetchAllLetterTemplate();
        (<any>$('#newLetterPopup')).modal('hide');

        this.templateName1 = "";
        this.isAppointmentLetter1 = "";
        this.templateSubject1 = "";
        this.dateFormat1 = "";
        this.ckeditorContent1 = "";
        this.submitted = false;


      })
    }
  }

  modelShow() {
    this.templateName1 = "";
    this.isAppointmentLetter1 = "";
    this.templateSubject1 = "";
    this.dateFormat1 = "";
    this.ckeditorContent1 = "";
    this.templateName2 = "";
    this.isAppointmentLetter2 = "";
    this.fileUpload2 = "";
    this.templateSubject2 = "";
    this.dateFormat2 = "";
    this.ckeditorContent2 = "";
  }

  public searchModel='';
  fetchAllLetterTemplate() {
    this.spinner.show();
    let api: any = 'lettertemplatecreation/list/' + this.companyId+'?search='+this.searchModel;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.letterTemplateData = data.data.content;
    },

      (error) => {
        this.spinner.hide();
        this.notification.notify('error', 'Something Went Worng');
      })
  }


  editLetterTemplate(data: any) {
    this.templateId = data.templateId;
    this.templateName2 = data.templateName;
    this.templateSubject2 = data.templateSubject;
    this.isAppointmentLetter2 = data.isAppoitmentLetter;
    this.dateFormat2 = data.useDateFormat;
    this.ckeditorContent2 = data.letterTemplate;
    this.fileUpload2 = data.fileName;
  }

  update() {
    this.submitted = true;
    let object: any = {
      "templateName": this.templateName2,
      "isAppoitmentLetter": this.isAppointmentLetter2,
      "templateSubject": this.templateSubject2,
      "useDateFormat": this.dateFormat2,
      "letterTemplate": this.ckeditorContent2,
      "company": { "companyId": this.companyId }
    }
    if (this.templateName2 != '' && this.templateSubject2 != '') {
      let api: any = 'lettertemplatecreation/' + this.templateId;
      this.crudOperationsService.update(object, api).subscribe((data: any) => {
        console.log(data);
        this.fetchAllLetterTemplate();
        (<any>$('#editLetterPopup')).modal('hide');

        this.submitted = false;

      })
    }
  }

  removeLetterTemplate(data: any) {
    this.templateId = data.templateId;
  }

  deleteLetterTemplate() {

    this.crudOperationsService.delete('lettertemplatecreation/' + this.templateId).subscribe((data: any) => {
      console.log(data);
      this.fetchAllLetterTemplate();
    })
  }

  clear() {
    this.submitted = false;
    this.templateName1 = "";
    this.isAppointmentLetter1 = "";
    this.templateSubject1 = "";
    this.dateFormat1 = "";
    this.ckeditorContent1 = "";
    this.templateName2 = "";
    this.isAppointmentLetter2 = "";
    this.fileUpload2 = "";
    this.templateSubject2 = "";
    this.dateFormat2 = "";
    this.ckeditorContent2 = "";
  }

}
