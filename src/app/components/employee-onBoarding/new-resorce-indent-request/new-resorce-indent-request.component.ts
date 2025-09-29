import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { AddEmployeeService } from '../../master/addEmplyee.service';
import { EmployeeMastersService } from '../../master/employee.masters.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-new-resorce-indent-request',
  templateUrl: './new-resorce-indent-request.component.html',
  styleUrls: ['./new-resorce-indent-request.component.css']
})
export class NewResorceIndentRequestComponent implements OnInit {
  projectList: any;
  public weathertoshowupdatebutton: boolean=true;

  constructor(public fb: FormBuilder, private employeeService: AddEmployeeService, public datePipe: DatePipe,
    private crudOperationsService: CrudOperationsService, private notification: NotifierService,private employeMasterService: EmployeeMastersService, private spinner: NgxSpinnerService) { }
  public saveAlert: boolean = false;
  public updateAlert: boolean = false;
  public submitText = '';
  public companyId: any;
  public toggleLoader: boolean = false;
  public submitted: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public submitProcessing: boolean = false;
  public reasonList: any = ["New Requirement", "Replacement"];
  public headers: any = ["Resource Title", "Number Required", "Project Name", "Description", "Request Reason", "Attachment", "Budget Approving Authority", "Budget Approval Status","Status"];
  public resourceList: any = [];
  public selectedHiringDate: any;
  public hiring_date: any;
  public hiringDate = new Date();
  public selectedRequestDate = new Date();
  public request_date: any;
  public requestDate = new Date();
  public toDay = new Date();
  public jobId: any;
  public imageFileName: any;
  public filePath: any;
  public fileSelected: boolean = false;
  public employeeId: any;
  public branchList!: any[];
  public gradeList!: any[];
  public departMentList!: any[];
  public designationList!: any[];
  public costCenterList!: any[];
  public categoryList!: any[];
  public form = this.fb.group({
    resourceTitle: ["", Validators.required],
    project: ["", Validators.required],
    budgetApprovingAuthority: ["", Validators.required],
    numberRequired: ["", Validators.required],
    requestReason: ["", Validators.required],
    hiringStartDate: ["", Validators.required],
    jobDescription: ["", Validators.required],
    requestRaisedBy: [""],
    requestDate: [""],
    selectedFile: [""],
    Branch: ['', Validators.required],
    Grade: ['', Validators.required],
    Department: ['', Validators.required],
    Desiganion: ['', Validators.required],
    CostCenter: ['', Validators.required],
    Category: ['', Validators.required],
  });
  
  get form_() { return this.form.controls; };
  public tempReqDate: any;
  public numberRequired: any = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  public userName: any;
  public api = 'resourceindentrequest';
  public employeeList!: any[];

  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure you want delete';
  public confirmClicked = false;
  public cancelClicked = false;

  ngOnInit(): void {
    this.toggleLoader = true;
    this.resourceList = [];
    this.userName = localStorage.getItem("userName");
    this.employeeId = sessionStorage.getItem("empId");
    this.form.controls['requestRaisedBy'].patchValue(this.userName);
    this.companyId = sessionStorage.getItem("companyId");
    this.fetchResourceList();
    this.getAllEmployees();
    this.fetchProjectList();
    this.fetchBranchDetailsList();
    this.fetchCategoryList();
    this.fetchGradeList();
    this.fetchCostCenterList();
    this.fetchDesignationList();
  }

  fetchResourceList() {
    this.spinner.show();
    let listApi = this.api + '/list?companyId=' + this.companyId + '&employeeId=' + this.employeeId;
    this.crudOperationsService.getList(listApi)
      .subscribe((data: any) => {
        this.spinner.hide();
        this.resourceList = data.data.content;
        this.toggleLoader = false;
      },
        (_error) => {
          this.spinner.hide();
          this.toggleLoader = false;
          this.notification.notify('error', 'Something Went Worng');
        })
  }
  addResource() {
    this.submitText = 'Save';
    this.tempReqDate = this.datePipe.transform(new Date(), 'dd-MM-yyyy');
    this.clear();
  }
  editResource(data: any) {
    this.submitted = false;
    this.submitText = 'Update';
    (<any>$('#add-new-resourse')).modal('show');
    this.form.controls['resourceTitle'].patchValue(data.resourceTitle);
    this.form.controls['project'].patchValue(data.project.projectId);
    this.form.controls['CostCenter'].patchValue(data.costCenterMaster.costCenterId);
    this.form.controls['Branch'].patchValue(data.branchDetail.companyBranchDetailsId);
    this.fetchDepartmentList2(data.branchDetail.companyBranchDetailsId);
    this.form.controls['Category'].patchValue(data.categoryMaster.categoryId);
    this.form.controls['Department'].patchValue(data.department.departmentId);
    this.form.controls['Desiganion'].patchValue(data.designation.designationId);
    this.form.controls['Grade'].patchValue(data.gradeMaster.gradeId);
    this.form.controls['budgetApprovingAuthority'].patchValue(data.budgetApprovingAuthorityId);
    this.form.controls['numberRequired'].patchValue(data.numberRequired);
    this.form.controls['requestReason'].patchValue(data.requestReason);
    this.form.controls['hiringStartDate'].patchValue(new Date(data.hiringStartDate));
    this.form.controls['jobDescription'].patchValue(data.jobDescription);
    this.form.controls['requestRaisedBy'].patchValue(this.userName);
    this.form.controls['selectedFile'].patchValue('');
    this.weathertoshowupdatebutton=data.isOpen;
    this.tempReqDate = this.datePipe.transform(data.requestDate, 'dd-MM-yyyy');
    this.selectedRequestDate = new Date(data.requestDate);
    this.selectedFile = '';
    this.jobId = data.jobId;
    this.imageFileName = data.fileName;
    this.filePath = data.filePath;
    this.fileSelected = true;

  }
  reset() {
    this.submitText = 'Save';
  }
  submit() {
    this.submitted = true;
    console.log(this.form.value)
    for (let el in this.form.controls) {
      if (this.form.controls[el].errors) {
        console.log(el)
      }
    }
    if (this.form.valid) {
      let formData = this.setFormData();
      if (this.submitText == 'Save') {
        if (this.selectedFile != undefined && this.selectedFile != '') {
          this.save(formData, this.api);
        }
      } else {
        if (this.selectedFile != undefined) {
          this.update(formData, this.api + `/${this.jobId}`);
        }
      }
    }
  }
  update(formData: any, api: string) {
    this.submitProcessing = true;
    this.crudOperationsService.update(formData, api)
      .subscribe((data: any) => {
        this.notification.notify('success', data.message);
        (<any>$('#add-new-resourse')).modal('hide');
        this.submitProcessing = false;
        this.ngOnInit();
      },
        (_error) => {
          this.submitProcessing = false;
          this.notification.notify('error', 'Something Went Wrong')
        })
  }
  save(formData: any, api: string) {
    this.submitProcessing = true;
    this.crudOperationsService.create(formData, api)
      .subscribe((data: any) => {
        this.notification.notify('success', data.message);
        (<any>$('#add-new-resourse')).modal('hide');
        this.submitProcessing = false;
        this.ngOnInit();
      },
        (_error) => {
          this.submitProcessing = false;
          this.notification.notify('error', 'Something Went Wrong')
        })
  }
  setFormData(): any {
    const empId = sessionStorage.getItem("empId");
    let data = {
      requestRaisedBy: {
        employeeId: empId
      },
      budgetApprovingAuthority: {
        employeeId: this.form.value.budgetApprovingAuthority
      },
      company: {
        companyId: this.companyId
      },
      hiringStartDate: this.selectedHiringDate,
      requestDate: this.selectedRequestDate,
      resourceTitle: this.form.value.resourceTitle,
      project: {projectId : this.form.value.project},
      numberRequired: this.form.value.numberRequired,
      requestReason: this.form.value.requestReason,
      jobDescription: this.form.value.jobDescription,
      branchDetail: {companyBranchDetailsId: this.form.value.Branch},
      categoryMaster: {categoryId: this.form.value.Category},
      costCenterMaster: {costCenterId: this.form.value.CostCenter},
      department: {departmentId: this.form.value.Department},
      designation: {designationId: this.form.value.Desiganion},
      gradeMaster: {gradeId: this.form.value.Grade}
    }

    
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('resourceIndentRequestDTO', JSON.stringify(data));
    return formData;
  }

  onHiringStartDateValueChange(event: any) {
    this.selectedHiringDate = new Date(event);
  }

  public selectedFile: any;
  onFileChanged(event: any) {
    this.selectedFile = event.target.files[0];
    this.fileSelected = false;
  }
  clear() {
    this.submitted = false;
    this.form.reset();
    this.form.controls['requestRaisedBy'].patchValue(this.userName);
    this.form.controls['requestDate'].patchValue(new Date());
    this.form.controls['numberRequired'].patchValue('');
    this.form.controls['requestReason'].patchValue('');
    this.form.controls['budgetApprovingAuthority'].patchValue('');
    this.fileSelected = false;
    this.selectedFile = '';
    this.selectedRequestDate = new Date();
  }

  
  getAllEmployees() {
    let listApi = this.api + `/list-by/${this.companyId}`;
    this.crudOperationsService.getList(listApi)
      .subscribe((data: any) => {
        this.employeeList = data.data;
      },
        (error) => {
          this.notification.notify('error', 'Something Went Wrong');
        })
  }

  downloadDocumentAttachment(filePath: string, fileName: string) {
    let downloadApi = this.api + '/jobresourcedownload?filePath=' + filePath;
    this.crudOperationsService.downloadDocument(downloadApi)
      .subscribe((response: any) => {
        let blob: any = new Blob([response], { type: "application/octet-stream" }); // must match the Accept type
        const filename = fileName;
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        console.log(fileName)
        anchor.download = filename;
        anchor.href = url;
        anchor.click();
      },
        (error) => {
          this.notification.notify('error', 'Error while downloading the file');
        }
      )
  }
  delete(id: number) {
    this.crudOperationsService.delete(this.api + `/${id}`).subscribe((data: any) => {
      this.notification.notify('success', data.message);
      this.ngOnInit();
    }, (error) => { this.notification.notify('error', 'something went wrong') })
  }
  download() {
    this.downloadDocumentAttachment(this.filePath, this.imageFileName);
  }
  fetchProjectList() {
    this.companyId = Number(sessionStorage.getItem('companyId'));
    this.employeMasterService.getProjectMasterList(this.companyId)
      .subscribe((data: any) => {

        this.projectList = data.data.content;

      })
  }


  fetchBranchDetailsList() {
    //getting companyId from session-storage
    this.companyId = Number(sessionStorage.getItem('companyId'));
    this.employeeId = Number(sessionStorage.getItem('empId'));
    return this.employeMasterService.getBranchMaster(this.companyId)
      .subscribe((data: any) => {

        this.branchList = data.data.content;
        console.log(this.branchList);
      }
        ,
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }
  //get designation list
  fetchGradeList() {
    //getting companyId from session-storage
    this.companyId = Number(sessionStorage.getItem('companyId'));
    this.employeMasterService.getGradeMasterList(this.companyId)
      .subscribe((data: any) => {

        this.gradeList = data.data.content;
      },
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }
 
  //get deepartmentList
  fetchDepartmentList() {
    return this.employeMasterService.getDepartmentListByBranchId(this.form.value.Branch)
      .subscribe((data: any) => {
        this.departMentList = data.data;

      }
        ,
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
        })

  }

  fetchDepartmentList2(data:any) {
    return this.employeMasterService.getDepartmentListByBranchId(data)
      .subscribe((data: any) => {
        this.departMentList = data.data;

      }
        ,
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
        })

  }

  //get designation list
  fetchDesignationList() {
    //getting companyId from session-storage
    this.companyId = Number(sessionStorage.getItem('companyId'));
    this.employeMasterService.getDesignationList(this.companyId)
      .subscribe((data: any) => {

        this.designationList = data.data.content;
      },
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }
  //get costcenter list
  fetchCostCenterList() {
    this.companyId = Number(sessionStorage.getItem('companyId'));
    this.employeMasterService.getCostCenterMasterList(this.companyId)
      .subscribe((data: any) => {

        this.costCenterList = data.data.content;

      },
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }

  //get categoryMaster list
  fetchCategoryList() {
    this.companyId = Number(sessionStorage.getItem('companyId'));
    this.employeMasterService.getCategoryMasterList(this.companyId)
      .subscribe((data: any) => {

        this.categoryList = data.data.content;

        console.log(this.categoryList);

      },
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }

}
