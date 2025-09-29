import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { AddEmployeeService } from '../../master/addEmplyee.service';
import { ConfigurationService } from 'src/app/components/configuration/configuration.service';
import { Router } from '@angular/router';
import { ShareDataService } from 'src/app/services/sharaData.service';

@Component({
  selector: 'app-candidates',
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.css']
})
export class CandidatesComponent implements OnInit {
  constructor(private configurationService: ConfigurationService, private formBuilder: FormBuilder, private spinner: NgxSpinnerService,
    public crudOperationsService: CrudOperationsService, private notification: NotifierService, private router: Router,
    public datePipe: DatePipe, private employeeService: AddEmployeeService, private route: Router,public shareService: ShareDataService,private cdr: ChangeDetectorRef) { }

  public headers: any = ['Candidate Name', 'Candidate Reference', 'Candidate Location', 'Current Position', 'Current Company', 'Notice Period', 'Current Salary', 'Expected Salary', 'Candidate Owner', 'Candidate Created Date'];
  public statusList: any = ['New candidate', 'Interested', 'Shortlisted', 'Submitted', 'Interviewed', 'Offered', 'Hired', 'Started',	'Probation passed', 'Dropped'];
  public jobHeaders: any = ['Position Name', 'Job Location', 'Client Name'];
  public jobListHeader: any = ['Position Name', 'Job Client', 'Job Location', 'Headcount', 'Job Stage', 'Minimum Salary', 'Maximum Salary', 'Job Owner', 'Job Team', 'Job Status'];
  public attachmentHeader: any = ['Document Name', 'Document Type', 'Actions'];
  public experianceHeader: any = ['Position Name', 'Employer', 'Start Date', 'Actions'];
  public frequencyDropdown: any = ['Daily', 'Hourly', 'Weekly', 'Monthly', 'Yearly'];
  public currencyTypeDropdown: any = ['INR', 'MY'];
  public educationHeader: any = ['School', 'Degree', 'Specialization', 'Actions'];
  public skillsHeader: any = ['Skill Name', 'Rating', 'Actions'];
  public ratingList: any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  public scoreTypes: any = ['CGPA', 'GPA'];
  public genders: any = ['Male', 'Female', 'Other'];
  public teamMembersHeader: any = ['Name', 'Display Name', 'Last Active', 'Actions'];
  public tagsList: any = [
    { color: 'green', name: 'Available', selected: false },
    { color: 'red', name: 'Blacklisted', selected: false },
    { color: 'blue', name: 'Foreigner', selected: false },
    { color: 'pink', name: 'Important', selected: false },
    { color: 'lightpink', name: 'Open to relocation', selected: false },
    { color: 'lightgrey', name: 'Recently placed', selected: false },
    { color: 'greenyellow', name: 'Remote', selected: false },
    { color: 'rosybrown', name: 'VIP', selected: false }
  ];
  public companyId: any = Number(sessionStorage.getItem('companyId'));
  public employeeId: any = Number(sessionStorage.getItem('empId'));

  public Fields: any = [{ "name": "Candidate Name", "value": "candidateName" }, { "name": "Candidate Website", "value": "candidatePhoneNumber" }, { "name": "Candidate Location", "value": "candidateLocation" },
  { "name": "Candidate Owner", "value": "candidateOwner" }, { "name": "Candidate ContactNumber", "value": "candidateContactNumber" }];
  public CandidateSearchFields: any = [{ "name": "Location", "value": "candidateLocation" }, { "name": "Employers", "value": "Employers" }, { "name": "Languages", "value": "languages" },
  { "name": "Skills", "value": "Skills" }];
  public Conditions: any = [{ "name": "is equal to", "value": "=" }, { "name": "contains", "value": "contains" }, { "name": "starts with", "value": "starts with" }, { "name": "ends with", "value": "ends with" }];
  public fieldModel: any = '';
  public conditionModel: any = '';
  public valueModel: any = '';
  public conditionsArray: any = [];
  public valuesArray: any = [];

  public valuesList: any = [];

  public candidateList: any = [];
  public skillList: any = [];
  public referralList: any = [];
  public skillsList: any = [];
  public sources: any = [];
  public dbJobList: any = [];
  public filteredJobList: any = [];
  public jobList: any = [];
  public recomendedList: any = [];
  public candidateEditTempObject: any = {};
  public attachmentsList: any = [];
  public resumeList: any = [];
  public showConditionText = false;
  public showConditionDropdown = true;
  public candidateSummaryDetails: any = {};
  public candidateDetails: any = {};
  public teamMembersList: any = [];
  public showAdvancedOptions = false;
  public showFilterModel = false;
  public filterApplied = false;
  public showAdvanceFilterModel = false;
  public showView: any = false;
  public cityObject: any = "";
  public employeeList: any = [];
  public searchValue: any = "";
  public tagSearchValue: any = "";
  public toggleLoader: boolean = false;
  public id: any;
  public searchModel = '';
  public searchModel1 = '';
  public searchModel2 = '';
  public jobid: any;
  public candidatesSearchModel = '';
  public selectedCandidateCount: number = 0;
  public jobSearchModel = '';
  public submitted: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public selectedFile: any;
  public imageFileName: any;
  public filePath: any;
  public fileSelected: boolean = false;
  public submitText = '';
  public submitTextJob = '';
  public api = 'candidate'
  public api_job = 'job'
  public submitProcessing = false;
  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure you want delete';
  public confirmClicked = false;
  public cancelClicked = false;
  public submitErrorText: any = '';
  public fileSizeExceeded: boolean = false;
  public emailExists = false;
  public emailError = false;

  onItemSelectUser(data: any) { }
  OnUserItemDeSelect(item: any) { }
  onSelectAllUser(event: any) { }

  onItemSelectStage(data: any) { }
  OnStageItemDeSelect(item: any) { }
  onSelectAllStage(event: any) { }

  public dropdownSettingsUser = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: false,
  };

  public dropdownSettingsSkill = {
    singleSelection: true,
    idField: 'id',
    textField: 'skillName',
    // selectAllText: 'Select All',
    // unSelectAllText: 'UnSelect All',
    itemsShowLimit: 4,
    allowSearchFilter: true,
  };

  onItemSelectSkill(event: any) {
    console.log("Selected Skill ID:", event.id);
    this._formSkill.skillName = event.id; 
  
    if (this.skillform_.skillName) {
      this.skillform_.skillName.setValue(event.id);
      this.skillform_.skillName.markAsTouched();
      this.skillform_.skillName.updateValueAndValidity();
    }
  }
  
  OnItemDeSelectSkill(event: any) {
    console.log("Deselected Skill:", event);
    this._formSkill.skillName = null;
  
    if (this.skillform_.skillName) {
      this.skillform_.skillName.setValue(null);
      this.skillform_.skillName.markAsTouched();
      this.skillform_.skillName.updateValueAndValidity();
    }
  }
  
  public candidateForm = this.formBuilder.group({
    candidateName: ['', Validators.required],
    candidatePhoneNumber: ['',Validators.required],
    candidateEmailAddress: ['', Validators.compose([Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$')])],
    candidateLocation: [''],
    candidateDescription: [''],
    file: [''],
  })

  public jobForm = this.formBuilder.group({
    positionName: ['', Validators.required],
    candidateId: ['', Validators.required],
    headCount: [''],
    jobLocation: [''],
    contractDetails: [''],
    minSalary: [''],
    maxSalary: [''],
    currency: [''],
    frequency: [''],
    jobDescription: ['']
  })

  public educationForm = this.formBuilder.group({
    school: ['', Validators.required],
    university: [''],
    degree: ['', Validators.required],
    specialization: [''],
    startDate: [''],
    finalGrade: [''],
    scoreType: [null],
    location: [''],
    description: ['']
  })

  public experianceForm = this.formBuilder.group({
    positionName: ['', Validators.required],
    employer: ['', Validators.required],
    startDate: [''],
    endDate: [''],
    salary: [''],
    currency: [''],
    frequency: [''],
    location: [''],
    description: ['']
  })

  public skillForm = this.formBuilder.group({
    skillName: ['', Validators.required],
    rating: [null, Validators.required]
  })

  public candidateDropForm = this.formBuilder.group({
    candidateName: ['', Validators.required],
    candidatePhoneNumber: [''],
    candidateEmailAddress: ['', Validators.compose([Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$')])],
    candidateLocation: [''],
    candidateDescription: [''],
    file: [''],
  })
  public dropDescription: any = '';
  public stageList: any = ['Above budget', 'Accepted another offer', 'Cultural fit', 'Did not attend the interview',
    'Not available', 'Not Qualified', 'Other', 'Overqualified', 'Reference check failed', 'Rejected the offer',
    'Technical test failed', 'Unresponsive'];
  public selectedItemsStage: any = [];
  public dropdownSettingsStage = {
    singleSelection: false,
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 4,
    allowSearchFilter: false,
  };

  public selectedItemsLanguage: any = [];
  public dropdownSettingsLanguage = {
    singleSelection: false, 
    idField: 'languageId', 
    textField: 'languageName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 4,
    allowSearchFilter: false, 
  };

  onSelectAllLanguage(items: any) {
    console.log("All Items Selected:", items);
  
    this.selectedItemsLanguage = [...items]; 
  
    this.updateLanguagesString();
  }
  
  onDeSelectAllLanguage(items: any) {
    console.log("All Items Deselected:", items);
    this.updateLanguagesString();
  }
  
  private updateLanguagesString() {
    this.languages = this.selectedItemsLanguage
      .map((item: any) => item.languageId)
      .join(',');
    console.log("Updated Languages String:", this.languages);
  }

  onItemSelectLanguage(data: any) {
    console.log("Selected Item:", data);
    this.updateLanguagesString();
  }
  
  // Handle single item deselection
  OnLanguageItemDeSelect(item: any) {
    console.log("Deselected Item:", item);
    this.updateLanguagesString();
  }
  
  public languageList: any = [];

  public skillSubmitted: boolean = false;
  public educationSubmitted: boolean = false;
  public experianceSubmitted: boolean = false;
  public jobsubmitted: boolean = false;
  public enableBulkAction: any = false;

  public candidateName: any = '';
  public candidateReference: any = '';
  public gender: any = '';
  public diploma: any = '';
  public university: any = '';
  public currentCompany: any = '';
  public currentPosition: any = '';
  public candidateLocation: any = '';
  public birthdate: any = '';
  public candidateAddress: any = '';
  public candidateEmailAddress: any = '';
  public candidatePhoneNumber: any = '';
  public skype: any = '';
  public otherContact: any = '';
  public fatherName: any = '';
  public fatherMobileNumber: any = '';
  public motherName: any = '';
  public motherMobileNumber: any = '';

  public currentDepartment: any = '';
  public candidateIndustry: any = '';
  public yearsOfExperience: any = '';
  public graduationDate: any = '';
  public currentSalary: any = '';
  public currentBenefits: any = '';
  public noticePeriod: any = '';
  public expectedSalary: any = '';
  public expectedBenefits: any = '';
  public nationalities: any = '';
  public skillName: any = '';
  public languages: any = '';
  public candidateReferenceName: any = '';
  public gdprConsent: any = '';
  public candidateDescription: any = '';

  public candidateTagsList: any = [];

  public source: any = '';
  public sourceValue = '';
  public createdDate: any = '';
  public dateResumeadded: any = '';
  public createdby: any = '';
  public lastUpdated: any = '';

  //pagination
  public p: number = 1;
  public itemsPerPage: any = 20;
  public totalItems: any;
  public currentPage: any;
  public totalElements: number = 0;
  public showingFrom: number = 0;
  public showingTo: number = 0;
  public pageNumber: Number = 0;

  //pagination
  public jobp: number = 1;
  public jobitemsPerPage: any;
  public jobtotalItems: any;
  public jobcurrentPage: any;
  public jobtotalElements: number = 0;
  public jobshowingFrom: number = 0;
  public jobshowingTo: number = 0;
  public jobpageNumber: Number = 0;

  get form_() { return this.candidateForm.controls; };

  get _form() { return this.candidateForm.value };

  get jobform_() { return this.jobForm.controls; };

  get _formJob() { return this.jobForm.value };

  get experianceform_() { return this.experianceForm.controls; };

  get _formExperiance() { return this.experianceForm.value };

  get educationform_() { return this.educationForm.controls; };

  get _formEducation() { return this.educationForm.value };

  get skillform_() { return this.skillForm.controls; };

  get _formSkill() { return this.skillForm.value };

  public subscription: any;
  public sharedData: any;

  ngOnInit(): void {
    this.subscription = this.shareService.currentMessage.subscribe((message) => {
      this.sharedData = message
    });
    if (this.sharedData && this.sharedData != 'Default') {
      this.handleViewCandidate(this.sharedData);
      this.shareService.changeMessage('');
    }
    this.getCandidates();
    this.getDBJobs();
  }

  ngAfterViewInit(): void {
    this.getReferralList();
    this.fetchLanguages();
    this.fetchSkills();
  }

  fetchSkills() {
    this.spinner.show();
    let url = 'parent-skill-master/skillsearch?search='+this.searchModel +'';
    this.crudOperationsService.getList(url).subscribe((data: any) => {
      this.spinner.hide();
      this.skillList = data.data;
     // this.skillList.sort((a: any, b: any) => a.id - b.id);
    },
      (error) => {
        this.spinner.hide();
       // this.notification.notify('error', 'Something went wrong!');
      })
  }

  getReferralList() {
    this.spinner.show();
    let api = 'referral/list/' + this.companyId + '?page=0&size=200';
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.referralList = data.data.content;
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })
  }

  getCandidates() {
    this.spinner.show();
    let api = 'candidate/list?companyId=' + this.companyId + '&search=' + this.candidatesSearchModel + '&page=' + this.pageNumber + '&size=20&isArchived=false';
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.candidateList = data.data.content;
      this.candidateList.map(function (obj: any) {
        obj.selected = false;
      })
      //pagination call
      this.handlePagination(data);
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })
  }

  getDBJobs() {
    this.spinner.show();
    let api = 'job/list?companyId=' + this.companyId + '&search=&page=0&size=500';
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.dbJobList = data.data.content;
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })
  }
  search() {
    this.getCandidates();
  }

  modelShow() {
    this.clear();
  }

  modelShowEdit(data: any) {
    this.submitted = false;
    this.submitText = 'Update';
    this.id = data.candidateId;
    this.candidateForm.reset();
    this.form_['candidateName'].patchValue(data.candidateName);
    this.form_['candidatePhoneNumber'].patchValue(data.candidatePhoneNumber);
    this.form_['candidateLocation'].patchValue(data.candidateLocation);
    this.form_['candidateDescription'].patchValue(data.candidateDescription);
    this.form_['candidateEmailAddress'].patchValue(data.candidateEmailAddress);
    this.form_['file'].patchValue('');
    this.getImageFromService(data.filePath);
    this.selectedFile = data.filePath;
    (<any>$('#candidate-update-modal')).modal('show');
    this.showAdvancedOptions = true;
  }

  candidateEdit() {
    let result = this.candidateList.filter((item: any) => item.candidateId === this.id);
    console.log(result[0], ' ', this.id)
    this.modelShowEdit(result[0]);
  }

  downloadDocumentAttachment(filePath: string, fileName: string) {
    let downloadApi = 'candidate/document_download?filePath=' + filePath;
    this.crudOperationsService.downloadDocument(downloadApi)
      .subscribe((response: any) => {
        let blob: any = new Blob([response], { type: 'application/octet-stream' }); // must match the Accept type
        const filename = fileName;
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
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

  checkEmail(email:any){
    this.emailError=false;
    this.crudOperationsService.getList(this.api + '/checkEmail?companyId='+this.companyId+'&email=' + email)
    .subscribe((data: any) => {
      this.emailExists=data.data;
    },
      (_error) => {
        //this.notification.notify('error', 'Something Went Wrong')
      })
  }

  submit() {
    this.submitted = true;
    for (let el in this.form_) {
      if (this.form_[el].errors) {
        console.log(el)
      }
    }
    if(this.form_.candidateEmailAddress.value === "" || this.form_.candidateEmailAddress.value === null){
      this.emailError=true;
    }
    if (this.candidateForm.valid) {
      let formData = this.setFormData();
      if (this.submitText !== 'Update') {
        if(this.emailExists !== true){
          if(this.emailError!==true){
            this.save(formData, this.api);
          }
        }
      } else {
          this.update(formData, this.api + `/${this.id}`);
      }
     }   
  }
  update(formData: any, api: string) {
    this.submitProcessing = true;
    this.crudOperationsService.update(formData, api)
      .subscribe((data: any) => {
        this.notification.notify('success', data.message);
        (<any>$('#candidate-update-modal')).modal('hide');
        this.submitProcessing = false;
        if (this.showView) {
          this.getCandidateById();
          this.getCandidates();
        } else {
          this.ngOnInit();
        }
        this.clear();
      },
        (_error) => {
          this.submitProcessing = false;
          //this.notification.notify('error', 'Something Went Wrong')
        })
  }
  save(formData: any, api: string) {
    this.submitProcessing = true;
    this.crudOperationsService.create(formData, api)
      .subscribe((data: any) => {
        this.notification.notify('success', data.message);
        (<any>$('#candidate-add-modal')).modal('hide');
        this.submitProcessing = false;
        this.ngOnInit();
        this.clear();
      },
        (_error) => {
          this.submitProcessing = false;
          //this.notification.notify('error', 'Something Went Wrong')
        })
  }
  getFormData(): any {
    let companyId = {
      'companyId': this.companyId
    };
    this._form.companyId = companyId;
    let data = this._form;
    return data;
  }
  setFormData(): any {
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('candidateDTO', JSON.stringify(this.getFormData()));
    return formData;
  }

  clear() {
    this.submitted = false;
    this.fileSelected = false;
    this.showAdvancedOptions = false;
    this.candidateForm.reset();
    // this.id = undefined;
    this.submitText = 'Create';
    this.candidateForm.enable();
    this.imageSrc = '';
    this.selectedFile = '';
    this.emailExists=false;
    this.emailError=false;
  }

  deleteDoc(fileName: any) {
    this.crudOperationsService.getList(this.api + '/deleteFile?id=' + this.id + '&fileName=' + fileName)
      .subscribe((data: any) => {
        this.notification.notify('success', 'File deleted successfully!');
        this.getCandidateById();
      },
        (_error) => {
          //this.notification.notify('error', 'Something Went Wrong')
        })
  }

  delete(id: number) {
    this.crudOperationsService.delete(this.api + `/${id}`).subscribe((data: any) => {
      this.notification.notify('success', data.message);
      this.ngOnInit();
    }, (error) => { //this.notification.notify('error', 'something went wrong') 

    })
  }
  handlePagination(data: any) {
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
    this.getCandidates();
  }

  handleAdvancedClick() {
    this.showAdvancedOptions = true;
  }

  handleCandidate(data: any) {
    this.filteredJobList = [];
    this.showView = true;
    this.id = data.candidateId;
    this.getCandidateById();
    this.candidateEditTempObject = data;
  }

  handleViewCandidate(data: any) {
    this.filteredJobList = [];
    this.showView = true;
    this.id = data.id;
    this.getCandidateById();
    this.candidateEditTempObject = data;
  }

  fetchLanguages() {
    this.spinner.show();
    let url = 'language/list?search='+''+'&page=&size=10';
    this.crudOperationsService.getList(url).subscribe((data: any) => {
      this.spinner.hide();
      this.languageList = data.data.content;
      this.languageList.sort((a: any, b: any) => a.languageId - b.languageId);
    },
      (error) => {
        this.spinner.hide();
        //this.notification.notify('error', 'Something went wrong!');
      })
  }

  public experianceList: any = [];
  public educationList: any = [];

  getCandidateById() {
    this.spinner.show();
    let api = this.api + '/' + this.id;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.candidateDetails = data.data;
      this.experianceList = this.candidateDetails?.experience ? this.candidateDetails?.experience : [];
      this.educationList = this.candidateDetails?.education ? this.candidateDetails?.education : [];
      // this.skillsList = this.candidateDetails?.skillMasters ? this.candidateDetails?.skillMasters : [];
      this.jobList = this.candidateDetails?.jobList ? this.candidateDetails?.jobList : [];
      this.filteredJobList = this.dbJobList.filter((j1: any) => !this.jobList.some((j2: any) => j1.id === j2.id));
      this.filteredJobList.map(function (obj: any) {
        obj.selected = false;
      })
      this.setSummaryDetails(this.candidateDetails);
      this.setAdditionalDetails(this.candidateDetails);
      this.setAttachments(this.candidateDetails);
      this.setResume(this.candidateDetails);
      this.setLogBookDetails(this.candidateDetails);
      this.getImageFromService(this.candidateDetails.filePath);
      this.getSkillsList();
      this.getRecomendedList();
    },
      (error) => {
        this.spinner.hide();
        this.notification.notify('error', 'Error while Retriving Candidate');
        console.log(error);
      })

     this.fetchSourceChannels();
  }
  fetchSourceChannels() {
    //this.spinner.show();
    let api:any='sourcechannel/list?search='+this.searchModel;
    this.crudOperationsService.getList(api).subscribe((res: any) => {
     // this.toggleLoader = true;
      //this.spinner.hide();
      this.sources = res.data;
    },
      (error) => {
       // this.spinner.hide();
        //this.toggleLoader = true;
       // this.notification.notify('error', 'Something went wrong!');
      })
  }
  getRecomendedList() {
    let url = this.api + '/getRecomendedList_SkillsByType/Candidate/' +this.id;
    this.crudOperationsService.getList(url).subscribe((data: any) => {
      this.spinner.hide();
      this.recomendedList = data.data;
    },
      (error) => {
        //this.notification.notify('error', 'Something went wrong!');
      })
  }
  getSkillsList() {
    let url = this.api + '/getSkillsByType/Candidate/' +this.id;
    this.crudOperationsService.getList(url).subscribe((data: any) => {
      this.spinner.hide();
      this.skillsList = data.data;
    },
      (error) => {
        //this.notification.notify('error', 'Something went wrong!');
      })
  }

  setLogBookDetails(data: any) {
    this.source = data.source ? data.source : 'Form' ;
    this.sourceValue = data.sourceValue;
    this.createdDate = this.datePipe.transform(data.createdDate, 'dd-MM-yyyy');
    if (data.dateResumeAdded) {
      // Convert to local date without timezone shift
      const localDate = new Date(data.dateResumeAdded);
      localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
      this.dateResumeadded = localDate.toISOString().split('T')[0];
    }
    //this.dateResumeadded = this.datePipe.transform(data.dateResumeAdded, 'dd-MM-yyyy');
    this.createdby = data.createdBy;
    this.lastUpdated = this.datePipe.transform(data.modifiedDate, 'dd-MM-yyyy');
  }
  setAdditionalDetails(data: any) {
    this.currentDepartment = data.currentDepartment;
    this.candidateIndustry = data.candidateIndustry;
    this.yearsOfExperience = data.yearsOfExperience;
    this.graduationDate = this.datePipe.transform(data.graduationDate, 'dd-MM-yyyy');
    this.currentSalary = data.currentSalary;
    this.currentBenefits = data.currentBenefits;
    this.noticePeriod = data.noticePeriod;
    this.expectedSalary = data.expectedSalary;
    this.expectedBenefits = data.expectedBenefits;
    //this.languages = data.languages;
    const languageIds = data.languages ? data.languages.split(',').map((languageId: string) => +languageId) : [];
    this.selectedItemsLanguage = this.languageList.filter((language: any) =>
      languageIds.includes(language.languageId)
    );
    this.languages = data.languages;
    this.candidateReferenceName = data.candidateReferenceName;
    this.gdprConsent = data.gdprConsent;
    this.candidateDescription = data.candidateDescription;
    this.fetchNationalites(data.nationalities);
  }
  public nationalityList: any = [];
  fetchNationalites(nationalities: any) {
    this.spinner.show();
    this.configurationService.fetchNationalites().subscribe((data: any) => {
      this.spinner.hide();
      this.nationalityList = data.data.content;
      this.nationalities = nationalities;
    },
      (error) => {
        this.spinner.hide();
        //this.notification.notify('error', 'Something went wrong!');
      })
  }
  setSummaryDetails(data: any) {
    this.candidateName = data.candidateName;
    this.candidateReference = data.candidateReference;
    this.gender = data.gender;
    this.diploma = data.diploma;
    this.university = data.university;
    this.currentCompany = data.currentCompany;
    this.currentPosition = data.currentPosition;
    this.candidateLocation = data.candidateLocation;
    this.birthdate = this.datePipe.transform(data.birthDate, 'dd-MM-yyyy');
    this.candidateAddress = data.candidateAddress;
    this.candidateEmailAddress = data.candidateEmailAddress;
    this.candidatePhoneNumber = data.candidatePhoneNumber;
    this.skype = data.skype;
    this.otherContact = data.otherContact;
    this.candidateTagsList = data.tags ? data.tags : [];
  }
  setAttachments(data: any) {
    this.attachmentsList = data.attachments ? data.attachments : [];
  }

  setResume(data: any) {
    this.resumeList = data.resume ? data.resume : [];
  }

  public tabType: any = 'Summary';
  setType(type: any) {
    this.tabType = type;
  }

  public editSummaryDetailsEnable: boolean = false;
  public editLogBookEnable: boolean = false;
  public editAdditionalDetailsEnable: boolean = false;
  public editSummaryDescriptionEnable: boolean = false;
  public selectedFile1: any;
  public submitted1 = false;
  public selectedResumeFile: any;
  public submittedResume = false;

  handleEditSummaryDetails() {
    this.editSummaryDetailsEnable = !this.editSummaryDetailsEnable;
  }
  handleEditLogBook() {
    this.editLogBookEnable = !this.editLogBookEnable;
  }
  handleEditAdditionalDetails() {
    this.editAdditionalDetailsEnable = !this.editAdditionalDetailsEnable;
  }

  handleEditSummaryDescription() {
    this.editSummaryDescriptionEnable = !this.editSummaryDescriptionEnable;
  }

  cancelDescription() {
    this.editSummaryDescriptionEnable = false;
    this.getCandidateById();
  }

  cancelDetails() {
    this.editSummaryDetailsEnable = false;
    this.errorMessages = {
      candidateName: '',
      gender: '',
      diploma: '',
      currentCompany: '',
      currentPosition: '',
      birthDate: '',
      candidateEmailAddress: '',
      candidatePhoneNumber: '',
    };
    this.getCandidateById();
  }

  cancelAdditionalDetails() {
    this.errorAdditionalMessages = {
      yearsOfExperience: '',
      // graduationDate: '',
      currentSalary: '',
      noticePeriod: '',
      expectedSalary: '',
      nationalities: '',
      languages: '',
    };
    this.editAdditionalDetailsEnable = false;
    this.getCandidateById();
  }

  cancelLogBookDetails() {
    this.sourceError=false;
    this.editLogBookEnable = false;
    this.getCandidateById();
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
          (<any>$('#candidate-attch-add-files')).modal('hide');
          this.submitProcessing = false;
          this.getCandidateById();
        },
          (_error) => {
            this.submitProcessing = false;
            //this.notification.notify('error', 'Something Went Wrong')
          })
    }
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

    this.employeeService.getEmployeesByFilter(filterJson)
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

      this.crudOperationsService.addTeamMembers(empList, this.id)
        .subscribe((data: any) => {
          let response = data.data;
          response.forEach((res: any) => {
            this.notification.notify(res.status, res.message);
          });

          (<any>$('#candidate-team-member-add')).modal('hide');
          this.submitProcessing = false;
        },
          (_error) => {
            this.submitProcessing = false;
            //this.notification.notify('error', 'Something Went Wrong')
          })
    } else {
      this.validationText = 'Please select atlease 1 employee(s).';
    }
  }

  clearMembers() {
    this.searchValue = '';
    this.employeeList = [];
  }

  errorMessages: { 
    candidateName: string; 
    gender: string; 
    diploma: string; 
    currentCompany: string; 
    currentPosition: string; 
    birthDate: string; 
    candidateEmailAddress: string; 
    candidatePhoneNumber: string; 
  } = {
    candidateName: '',
    gender: '',
    diploma: '',
    currentCompany: '',
    currentPosition: '',
    birthDate: '',
    candidateEmailAddress: '',
    candidatePhoneNumber: ''
  };

  updateSummaryDetails() {
    this.errorMessages = {
      candidateName: '',
      gender: '',
      diploma: '',
      currentCompany: '',
      currentPosition: '',
      birthDate: '',
      candidateEmailAddress: '',
      candidatePhoneNumber: '',
    };
    this.submitProcessing = true;
  
    if (!this.candidateName) {
      this.errorMessages.candidateName = 'Candidate Name is required';
    }
    // if (!this.gender) {
    //   this.errorMessages.gender = 'Gender is required';
    // }
    // if (!this.diploma) {
    //   this.errorMessages.diploma = 'Highest Qualification is required';
    // }
    // if (!this.currentCompany) {
    //   this.errorMessages.currentCompany = 'Current Company is required';
    // }
    // if (!this.currentPosition) {
    //   this.errorMessages.currentPosition = 'Current Position is required';
    // }
    // if (!this.selectedBirthDate) {
    //   this.errorMessages.birthDate = 'Birth Date is required';
    // }
    if (!this.candidateEmailAddress) {
      this.errorMessages.candidateEmailAddress = 'Email Address is required';
    }
    if (!this.candidatePhoneNumber) {
      this.errorMessages.candidatePhoneNumber = 'Phone Number is required';
    }
  
    const hasErrors = Object.values(this.errorMessages).some((message) => message !== '');
  
    if (hasErrors) {
      this.submitProcessing = false;
      return;
    }
  
    const formData = {
      candidateName: this.candidateName,
      candidateReference: this.candidateReference,
      gender: this.gender,
      diploma: this.diploma,
      university: this.university,
      currentCompany: this.currentCompany,
      currentPosition: this.currentPosition,
      candidateLocation: this.candidateLocation,
      birthDate: this.selectedBirthDate,
      candidateAddress: this.candidateAddress,
      candidateEmailAddress: this.candidateEmailAddress,
      candidatePhoneNumber: this.candidatePhoneNumber,
      skype: this.skype,
      otherContact: this.otherContact,
    };
  
    this.crudOperationsService.update(formData, this.api + `/updateSumamryDetails/${this.id}`)
      .subscribe(
        (data: any) => {
          this.notification.notify('success', 'Details Updated Successfully!');
          this.submitProcessing = false;
          this.cancelDetails();
        },
        (_error) => {
          this.submitProcessing = false;
          this.notification.notify('error', 'Something Went Wrong');
        }
      );
  }
  
  
  sourceError=false;
  updateLogBook() {
    this.submitProcessing = true;
    if(!this.source){
      this.sourceError=true;
    }
    else{
      const [day, month, year] = this.dateResumeadded.split('-').map(Number);
      const date = new Date(year, month - 1, day); // month is 0-based
      let formData = {
        'source': this.source,
        'sourceValue': this.sourceValue,
        'dateResumeAdded': date
      }
      this.crudOperationsService.update(formData, this.api + `/updateSource/${this.id}`)
        .subscribe((data: any) => {
          this.notification.notify('success', 'Details Updated Successfully!');
          this.submitProcessing = false;
          this.cancelLogBookDetails();
        },
          (_error) => {
            this.submitProcessing = false;
            //this.notification.notify('error', 'Something Went Wrong')
          })
    }
  }

  errorAdditionalMessages: { 
    yearsOfExperience: string; 
    // graduationDate: string; 
    currentSalary: string; 
    noticePeriod: string; 
    expectedSalary: string; 
    nationalities: string; 
    languages: string; 
  } = {
    yearsOfExperience: '',
    // graduationDate: '',
    currentSalary: '',
    noticePeriod: '',
    expectedSalary: '',
    nationalities: '',
    languages: '',
  };


  updateAdditionalDetails() {
    this.errorAdditionalMessages = {
      yearsOfExperience: '',
      // graduationDate: '',
      currentSalary: '',
      noticePeriod: '',
      expectedSalary: '',
      nationalities: '',
      languages: '',
    };
    this.submitProcessing = true;
  
    // if (!this.yearsOfExperience) {
    //   this.errorAdditionalMessages.yearsOfExperience = 'Years of Experience is required';
    // }
    // if (!this.graduationDate) {
    //   this.errorAdditionalMessages.graduationDate = 'Graduation Date is required';
    // }
    // if (!this.currentSalary) {
    //   this.errorAdditionalMessages.currentSalary = 'Current Salary is required';
    // }
    // if (!this.noticePeriod) {
    //   this.errorAdditionalMessages.noticePeriod = 'Notice Period is required';
    // }
    // if (!this.expectedSalary) {
    //   this.errorAdditionalMessages.expectedSalary = 'Expected Salary is required';
    // }
    // if (!this.nationalities) {
    //   this.errorAdditionalMessages.nationalities = 'Nationalities is required';
    // }
    // if (!this.languages) {
    //   this.errorAdditionalMessages.languages = 'Languages is required';
    // }
  
    const hasErrors = Object.values(this.errorAdditionalMessages).some((message) => message !== '');
  
    if (hasErrors) {
      this.submitProcessing = false;
      return;
    }

    this.submitProcessing = true;
    let formData = {
      'currentDepartment': this.currentDepartment,
      'candidateIndustry': this.candidateIndustry,
      'yearsOfExperience': this.yearsOfExperience,
      'graduationDate': this.selectedGraduationDate,
      'currentSalary': this.currentSalary,
      'currentBenefits': this.currentBenefits,
      'noticePeriod': this.noticePeriod,
      'expectedSalary': this.expectedSalary,
      'expectedBenefits': this.expectedBenefits,
      'nationalities': this.nationalities,
      'languages': this.languages,
      'candidateReferenceName': this.candidateReferenceName,
      'gdprConsent': this.gdprConsent,
      'candidateDescription': this.candidateDescription,
    }
    console.log("Form Data",formData);
    this.crudOperationsService.update(formData, this.api + `/updateAdditionalDetails/${this.id}`)
      .subscribe((data: any) => {
        this.notification.notify('success', 'Details Updated Successfully!');
        this.submitProcessing = false;
        this.cancelAdditionalDetails();
      },
        (_error) => {
          this.submitProcessing = false;
          //this.notification.notify('error', 'Something Went Wrong')
        })
  }

  deleteTeamMember(id: number) {
    this.crudOperationsService.getList(this.api + '/deleteTeamMember?candidateId=' + this.id + '&id=' + id).subscribe((data: any) => {
      this.notification.notify('success', 'Team Member Deleted Successfully!');
    }, (error) => { //this.notification.notify('error', 'something went wrong') 
      })
  }
  goBack() {
    this.showView = false;
    this.getCandidates();
  }

  setCandidateId(id: any) {
    this.id = id;
  }

  jobModalShow() {
    this.jobForm.reset();
    this.jobform_['candidateId'].patchValue(this.id);
    this.jobsubmitted = false;
    this.submitTextJob = 'Create';
  }

  submitJob() {
    this.jobsubmitted = true;
    const eItems = this.filteredJobList.filter((item: any) => item.selected === true);
    if (eItems.length > 0) {
      this.submitProcessing = true;
      let jobSelectedList = [];
      for (let i = 0; i < this.filteredJobList.length; i++) {
        if (this.filteredJobList[i].selected) {
          jobSelectedList.push(this.filteredJobList[i]);
        }
      }
      this.crudOperationsService.addCandidateJobs(jobSelectedList, this.id)
        .subscribe((data: any) => {
          let response = data.data;
          this.notification.notify('success', response);
          (<any>$('#candidate-job-add-modal')).modal('hide');
          this.submitProcessing = false;
          this.selectedJobCount = 0;
          this.getCandidateById();
        },
          (_error) => {
            this.submitProcessing = false;
            //this.notification.notify('error', 'Something Went Wrong')
          })
    } else {
      this.validationTagText = 'Please select atlease 1 Job(s).';
    }
  }

  modelShowEditJob(data: any) {
    this.jobsubmitted = false;
    this.submitTextJob = 'Update';
    this.jobid = data.id;
    this.jobForm.reset();
    this.jobform_['positionName'].patchValue(data.positionName);
    this.jobform_['candidateId'].patchValue(data.clId);
    this.jobform_['headCount'].patchValue(data.headCount);
    this.jobform_['jobLocation'].patchValue(data.jobLocation);
    this.jobform_['contractDetails'].patchValue(data.contractDetails);
    this.jobform_['minSalary'].patchValue(data.minSalary);
    this.jobform_['maxSalary'].patchValue(data.maxSalary);
    this.jobform_['currency'].patchValue(data.currency);
    this.jobform_['frequency'].patchValue(data.frequency);
    this.jobform_['jobDescription'].patchValue(data.jobDescription);
    (<any>$('#candidate-job-add-modal')).modal('show');
    // this.fileSelected = true;
  }
  deleteJob(id: number) {
    this.crudOperationsService.delete(this.api + `/deleteJob/${this.id}/${id}`).subscribe((data: any) => {
      this.notification.notify('success', data.message);
      //this.goBack();
      //window.location.reload();
      this.getCandidateById();
    }, (error) => { //this.notification.notify('error', 'something went wrong') 

    })
  }

  jobhandlePagination(data: any) {
    this.jobtotalElements = data.data.totalElements;
    this.jobitemsPerPage = 10;
    this.jobcurrentPage = data.data.pageable.pageNumber + 1;
    this.jobtotalItems = (data.data.totalPages) * this.jobitemsPerPage;
    this.jobshowingFrom = (data.data.pageable.pageNumber * 10) + 1;
    const to = (data.data.pageable.pageNumber + 1) * 10;
    if (this.jobtotalElements >= to) {
      this.jobshowingTo = to;
    } else {
      this.jobshowingTo = this.jobtotalElements;
    }
  }
  jobpageChanged(event: any) {
    this.jobpageNumber = event - 1;
  }

  searchjob() {
    //this.dbJobList = [];
    // this.filteredJobList.includes(this.jobSearchModel);
    let data = this.transform(this.jobList, this.jobSearchModel);
   // console.log(data)
   //this.spinner.show();
    let api = 'job/list?companyId=' + this.companyId + '&search='+this.jobSearchModel+'&page=0&size=500';
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      //this.spinner.hide();
      this.filteredJobList = data.data.content;
    },
      (error) => {
        //this.spinner.hide();
        console.log(error);
      })
  }
  transform(items: any[], search: string): any {
    if (!items) return [];
    if (!search) return items;
    search = search.toLowerCase();
    return items.filter(function (it: any) {
      return (it.positionName.toLowerCase().includes(search));
    });
  }

  handleBulkAction() {
    const eItems = this.candidateList.filter((item: any) => item.selected === true);
    this.enableBulkAction = eItems.length > 0 ? true : false;
    this.selectedCandidateCount = eItems.length;
  }

  onClickCandidateCheckBox(id: any) {
    this.validationText = '';
    const i = this.candidateList.findIndex((obj: any) => obj.candidateId == id);
    this.candidateList[i].selected = !this.candidateList[i].selected;
    this.handleBulkAction();
  }

  selectAllCandidate(event: any) {
    const checked = event.target.checked;
    this.validationText = '';
    this.candidateList.forEach((item: any) => item.selected = checked);
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
      for (let i = 0; i < this.candidateList.length; i++) {
        if (this.candidateList[i].selected) {
          clList.push(this.candidateList[i]);
        }
      }

      let tagList = [];
      for (let i = 0; i < this.tagsList.length; i++) {
        if (this.tagsList[i].selected) {
          tagList.push(this.tagsList[i]);
        }
      }

      this.crudOperationsService.addCandidateTags(clList, tagList)
        .subscribe((data: any) => {
          let response = data.data;
          this.notification.notify('success', response);
          (<any>$('#candidate-add-tag-bulk')).modal('hide');
          this.submitProcessing = false;
          this.clearTagsBulk();
          this.selectedCandidateCount = 0;
          this.enableBulkAction = false;
          this.getCandidates();
        },
          (_error) => {
            this.submitProcessing = false;
            //this.notification.notify('error', 'Something Went Wrong')
          })
    } else {
      this.validationTagText = 'Please select atlease 1 Tag(s).';
    }
  }

  clearTagsBulk() {
    this.tagSearchValue = '';
    this.validationTagText = '';
    this.tagsList.forEach((item: any) => item.selected = false);
  }

  clearTags() {
    this.tagSearchValue = '';
    this.validationTagText = '';
    this.tagsList.forEach((item: any) => item.selected = false);

    for (let i = 0; i < this.candidateTagsList.length; i++) {
      let index = this.tagsList.findIndex((item: any) => item.name === this.candidateTagsList[i].name);
      if (index != -1) {
        this.tagsList[i].selected = true;
      }
    }
  }

  searchTag() {
    this.tagsList = this.tagsList.includes(this.tagSearchValue);
  }

  addTagsIndividual() {
    const eItems = this.tagsList.filter((item: any) => item.selected === true);
    if (eItems.length > 0) {
      this.submitProcessing = true;

      let tagList = [];
      for (let i = 0; i < this.tagsList.length; i++) {
        if (this.tagsList[i].selected) {
          tagList.push(this.tagsList[i]);
        }
      }

      this.crudOperationsService.addCandidateIndividualTags(this.id, tagList)
        .subscribe((data: any) => {
          let response = data.data;
          this.notification.notify('success', response);
          (<any>$('#candidate-add-tag-individual')).modal('hide');
          this.submitProcessing = false;
          this.clearTags();
          this.getCandidateById();
        },
          (_error) => {
            this.submitProcessing = false;
            //this.notification.notify('error', 'Something Went Wrong')
          })
    } else {
      this.validationTagText = 'Please select atlease 1 Tag(s).';
    }
  }

  candidateArchive() {
    const eItems = this.candidateList.filter((item: any) => item.selected === true);
    if (eItems.length > 0) {
      this.submitProcessing = true;
      let clList = [];
      for (let i = 0; i < this.candidateList.length; i++) {
        if (this.candidateList[i].selected) {
          clList.push(this.candidateList[i]);
        }
      }
      this.crudOperationsService.candidateArchive(clList)
        .subscribe((data: any) => {
          let response = data.data;
          this.notification.notify('success', response);
          (<any>$('#candidate-archive-bulk')).modal('hide');
          this.submitProcessing = false;
          this.enableBulkAction = false;
          this.getCandidates();
        },
          (_error) => {
            this.submitProcessing = false;
            //this.notification.notify('error', 'Something Went Wrong')
          })
    } else {
      this.validationText = 'Please select atlease 1 Candidate(s).';
    }
  }

  candidateArchiveIndividual() {
    this.submitProcessing = true;
    let url = this.api + '/archiveIndividual/' + this.id;
    this.crudOperationsService.getList(url)
      .subscribe((data: any) => {
        let response = data.data;
        this.notification.notify('success', response);
        (<any>$('#candidate-archive-individual')).modal('hide');
        this.submitProcessing = false;
        this.goBack();
      },
        (_error) => {
          this.submitProcessing = false;
         // this.notification.notify('error', 'Something Went Wrong')
        })
  }

  addCondition(field: any, condition: any, value: any) {
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
  applyConditionFilter() {
    var condition = '';
    for (var i = 0; i < this.conditionsArray.length; i++) {
      condition = condition.concat(" AND " + this.conditionsArray[i]);
    }
    var data = { "condition": condition };
    this.spinner.show();
    let api = 'candidate/findAllCandidatesByFilter' + `/${this.companyId}`;
    this.crudOperationsService.update(data, api).subscribe((data: any) => {
      this.spinner.hide();
      this.filterApplied=true;
      this.candidateList = data.data;
      //pagination call
      //this.handlePagination(data);
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })

  }
  clearCondition() {
    this.filterApplied=false;
    this.conditionsArray = [];
    this.fieldModel = '';
    this.conditionModel = '';
    this.valueModel = [];
    this.getCandidates();
  }
  modelFilter() {
    this.cancelAdvacnceFilter();
    this.showFilterModel = true;
  }
  modelAdvanceFilter() {
    this.cancelFilter();
    this.showAdvanceFilterModel = true;
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
      this.candidateList = data.data;
      //pagination call
      //this.handlePagination(data);
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })

  }
  cancelFilter() {
    this.filterApplied=false;
    this.showFilterModel = false;
    this.conditionsArray = [];
    this.fieldModel = '';
    this.conditionModel = '';
    this.valueModel = [];
    this.getCandidates();
  }
  cancelAdvacnceFilter() {
    this.filterApplied=false;
    this.showAdvanceFilterModel = false;
  }
  getImageFromService(filePath: any) {
    this.isImageLoading = true;
    this.imageSrc = '';
    if (filePath) {
      let url = 'candidate/document_download?filePath=' + filePath;
      this.crudOperationsService.getImage(url).subscribe(data => {
        this.createImageFromBlob(data);
        this.isImageLoading = false;
      }, error => {
        this.isImageLoading = false;
        console.log(error);
      });
    }
  }
  imageToShow: any;
  isImageLoading: any = true;

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.imageToShow = reader.result;
      this.imageSrc = reader.result as string;
    }, false);
    if (image) {
      reader.readAsDataURL(image);
    }
  }

  imageSrc: string = '';
  onFileChange(event: any) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      this.selectedFile = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageSrc = reader.result as string;
      };
    } else {
      this.imageSrc = '';
    }
  }

  exportTable(type: string) {
    this.companyId = Number(sessionStorage.getItem('companyId'));
    let obj = {};
    //spinner show
    var fileType = '';
    if (type == 'EXCEL') {
      fileType = 'CandidateReport.xls';
      let api: any = "reports/candidate/exportExcel/" + this.companyId + '/false?search=' + this.candidatesSearchModel;
      this.crudOperationsService.exportExcelReport2(api, fileType, obj)
    }
    else {
      fileType = 'CandidateReport.pdf';
      let api: any = "reports/candidate/exportPDF/" + this.companyId + '/false?search=' + this.candidatesSearchModel;
      this.crudOperationsService.exportPDF2(api, fileType, obj)
    }
  }

  submitExperiance() {
    this.experianceSubmitted = true;
    for (let el in this.experianceform_) {
      if (this.experianceform_[el].errors) {
        console.log(el)
      }
    }
    if (this.experianceForm.valid) {
      if (this.submitTextExpeiance !== 'Update') {
        this.saveExperiance(this._formExperiance, this.api + '/saveExperiance/' + this.id);
      } else {
        this.updateExperiance(this._formExperiance, this.api + '/updateExperiance/' + this.id + '/' + this.experianceId);
      }
    }
  }
  updateExperiance(formData: any, api: string) {
    this.submitProcessing = true;
    this.crudOperationsService.update(formData, api)
      .subscribe((data: any) => {
        this.notification.notify('success', data.message);
        (<any>$('#candidate-experiance-modal')).modal('hide');
        this.submitProcessing = false;
        this.resetExperiance();
        this.getCandidateById();
      },
        (_error) => {
          this.submitProcessing = false;
          //this.notification.notify('error', 'Something Went Wrong')
        })
  }
  saveExperiance(formData: any, api: string) {
    this.submitProcessing = true;
    this.crudOperationsService.create(formData, api)
      .subscribe((data: any) => {
        this.notification.notify('success', data.data);
        (<any>$('#candidate-experiance-modal')).modal('hide');
        this.submitProcessing = false;
        this.resetExperiance();
        this.getCandidateById();
      },
        (_error) => {
          this.submitProcessing = false;
          //this.notification.notify('error', 'Something Went Wrong')
        })
  }

  resetExperiance() {
    this.experianceSubmitted = false;
    this.experianceForm.reset();
    this.submitTextExpeiance = 'Save';
  }

  submitEducation() {
    this.educationSubmitted = true;
    for (let el in this.educationform_) {
      if (this.educationform_[el].errors) {
        console.log(el)
      }
    }
    if (this.educationForm.valid) {
      if (this.submitTextEducation !== 'Update') {
        this.saveEducation(this._formEducation, this.api + '/saveEducation/' + this.id);
      } else {
        this.updateEducation(this._formEducation, this.api + '/updateEducation/' + this.id + '/' + this.educationId);
      }
    }
  }
  updateEducation(formData: any, api: string) {
    this.submitProcessing = true;
    this.crudOperationsService.update(formData, api)
      .subscribe((data: any) => {
        this.notification.notify('success', data.message);
        (<any>$('#candidate-education-modal')).modal('hide');
        this.submitProcessing = false;
        this.resetEducation();
        this.getCandidateById();
      },
        (_error) => {
          this.submitProcessing = false;
          //this.notification.notify('error', 'Something Went Wrong')
        })
  }
  saveEducation(formData: any, api: string) {
    this.submitProcessing = true;
    this.crudOperationsService.create(formData, api)
      .subscribe((data: any) => {
        this.notification.notify('success', data.data);
        (<any>$('#candidate-education-modal')).modal('hide');
        this.submitProcessing = false;
        this.resetEducation();
        this.getCandidateById();
      },
        (_error) => {
          this.submitProcessing = false;
          //this.notification.notify('error', 'Something Went Wrong')
        })
  }

  resetEducation() {
    this.educationSubmitted = false;
    this.educationForm.reset();
    this.submitTextEducation = 'Save';
  }

  public experianceId: any = '';
  public educationId: any = '';
  public submitTextExpeiance = 'Save';
  public submitTextEducation = 'Save';
  public selectedExpStartDate: any;
  public selectedExpEndDate: any;
  public selectedEduDate: any = '';
  public skillId: any = '';
  public submitTextSkill = 'Save';
  public selectedJobCount: number = 0;
  public selectedGraduationDate: any;
  public selectedBirthDate: any='';

  modelShowEditExperiance(data: any) {
    this.experianceSubmitted = false;
    this.submitTextExpeiance = 'Update';
    this.experianceId = data.id;
    this.experianceForm.reset();
    this.selectedExpStartDate = new Date(data.startDate);
    this.selectedExpEndDate = new Date(data.endDate);
    this.experianceform_['positionName'].patchValue(data.positionName);
    this.experianceform_['employer'].patchValue(data.employer);
    this.experianceform_['startDate'].patchValue(this.selectedExpStartDate);
    this.experianceform_['endDate'].patchValue(this.selectedExpEndDate);
    this.experianceform_['salary'].patchValue(data.salary);
    this.experianceform_['currency'].patchValue(data.currency);
    this.experianceform_['frequency'].patchValue(data.frequency);
    this.experianceform_['location'].patchValue(data.location);
    this.experianceform_['description'].patchValue(data.description);
    (<any>$('#candidate-experiance-modal')).modal('show');
  }
  deleteExperiance(id: number) {
    this.crudOperationsService.delete(this.api + `/deleteExperiance?id=` + this.id + '&experianceId=' + id).subscribe((data: any) => {
      this.notification.notify('success', data.message);
      this.getCandidateById();
    }, (error) => { //this.notification.notify('error', 'something went wrong') 

    })
  }

  modelShowEditEducation(data: any) {
    this.educationSubmitted = false;
    this.submitTextEducation = 'Update';
    this.educationId = data.id;
    this.educationForm.reset();
    if(data.startDate) {
      this.selectedEduDate = new Date(data.startDate);
    }
    this.educationform_['school'].patchValue(data.school);
    this.educationform_['university'].patchValue(data.university);
    this.educationform_['degree'].patchValue(data.degree);
    this.educationform_['specialization'].patchValue(data.specialization);
    this.educationform_['startDate'].patchValue(this.selectedEduDate);
    this.educationform_['finalGrade'].patchValue(data.finalGrade);
    this.educationform_['scoreType'].patchValue(data.scoreType);
    this.educationform_['location'].patchValue(data.location);
    this.educationform_['description'].patchValue(data.description);
    (<any>$('#candidate-education-modal')).modal('show');
  }
  deleteEducation(id: number) {
    this.crudOperationsService.delete(this.api + `/deleteEducation?id=` + this.id + '&educationId=' + id).subscribe((data: any) => {
      this.notification.notify('success', data.message);
      this.getCandidateById();
    }, (error) => { //this.notification.notify('error', 'something went wrong') 

    })
  }

  onExpDateValueChange(event: any) {
    this.selectedExpStartDate = new Date(event);
  }

  onEndpDateValueChange(event: any) {
    this.selectedExpEndDate = new Date(event);
  }

  onGraduationDateValueChange(event: any) {
    this.selectedGraduationDate = new Date(event);
  }

  onBirthDateValueChange(event: any) {
    //alert(event);
    if(event!=null) this.selectedBirthDate = new Date(event);
  }

  onEduDateValueChange(event: any) {
    this.selectedEduDate = new Date(event);
  }
  // modelShowEditSkill(data: any) {
  //  // alert(JSON.stringify(data));
  //   this.skillSubmitted = false;
  //   this.submitTextSkill = 'Update';
  //   this.skillId = data.id;
  //   this.skillForm.reset();
  //   this.selectedExpStartDate = new Date(data.startDate);
   
  //  this.skillName = data;
  //   this.skillform_['skillName'].patchValue(this.skillName);
  //   this.skillform_['rating'].patchValue(data.rating);
  //   (<any>$('#candidate-skill-modal')).modal('show');
  // }

  modelShowEditSkill(data: any) {
    //alert(JSON.stringify(data));
    this.skillSubmitted = false;
    this.submitTextSkill = 'Update';
    this.skillId = data.id;
    this.skillForm.reset();
    this.selectedExpStartDate = new Date(data.startDate);

    let selectedSkill = this.skillList.find((skill:any) => skill.id === data.parentSkillId);
    if (selectedSkill) 
    {
      this.skillform_['skillName'].patchValue([selectedSkill]);
    }
    this.skillform_['rating'].patchValue(data.rating);    
    (<any>$('#candidate-skill-modal')).modal('show');
  }

  submitSkill() {
    this.skillSubmitted = true;
    for (let el in this.skillform_) {
      if (this.skillform_[el].errors) {
        console.log(el)
      }
    }
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
      this._formSkill.type = 'Candidate';
      this._formSkill.parentSkillMaster = parentSkillMaster;
      this._formSkill.externalId = this.id;
      this._formSkill.company = companyId;
     // alert(JSON.stringify(this._formSkill.skillName));
     
      var i = this.skillsList.length;
    let dupliateCheck:boolean = false;
    while (i--) {
    //  alert(JSON.stringify(""+this.skillsList[i].parentSkillId+""));
       if (""+this.skillsList[i].parentSkillId+"" === this._formSkill.skillName) {
        dupliateCheck = true;
       }
    }
   // alert(dupliateCheck);
      if (this.submitTextSkill !== 'Update') {
        if(dupliateCheck){
          this.notification.notify('error', 'Duplicate skill is not allowed')
        }else{
          this.saveSkill(this._formSkill, this.api + '/saveSkill');
        }
        
      } else {
        this.updateSkill(this._formSkill, this.api + '/updateSkill/' + this.skillId);
      }
    }
  }
  updateSkill(formData: any, api: string) {
    this.submitProcessing = true;
    this.crudOperationsService.update(formData, api)
      .subscribe((data: any) => {
        this.notification.notify('success', data.message);
        (<any>$('#candidate-skill-modal')).modal('hide');
        this.submitProcessing = false;
        this.resetSkill();
        this.getCandidateById();
      },
        (_error) => {
          this.submitProcessing = false;
          //this.notification.notify('error', 'Something Went Wrong')
        })
  }
  saveSkill(formData: any, api: string) {
    this.submitProcessing = true;
    this.crudOperationsService.create(formData, api)
      .subscribe((data: any) => {
        this.notification.notify('success', data.message);
        (<any>$('#candidate-skill-modal')).modal('hide');
        this.submitProcessing = false;
        this.resetSkill();
        this.getCandidateById();
      },
        (_error) => {
          this.submitProcessing = false;
          //this.notification.notify('error', 'Something Went Wrong')
        })
  }

  resetSkill() {
    this.skillSubmitted = false;
    this.skillForm.reset();
    this.skillId = '';
    this.submitTextSkill = 'Save';
  }

  
  deleteSkill(id: number) {
    this.crudOperationsService.delete(this.api + `/deleteSkill?id=` + id).subscribe((data: any) => {
      this.notification.notify('success', data.message);
      this.getCandidateById();
    }, (error) => { //this.notification.notify('error', 'something went wrong') 

    })
  }

  onClickJobCheckBox(id: any) {
    this.validationText = '';
    const i = this.filteredJobList.findIndex((obj: any) => obj.id == id);
    this.filteredJobList[i].selected = !this.filteredJobList[i].selected;
    const eItems = this.candidateList.filter((item: any) => item.selected === true);
    this.selectedJobCount = eItems.length;
  }

  selectAllJob(event: any) {
    const checked = event.target.checked;
    this.validationText = '';
    this.filteredJobList.forEach((item: any) => item.selected = checked);
    const eItems = this.candidateList.filter((item: any) => item.selected === true);
    this.selectedJobCount = eItems.length;
  }

  addResumeFileClick() {
    this.selectedResumeFile = '';
  }
  addResumeFile() {
    if (this.selectedResumeFile != undefined && this.selectedResumeFile != '') {
      const formData = new FormData();
      formData.append('file', this.selectedResumeFile);
      formData.append('id', this.id);
      this.submitProcessing = true;
      this.crudOperationsService.create(formData, this.api + '/addResumeFile')
        .subscribe((data: any) => {
          this.notification.notify('success', data.message);
          (<any>$('#candidate-resume-add-files')).modal('hide');
          this.submitProcessing = false;
          this.getCandidateById();
        },
          (_error) => {
            this.submitProcessing = false;
            //this.notification.notify('error', 'Something Went Wrong')
          })
    }
  }

  onResumeFileChanged(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0];

        if (file.size > 2 * 1024 * 1024) {
            this.fileSizeExceeded = true; 
            this.selectedResumeFile = null;
        } else {
            this.fileSizeExceeded = false; 
            this.selectedResumeFile = file;
        }
    }
}

  clearResume() {
    this.submittedResume = false;
    this.selectedResumeFile = undefined;
    this.fileSizeExceeded = false;
  }

  deleteResumeDoc(fileName: any) {
    this.crudOperationsService.getList(this.api + '/deleteResumeFile?id=' + this.id + '&fileName=' + fileName)
      .subscribe((data: any) => {
        this.notification.notify('success', 'File deleted successfully!');
        this.getCandidateById();
      },
        (_error) => {
          //this.notification.notify('error', 'Something Went Wrong')
        })
  }

  getDocFromService(filePath: any) {
    this.isDocLoading = true;
    this.imageSrc = '';
    if (filePath) {
      let url = 'candidate/document_download?filePath=' + filePath;
      this.crudOperationsService.getImage(url).subscribe(data => {
        this.createDocFromBlob(data);
        this.isDocLoading = false;
      }, error => {
        this.isDocLoading = false;
        console.log(error);
      });
    }
  }
  docToShow: any;
  isDocLoading: any = true;

  createDocFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.docToShow = reader.result;
    }, false);
    if (image) {
      reader.readAsDataURL(image);
    }
  }

  showTeamMembers(id: any) {
    let api = 'job/getTeamMembers?id=' + id;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.teamMembersList = data.data.team;
    },
      (error) => {
        console.log(error);
      })
  }

  viewDocument(filePath: string, fileType: string) {
    //spinner show
    this.spinner.show();
    var fileType = '';
    if (fileType == '.doc' || fileType == '.docx') {
      fileType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    } else {
      fileType = 'application/pdf';
    }
    let url = 'candidate/document_download?filePath=' + filePath;
    this.crudOperationsService.getImage(url).subscribe(response => {
      //spinner hide
      this.spinner.hide();
      let blob: any = new Blob([response], { type: fileType });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
      //window.location.href = response.url;
      //this._FileSaverService.save(blob,'Employee_Branch_Report');
    },
      (error) => {
        this.notification.notify('error', 'Something Went Worng');
        //spinner hide
        this.spinner.hide();
      }
    )
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

  removeImage() {
    this.selectedFile = '';
    this.imageSrc = '';
  }

  // onStatusChange(event: any, candidateId: any) {
  //   this.id = candidateId;
  //   //alert(event.target.value);
  //   if (event.target.value == 'Dropped') {
  //     this.clearDropCandidate();
  //     (<any>$('#candidate-drop-modal')).modal('show');
  //   } else {
  //     let formData = {
  //       'candidateStage': event.target.value,
  //     }
  //     this.crudOperationsService.update(formData, this.api + `/updateStatusDetails/${candidateId}`)
  //       .subscribe((data: any) => {
  //         this.notification.notify('success', 'Details Updated Successfully!');
  //         this.submitProcessing = false;
  //         //this.cancelDescription();
  //         // this.cancelDetails();
  //         this.getCandidates();
  //       },
  //         (_error) => {
  //           this.submitProcessing = false;
  //           this.notification.notify('error', 'Something Went Wrong')
  //         })
  //   }
  // }
  addReferrer() {
    this.route.navigateByUrl('HRMS/ATS/referral');
  }
  dropCandidate() {
    let formData = {
      'candidateStage': 'Dropped',
      'reasonsToDrop': this.selectedItemsStage,
      'dropDescription': this.dropDescription
    }
    this.crudOperationsService.update(formData, this.api + `/updateDroppedStatusDetails/${this.id}`)
      .subscribe((data: any) => {
        this.notification.notify('success', 'Details Updated Successfully!');
        (<any>$('#candidate-drop-modal')).modal('hide');
        this.submitProcessing = false;
        //this.cancelDescription();
        // this.cancelDetails();
        this.getCandidates();
      },
        (_error) => {
          this.submitProcessing = false;
          //this.notification.notify('error', 'Something Went Wrong')
        })
  }
  clearDropCandidate() {
    this.dropDescription = '';
    this.selectedItemsStage = [];
  }

  onJobStatusChange(event: any, jobId: any) {
    //alert(event.target.value);

    let formData = {
      'status': event.target.value,
    }
    this.crudOperationsService.update(formData, `job/updateStatusDetails/${jobId}`)
      .subscribe((data: any) => {
        this.notification.notify('success', 'Details Updated Successfully!');
        this.submitProcessing = false;
        this.getCandidateById();
      },
        (_error) => {
          this.submitProcessing = false;
          //this.notification.notify('error', 'Something Went Wrong')
        })
  }

  viewJob(data: any) {
    this.shareService.changeMessage(data);
    this.router.navigateByUrl('HRMS/ATS/jobs');
  }

  exportRecomendedTable(type: string) {
    //spinner show
    var fileType = '';
    if (type == 'EXCEL') {
      fileType = 'CandidateRecomendedReport.xls';
      let api: any = "additional/reports/candidateRecomended/exportExcel/" + this.id;
      this.crudOperationsService.exportExcelReport(api, fileType)
    }
    else {
      fileType = 'CandidateRecomendedReport.pdf';
      let api: any = "additional/reports/candidateRecomended/exportPDF/" + this.id;
      this.crudOperationsService.exportPDF(api, fileType)
    }
  }

  exportSummary() {
      let fileType = 'CandidateSummaryReport.xls';
      let api: any = "additional/reports/candidateSummary/exportExcel/" + this.id;
      this.crudOperationsService.exportExcelReport(api, fileType)
  }


  onSorted($event: Event) {
    let data: any = $event;
    console.log("data ::: ", data)
    let sortedArray = (this.candidateList || []).sort((a : any,b: any)=>{
      if(a[data.sortColumn].toLowerCase() > b[data.sortColumn].toLowerCase()){
        return (data.sortDirection === 'desc') ? 1 : -1;
      }
      if(a[data.sortColumn].toLowerCase() < b[data.sortColumn].toLowerCase()){
        return (data.sortDirection === 'desc') ? -1 : 1;
      }
      return 0;
    })
    this.candidateList = sortedArray;
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
  }

  onValueFieldChange(event: any) {
    let field = event.target.value;
    this.valuesList  =[];
    this.valuesArray  =[];
    
    for(var i=0;i<this.candidateList.length;i++){
        if (field == "candidateName") {
          var data = {"id":this.candidateList[i].candidateId,"name":this.candidateList[i].candidateName};
          this.valuesList.push(data);
        }
        if (field == "candidateLocation") {
          if(this.candidateList[i].candidateLocation != null ){
            var data = {"id":this.candidateList[i].candidateId,"name":this.candidateList[i].candidateLocation};
            this.valuesList.push(data);
          }
        }
        if (field == "candidateOwner") {
          if(this.candidateList[i].createdBy != null ){
            var data = {"id":this.candidateList[i].candidateId,"name":this.candidateList[i].createdBy};
            this.valuesList.push(data);
          }
        }
       
          
      }
      this.valuesArray = Array.from(this.valuesList.reduce((m:any, t:any) => m.set(t.name, t), new Map()).values());
     
  }
}
