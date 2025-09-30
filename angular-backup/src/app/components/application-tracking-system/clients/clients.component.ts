import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { ShareDataService } from 'src/app/services/sharaData.service';
import { AddEmployeeService } from '../../master/addEmplyee.service';
import { EmployeeMastersService } from '../../master/employee.masters.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService,
    public crudOperationsService: CrudOperationsService, private notification: NotifierService,
    public datePipe: DatePipe, private employeeService: AddEmployeeService,
    public shareService: ShareDataService, private router: Router,
    private employeMasterService: EmployeeMastersService) { }

  public headers: any = ['Client Name', 'Client Website', 'Client Industry', 'Client Location', 'Client Address', 'Client Created Date', 'Job Count', 'Client Owner', 'Client Team', 'Client Stage'];
  public jobHeaders: any = ['Position Name', 'Job Client', 'Job Location', 'Headcount', 'Minimum Salary', 'Maximum Salary', 'Job Owner', 'Job Team', 'Job Stage', 'Actions'];
  public attachmentHeader: any = ['Document Name', 'Document Type', 'Actions'];
  public teamMembersHeader: any = ['Name', 'Display Name', 'Last Active', 'Actions'];
  public contractinfoHeader: any = ['Contract Type', 'Contract Start Date', 'Contract End Date', 'PIC Info', 'Name', 'Desig', 'Tel', 'Mobile', 'Email', 'Terms of Business', 'payment terms', 'Warranty period', 'Status', 'Actions'];
  public stageList: any = ['Prospect', 'Lead', 'Engaged', 'Negotiation', 'Signed'];
  public tagsList: any = [{ color: 'red', name: 'Critical', selected: false }, { color: 'green', name: 'Difficult', selected: false },
  { color: 'yellow', name: 'Important', selected: false }, { color: 'pink', name: 'Open to foreigners', selected: false }];
  public companyId: any = Number(sessionStorage.getItem('companyId'));
  public employeeId: any = Number(sessionStorage.getItem('empId'));

  public contractDropdown: any = ['Fulltime', 'Part-time', 'Temporary', 'Freelance', 'Internship', 'Apprenticeship', 'Contractor', 'Consultancy'];
  public frequencyDropdown: any = ['Daily', 'Hourly', 'Weekly', 'Monthly', 'Yearly'];

  public Fields: any = [{ "name": "Client Name", "value": "clientName" }, { "name": "Client Website", "value": "clientWebsite" }, { "name": "Client Location", "value": "clientLocation" },
  { "name": "Client Owner", "value": "clientOwner" }, { "name": "Client Stage", "value": "clientStage" }, { "name": "Client ContactNumber", "value": "clientContactNumber" }];
  public Conditions: any = [{ "name": "is equal to", "value": "=" }, { "name": "contains", "value": "contains" }, { "name": "starts with", "value": "starts with" }, { "name": "ends with", "value": "ends with" }];
  public fieldModel: any = '';
  public conditionModel: any = '';
  public valueModel: any = [];
  public conditionsArray: any = [];

  public clientList: any = [];
  public valuesList: any = [];
  public jobList: any = [];
  public valuesArray: any = [];
  public clientEditTempObject: any = {};
  public attachmentsList: any = [];
  public clientContractDetails: any = {};
  public clientSummaryDetails: any = {};
  public teamMembersList: any = [];
  public contractinfoList: any = [];
  public showAdvancedOptions = false;
  public showConditionText = false;
  public showConditionDropdown = true;
  public showFilterModel = false;
  public showView: any = false;
  public employeeList: any = [];
  public searchValue: any = "";
  public tagSearchValue: any = "";
  public toggleLoader: boolean = false;
  public id: any;
  public jobid: any;
  public clientSearchModel = '';
  public selectedClientCount: number = 0;
  public jobSearchModel = '';
  public submitted: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public selectedFile: any;
  public imageFileName: any;
  public filePath: any;
  public fileSelected: boolean = false;
  public submitText = '';
  public submitTextJob = '';
  public api = 'client'
  public api_job = 'job'
  public submitProcessing = false;
  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure you want delete';
  public confirmClicked = false;
  public cancelClicked = false;
  public submitErrorText: any = '';
  public reg = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
  public clientForm = this.formBuilder.group({
    clientName: ['', Validators.required],
    clientWebsite: ['', Validators.compose([Validators.pattern(this.reg)])],
    clientLocation: [''],
    clientDescription: [''],
    file: [''],
  })

  public jobForm = this.formBuilder.group({
    positionName: ['', Validators.required],
    clientId: ['', Validators.required],
    headCount: [''],
    jobLocation: [''],
    contractDetails: [''],
    minSalary: [''],
    maxSalary: [''],
    currency: [''],
    frequency: [''],
    jobDescription: ['']
  })

  public jobsubmitted: boolean = false;
  public enableBulkAction: any = false;

  public contractform = this.formBuilder.group({
    contractType: [null],
    contractStartDate: [''],
    contractEndDate: [''],
    picInfo: [''],
    name: [''],
    designation: [''],
    tel: [''],
    mobile: [''],
    email: ['', Validators.compose([Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$')])],
    termsOfBusiness: [''],
    paymentTerms: [''],
    warrantyPeriod: [''],
    status: [null]
  });
  public contractSubmitted: any = false;
  get contractform_() { return this.contractform.controls; };

  get _form_contract() { return this.contractform.value };
  public contractList: any = [];
  public submitTextContract: any = 'Save';
  public contractType: any = ['Permanent', 'Hierarchy', 'Contract'];
  public statuses: any = ['Active', 'Completed'];
  public selectedStartDate: any;
  public selectedEndDate: any;
  public contractId: any = '';

  public clientName: any = '';
  public clientWebsite: any = '';
  public clientIndustry: any = '';
  public clientLocation: any = '';
  public clientAddress: any = '';
  public clientContactNumber: any = '';
  public clientDescription: any = '';
  public clientTagsList: any = [];

  public currencyList!: any[];

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
  public jobitemsPerPage: any = 20;
  public jobtotalItems: any;
  public jobcurrentPage: any;
  public jobtotalElements: number = 0;
  public jobshowingFrom: number = 0;
  public jobshowingTo: number = 0;
  public jobpageNumber: Number = 0;

  get form_() { return this.clientForm.controls; };

  get _form() { return this.clientForm.value };

  get jobform_() { return this.jobForm.controls; };

  get _formJob() { return this.jobForm.value };

  onItemSelectUser(data: any) { }
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

  ngOnInit(): void {
    this.getClients();
  }

  ngAfterViewInit(): void {
    this.fetchIndustries();
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
  getClients() {
    this.spinner.show();
    let api = 'client/list?companyId=' + this.companyId + '&search=' + this.clientSearchModel + '&username=' + localStorage.getItem("userName") + '&page=' + this.pageNumber + '&size=20&isArchived=false';;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.clientList = data.data.content;
      this.clientList.map(function (obj: any) {
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

  search() {
    this.getClients();
  }

  modelShow() {
    this.clear();
  }

  modelShowEdit(data: any) {
    this.submitted = false;
    this.submitText = 'Update';
    this.id = data.clientId;
    this.clientForm.reset();
    this.form_['clientName'].patchValue(data.clientName);
    this.form_['clientWebsite'].patchValue(data.clientWebsite);
    this.form_['clientLocation'].patchValue(data.clientLocation);
    this.form_['clientDescription'].patchValue(data.clientDescription);
    this.form_['file'].patchValue('');
    this.getImageFromService(data.filePath);
    this.selectedFile = data.filePath;
    (<any>$('#client-update-modal')).modal('show');
    this.showAdvancedOptions = true;
  }

  modelShowContractEdit(data: any) {
    this.submitTextContract = 'Update';
    this.contractSubmitted = false;
    this.contractId = data.id;
    this.contractform_['contractType'].patchValue(data.contractType);
    this.contractform_['contractStartDate'].patchValue(data.contractStartDate);
    this.contractform_['contractEndDate'].patchValue(data.contractEndDate);
    this.contractform_['picInfo'].patchValue(data.picInfo);
    this.contractform_['name'].patchValue(data.name);
    this.contractform_['designation'].patchValue(data.designation);
    this.contractform_['tel'].patchValue(data.tel);
    this.contractform_['mobile'].patchValue(data.mobile);
    this.contractform_['email'].patchValue(data.email);
    this.contractform_['termsOfBusiness'].patchValue(data.termsOfBusiness);
    this.contractform_['paymentTerms'].patchValue(data.paymentTerms);
    this.contractform_['warrantyPeriod'].patchValue(data.warrantyPeriod);
    this.contractform_['status'].patchValue(data.status);
    (<any>$('#contract-info-modal')).modal('show');
  }

  clientEdit() {
    this.modelShowEdit(this.clientEditTempObject);
  }

  downloadDocumentAttachment(filePath: string, fileName: string) {
    let downloadApi = 'client/document_download?filePath=' + filePath;
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

  submitContractInfo() {
    this.contractSubmitted = true;
    for (let el in this.contractform_) {
      if (this.contractform_[el].errors) {
        console.log(el)
      }
    }

    if (this.contractform.valid) {
      let formData = this.getContractFormData();
      if (this.submitTextContract !== 'Update') {
        this.saveContract(formData, 'client-contract');
      } else {
        this.updateContract(formData, 'client-contract' + `/${this.contractId}`);
      }
    }
  }
  updateContract(formData: any, api: string) {
    this.submitProcessing = true;
    this.crudOperationsService.update(formData, api)
      .subscribe((data: any) => {
        this.notification.notify('success', data.message);
        (<any>$('#contract-info-modal')).modal('hide');
        this.submitProcessing = false;
        this.getContractInfo();
        this.clearContract();
      },
        (_error) => {
          this.submitProcessing = false;
          this.notification.notify('error', 'Something Went Wrong')
        })
  }
  saveContract(formData: any, api: string) {
    let result = this.contractinfoList.filter((item: any) => item.status === 'Active');
    console.log(result, '>>>>')
    if (result.length > 0) {
      this.notification.notify('error', 'Active contract is already exist, you can\'t create a new Contract!');
    } else {
      this.submitProcessing = true;
      this.crudOperationsService.create(formData, api)
        .subscribe((data: any) => {
          this.notification.notify('success', data.message);
          (<any>$('#contract-info-modal')).modal('hide');
          this.submitProcessing = false;
          this.getContractInfo();
          this.clearContract();
        },
          (_error) => {
            this.submitProcessing = false;
            this.notification.notify('error', 'Something Went Wrong')
          })
    }
  }
  getContractFormData(): any {
    let companyId = {
      'companyId': this.companyId
    };
    let client = {
      'id': this.id
    }
    this._form_contract.client = client;
    this._form_contract.company = companyId;
    let data = this._form_contract;
    return data;
  }

  clearContract() {
    this.contractSubmitted = false;
    this.submitTextContract = 'Save';
    this.contractform.reset();
  }

  onStartDateValueChange(event: any) {
    this.selectedStartDate = new Date(event);
  }

  onEndDateValueChange(event: any) {
    this.selectedEndDate = new Date(event);
  }

  submit() {
    this.submitted = true;
    for (let el in this.form_) {
      if (this.form_[el].errors) {
        console.log(el)
      }
    }
    if (this.clientForm.valid) {
      let formData = this.setFormData();
      if (this.submitText !== 'Update') {
        this.save(formData, this.api);
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
        (<any>$('#client-update-modal')).modal('hide');
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
    this._form.companyId = companyId;
    let data = this._form;
    return data;
  }
  setFormData(): any {
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('clientDTO', JSON.stringify(this.getFormData()));
    return formData;
  }

  clear() {
    this.submitted = false;
    this.fileSelected = false;
    this.showAdvancedOptions = false;
    this.clientForm.reset();
    this.id = undefined;
    this.submitText = 'Create';
    this.clientForm.enable();
    this.imageSrc = '';
    this.selectedFile = '';
  }

  deleteDoc(fileName: any) {
    this.crudOperationsService.getList(this.api + '/deleteFile?id=' + this.id + '&fileName=' + fileName)
      .subscribe((data: any) => {
        this.notification.notify('success', 'File deleted successfully!');
        this.getAttachments();
      },
        (_error) => {
          this.notification.notify('error', 'Something Went Wrong')
        })
  }

  delete(id: number) {
    this.crudOperationsService.delete(this.api + `/${id}`).subscribe((data: any) => {
      this.notification.notify('success', data.message);
      this.ngOnInit();
    }, (error) => { this.notification.notify('error', 'something went wrong') })
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
    this.getClients();
  }

  handleAdvancedClick() {
    this.showAdvancedOptions = true;
  }

  showTeamMembers(id: any) {
    this.id = id;
    this.getTeamMembers();
  }

  handleClient(data: any) {
    this.showView = true;
    this.id = data.clientId;
    this.getImageFromService(data.filePath);
    this.getJobsByClient();
    this.getAttachments();
    this.getSummaryDetails();
    this.getTeamMembers();
    this.getContractInfo();
    this.clientEditTempObject = data;
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
  getContractInfo() {
    let api = 'client-contract/dropdownList?id=' + this.id;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.contractinfoList = data.data;
    },
      (error) => {
        console.log(error);
      })
  }
  getSummaryDetails() {
    let api = this.api + '/getSummaryDetails?id=' + this.id;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.clientSummaryDetails = data.data;
      this.clientName = this.clientSummaryDetails.clientName;
      this.clientWebsite = this.clientSummaryDetails.clientWebsite;
      this.clientIndustry = this.clientSummaryDetails.clientIndustry;
      this.clientLocation = this.clientSummaryDetails.clientLocation;
      this.clientAddress = this.clientSummaryDetails.clientAddress;
      this.clientContactNumber = this.clientSummaryDetails.clientContactNumber;
      this.clientDescription = this.clientSummaryDetails.clientDescription;
      this.clientTagsList = this.clientSummaryDetails.tags ? this.clientSummaryDetails.tags : [];
    },
      (error) => {
        console.log(error);
      })
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

  public tabType: any = 'Jobs';
  setType(type: any) {
    this.tabType = type;
  }

  public editSummaryDetailsEnable: boolean = false;
  public editSummaryDescriptionEnable: boolean = false;
  public selectedFile1: any;
  public submitted1 = false;

  handleEditSummaryDetails() {
    this.editSummaryDetailsEnable = !this.editSummaryDetailsEnable;
  }

  handleEditSummaryDescription() {
    this.editSummaryDescriptionEnable = !this.editSummaryDescriptionEnable;
  }

  cancelDescription() {
    this.editSummaryDescriptionEnable = false;
    this.getSummaryDetails();
  }

  cancelDetails() {
    this.editSummaryDetailsEnable = false;
    this.getSummaryDetails();
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

  addContractInfo() {
    this.clearContract();
  }

  applyFilter() {
    this.employeeList = [];
    var filterJson = {
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

      this.crudOperationsService.addTeamMembers(empList, this.id)
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

  updateSummaryDetails() {
    this.submitProcessing = true;
    let formData = {
      'clientName': this.clientName,
      'clientWebsite': this.clientWebsite,
      'clientIndustry': this.clientIndustry,
      'clientLocation': this.clientLocation,
      'clientAddress': this.clientAddress,
      'clientContactNumber': this.clientContactNumber,
      'clientDescription': this.clientDescription
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
    this.crudOperationsService.getList(this.api + '/deleteTeamMember?clientId=' + this.id + '&id=' + id).subscribe((data: any) => {
      this.notification.notify('success', 'Team Member Deleted Successfully!');
      this.getTeamMembers();
    }, (error) => { this.notification.notify('error', 'something went wrong') })
  }

  deleteContractInfo(id: number) {
    this.crudOperationsService.delete('client-contract/' + id).subscribe((data: any) => {
      this.notification.notify('success', 'Contract Info Deleted Successfully!');
      this.getContractInfo();
    }, (error) => { this.notification.notify('error', 'something went wrong') })
  }

  goBack() {
    this.showView = false;
    this.getClients();
  }

  setClientId(id: any) {
    this.id = id;
  }

  jobModalShow() {
    this.jobForm.reset();
    this.jobform_['clientId'].patchValue(this.id);
    this.jobform_['clientId'].disable();
    this.jobsubmitted = false;
    this.showAdvancedOptions = false;
    this.submitTextJob = 'Create';
  }

  submitJob() {
    this.jobsubmitted = true;
    for (let el in this.jobform_) {
      if (this.jobform_[el].errors) {
        console.log(el)
      }
    }
    if (this.jobForm.valid) {
      if (this.submitTextJob !== 'Update') {
        let formData = this.setJobFormData();
        this.saveJob(formData, this.api_job);
      } else {
        let formData = this.getJobFormData();
        this.updateJob(formData, this.api_job + `/${this.jobid}`);
      }
    }
  }
  updateJob(formData: any, api: string) {
    this.submitProcessing = true;
    this.crudOperationsService.update(formData, api)
      .subscribe((data: any) => {
        this.notification.notify('success', data.message);
        (<any>$('#job-add-modal')).modal('hide');
        this.submitProcessing = false;
        if (this.showView) {
          this.getJobsByClient();
        } else {
          this.getClients();
        }
        this.jobModalShow();
      },
        (_error) => {
          this.submitProcessing = false;
          this.notification.notify('error', 'Something Went Wrong')
        })
  }
  saveJob(formData: any, api: string) {
    this.submitProcessing = true;
    this.crudOperationsService.create(formData, api)
      .subscribe((data: any) => {
        this.notification.notify('success', data.message);
        (<any>$('#job-add-modal')).modal('hide');
        this.submitProcessing = false;
        if (this.showView) {
          this.getJobsByClient();
        } else {
          this.getClients();
        }
        this.jobModalShow();
      },
        (_error) => {
          this.submitProcessing = false;
          this.notification.notify('error', 'Something Went Wrong')
        })
  }
  getJobFormData(): any {
    let companyId = {
      'companyId': this.companyId
    };
    let clientId = {
      'id': this.id
    };
    this._formJob.companyId = companyId;
    this._formJob.clientId = clientId;
    this._formJob.isArchived = false;
    this._formJob.jobOwner = sessionStorage.getItem("firstName");
    let data = this._formJob;
    return data;
  }

  setJobFormData(): any {
    const formData = this.getJobFormData();
    return formData;
  }

  clearJob() {
    this.showAdvancedOptions = false;
    this.jobForm.reset();
    this.jobform_['clientId'].patchValue(this.id);
    this.jobform_['clientId'].disable();
    this.jobsubmitted = false;
  }

  modelShowEditJob(data: any) {
    this.jobsubmitted = false;
    this.submitTextJob = 'Update';
    this.jobid = data.id;
    this.jobForm.reset();
    this.jobform_['positionName'].patchValue(data.positionName);
    this.jobform_['clientId'].patchValue(data.clId);
    this.jobform_['headCount'].patchValue(data.headCount);
    this.jobform_['jobLocation'].patchValue(data.jobLocation);
    this.jobform_['contractDetails'].patchValue(data.contractDetails);
    this.jobform_['minSalary'].patchValue(data.minSalary);
    this.jobform_['maxSalary'].patchValue(data.maxSalary);
    this.jobform_['currency'].patchValue(data.currency);
    this.jobform_['frequency'].patchValue(data.frequency);
    this.jobform_['jobDescription'].patchValue(data.jobDescription);
    (<any>$('#job-add-modal')).modal('show');
    // this.fileSelected = true;
  }
  deleteJob(id: number) {
    this.crudOperationsService.delete(this.api_job + `/${id}`).subscribe((data: any) => {
      this.notification.notify('success', data.message);
      this.getJobsByClient();
    }, (error) => { this.notification.notify('error', 'something went wrong') })
  }

  getJobsByClient() {
    this.spinner.show();
    let api = this.api + '/getJobsByClient?id=' + this.id + '&companyId=' + this.companyId + '&search=' + this.jobSearchModel + '&page=' + this.jobpageNumber + '&size=20';
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.jobList = data.data.content;
      //pagination call
      this.jobhandlePagination(data);
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
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
    this.getJobsByClient();
  }

  searchjob() {
    this.getJobsByClient();
  }

  handleBulkAction() {
    const eItems = this.clientList.filter((item: any) => item.selected === true);
    this.enableBulkAction = eItems.length > 0 ? true : false;
    this.selectedClientCount = eItems.length;
  }

  onClickClientCheckBox(id: any) {
    this.validationText = '';
    const i = this.clientList.findIndex((obj: any) => obj.clientId == id);
    this.clientList[i].selected = !this.clientList[i].selected;
    this.handleBulkAction();
  }

  selectAllClient(event: any) {
    const checked = event.target.checked;
    this.validationText = '';
    this.clientList.forEach((item: any) => item.selected = checked);
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
      for (let i = 0; i < this.clientList.length; i++) {
        if (this.clientList[i].selected) {
          clList.push(this.clientList[i]);
        }
      }

      let tagList = [];
      for (let i = 0; i < this.tagsList.length; i++) {
        if (this.tagsList[i].selected) {
          tagList.push(this.tagsList[i]);
        }
      }

      this.crudOperationsService.addClientTags(clList, tagList)
        .subscribe((data: any) => {
          let response = data.data;
          this.notification.notify('success', response);
          (<any>$('#client-add-tag-bulk')).modal('hide');
          this.submitProcessing = false;
          this.clearTagsBulk();
          this.selectedClientCount = 0;
          this.enableBulkAction = false;
          this.getClients();
        },
          (_error) => {
            this.submitProcessing = false;
            this.notification.notify('error', 'Something Went Wrong')
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

    for (let i = 0; i < this.clientTagsList.length; i++) {
      let index = this.tagsList.findIndex((item: any) => item.name === this.clientTagsList[i].name);
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

      this.crudOperationsService.addClientIndividualTags(this.id, tagList)
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
    const eItems = this.clientList.filter((item: any) => item.selected === true);
    if (eItems.length > 0) {
      this.submitProcessing = true;
      let clList = [];
      for (let i = 0; i < this.clientList.length; i++) {
        if (this.clientList[i].selected) {
          clList.push(this.clientList[i]);
        }
      }
      this.crudOperationsService.clientArchive(clList)
        .subscribe((data: any) => {
          let response = data.data;
          this.notification.notify('success', response);
          (<any>$('#client-archive')).modal('hide');
          this.submitProcessing = false;
          this.enableBulkAction = false;
          this.getClients();
        },
          (_error) => {
            this.submitProcessing = false;
            this.notification.notify('error', 'Something Went Wrong')
          })
    } else {
      this.validationText = 'Please select atlease 1 Client(s).';
    }
  }

  addCondition(field: any, condition: any, value: any) {
   // alert(JSON.stringify(value));
   if(field=='' || condition=='' || value=='') return;
    if(this.showConditionText){
          this.valuesArray = [];
          this.valuesList = [];
          var data = { "id": 1, "name": value };
          this.valuesList.push(data);
          this.valuesArray = this.valuesList;
          value = this.valuesArray;
    }
    //alert(JSON.stringify(value));
    var conditionValue = '';
    if(field=='clientOwner')  field='createdBy';
    if (condition == 'contains') {

      for (var i = 1; i < value.length + 1; i++) {
        if (i == 1) conditionValue = '(lower(' + field + ") like '%" + value[i - 1].name.toLowerCase() + "%'";
        else conditionValue = conditionValue + " or " + 'lower(' + field + ") like '%" + value[i - 1].name.toLowerCase() + "%'";
      }
    } else if (condition == 'starts with') {

      for (var i = 1; i < value.length + 1; i++) {
        if (i == 1) conditionValue = '(lower(' + field + ") like '" + value[i - 1].name.toLowerCase() + "%'";
        else conditionValue = conditionValue + " or " + 'lower(' + field + ") like '" + value[i - 1].name.toLowerCase() + "%'";
      }
    } else if (condition == 'ends with') {
      for (var i = 1; i < value.length + 1; i++) {
        if (i == 1) conditionValue = '(lower(' + field + ") like '%" + value[i - 1].name.toLowerCase() + "'";
        else conditionValue = conditionValue + " or " + 'lower(' + field + ") like '%" + value[i - 1].name.toLowerCase() + "'";
      }
    } else {
      for (var i = 1; i < value.length + 1; i++) {
          if (i == 1) conditionValue = '(lower(' + field + ") " + condition + " '" + value[i - 1].name.toLowerCase() + "'";
          else conditionValue = conditionValue + " or " + 'lower(' + field + ") " + condition + " '" + value[i - 1].name.toLowerCase() + "'";
        }
     
    }
    conditionValue = conditionValue + " ) "
    this.conditionsArray.push(conditionValue);
  }
  applyConditionFilter() {
    var condition = '';
    for (var i = 0; i < this.conditionsArray.length; i++) {
      condition = condition.concat(" AND " + this.conditionsArray[i]);
    }
    var data = { "condition": condition };
    this.spinner.show();
    let api = 'client/findAllClientsByFilter' + `/${this.companyId}`;
    this.crudOperationsService.update(data, api).subscribe((data: any) => {
      this.spinner.hide();
      this.clientList = data.data;
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
    this.getClients();
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
    this.getClients();
  }
  getImageFromService(filePath: any) {
    this.isImageLoading = true;
    this.imageSrc = '';
    if (filePath) {
      let url = 'client/document_download?filePath=' + filePath;
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
      fileType = 'ClientReport.xls';
      let api: any = "reports/client/exportExcel/" + this.companyId + '/false?search=' + this.clientSearchModel;
      this.crudOperationsService.exportExcelReport2(api, fileType, obj)
    }
    else {
      fileType = 'ClientReport.pdf';
      let api: any = "reports/client/exportPDF/" + this.companyId + '/false?search=' + this.clientSearchModel;
      this.crudOperationsService.exportPDF2(api, fileType, obj)
    }
  }

  removeImage() {
    this.selectedFile = '';
    this.imageSrc = '';
  }

  onStageChange(event: any, id: any) {
    let formData = {
      'clientStage': event.target.value,
    }
    this.crudOperationsService.update(formData, this.api + `/updateStageDetails/${id}`)
      .subscribe((data: any) => {
        this.notification.notify('success', 'Details Updated Successfully!');
        this.submitProcessing = false;
        this.getClients();
      },
        (_error) => {
          this.submitProcessing = false;
          this.notification.notify('error', 'Something Went Wrong')
        })
  }

  viewJob(data: any) {
    this.shareService.changeMessage(data);
    this.router.navigateByUrl('HRMS/ATS/jobs');
  }

  public industryList: any = [];
  fetchIndustries() {
    let url = 'industry-master/dropdownList?id=' + this.companyId;
    this.crudOperationsService.getList(url).subscribe((data: any) => {
      this.industryList = data.data;
    },
      (error) => {
        this.notification.notify('error', 'Something went wrong!');
      })
  }

  onSorted($event: Event) {
    let data: any = $event;
    console.log("data ::: ", data)
    let sortedArray = (this.clientList || []).sort((a: any, b: any) => {
      if (a[data.sortColumn] > b[data.sortColumn]) {
        return (data.sortDirection === 'desc') ? 1 : -1;
      }
      if (a[data.sortColumn] < b[data.sortColumn]) {
        return (data.sortDirection === 'desc') ? -1 : 1;
      }
      return 0;
    })
    this.clientList = sortedArray;
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

  onFieldChange(event: any) {
    let field = event.target.value;
    this.valuesList = [];
    this.valuesArray = [];

    for (var i = 0; i < this.clientList.length; i++) {
      if (field == "clientName") {
        var data = { "id": this.clientList[i].clientId, "name": this.clientList[i].clientName };
        this.valuesList.push(data);
      }
      if (field == "clientWebsite") {
        if (this.clientList[i].clientWebsite != null) {
          var data = { "id": this.clientList[i].clientId, "name": this.clientList[i].clientWebsite };
          this.valuesList.push(data);
        }
      }
      if (field == "clientLocation") {
        if (this.clientList[i].clientLocation != null) {
          var data = { "id": this.clientList[i].clientId, "name": this.clientList[i].clientLocation };
          this.valuesList.push(data);
        }
      }
      if (field == "clientOwner") {
        if (this.clientList[i].createdBy != null) {
          var data = { "id": this.clientList[i].clientId, "name": this.clientList[i].createdBy };
          this.valuesList.push(data);
        }
      }
      if (field == "clientStage") {
        if (this.clientList[i].clientStage != null) {
          var data = { "id": this.clientList[i].clientId, "name": this.clientList[i].clientStage };
          this.valuesList.push(data);
        }
      }
      if (field == "clientContactNumber") {
        if (this.clientList[i].clientContactNumber != null) {
          var data = { "id": this.clientList[i].clientId, "name": this.clientList[i].clientContactNumber };
          this.valuesList.push(data);
        }
      }

    }
    this.valuesArray = Array.from(this.valuesList.reduce((m:any, t:any) => m.set(t.name, t), new Map()).values());

  }
}
