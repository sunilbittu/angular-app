import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { EmployeeMastersService } from '../employee.masters.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
declare var $: any;

@Component({
  selector: 'app-grade-master',
  templateUrl: './grade-master.component.html',
  styleUrls: ['./grade-master.component.css']
})
export class GradeMasterComponent implements OnInit {
  public headers: any = ["Grade Code", "Grade Name", "Action"];

  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure you want delete';
  public gradeMastersForm!: FormGroup;
  public editButtonEnable!: boolean;
  public gradeList!: any[];
  public gradeObject!: any;
  public gradeId!: any;
  public exist: boolean = false;
  public exist2: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public submitted: boolean = false;

  public companyId!: number;

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
    private notification: NotifierService, private spinner: NgxSpinnerService,private crudOperationsService:CrudOperationsService) { }

  ngOnInit(): void {

    this.gradeMastersForm = this.formBuilder.group({
      gradeCode: ['', Validators.required],
      gradeName: ['', Validators.required]
    })

    //get designation list
    this.fetchGradeList()
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
    this.fetchGradeList();
  }
  get form_() { return this.gradeMastersForm.controls; };
  //clear form values
  modelShow() {
    this.exist = false;
    this.exist2 = false;
    this.gradeMastersForm.reset();
    //hide edit button
    this.editButtonEnable = false;

  }

  checkIfalreadyExist2(typedCode: any) {

    if (this.editButtonEnable == true) {
      let gradeList2: any[] = this.gradeList.filter(y => y.gradeId != this.gradeId);

      let code: any[] = gradeList2.filter(
        x => x.gradeCode.toLowerCase() == typedCode.toLowerCase());

      if (code.length > 0) {
        this.exist2 = true;
      } else {
        this.exist2 = false;
      }
    } else {
      let code: any[] = this.gradeList.filter(
        x => x.gradeCode.toLowerCase() == typedCode.toLowerCase());

      if (code.length > 0) {
        this.exist2 = true;
      } else {
        this.exist2 = false;
      }
    }
  }
  checkIfalreadyExist(typedName: any) {
    if (this.editButtonEnable == true) {
      let gradeList2: any[] = this.gradeList.filter(y => y.gradeId != this.gradeId);

      let name: any[] = gradeList2.filter(
        x => x.gradeName.toLowerCase() == typedName.toLowerCase());

      if (name.length > 0) {
        this.exist = true;
      } else {
        this.exist = false;
      }
    } else {
      let name: any[] = this.gradeList.filter(
        x => x.gradeName.toLowerCase() == typedName.toLowerCase());

      if (name.length > 0) {
        this.exist = true;
      } else {
        this.exist = false;
      }
    }
  }
  //get designation list
  fetchGradeList() {
    this.spinner.show();
    //getting companyId from session-storage
    this.companyId = Number(sessionStorage.getItem('companyId'));
    this.employeMasterService.getGradeMasterList(this.companyId,this.pageNumber)
      .subscribe((data: any) => {
        this.spinner.hide();
        this.gradeList = data.data.content;
        this.handlePagination(data);

        console.log(this.gradeList)
      },
        (error) => {
          this.spinner.hide();
          this.notification.notify('error', 'Something Went Worng');
        })
  }

  public searchModel='';
  getGradeListBySearchParam($event: any) {
    const param = $event.target.value;
    this.searchModel=param;
    if (param.trim() == "") {
      //geting agents list
      this.fetchGradeList();
    }
    else {
      //alert($event.target.value);
      let api: any = "grademaster/list/1?search=" + param + "&page=" + this.pageNumber + "&size=10";
      this.crudOperationsService.getList(api)
        .subscribe((data: any) => {
          //this.departmentMasterList = data.data.content
          this.gradeList = data.data.content;
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

  editGradeMaster(id: number) {
    //show edit button
    this.editButtonEnable = true;

    this.gradeId = id

    this.employeMasterService.getGradeMasterById(id)
      .subscribe((data: any) => {
        const gradeListById = data.data[0]
        this.gradeMastersForm.patchValue({
          gradeCode: gradeListById.gradeCode,
          gradeName: gradeListById.gradeName
        })
      }
        ,
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
        })

  }
  //delete designationMaster
  deleteGradeById(id: number) {
    this.employeMasterService.deleteGradeListById(id)
      .subscribe((data: any) => {
        if (data.status == 'success') {
          this.notification.notify('success', data.message);
        }
        this.fetchGradeList();
      },
        (error) => {
          if (error.error.error == 'Conflict') {
            this.notification.notify('error', error.error.message);
          } else {
            this.notification.notify('error', 'Something Went Worng');
          }
        })
  }
  //update grade master
  updateGradeMaster(id: number) {
    this.submitted = true;

    if (this.gradeMastersForm.valid == true && this.exist == false && this.exist2 == false) {
      this.gradeObject =
      {

        "gradeId ": this.gradeId,
        "gradeCode": this.gradeMastersForm.value.gradeCode,
        "gradeName": this.gradeMastersForm.value.gradeName,

        "company": {
          "companyId": this.companyId
        }

      }

      this.employeMasterService.updateGradeMaster(this.gradeId, this.gradeObject)
        .subscribe((data: any) => {
          this.submitted = false;

          this.notification.notify('success', data.message);
          $('#employeeModelPopup').modal('hide');
          //get designation list
          this.fetchGradeList();
        }
          ,
          (error) => {
            this.notification.notify('error', 'Something Went Worng');
          })

    }
  }
  //submit form data
  onSubmit() {
    this.submitted = true;

    if (this.gradeMastersForm.valid == true && this.exist == false && this.exist2 == false) {

      $('#employeeModelPopup').modal('hide');

      this.gradeObject =
      {
        "gradeCode": this.gradeMastersForm.value.gradeCode,
        "gradeName": this.gradeMastersForm.value.gradeName,

        "company": {
          "companyId": this.companyId
        }

      }
      console.log(this.gradeObject)

      this.employeMasterService.postGradeMaster(this.gradeObject)
        .subscribe((data: any) => {
          this.notification.notify('success', data.message);
          this.submitted = false;

          //get designation list
          this.fetchGradeList();
        }
          ,
          (error) => {
            this.notification.notify('error', 'Something Went Worng');
          })

    }
  }
}
