import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmployeeMastersService } from '../employee.masters.service';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
declare var $: any;

@Component({
  selector: 'app-project-master',
  templateUrl: './project-master.component.html',
  styleUrls: ['./project-master.component.css']
})
export class ProjectMasterComponent implements OnInit {

  public headers: any = ["Project Code", "Project Name","Selected Working Days Option", "No. of Working Days", "Action"];

  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure you want delete';

  public projectMastersForm!: FormGroup;
  public editButtonEnable!: boolean;
  public projectMasterList!: any[];
  public projectObject!: any;
  public projectMasterId!: any;
  public companyId!: number;

  public workingDaysOption:any;

  public calender: boolean = true;
  public userInput: boolean = false;
  public exist: boolean = false;
  public exist2: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public submitted: boolean = false;
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

    this.projectMastersForm = this.formBuilder.group({
      projectCode: ['', Validators.required],
      projectName: ['', Validators.required],
      workingDays:['30']
    })

    //get costcenter list
    this.fetchProjectList()
  }
  get form_() { return this.projectMastersForm.controls; };
  //clear form values
  modelShow() {
    this.exist = false;
    this.exist2 = false;
    this.projectMastersForm.reset();
    //hide edit button
    this.editButtonEnable = false;

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
    this.fetchProjectList();
  }
  checkIfalreadyExist2(typedCode: any) {

    if (this.editButtonEnable == true) {
      let projectMasterList2: any[] = this.projectMasterList.filter(y => y.projectId != this.projectMasterId);

      let code: any[] = projectMasterList2.filter(
        x => x.projectCode.toLowerCase() == typedCode.toLowerCase());

      if (code.length > 0) {
        this.exist2 = true;
      } else {
        this.exist2 = false;
      }
    } else {
      let code: any[] = this.projectMasterList.filter(
        x => x.projectCode.toLowerCase() == typedCode.toLowerCase());

      if (code.length > 0) {
        this.exist2 = true;
      } else {
        this.exist2 = false;
      }
    }
  }
  checkIfalreadyExist(typedName: any) {
    if (this.editButtonEnable == true) {

      let projectMasterList2: any[] = this.projectMasterList.filter(y => y.projectId != this.projectMasterId);
      let name: any[] = projectMasterList2.filter(
        x => x.projectName.toLowerCase() == typedName.toLowerCase());

      if (name.length > 0) {
        this.exist = true;
      } else {
        this.exist = false;
      }
    } else {
      let name: any[] = this.projectMasterList.filter(
        x => x.projectName.toLowerCase() == typedName.toLowerCase());

      if (name.length > 0) {
        this.exist = true;
      } else {
        this.exist = false;
      }
    }
  }
  //get costcenter list
  fetchProjectList() {
    this.spinner.show();
    this.companyId = Number(sessionStorage.getItem('companyId'));
    this.employeMasterService.getProjectMasterListForPage(this.companyId,this.pageNumber)
      .subscribe((data: any) => {
        this.spinner.hide();
        this.projectMasterList = data.data.content;
        this.handlePagination(data);


      },
        (error) => {
          this.spinner.hide();
          this.notification.notify('error', 'Something Went Worng');
        })
  }

  public searchModel='';
  getProjectListBySearchParam($event: any) {
    const param = $event.target.value;
    this.searchModel=param;
    if (param.trim() == "") {
      //geting agents list
      this.fetchProjectList();
    }
    else {
      //alert($event.target.value);
      let api: any = "projectmaster/list/1?search=" + param + "&page=" + this.pageNumber + "&size=10";

      this.crudOperationsService.getList(api)
        .subscribe((data: any) => {
          this.projectMasterList = data.data.content;
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


  //delete ProjectMaster
  deleteProjectMasterById(id: number) {
    this.employeMasterService.deleteProjectListById(id)
      .subscribe((data: any) => {
        if (data.status == 'success') {
          this.notification.notify('success', data.message);
        }
        this.fetchProjectList();
      },
        (error) => {
          if (error.error.error == 'Conflict') {
            this.notification.notify('error', error.error.message);
          } else {
            this.notification.notify('error', 'Something Went Worng');
          }
        })
  }

  editProjectMaster(id: number) {

    //show edit button
    this.editButtonEnable = true;

    this.projectMasterId = id;
    this.employeMasterService.getProjectMasterById(this.projectMasterId)
      .subscribe((data: any) => {
        const projectListById = data.data[0];
        this.calender = projectListById.isCalender;
        if(!this.calender) this.userInput=true;
        else this.userInput=false;
        this.projectMastersForm.patchValue({
          projectCode: projectListById.projectCode,
          projectName: projectListById.projectName,
          workingDays: projectListById.workingDays
        })
      }
        ,
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
        })

  }

  updateProjectMaster(id: number) {
    this.submitted = true;

    if (this.projectMastersForm.valid == true && this.exist == false && this.exist2 == false) {

      this.projectObject =
      {

        "projectId": this.projectMasterId,
        "projectCode": this.projectMastersForm.value.projectCode,
        "projectName": this.projectMastersForm.value.projectName,
        "workingDays":this.projectMastersForm.value.workingDays,
        "isCalender":this.calender,
        "company": {
          "companyId": this.companyId
        }
      }
      this.employeMasterService.updateProjectMaster(this.projectMasterId, this.projectObject)
        .subscribe((data: any) => {
          this.submitted = false;

          this.notification.notify('success', data.message);
          $('#employeeModelPopup').modal('hide');
          //get designation list
          this.fetchProjectList();
        }
          ,
          (error) => {
            this.notification.notify('error', 'Something Went Worng');
          })
    }

  }

  getWorkingDaysOption(option:any){
    //alert(option);
    if(option==='user') this.calender=false;
    else this.calender=true;
  }

  onSubmit() {
    this.submitted = true;

    // if(!this.calender){
    //   if(this.projectMastersForm.value.workingDays==""){

    //   }else{

    //   }
    // }

    if (this.projectMastersForm.valid == true && this.exist == false && this.exist2 == false) {

      $('#employeeModelPopup').modal('hide');

      this.projectObject =
      {

        "projectCode": this.projectMastersForm.value.projectCode,
        "projectName": this.projectMastersForm.value.projectName,
        "workingDays":this.projectMastersForm.value.workingDays,
        "isCalender":this.calender,
        "company": {
          "companyId": this.companyId
        }
      }
      this.employeMasterService.postProjectMaster(this.projectObject)
        .subscribe((data: any) => {
          this.notification.notify('success', data.message);

          this.submitted = false;
          //get designation list
          this.fetchProjectList();
        }
          ,
          (error) => {
            this.notification.notify('error', 'Something Went Worng');
          })

    }

  }
}
