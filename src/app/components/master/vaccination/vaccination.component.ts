import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { EmployeeMastersService } from '../employee.masters.service';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

@Component({
  selector: 'app-vaccination',
  templateUrl: './vaccination.component.html',
  styleUrls: ['./vaccination.component.css']
})
export class VaccinationComponent implements OnInit {

  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure you want delete';

  public headers: any = ["Vaccination Code", "Vaccination Name", "Action"];

  public vaccinationMastersForm!: FormGroup;
  public editButtonEnable!: boolean;
  public vaccinationList!: any[];
  public vaccinationObject!: any;
  public vaccinationId!: any;
  public vaccinationMasterList!: any[];

  public companyId!: number;

  public exist: boolean = false;
  public exist2: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public submitted: boolean = false;
  public cancelClicked: any;
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

  constructor(private formBuilder: FormBuilder, private employeMasterService: EmployeeMastersService,
    private notification: NotifierService, private crudOperationsService: CrudOperationsService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {

    this.vaccinationMastersForm = this.formBuilder.group({

      vaccinationCode: ['', Validators.required],
      vaccinationName: ['', Validators.required]
    })

    //get designation list
    this.fetchVaccinationList();
  }
  get form_() { return this.vaccinationMastersForm.controls; };
  checkIfalreadyExist2() {
    let typedCode = this.vaccinationMastersForm.value.vaccinationCode;
    if (this.editButtonEnable == true) {
      let vaccinationList2: any[] = this.vaccinationList.filter(y => y.vaccinationId != this.vaccinationId);

      let code: any[] = vaccinationList2.filter(
        x => x.vaccinationCode.toLowerCase() == typedCode.toLowerCase());

      if (code.length > 0) {
        this.exist2 = true;
      } else {
        this.exist2 = false;
      }
    } else {
      let code: any[] = this.vaccinationList.filter(
        x => x.vaccinationCode.toLowerCase() == typedCode.toLowerCase());

      if (code.length > 0) {
        this.exist2 = true;
      } else {
        this.exist2 = false;
      }
    }
  }
  checkIfalreadyExist() {
    let typedName: any = this.vaccinationMastersForm.value.vaccinationName;
    if (this.editButtonEnable == true) {
      let vaccinationList2: any[] = this.vaccinationList.filter(y => y.vaccinationId != this.vaccinationId);

      let name: any[] = vaccinationList2.filter(
        x => x.vaccinationName.toLowerCase() == typedName.toLowerCase());

      if (name.length > 0) {
        this.exist = true;
      } else {
        this.exist = false;
      }
    } else {
      let name: any[] = this.vaccinationList.filter(
        x => x.vaccinationName.toLowerCase() == typedName.toLowerCase());

      if (name.length > 0) {
        this.exist = true;
      } else {
        this.exist = false;
      }
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
    this.fetchVaccinationList();
  }
  //clear form values
  modelShow() {
    this.exist = false;
    this.exist2 = false;
    this.vaccinationMastersForm.reset();
    //hide edit button
    this.editButtonEnable = false;

  }

  //get designation list
  fetchVaccinationList() {
    this.spinner.show();
    //getting companyId from session-storage
    this.companyId = Number(sessionStorage.getItem('companyId'));
    this.employeMasterService.getVaccinationList(this.companyId,this.pageNumber)
      .subscribe((data: any) => {
        this.spinner.hide();
        this.vaccinationList = data.data.content;
        this.handlePagination(data);
      },
        (error) => {
          this.spinner.hide();
          this.notification.notify('error', 'Something Went Worng');
        })
  }
  //update designation master
  updateVaccinationMaster(id: number) {

    this.submitted = true;

    if (this.vaccinationMastersForm.valid == true && this.exist == false && this.exist2 == false) {
      this.vaccinationObject =
      {

        "vaccinationId": this.vaccinationId,
        "vaccinationCode": this.vaccinationMastersForm.value.vaccinationCode,
        "vaccinationName": this.vaccinationMastersForm.value.vaccinationName,

        "company": {
          "companyId": this.companyId
        }

      }

      this.employeMasterService.updateVaccinationMaster(this.vaccinationId, this.vaccinationObject)
        .subscribe((data: any) => {
          this.submitted = false;

          this.notification.notify('success', data.message);
          $('#employeeModelPopup').modal('hide');
          //get designation list
          this.fetchVaccinationList();
        }
          ,
          (error) => {
            this.notification.notify('error', 'Something Went Worng');
          })
    }

  }
  //delete designationMaster
  deleteVaccinationById(id: number) {
    this.employeMasterService.deleteVaccinationListById(id)
      .subscribe((data: any) => {
        if (data.status == 'success') {
          this.notification.notify('success', data.message);
        }
        this.fetchVaccinationList();
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
  editVaccination(id: number) {

    //show edit button
    this.editButtonEnable = true;

    this.vaccinationId = id

    this.employeMasterService.getVaccinationMasterById(id)
      .subscribe((data: any) => {
        const vaccinationListById = data.data[0]
        this.vaccinationMastersForm.patchValue({
          vaccinationCode: vaccinationListById.vaccinationCode,
          vaccinationName: vaccinationListById.vaccinationName
        })
      }
        ,
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }
  //submit form data
  onSubmit() {
    this.submitted = true;

    if (this.vaccinationMastersForm.valid == true && this.exist == false && this.exist2 == false) {

      $('#employeeModelPopup').modal('hide');

      this.vaccinationObject =
      {
        "vaccinationCode": this.vaccinationMastersForm.value.vaccinationCode,
        "vaccinationName": this.vaccinationMastersForm.value.vaccinationName,

        "company": {
          "companyId": this.companyId
        }

      }

      console.log(this.vaccinationObject)

      this.employeMasterService.postVaccinationMaster(this.vaccinationObject)
        .subscribe((data: any) => {
          this.notification.notify('success', data.message);

          //get designation list
          this.fetchVaccinationList();
          this.submitted = false;
        }
          ,

          (error) => {

            error instanceof HttpErrorResponse

            console.log(error)

            if (error.error.status == 406) {

              this.notification.notify('error', 'VaccinationName/VaccinationCode Already Exits');
            }

            else {

              this.notification.notify('error', 'Something Went Wrong');

            }
          })
    }
  }

  getVaccinationListBySearchParam($event: any) {
    const param = $event.target.value;

    if (param.trim() == "") {
      //geting agents list
      this.fetchVaccinationList();
    }

    else {
      //alert($event.target.value);
      let api: any = "vaccination/list_company/1?searchParam=" + param+ "&page=" + this.pageNumber + "&size=10";

      this.crudOperationsService.getList(api)
        .subscribe((data: any) => {
          this.vaccinationList = data.data.content;
          this.handlePagination(data);
          //spinner hide
          //this.spinner.hide();

        },
          (error) => {

            console.log(error);

            //spinner hide
            //this.spinner.hide();
          })
    }
  }
}
