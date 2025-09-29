import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { AddEmployeeService } from '../../master/addEmplyee.service';
import { ConfigurationService } from 'src/app/components/configuration/configuration.service';
import { ShareDataService } from 'src/app/services/sharaData.service';
import { EmployeeMastersService } from '../../master/employee.masters.service';
import { PaginationInstance } from 'ngx-pagination';


@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {
  downloadDocumentAttachment(arg0: any, arg1: any) {
  }

  constructor(private configurationService: ConfigurationService,private employeMasterService: EmployeeMastersService, private formBuilder: FormBuilder, private spinner: NgxSpinnerService,
    public crudOperationsService: CrudOperationsService, private notification: NotifierService,
    public datePipe: DatePipe, private employeeService: AddEmployeeService, public shareService: ShareDataService, private router: Router) { }

  public headers: any = ['Position Name', 'Job Client', 'Job Location', 'Headcount','Max. Submissions','Current Submissions', 'Minimum Salary', 'Maximum Salary', 'Job Owner', 'Job Team', 'Job Stage', 'Actions'];
  public candidateHeaders: any = ['Candidate Name', 'Candidate Reference', 'Candidate Location', 'Current Position', 'Current Company', 'Notice Period', 'Current Salary', 'Expected Salary', 'Candidate Owner', 'Candidate Created Date'];
  public attachmentHeader: any = ['Document Name', 'Document Type', 'Actions'];
  public statusList: any = ['Active', 'Completed', 'Cancelled', 'On Hold'];
  public candidateStatusList: any = ['New candidate', 'Interested', 'Shortlisted', 'Submitted', 'Interviewed', 'Offered', 'Hired', 'Started', 'Probation passed','Rejected'];
  public teamMembersHeader: any = ['Name', 'Display Name', 'Last Active', 'Actions'];
  public companyId: any = Number(sessionStorage.getItem('companyId'));
  public employeeId: any = Number(sessionStorage.getItem('empId'));

  public contractDropdown: any = ['Permanent','Fulltime', 'Part-time', 'Temporary', 'Freelance', 'Internship', 'Apprenticeship', 'Contractor', 'Consultancy'];
  public frequencyDropdown: any = ['Daily', 'Hourly', 'Weekly', 'Monthly', 'Yearly'];
  public Fields: any = [{ "name": "Position Name", "value": "positionName" }, { "name": "Job Location", "value": "jobLocation" }, { "name": "Contract Details", "value": "contractDetails" },
  { "name": "Job Owner", "value": "jobOwner" }, { "name": "Job Stage", "value": "jobStage" },{ "name": "Client Name", "value": "clientName" }];
  public CandidateFields: any = [{ "name": "Candidate Name", "value": "candidateName" }, { "name": "Candidate Website", "value": "candidatePhoneNumber" }, { "name": "Candidate Location", "value": "candidateLocation" },
  { "name": "Candidate Owner", "value": "candidateOwner" }, { "name": "Candidate Stage", "value": "candidateStage" }, { "name": "Candidate ContactNumber", "value": "candidateContactNumber" }];
  public CandidateSearchFields: any = [{ "name": "Location", "value": "candidateLocation" }, { "name": "Employers", "value": "Employers" }, { "name": "Languages", "value": "languages" },
  { "name": "Skills", "value": "Skills" }];
  public Conditions: any = [{ "name": "is equal to", "value": "=" }, { "name": "contains", "value": "contains" }, { "name": "starts with", "value": "starts with" }, { "name": "ends with", "value": "ends with" }];
  public fieldModel: any = '';
  public conditionModel: any = '';
  public candidateList: any = [];
  public filterCandidateList: any = [];
  public recommandedCandidateList: any[] = [];
  public valueModel: any = '';
  public conditionsArray: any = [];
  public valuesArray: any = [];
  public cityObject: any = "";
  public searchModel = '';
  public jobTagsList: any = [];
  public currencyList!: any[];
  public candidatesSearchModel = '';
  public skillSubmitted: boolean = false;
  public skillId: any = '';
  public submitTextSkill = 'Save';
  public skillsHeader: any = ['Skill Name', 'Rating', 'Actions'];
  public ratingList: any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  public skillsList: any = [];
  public skillList: any = [];

  public showConditionText = false;
  public showConditionDropdown = true;

  public skillForm = this.formBuilder.group({
    skillName: ['', Validators.required],
    rating: [null, Validators.required]
  })

  get skillform_() { return this.skillForm.controls; };

  get _formSkill() { return this.skillForm.value };
  public selectedCandidateCount: number = 0;
  public dropDescription: any = '';
  public selectedItemsStage: any = [];

  public clientList: any = [];
  public jobList: any = [];
  public valuesList: any = [];
  public attachmentsList: any = [];
  public clientSummaryDetails: any = {};
  public teamMembersList: any = [];
  public showAdvancedOptions = false;
  public showFilterModel = false;
  public showView: any = false;
  public employeeList: any;
  public searchValue: any = "";
  public toggleLoader: boolean = false;
  public id: any;
  public candidateId: any;
  public clientSearchModel = '';
  public submitted: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public selectedFile: any;
  public imageFileName: any;
  public filePath: any;
  public fileSelected: boolean = false;
  public submitText = '';
  public api = 'job'
  public submitProcessing = false;
  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure you want delete';
  public confirmClicked = false;
  public cancelClicked = false;
  public submitErrorText: any = '';
  public clientForm = this.formBuilder.group({
    positionName: ['', Validators.required],
    clientId: ['', Validators.required],
    headCount: [''],
    maxSubmissions: [''],
    submittedCount: [''],
    jobLocation: [''],
    contractDetails: [''],
    minSalary: [''],
    maxSalary: [''],
    currency: [''],
    frequency: [''],
    jobDescription: [''],
    isArchived: false,
    jobOwner: ['']

  })
  public checked: any = false;
  public droppedPopoverTitle = 'Dropped Confirmation';
  public droppedPopoverMessage = 'Are you sure you want drop';

  public addToJobPopoverTitle = 'Add to Job Confirmation';
  public addToJobPopoverMessage = 'Are you sure for add to Job?';

  public dropdownSettingsStage = {
    singleSelection: false,
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 4,
    allowSearchFilter: false,
  };

  public stageList: any = ['Above budget', 'Accepted another offer', 'Cultural fit', 'Did not attend the interview',
    'Not available', 'Not Qualified', 'Other', 'Overqualified', 'Reference check failed', 'Rejected the offer',
    'Technical test failed', 'Unresponsive'];

  onItemSelectStage(data: any) { }
  OnStageItemDeSelect(item: any) { }
  onSelectAllStage(event: any) { }

  onItemSelectUser(data: any) { 
    if (this.fieldModel && this.conditionModel && this.valueModel) {
      this.addCondition(this.fieldModel, this.conditionModel, this.valueModel);
  }
  }
  OnUserItemDeSelect(item: any) { }
  onSelectAllUser(event: any) { }

  public dropdownSettingsUser = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: false,
  };

  public tagSearchValue: any = "";
  public enableBulkAction: any = false;
  public enableStudentBulkAction: any = false;
  public selectedClientCount: number = 0;
  public tagsList: any = [{ color: 'red', name: 'Critical', selected: false }, { color: 'green', name: 'Difficult', selected: false },
  { color: 'yellow', name: 'Important', selected: false }, { color: 'pink', name: 'Open to foreigners', selected: false }];

  designation: string | null = null;

  //pagination
  itemsPerPage: any = 20;
  totalItems: any;
  currentPage: any;
  totalElements: number = 0;
  showingFrom: number = 0;
  showingTo: number = 0;
  public pageNumber: Number = 0;

  get form_() { return this.clientForm.controls; };

  get _form() { return this.clientForm.value };
  public subscription: any;
  public sharedData: any;
  ngOnInit(): void {
    this.designation = sessionStorage.getItem('designation');
    this.subscription = this.shareService.currentMessage.subscribe((message) => {
      this.sharedData = message
    });
    if (this.sharedData && this.sharedData != 'Default') {
      this.handleClient(this.sharedData);
      this.shareService.changeMessage('');
    }

    this.getClients();
    this.getJobs();
    // this.getCandidates();
    this.fetchSkills();
    this.fetchCurrencyList();
  }

  fetchCurrencyList() {
    //getting companyId from session-storage
    this.spinner.show();
    this.companyId = Number(sessionStorage.getItem('companyId'));
    this.employeMasterService.getCurrencyList(this.companyId)
      .subscribe((data: any) => {
        this.spinner.hide();
        this.currencyList = data.data.content;
      },
        (error) => {
          this.spinner.hide();
          this.notification.notify('error', 'Something Went Worng');
        })
  }

  fetchSkills() {
    this.spinner.show();
    let url = 'parent-skill-master/dropdownList?id=' + this.companyId;
    this.crudOperationsService.getList(url).subscribe((data: any) => {
      this.spinner.hide();
      this.skillList = data.data;
      this.skillList.sort((a: any, b: any) => a.id - b.id);
    },
      (error) => {
        this.spinner.hide();
        this.notification.notify('error', 'Something went wrong!');
      })
  }
  getClients() {
    this.spinner.show();
    let api = 'client/list?companyId=' + this.companyId + '&search=' + this.clientSearchModel +'&username=' + localStorage.getItem("userName") + '&page=&size=200&isArchived=false';
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.clientList = data.data.content;
      //pagination call
      //this.handlePagination(data);
    },
      (error) => {
        // this.spinner.hide();
        console.log(error);
      })
  }
  getJobs() {
    this.spinner.show();
    let api = 'job/findAllJobsWithCandidates?companyId=' + this.companyId + '&search=' + this.clientSearchModel + '&page=' + this.pageNumber + '&size=20&isArchived=false';
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.jobList = data.data.content;
      //pagination call
      this.jobList.map(function (obj: any) {
        obj.selected = false;
      })
      this.handlePagination(data);
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })
  }
  getCandidates() {
    this.spinner.show();
    let api = 'job/getCandidatesById?id=' + this.id;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.candidateList = data.data;
      this.candidateList.map(function (obj: any) {
        obj.selected = false;
      })
      //pagination call
      //this.handlePagination(data);
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })
  }

  search() {
    this.getJobs();
  }

  modelShow() {
    this.clear();
  }
  modelFilter() {
    this.showFilterModel = true;
  }
  cancelFilter() {
    this.showFilterModel = false;
    this.conditionsArray = [];
    this.fieldModel = '';
    this.conditionModel = '';
    this.valueModel = [];
    this.getJobs();
    this.getCandidates();
  }

  public linkId = '';
  confirmDropped(id: any) {
    // this.clearDropCandidate();
    (<any>$('#candidate-drop-modal')).modal('show');
    this.linkId = id;
  }

  clearDropCandidate() {
    this.dropDescription = '';
    this.selectedItemsStage = [];
    this.getCandidates();
    this.linkId = '';
  }

  dropCandidate() {
    let formData = {
      'reasonsToDrop': this.selectedItemsStage,
      'dropDescription': this.dropDescription
    }
    this.crudOperationsService.update(formData, this.api + `/updateDroppedCandidateDetails/${this.linkId}`)
      .subscribe((data: any) => {
        this.notification.notify('success', 'Details Updated Successfully!');
        (<any>$('#candidate-drop-modal')).modal('hide');
         (<any>$('#candidate-reject-modal')).modal('hide');
        this.submitProcessing = false;
        this.getCandidates();
      },
        (_error) => {
          this.submitProcessing = false;
          this.notification.notify('error', 'Something Went Wrong')
        })
  }

  


  modelShowEdit(data: any) {
    this.submitted = false;
    this.submitText = 'Update';
    this.id = data.id;
    this.clientForm.reset();
    this.form_['positionName'].patchValue(data.positionName);
    this.form_['clientId'].patchValue(data.clId);
    this.form_['headCount'].patchValue(data.headCount);
    this.form_['maxSubmissions'].patchValue(data.maxSubmissions);
    this.form_['submittedCount'].patchValue(data.submittedCount);
    this.form_['jobLocation'].patchValue(data.jobLocation);
    this.form_['contractDetails'].patchValue(data.contractDetails);
    this.form_['minSalary'].patchValue(data.minSalary);
    this.form_['maxSalary'].patchValue(data.maxSalary);
    this.form_['currency'].patchValue(data.currency);
    this.form_['frequency'].patchValue(data.frequency);
    this.form_['jobDescription'].patchValue(data.jobDescription);
    (<any>$('#client-add-modal')).modal('show');
    // this.fileSelected = true;
  }

  submit() {
    this.submitted = true;
    for (let el in this.form_) {
      if (this.form_[el].errors) {
        console.log(el)
      }
    }
    if (this.clientForm.valid) {
      // alert("save");
      if (this.submitText !== 'Update') {
        let formData = this.setFormData();
        this.save(formData, this.api);
      } else {
        let formData = this.getFormData();
        this.update(formData, this.api + `/${this.id}`);
      }
    }
  }
  update(formData: any, api: string) {
    this.submitProcessing = true;
    this.crudOperationsService.update(formData, api)
      .subscribe((data: any) => {
        this.notification.notify('success', data.message);
        (<any>$('#client-add-modal')).modal('hide');
        this.submitProcessing = false;
        this.ngOnInit();
        this.clear();
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
        (<any>$('#client-add-modal')).modal('hide');
        this.submitProcessing = false;
        this.ngOnInit();
        this.clear();
      },
        (_error) => {
          this.submitProcessing = false;
          this.notification.notify('error', 'Something Went Wrong')
        })
  }
  getFormData(): any {
    let companyId = {
      'companyId': this.companyId
    };
    let clientId = {
      'id': this._form.clientId
    };
    this._form.companyId = companyId;
    this._form.clientId = clientId;
    this._form.isArchived = false;
    this._form.jobOwner = sessionStorage.getItem("firstName");
    let data = this._form;
    return data;
  }
  showTeamMembers(id: any) {
    this.id = id;
    this.getTeamMembers();
  }
  setFormData(): any {
    const formData = this.getFormData();
    return formData;
  }

  public clientName: any = '';

  public positionName: any = '';
  public clientId: any = '';
  public headCount: any = '';
  public maxSubmissions: any = '';
  public submittedCount: any = '';
  public jobLocation: any = '';
  public contractDetails: any = '';
  public minSalary: any = '';
  public maxSalary: any = '';
  public currency: any = '';
  public frequency: any = '';
  public jobPackage: any = '';

  public experianceLevel: any = '';
  public jobIndustry: any = '';


  public jobDescription: any = '';
  clear() {
    this.submitted = false;
    this.fileSelected = false;
    this.showAdvancedOptions = false;
    this.clientForm.reset();
    this.id = undefined;
    this.submitText = 'Create';
    this.clientForm.enable();
  }

  deleteDoc(fileName: any) {
    this.crudOperationsService.getList(this.api + '/deleteFile?id=' + this.id + '&fileName=' + fileName)
      .subscribe((data: any) => {
        this.notification.notify('success', 'File deleted successfully!');
        this.submitProcessing = false;
        this.getAttachments();
      },
        (_error) => {
          this.notification.notify('error', 'Something Went Wrong')
          this.submitProcessing = false;
          this.getAttachments();
        })
  }

  delete(id: number) {
    this.crudOperationsService.delete(this.api + `/${id}`).subscribe((data: any) => {
      this.notification.notify('success', data.message);
      this.ngOnInit();
    }, (error) => { this.notification.notify('error', 'something went wrong') })
  }
  handlePagination(data: any) {
    // alert(data.data.totalElements);
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
    this.getJobs();
  }

  handleAdvancedClick() {
    this.showAdvancedOptions = true;
  }

  handleClient(id: any) {
    (<any>$('#client-view-modal')).modal('hide');
    this.showView = true;
    this.id = id;
    this.getAttachments();
    this.getSummaryDetails();
    this.getTeamMembers();
    this.getCandidates();
    this.getSkillsList();
    this.getRecomendedList();
  }

public config: PaginationInstance = {
  id: 'recommendedCandidates',
  itemsPerPage: 10,
  currentPage: 1
};

recommTotalItems: number = 0;

getRecomendedList() {
  let url = this.api + '/getRecomendedList_SkillsByType/Job/' + this.id;
  this.crudOperationsService.getList(url).subscribe((data: any) => {
    this.spinner.hide();
    this.recommandedCandidateList = data.data || [];
    this.recommTotalItems = this.recommandedCandidateList.length;
    this.config.currentPage = 1; 
  }, (error) => {
    this.notification.notify('error', 'Something went wrong!');
  });
}

recommPageChanged(page: number): void {
  this.config.currentPage = page;
  window.scrollTo(0, 0); 
}
  getSkillsList() {
    let url = 'candidate/getSkillsByType/Job/' + this.id;
    this.crudOperationsService.getList(url).subscribe((data: any) => {
      this.spinner.hide();
      this.skillsList = data.data;
    },
      (error) => {
        this.notification.notify('error', 'Something went wrong!');
      })
  }

  public tabType: any = 'Jobs';
  setType(type: any) {
    this.tabType = type;
  }

  public editSummaryDetailsEnable: boolean = false;
  public editSummaryDescriptionEnable: boolean = false;
  public editSummaryPackageEnable: boolean = false;
  public selectedFile1: any;
  public submitted1 = false;

  handleEditSummaryDetails() {
    this.editSummaryDetailsEnable = !this.editSummaryDetailsEnable;
  }

  handleEditSummaryDescription() {
    this.editSummaryDescriptionEnable = !this.editSummaryDescriptionEnable;
  }
  handleEditSummaryPackage() {
    this.editSummaryPackageEnable = !this.editSummaryPackageEnable;
  }

  cancelDescription() {
    this.editSummaryDescriptionEnable = !this.editSummaryDescriptionEnable;
  }
  cancelPackage() {
    this.editSummaryPackageEnable = !this.editSummaryPackageEnable;
  }

  cancelDetails() {
    this.editSummaryDetailsEnable = !this.editSummaryDetailsEnable;
  }

  getTeamMembers() {
    let api = this.api + '/getTeamMembers?id=' + this.id;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.teamMembersList = data.data.team;
    },
      (error) => {
        console.log(error);
      })
  }

  applyFilter() {
    this.employeeList = [];
    var filterJson = {
      "selectedItemsBranch": [],
      "selectedItemsGrade": [],
      "selectedItemsDepartment": [],
      "selectedItemsDesignation": [],
      "selectedItemsCostCenter": [],
      "selectedItemsProject": [],
      "selectedItemsCategory": [],
      "selectedItemsBank": [],
      "companyId": this.companyId,
      "search": this.searchValue
    }

    this.employeeService.getFilterData(filterJson)
      .subscribe((data: any) => {
        this.employeeList = data.data;
        this.employeeList.map(function (obj: any) {
          obj.selected = false;
        })
        console.log(this.employeeList);
      })
  }

  public validationText: string = '';
  onClickCheckBox(id: any) {
    this.validationText = '';
    const i = this.employeeList.findIndex((obj: any) => obj.employeeId == id);
    this.employeeList[i].selected = !this.employeeList[i].selected;
  }

  selectAll(event: any) {
    const checked = event.target.checked;
    this.validationText = '';
    this.employeeList.forEach((item: any) => item.selected = checked);
  }

  addMembers() {
    const eItems = this.employeeList.filter((item: any) => item.selected === true);
    if (eItems.length > 0) {
      this.submitProcessing = true;
      let empList = [];
      for (let i = 0; i < this.employeeList.length; i++) {
        if (this.employeeList[i].selected) {
          empList.push(this.employeeList[i]);
        }
      }

      this.crudOperationsService.addTeamMembersToJob(empList, this.id)
        .subscribe((data: any) => {
          let response = data.data;
          response.forEach((res: any) => {
            this.notification.notify(res.status, res.message);
          });

          (<any>$('#client-team-member-add')).modal('hide');
          this.submitProcessing = false;
          this.getTeamMembers();
        },
          (_error) => {
            this.submitProcessing = false;
            this.notification.notify('error', 'Something Went Wrong')
          })
    } else {
      this.validationText = 'Please select atlease 1 employee(s).';
    }
  }

  clearMembers() {
    this.searchValue = '';
    this.employeeList = [];
  }
  addFileClick() {
    this.selectedFile1 = '';
  }
  addFile() {
    if (this.selectedFile1 != undefined && this.selectedFile1 != '') {
      const formData = new FormData();
      formData.append('file', this.selectedFile1);
      formData.append('id', this.id);
      this.submitProcessing = true;
      this.crudOperationsService.create(formData, this.api + '/addFile')
        .subscribe((data: any) => {
          this.notification.notify('success', data.message);
          (<any>$('#client-attch-add-files')).modal('hide');
          this.submitProcessing = false;
          this.getAttachments();
        },
          (_error) => {
            this.submitProcessing = false;
            this.notification.notify('error', 'Something Went Wrong')
          })
    }
  }
  getAttachments() {
    let api = this.api + '/getAttachements?id=' + this.id;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.attachmentsList = data.data.attachments;
    },
      (error) => {
        console.log(error);
      })
  }
  getSummaryDetails() {
    let api = this.api + '/getSummaryDetails?id=' + this.id;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.clientSummaryDetails = data.data;
      this.positionName = this.clientSummaryDetails.positionName;
      this.clientId = this.clientSummaryDetails.clId;
      this.headCount = this.clientSummaryDetails.headCount;
      this.maxSubmissions = this.clientSummaryDetails.maxSubmissions;
      this.submittedCount = this.clientSummaryDetails.submittedCount;
      this.jobLocation = this.clientSummaryDetails.jobLocation;
      this.contractDetails = this.clientSummaryDetails.contractDetails;
      this.minSalary = this.clientSummaryDetails.minSalary;
      this.maxSalary = this.clientSummaryDetails.maxSalary;
      this.currency = this.clientSummaryDetails.currency;
      this.frequency = this.clientSummaryDetails.frequency;
      this.jobDescription = this.clientSummaryDetails.jobDescription;
      this.jobPackage = this.clientSummaryDetails.packageDetails;
      this.experianceLevel = this.clientSummaryDetails.experianceLevel;
      this.jobIndustry = this.clientSummaryDetails.jobIndustry;
      this.jobTagsList = this.clientSummaryDetails.tags ? this.clientSummaryDetails.tags : [];
    },
      (error) => {
        console.log(error);
      })
  }
  onFileChanged1(event: any) {
    this.selectedFile1 = event.target.files[0];
  }

  clearAttachment() {
    this.submitted1 = false;
    this.selectedFile1 = undefined;
  }

  addTeamMember() {
    this.clearMembers();
    this.applyFilter();
  }

  updateSummaryDetails() {
    this.submitProcessing = true;
    let formData = {
      'positionName': this.positionName,
      'headCount': this.headCount,
      'maxSubmissions': this.maxSubmissions,
      'submittedCount': this.submittedCount,
      'jobLocation': this.jobLocation,
      'contractDetails': this.contractDetails,
      'minSalary': this.minSalary,
      'maxSalary': this.maxSalary,
      'currency': this.currency,
      'frequency': this.frequency,
      'jobDescription': this.jobDescription,
      'packageDetails': this.jobPackage,
      'experianceLevel': this.experianceLevel,
      'jobIndustry': this.jobIndustry
    }
    this.crudOperationsService.update(formData, this.api + `/updateSumamryDetails/${this.id}`)
      .subscribe((data: any) => {
        this.notification.notify('success', 'Details Updated Successfully!');
        this.submitProcessing = false;
        this.cancelDescription();
        this.cancelDetails();
      },
        (_error) => {
          this.submitProcessing = false;
          this.notification.notify('error', 'Something Went Wrong')
        })
  }

  deleteTeamMember(id: number) {
    this.crudOperationsService.getList(this.api + '/deleteTeamMember?jobId=' + this.id + '&id=' + id).subscribe((data: any) => {
      this.notification.notify('success', 'Team Member Deleted Successfully!');
      this.getTeamMembers();
    }, (error) => { this.notification.notify('error', 'something went wrong') })
  }
  goBack() {
    this.showView = false;
  }

  onValueChange() {
    if (this.fieldModel && this.conditionModel && this.valueModel) {
        this.addCondition(this.fieldModel, this.conditionModel, this.valueModel);
    }
}

  addCondition(field: any, condition: any, value: any) {
    if(field=='' || condition=='' || value=='') return;
    var conditionValue = '';
    if(field=='jobOwner')  field='createdBy';
    if (field == 'Skills') {
      field = "sm.skillName"
    }else if (field == 'clientName') {
      field = "cl.clientId." + field;
    } else {
      field = "cl." + field;
    }

    if(this.showConditionText){
      this.valuesArray = [];
      this.valuesList = [];
      var data = { "id": 1, "name": value };
      this.valuesList.push(data);
      this.valuesArray = this.valuesList;
      value = this.valuesArray;
}

    //var conditionValue = '';
    
    if (condition == 'contains') {
      
      for(var i=1; i < value.length+1; i++){
        if(i==1) conditionValue = '(lower(' +field + ") like '%" + value[i-1].name.toLowerCase() + "%'";
        else conditionValue = conditionValue +" or "+'lower(' +field + ") like '%" + value[i-1].name.toLowerCase() + "%'";
      }
    } else if (condition == 'starts with') {
      
      for(var i=1; i < value.length+1; i++){
        if(i==1) conditionValue = '(lower(' +field + ") like '" + value[i-1].name.toLowerCase() + "%'";
        else conditionValue = conditionValue +" or " + 'lower(' +field + ") like '" + value[i-1].name.toLowerCase() + "%'";
      }
    } else if (condition == 'ends with') {
      for(var i=1; i < value.length+1; i++){
        if(i==1) conditionValue = '(lower(' +field + ") like '%" + value[i-1].name.toLowerCase() + "'";
        else conditionValue = conditionValue +" or "+ 'lower(' +field + ") like '%" + value[i-1].name.toLowerCase() + "'";
      }
    } else {
      for(var i=1; i < value.length+1; i++){
        if(i==1) conditionValue = '(lower(' +field + ") " + condition + " '" + value[i-1].name.toLowerCase() + "'";
        else  conditionValue = conditionValue +" or "+ 'lower(' +field + ") " + condition + " '" + value[i-1].name.toLowerCase() + "'";
      }
    }
    conditionValue = conditionValue +" ) "
    this.conditionsArray.push(conditionValue);
  }
  applyConditionFilter() {
    //alert("hi");
    var condition = '';
    for (var i = 0; i < this.conditionsArray.length; i++) {
      condition = condition.concat(" AND " + this.conditionsArray[i]);
    }
    var data = { "condition": condition };
    this.spinner.show();
    let api = 'job/findAllClientsByFilter' + `/${this.companyId}`;
    this.crudOperationsService.update(data, api).subscribe((data: any) => {
      this.spinner.hide();
      this.jobList = data.data;
      //pagination call
      //this.handlePagination(data);
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })

  }

  applyCandidateConditionFilter() {
    var condition = '';
    this.candidateList=[];
    this.filterCandidateList =[];
    for (var i = 0; i < this.conditionsArray.length; i++) {
      condition = condition.concat(" AND " + this.conditionsArray[i]);
    }
    var data = { "condition": condition };
    this.spinner.show();
    let api = 'candidate/findAllCandidatesByFilter' + `/${this.companyId}`;
    this.crudOperationsService.update(data, api).subscribe((data: any) => {
      this.spinner.hide();
      this.filterCandidateList = data.data;
      this.filterCandidateListFunction();
      //pagination call
      //this.handlePagination(data);
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })
      
  }

  filterCandidateListFunction(){
   // alert(this.filterCandidateList.length);
    for(var i=0;i<this.filterCandidateList.length;i++){
      
      var candidateobj={"candidateId":this.filterCandidateList[i]};
      this.candidateList.push(candidateobj);
    }
   // console.log("list is ========",this.candidateList);
  }

  addStudentCondition(field: any, condition: any, value: any) {
    if(field=='' || condition=='' || value=='') return;
    if(this.showConditionText){
      this.valuesArray = [];
      this.valuesList = [];
      var data = { "id": 1, "name": value };
      this.valuesList.push(data);
      this.valuesArray = this.valuesList;
      value = this.valuesArray;
    }
    var conditionValue = '';
    if(field=='candidateOwner')  field='createdBy';
    if (condition == 'contains') {
      
      for(var i=1; i < value.length+1; i++){
        if(i==1) conditionValue = '(lower(' +field + ") like '%" + value[i-1].name.toLowerCase() + "%'";
        else conditionValue = conditionValue +" or "+'lower(' +field + ") like '%" + value[i-1].name.toLowerCase() + "%'";
      }
    } else if (condition == 'starts with') {
      
      for(var i=1; i < value.length+1; i++){
        if(i==1) conditionValue = '(lower(' +field + ") like '" + value[i-1].name.toLowerCase() + "%'";
        else conditionValue = conditionValue +" or " + 'lower(' +field + ") like '" + value[i-1].name.toLowerCase() + "%'";
      }
    } else if (condition == 'ends with') {
      for(var i=1; i < value.length+1; i++){
        if(i==1) conditionValue = '(lower(' +field + ") like '%" + value[i-1].name.toLowerCase() + "'";
        else conditionValue = conditionValue +" or "+ 'lower(' +field + ") like '%" + value[i-1].name.toLowerCase() + "'";
      }
    } else {
      for(var i=1; i < value.length+1; i++){
        if(i==1) conditionValue = '(lower(' +field + ") " + condition + " '" + value[i-1].name.toLowerCase() + "'";
        else  conditionValue = conditionValue +" or "+ 'lower(' +field + ") " + condition + " '" + value[i-1].name.toLowerCase() + "'";
      }
    }
    conditionValue = conditionValue +" ) "
    this.conditionsArray.push(conditionValue);
  }
  applyStudentConditionFilter() {
    var condition = '';
    for (var i = 0; i < this.conditionsArray.length; i++) {
      condition = condition.concat(" AND " + this.conditionsArray[i]);
    }
    var data = { "condition": condition };
    this.spinner.show();
    let api = 'candidate/findAllCandidatesByFilter' + `/${this.companyId}`;
    this.crudOperationsService.update(data, api).subscribe((data: any) => {
      this.spinner.hide();
      // this.recommandedCandidateList = data.data;
      //pagination call
      //this.handlePagination(data);
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })

  }
  clearCondition() {
    this.conditionsArray = [];
    this.fieldModel = '';
    this.conditionModel = '';
    this.valueModel = [];
    this.getJobs();
    this.getCandidates();
  }

  handleBulkAction() {
    const eItems = this.jobList.filter((item: any) => item.selected === true);
    this.enableBulkAction = eItems.length > 0 ? true : false;
    this.selectedClientCount = eItems.length;
  }

  onClickClientCheckBox(id: any) {
    this.validationText = '';
    const i = this.jobList.findIndex((obj: any) => obj.id == id);
    this.jobList[i].selected = !this.jobList[i].selected;
    this.handleBulkAction();
  }

  selectAllClient(event: any) {
    const checked = event.target.checked;
    this.validationText = '';
    this.jobList.forEach((item: any) => item.selected = checked);
    this.handleBulkAction();
  }

  onClickTagCheckBox(name: any) {
    const i = this.tagsList.findIndex((obj: any) => obj.name == name);
    this.tagsList[i].selected = !this.tagsList[i].selected;
  }
  public validationTagText: string = '';
  addTags() {
    const eItems = this.tagsList.filter((item: any) => item.selected === true);
    if (eItems.length > 0) {
      this.submitProcessing = true;
      let clList = [];
      for (let i = 0; i < this.jobList.length; i++) {
        if (this.jobList[i].selected) {
          clList.push(this.jobList[i]);
        }
      }

      let tagList = [];
      for (let i = 0; i < this.tagsList.length; i++) {
        if (this.tagsList[i].selected) {
          tagList.push(this.tagsList[i]);
        }
      }

      this.crudOperationsService.addJobTags(clList, tagList)
        .subscribe((data: any) => {
          let response = data.data;
          this.notification.notify('success', response);
          (<any>$('#client-add-tag-bulk')).modal('hide');
          this.submitProcessing = false;
          this.clearTags();
          this.selectedClientCount = 0;
          this.enableBulkAction = false;
          this.getJobs();
        },
          (_error) => {
            this.submitProcessing = false;
            this.notification.notify('error', 'Something Went Wrong')
          })
    } else {
      this.validationTagText = 'Please select atlease 1 Tag(s).';
    }
  }

  clearTags() {
    this.tagSearchValue = '';
    this.validationTagText = '';
    this.tagsList.forEach((item: any) => item.selected = false);

    for (let i = 0; i < this.jobTagsList.length; i++) {
      let index = this.tagsList.findIndex((item: any) => item.name === this.jobTagsList[i].name);

      this.tagsList[index].selected = true;

    }
  }

  searchTag() {
    this.tagsList = this.tagsList.includes(this.tagSearchValue);
  }

  addTagsIndividual() {
    const eItems = this.tagsList.filter((item: any) => item.selected === true);
    if (eItems.length > 0) {
      this.submitProcessing = true;
      let clList = [];
      clList.push({ 'id': this.id });

      let tagList = [];
      for (let i = 0; i < this.tagsList.length; i++) {
        if (this.tagsList[i].selected) {
          tagList.push(this.tagsList[i]);
        }
      }

      this.crudOperationsService.addJobTags(clList, tagList)
        .subscribe((data: any) => {
          let response = data.data;
          this.notification.notify('success', response);
          (<any>$('#client-add-tag-individual')).modal('hide');
          this.submitProcessing = false;
          this.clearTags();
          this.getSummaryDetails();
        },
          (_error) => {
            this.submitProcessing = false;
            this.notification.notify('error', 'Something Went Wrong')
          })
    } else {
      this.validationTagText = 'Please select atlease 1 Tag(s).';
    }
  }

  clientArchive() {
    const eItems = this.jobList.filter((item: any) => item.selected === true);
    if (eItems.length > 0) {
      this.submitProcessing = true;
      let clList = [];
      for (let i = 0; i < this.jobList.length; i++) {
        if (this.jobList[i].selected) {
          clList.push(this.jobList[i]);
        }
      }
      this.crudOperationsService.jobArchive(clList)
        .subscribe((data: any) => {
          let response = data.data;
          this.notification.notify('success', response);
          (<any>$('#client-archive')).modal('hide');
          this.submitProcessing = false;
          this.enableBulkAction = false;
          this.getJobs();
        },
          (_error) => {
            this.submitProcessing = false;
            this.notification.notify('error', 'Something Went Wrong')
          })
    } else {
      this.validationText = 'Please select atlease 1 Client(s).';
    }
  }
  exportTable(type: string) {
    this.companyId = Number(sessionStorage.getItem('companyId'));
    //spinner show
    let obj = {};
    var fileType = '';
    if (type == 'EXCEL') {
      fileType = 'JobReport.xls';
      let api: any = "reports/job/exportExcel/" + this.companyId + '/false?search=' + this.clientSearchModel;
      this.crudOperationsService.exportExcelReport2(api, fileType,obj)
    }
    else {
      fileType = 'JobReport.pdf';
      let api: any = "reports/job/exportPDF/" + this.companyId + '/false?search=' + this.clientSearchModel;
      this.crudOperationsService.exportPDF2(api, fileType,obj)
    }
  }
  onFieldChange(event: any) {
    let field = event.target.value;
    // alert(field);
    if (field == "Skills") {
      this.valuesArray = ['Java', '.Net', 'Javascript', 'Angular', 'Spring Boot'];
    } else if (field == "candidateLocation") {
      this.configurationService.fetchAllCities(this.searchModel).subscribe((data: any) => {
        this.spinner.hide();
        this.cityObject = data.data;
        for (let i = 0; i < this.cityObject.length; i++) {

          this.valuesArray.push(this.cityObject[i].cityName);
        }

      },
        (error) => {
          this.spinner.hide();
        })
    } else if (field == "languages") {
      this.valuesArray = ['English', 'Hindi', 'Teleugu'];
    } else if (field == "Employers") {
      this.valuesArray = ['Datadot Software Solution Pvt Ltd', 'Intel', 'TCS'];
    }
  }

  public candidateName:any;
  public positionTitle:any;
  public clientTitle:any;
  public clientAddress:any;
  public clientEmailId:any;
  public jobStartedDate:any = new Date().toISOString().split('T')[0];

  public invoiceNo:any;
  public invoiceDate: any = new Date().toISOString().split('T')[0];
  public attentionTo:any;
  public salaryOffered:any;
  public Fee:any;
  public fundsRealizedOn:any;

  public stage:any;
  //public studentId:any;
  onStudentStatusChange(stage: any, id: any, data:any) {
     this.candidateId = id;
     this.stage = stage;
   // console.log(JSON.stringify(data));
     if (stage == 'Started') {
       //this.clearDropCandidate();
       this.candidateName = data.candidateId.candidateName;
       this.positionTitle = data.jobId.positionName;
       this.clientTitle = data.jobId.clientId.clientName;
       this.clientAddress = data.jobId.clientId.clientLocation;
      // this.clientEmailId = data.jobId.clientId.clientLocation;
       //this.jobStartedDate = new Date().toDateString();
       (<any>$('#candidate-invoice-modal')).modal('show');
     } else if (stage == 'Interviewed' || stage == 'Offered') {
       //this.clearDropCandidate();
       this.candidateName = data.candidateId.candidateName;
       this.positionTitle = data.jobId.positionName;
       this.clientTitle = data.jobId.clientId.clientName;
       this.clientAddress = data.jobId.clientId.clientLocation;
      // this.clientEmailId = data.jobId.clientId.clientLocation;
       //this.jobStartedDate = new Date().toDateString();
       (<any>$('#candidate-interview-modal')).modal('show');
     } else if (stage == 'Rejected') {
       //this.clearDropCandidate();
       this.candidateName = data.candidateId.candidateName;
      //  this.positionTitle = data.jobId.positionName;
      //  this.clientTitle = data.jobId.clientId.clientName;
      //  this.clientAddress = data.jobId.clientId.clientLocation;
      // this.clientEmailId = data.jobId.clientId.clientLocation;
       //this.jobStartedDate = new Date().toDateString();
       (<any>$('#candidate-reject-modal')).modal('show');
     } else {
      let formData = {
        'candidateStage': stage,
      }
      
      this.crudOperationsService.update(formData, `candidate/updateStatusDetails/${id}`)
        .subscribe((data: any) => {
          this.notification.notify('success', 'Details Updated Successfully!');
          this.submitProcessing = false;
          //this.cancelDescription();
          // this.cancelDetails();
          this.getCandidates();
        },
          (_error) => {
            this.submitProcessing = false;
            this.notification.notify('error', 'Something Went Wrong')
          })
     }
  }

  rejectCandidate() {
    let formData = {
      // 'reasonsToDrop': this.selectedItemsStage,
       'candidateStage': this.stage,
      // 'dropDescription': this.dropDescription
    }

     this.crudOperationsService.update(formData, `candidate/updateStatusDetails/${this.candidateId}`)
        .subscribe((data: any) => {
          this.notification.notify('success', 'Details Updated Successfully!');
          (<any>$('#candidate-drop-modal')).modal('hide');
          (<any>$('#candidate-reject-modal')).modal('hide');
          this.submitProcessing = false;
          //this.cancelDescription();
          // this.cancelDetails();
          this.getCandidates();
        },
          (_error) => {
            this.submitProcessing = false;
            this.notification.notify('error', 'Something Went Wrong')
          })
    
  }

  saveInvoice(){

    let formData = {
      'candidateStage': this.stage,
      'invoiceNo':this.invoiceNo,
      'invoiceDate':this.invoiceDate,
      'jobStartedDate':this.jobStartedDate,
      'attentionTo':this.attentionTo,
      'salaryOffered':this.salaryOffered,
      'Fee':this.Fee
    }
    
    this.crudOperationsService.update(formData, `candidate/updateStatusDetails/${this.candidateId}`)
      .subscribe((data: any) => {
        this.notification.notify('success', 'Details Updated Successfully!');
        this.submitProcessing = false;
        //this.cancelDescription();
        // this.cancelDetails();
        (<any>$('#candidate-invoice-modal')).modal('hide');
        this.getCandidates();
      },
        (_error) => {
          this.submitProcessing = false;
          this.notification.notify('error', 'Something Went Wrong')
        })

  }

   saveCandidateStage(){

    let formData = {
      'candidateStage': this.stage,
      'invoiceDate':this.invoiceDate
    }
    
    this.crudOperationsService.update(formData, `candidate/updateStatusDetails/${this.candidateId}`)
      .subscribe((data: any) => {
        this.notification.notify('success', 'Details Updated Successfully!');
        this.submitProcessing = false;
        //this.cancelDescription();
        // this.cancelDetails();
        (<any>$('#candidate-interview-modal')).modal('hide');
        this.getCandidates();
      },
        (_error) => {
          this.submitProcessing = false;
          this.notification.notify('error', 'Something Went Wrong')
        })

  }

  onStatusChange(event: any, jobId: any) {
    //alert(event.target.value);

    let formData = {
      'status': event.target.value,
    }
    this.crudOperationsService.update(formData, this.api + `/updateStatusDetails/${jobId}`)
      .subscribe((data: any) => {
        this.notification.notify('success', 'Details Updated Successfully!');
        this.submitProcessing = false;
        //this.cancelDescription();
        // this.cancelDetails();
        this.getJobs();
      },
        (_error) => {
          this.submitProcessing = false;
          this.notification.notify('error', 'Something Went Wrong')
        })
  }
  handleStudentBulkAction() {
    const eItems = this.candidateList.filter((item: any) => item.selected === true);
    this.enableStudentBulkAction = eItems.length > 0 ? true : false;
    this.selectedCandidateCount = eItems.length;
  }

  onClickCandidateCheckBox(id: any) {
    this.validationText = '';
    const i = this.candidateList.findIndex((obj: any) => obj.candidateId == id);
    this.candidateList[i].selected = !this.candidateList[i].selected;
    this.handleStudentBulkAction();
  }

  selectAllCandidate(event: any) {
    const checked = event.target.checked;
    this.validationText = '';
    this.candidateList.forEach((item: any) => item.selected = checked);
    this.handleStudentBulkAction();
  }

  viewCandidate(data: any) {
    this.shareService.changeMessage(data);
    this.router.navigateByUrl('HRMS/ATS/candidates');
  }

  submitSkill() {
    this.skillSubmitted = true;
    for (let el in this.skillform_) {
      if (this.skillform_[el].errors) {
        console.log(el)
      }
    }
    if (this.skillsList.length < 3) {
      if (this.skillForm.valid) {
        let companyId = {
          'companyId': this.companyId
        };
        let candidateId = {
          'id': this.id
        };
        let parentSkillMaster = {
          'id': this._formSkill.skillName
        }
        this._formSkill.type = 'Job';
        this._formSkill.parentSkillMaster = parentSkillMaster;
        this._formSkill.externalId = this.id;
        this._formSkill.company = companyId;
        if (this.submitTextSkill !== 'Update') {
          this.saveSkill(this._formSkill, 'candidate/saveSkill');
        } else {
          this.updateSkill(this._formSkill, 'candidate/updateSkill/' + this.skillId);
        }
      }
    } else {
      this.notification.notify('error', '3 Skill\'s are already Added!')
    }
  }
  updateSkill(formData: any, api: string) {
    this.submitProcessing = true;
    this.crudOperationsService.update(formData, api)
      .subscribe((data: any) => {
        this.notification.notify('success', data.message);
        (<any>$('#job-skill-modal')).modal('hide');
        this.submitProcessing = false;
        this.resetSkill();
        this.getSkillsList();
      },
        (_error) => {
          this.submitProcessing = false;
          this.notification.notify('error', 'Something Went Wrong')
        })
  }
  saveSkill(formData: any, api: string) {
    this.submitProcessing = true;
    this.crudOperationsService.create(formData, api)
      .subscribe((data: any) => {
        this.notification.notify('success', data.message);
        (<any>$('#job-skill-modal')).modal('hide');
        this.submitProcessing = false;
        this.resetSkill();
        this.getSkillsList();
      },
        (_error) => {
          this.submitProcessing = false;
          this.notification.notify('error', 'Something Went Wrong')
        })
  }

  resetSkill() {
    this.skillSubmitted = false;
    this.skillForm.reset();
    this.skillId = '';
    this.submitTextSkill = 'Save';
  }

  modelShowEditSkill(data: any) {
   // alert(JSON.stringify(data));
    this.skillSubmitted = false;
    this.submitTextSkill = 'Update';
    this.skillId = data.id;
    this.skillForm.reset();
    this.skillform_['skillName'].patchValue(data.skillName);
    this.skillform_['rating'].patchValue(data.rating);
    (<any>$('#job-skill-modal')).modal('show');
  }
  deleteSkill(id: number) {
    this.crudOperationsService.delete(`candidate/deleteSkill?id=` + id).subscribe((data: any) => {
      this.notification.notify('success', data.message);
      this.getSkillsList();
    }, (error) => { this.notification.notify('error', 'something went wrong') })
  }

  addToJob(id: any) {
    let url = this.api + '/addToJob/'+id + '/' +this.id;
    this.crudOperationsService.getList(url)
      .subscribe((data: any) => {
        let response = data.data;
        this.notification.notify('success', 'Successfully Added to Job!');
        this.getCandidates();
        this.getRecomendedList();
      },
        (_error) => {
          this.submitProcessing = false;
          this.notification.notify('error', 'Something Went Wrong')
        })
  }

  onSorted($event: Event) {
    let data: any = $event;
    console.log("data ::: ", data)
    let sortedArray = (this.jobList || []).sort((a : any,b: any)=>{
      if(a[data.sortColumn] > b[data.sortColumn]){
        return (data.sortDirection === 'desc') ? 1 : -1;
      }
      if(a[data.sortColumn] < b[data.sortColumn]){
        return (data.sortDirection === 'desc') ? -1 : 1;
      }
      return 0;
    })
    this.jobList = sortedArray;
  }
  onConditionChange(event: any) {
    this.showConditionDropdown=false;
    this.showConditionText=false;
    let condition = event.target.value;
   // alert(condition);
    if(condition == '='){
      this.showConditionDropdown=true;
    }else{
      this.showConditionText=true;
    }
    // If we already have a field and value, add the condition immediately
    if (this.fieldModel && this.valueModel) {
      this.addCondition(this.fieldModel, this.conditionModel, this.valueModel);
    }
  }
  onValueFieldChange(event: any) {
    let field = event.target.value;
    this.valuesList  =[];
    this.valuesArray  =[];
    
    for(var i=0;i<this.jobList.length;i++){
        if (field == "positionName") {
          var data = {"id":this.jobList[i].id,"name":this.jobList[i].positionName};
          this.valuesList.push(data);
        }
        if (field == "jobLocation") {
          if(this.jobList[i].jobLocation != null ){
            var data = {"id":this.jobList[i].id,"name":this.jobList[i].jobLocation};
            this.valuesList.push(data);
          }
        }
        if (field == "contractDetails") {
          if(this.jobList[i].contractDetails != null ){
            var data = {"id":this.jobList[i].id,"name":this.jobList[i].contractDetails};
            this.valuesList.push(data);
          }
        }
        if (field == "jobOwner") {
          if(this.jobList[i].createdBy != null ){
            var data = {"id":this.jobList[i].id,"name":this.jobList[i].createdBy};
            this.valuesList.push(data);
          }
        }
        if (field == "jobStage") {
          if(this.jobList[i].jobStage != null ){
            var data = {"id":this.jobList[i].id,"name":this.jobList[i].jobStage};
            this.valuesList.push(data);
          }
        }
         if (field == "clientName") {
          if(this.jobList[i].clientName != null ){
            var data = {"id":this.jobList[i].id,"name":this.jobList[i].clientName};
            this.valuesList.push(data);
          }
        }
        
          
      }
      this.valuesArray = Array.from(this.valuesList.reduce((m:any, t:any) => m.set(t.name, t), new Map()).values());
     
  }
  onCandidateValueFieldChange(event: any) {
    let field = event.target.value;
    this.valuesList  =[];
    this.valuesArray  =[];
    //alert(JSON.stringify(this.candidateList));
    for(var i=0;i<this.candidateList.length;i++){
      console.log(this.candidateList[i]);
        if (field == "candidateName") {
          var data = {"id":this.candidateList[i].candidateId.id,"name":this.candidateList[i].candidateId.candidateName};
          this.valuesList.push(data);
        }
        if (field == "candidateLocation") {
          if(this.candidateList[i].candidateLocation != null ){
            var data = {"id":this.candidateList[i].candidateId.id,"name":this.candidateList[i].candidateId.candidateLocation};
            this.valuesList.push(data);
          }
        }
        if (field == "candidateOwner") {
          if(this.candidateList[i].createdBy != null ){
            var data = {"id":this.candidateList[i].candidateId.id,"name":this.candidateList[i].candidateId.createdBy};
            this.valuesList.push(data);
          }
        }
       
          
      }
      this.valuesArray = Array.from(this.valuesList.reduce((m:any, t:any) => m.set(t.name, t), new Map()).values());
     
  }
}
