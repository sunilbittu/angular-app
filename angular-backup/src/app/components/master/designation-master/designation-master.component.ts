import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { EmployeeMastersService } from '../employee.masters.service';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Sort } from '@angular/material/sort';

//import { deepStrictEqual } from 'assert';
declare var $: any;

@Component({
  selector: 'app-designation-master',
  templateUrl: './designation-master.component.html',
  styleUrls: ['./designation-master.component.css']
})
export class DesignationMasterComponent implements OnInit {

  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure you want delete';

  public headers: any = ["Designation Code", "Designation Name", "Action"];
  public employees: any = [
    { designationCode: '123', designationName: 'Teacher' },
    { designationCode: '123', designationName: 'Teacher' }
  ]

  public exist: boolean = false;
  public exist2: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public submitted: boolean = false;
  public designationMastersForm!: FormGroup;
  public editButtonEnable!: boolean;
  public designationList!: any[];
  public designationObject!: any;
  public designationId!: any;
  public designationMasterList!: any[];
  public sortedData: any = [];
  public cancelClicked: boolean = false;

  // pagination
  public p: number = 1;
  itemsPerPage: any=20;
  totalItems: any;
  currentPage: any;
  totalElements: number = 0;
  showingFrom: number = 0;
  showingTo: number = 0;
  public pageNumber: Number = 0;
  public pageSize: number = 20;

  public companyId!: number;
  constructor(private formBuilder: FormBuilder, private employeMasterService: EmployeeMastersService,
    private notification: NotifierService, private crudOperationsService: CrudOperationsService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    console.log(this.editButtonEnable, "editbutton value")
    this.designationMastersForm = this.formBuilder.group({

      designationCode: ['', Validators.required],
      designationName: ['', Validators.required]
    })

    //get designation list
    this.fetchDesignationList();
  }
  get form_() { return this.designationMastersForm.controls; };
  sortData(sort: Sort) {
    this.sortedData = this.crudOperationsService.sortData(sort, this.designationList);

  }

  //clear form values
  modelShow() {
    console.log(this.editButtonEnable, "editbutton value")

    this.exist = false;
    this.exist2 = false;
    this.designationMastersForm.reset();
    //hide edit button
    this.editButtonEnable = false;

  }

  //get designation list
  public searchModel='';
  fetchDesignationList() {
    this.spinner.show();
    //getting companyId from session-storage
    this.companyId = Number(sessionStorage.getItem('companyId'));
    let api='designation/list_company/'+this.companyId+'?search='+this.searchModel+'&page=' + this.pageNumber + '&size=20';
    this.crudOperationsService.getList(api)// + this.pageSize)
      .subscribe((data: any) => {
        this.spinner.hide();

        this.designationList = data.data.content;
        this.sortedData = data.data.content;
        //pagination call
        this.handlePagination(data);
      },
        (error) => {
          this.spinner.hide();

          this.notification.notify('error', 'Something Went Worng');
        })
  }

  public handlePagination(data: any) {
    this.totalElements = data.data.totalElements;
    this.itemsPerPage = 20;
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
  pageChanged(event: any) {
    this.pageNumber = event - 1;
    this.fetchDesignationList();
  }

  checkIfalreadyExist2() {
    if (this.editButtonEnable == true) {

      let designationList2: any[] = this.designationList.filter(y => y.designationId != this.designationId);

      let code: any[] = designationList2.filter(
        x => x.designationCode.toLowerCase() == this.designationMastersForm.value.designationCode.toLowerCase());
      if (code.length > 0) {
        this.exist2 = true;
      } else {
        this.exist2 = false;
      }
    } else {
      let code: any[] = this.designationList.filter(
        x => x.designationCode.toLowerCase() == this.designationMastersForm.value.designationCode.toLowerCase());
      if (code.length > 0) {
        this.exist2 = true;
      } else {
        this.exist2 = false;
      }
    }
  }
  checkIfalreadyExist() {
    if (this.editButtonEnable == true) {

      let designationList2: any[] = this.designationList.filter(y => y.designationId != this.designationId);
      let name: any[] = designationList2.filter(
        x => x.designationName.toLowerCase() == this.designationMastersForm.value.designationName.toLowerCase());

      if (name.length > 0) {
        this.exist = true;
      } else {
        this.exist = false;
      }
    } else {
      let name: any[] = this.designationList.filter(
        x => x.designationName.toLowerCase() == this.designationMastersForm.value.designationName.toLowerCase());

      if (name.length > 0) {
        this.exist = true;
      } else {
        this.exist = false;
      }
    }
  }
  //update designation master
  updateDesignationMaster(id: number) {
    console.log(this.editButtonEnable, "editbutton value")
    this.submitted = true;

    if (this.designationMastersForm.valid == true && this.exist == false && this.exist2 == false) {

      this.designationObject =
      {

        "designationId": this.designationId,
        "designationCode": this.designationMastersForm.value.designationCode,
        "designationName": this.designationMastersForm.value.designationName,

        "company": {
          "companyId": this.companyId
        }

      }

      this.employeMasterService.updateDesignationMaster(this.designationId, this.designationObject)
        .subscribe((data: any) => {
          this.submitted = false;

          this.notification.notify('success', data.message);
          $('#employeeModelPopup').modal('hide');
          //get designation list
          this.fetchDesignationList();
        }
          ,
          (error) => {
            this.notification.notify('error', 'Something Went Worng');
          })

    }
  }
  //delete designationMaster
  deleteDesignationById(id: number) {
    console.log(this.editButtonEnable, "editbutton value")

    this.employeMasterService.deleteDesignationListById(id)
      .subscribe((data: any) => {
        if (data.status == 'success') {
          this.notification.notify('success', data.message);
        }
        this.fetchDesignationList();
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
  editDesignation(id: number) {
    console.log(this.editButtonEnable, "editbutton value")
    //show edit button
    this.editButtonEnable = true;

    this.designationId = id

    this.employeMasterService.getDesignationMasterById(id)
      .subscribe((data: any) => {
        const designationListById = data.data[0]
        this.designationMastersForm.patchValue({
          designationCode: designationListById.designationCode,
          designationName: designationListById.designationName
        })
      }
        ,
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }
  //submit form data
  onSubmit() {
    console.log(this.editButtonEnable, "editbutton value")

    this.submitted = true;

    if (this.designationMastersForm.valid == true && this.exist == false && this.exist2 == false) {

      $('#employeeModelPopup').modal('hide');

      this.designationObject =
      {
        "designationCode": this.designationMastersForm.value.designationCode,
        "designationName": this.designationMastersForm.value.designationName,

        "company": {
          "companyId": this.companyId
        }

      }

      console.log(this.designationObject)

      this.employeMasterService.postDesignationMaster(this.designationObject)
        .subscribe((data: any) => {
          this.notification.notify('success', data.message);
          this.submitted = false;

          //get designation list
          this.fetchDesignationList();
        }
          ,

          (error) => {

            error instanceof HttpErrorResponse

            console.log(error)

            if (error.error.status == 406) {

              this.notification.notify('error', 'DesignationName/DesignationCode Already Exits');
            }

            else {

              this.notification.notify('error', 'Something Went Wrong');

            }
          })
    }
  }

  getDesignationListBySearchParam($event: any) {
    console.log(this.editButtonEnable, "editbutton value")

    const param = $event.target.value;

    if (param.trim() == "") {
      //geting agents list
      this.fetchDesignationList();
    }

    else {
      //alert($event.target.value);
      let api: any = "designation/list_company/1?search=" + param;

      this.crudOperationsService.getList(api)
        .subscribe((data: any) => {
          //this.designationList = data.data.content;
          this.designationList = data.data.content;
          this.sortedData = data.data.content;
          //pagination call
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
