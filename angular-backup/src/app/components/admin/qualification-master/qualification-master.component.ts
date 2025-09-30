import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { identifierName } from '@angular/compiler';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-qualification-master',
  templateUrl: './qualification-master.component.html',
  styleUrls: ['./qualification-master.component.css']
})
export class QualificationMasterComponent implements OnInit {

  public qualificationMasterForm = this.formBuilder.group({
    qualificationCode: ['', Validators.required],
    qualificationName: ['', Validators.required],
    qualificationType: ['', Validators.required],
  })
  editButtonEnable: boolean = false;
  id: any;
  get form_() { return this.qualificationMasterForm.controls; };
  public submitText: string = '';
  public qualificationObject: any;
  public submitProcessing: boolean = false;
  public companyId: any = Number(sessionStorage.getItem("companyId"));
  public submitted: boolean = false;

  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure you want delete';
  public cancelClicked: boolean = false;

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


  constructor(private formBuilder: FormBuilder, private notification: NotifierService, private crudOperationsService: CrudOperationsService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.fetchQualificationsListByCompanyId();
  }
  public headers: any = ["Qualification Code", "Qualification Name", "Course Type", "Action"];
  public qualifications: any = [];

  onSubmit() {
    if (this.submitText == 'Update') {
      this.updateQualificationData();
    }
    if (this.submitText == 'Save') {
      this.saveQualificationData();
    }
  }
  updateQualificationData() {
    this.submitted = true;
    if (this.qualificationMasterForm.valid) {
      //show spinner
      this.spinner.show();
      this.qualificationObject =
      {
        'qualificationCode': this.qualificationMasterForm.value.qualificationCode,
        'qualificationName': this.qualificationMasterForm.value.qualificationName,
        'qualificationType': this.qualificationMasterForm.value.qualificationType,
        'company': {
          'companyId': this.companyId
        }
      }

      let api: any = 'qualificationmaster/'+this.id;
      this.crudOperationsService.update(this.qualificationObject, api)
        .subscribe((data: any) => {
          this.notification.notify('success', data.message);
          this.resetTheForm();
          //show hide
          this.spinner.hide();
          //hide modelpopup
          (<any>$('#addQualification')).modal('hide');
          this.fetchQualificationsListByCompanyId();
        },
          (error) => {
            this.notification.notify('error', 'Something Went Wrong');
            //show hide
            this.spinner.hide();
          })
    }
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
    this.fetchQualificationsListByCompanyId();
  }
  clickAdd() {
    this.resetTheForm();
  }
  resetTheForm() {
    this.submitted = false;
    this.id = undefined;
    this.submitText = 'Save';
    this.qualificationMasterForm.reset();
  }

  saveQualificationData() {
    this.submitted = true;
    if (this.qualificationMasterForm.valid) {
      //show spinner
      this.spinner.show();
      this.qualificationObject =
      {
        'qualificationCode': this.qualificationMasterForm.value.qualificationCode,
        'qualificationName': this.qualificationMasterForm.value.qualificationName,
        'qualificationType': this.qualificationMasterForm.value.qualificationType,
        'company': {
          'companyId': this.companyId
        }
      }

      let api: any = 'qualificationmaster'
      this.crudOperationsService.create(this.qualificationObject, api)
        .subscribe((data: any) => {
          this.notification.notify('success', data.message);
          this.resetTheForm();
          //show hide
          this.spinner.hide();
          //hide modelpopup
          (<any>$('#addQualification')).modal('hide');
          this.fetchQualificationsListByCompanyId();
        },
          (error) => {
            this.notification.notify('error', 'Something Went Wrong');
            //show hide
            this.spinner.hide();
          })
    }
  }
  public searchModel='';
  fetchQualificationsListByCompanyId() {
    this.spinner.show();
    let api: any = 'qualificationmaster/list_company/' + this.companyId + '?search='+this.searchModel+'&page='+this.pageNumber+'&size=10';
    this.crudOperationsService.getList(api)
      .subscribe((data: any) => {
        this.qualifications = data.data.content;
        this.handlePagination(data);
        this.spinner.hide();
      },
        (error) => {
          this.spinner.hide();
          this.notification.notify('error', 'Something Went Wrong');
        })
  }

  //delete designationMaster
  deleteById(id: number) {
    let api: any = "qualificationmaster/" + id;
    this.crudOperationsService.delete(api)
      .subscribe((data: any) => {
        if (data.status == 'success') {
          this.notification.notify('success', data.message);
        }
        this.fetchQualificationsListByCompanyId();
      },
        (error) => {
          if (error.error.error == 'Conflict') {
            this.notification.notify('error', error.error.message);
          } else {
            this.notification.notify('error', 'Something Went Worng');
          }
        })
  }

  //append form controls
  edit(data: any) {
    //show edit button
    this.editButtonEnable = true;
    this.submitText = 'Update';
    this.id = data.qualificationId;
    this.qualificationMasterForm.patchValue({
      qualificationCode: data.qualificationCode,
      qualificationName: data.qualificationName,
      qualificationType: data.qualificationType
    })
  }

}
