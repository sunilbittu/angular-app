import { ElementRef } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { ConfigurationService } from '../../configuration/configuration.service';
import { CompanyService } from '../company.service';

@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html',
  styleUrls: ['./edit-company.component.css']
})
export class EditCompanyComponent implements OnInit {
  @ViewChild('fileInput') fileInput: any;
  @ViewChild('attachFile') attachFile: any;
  attendanceMonths: any = ['Normal Month', 'Previous Month', '26-25', '21-20'];
  softwareStartMonths: any = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  options: any = [{ key: 'No', value: false }, { key: 'Yes', value: true }];
  attendanceYears: any = ['Calender', 'Financial'];
  public countryList: any = [];
  public stateList: any = [];
  public cityList: any = [];
  public countryId = '';
  public stateId: any;
  public cityId: any;
  public cityData: any;
  public companyId: any;
  public companyData: any = [];
  public attendenceYearModel: string = this.attendanceYears[0];
  public softwareStartMonthModel: string = this.softwareStartMonths[0];
  public attendenceMonthModel = this.attendanceMonths[0];
  public companyLogoData: any = [];
  public companyDocuments: any = [];
  public companyPayslipFormatModal: any;
  public companySalarySheetVerticalModal: any;
  public allowDaysPresentManualModal: boolean = false;
  public stopSalaryProcessIncaseOfHoldModal: boolean = false;
  public weekOfMinusModal: boolean = false;
  public divisionWiseReportModal: boolean = false;
  public markLeaveWithTimeProcessModal: boolean = false;
  public minusWeekoffFromJoinLeftAbsentModal: boolean = false;
  public adhaarNoMandatoryModal: boolean = false;
  public panNoMandatoryModal: boolean = false;
  public duplicateEmployeeModal: boolean = false;
  public showClientCodeModal: boolean = false;
  public showCshowTaDaDeatilsButtonReimbursementlientCodeModal: boolean = false;
  public enableDrugFoodLicenseModal: boolean = false;
  public divisionDaysModal: boolean = false;
  public enableAttendanceCycleModal: boolean = false;
  public coPlusApprovalModal: boolean = false;
  public considerNextDayShiftForWeekoffModal: boolean = false;
  public enableMissPunchModuleModal: boolean = false;
  public approveWithoutRemarksModal: boolean = false;
  public displayGradeInEssProfileModal: boolean = false;
  public allowPreviousMontLeaveApproveModal: boolean = false;
  public checkDuplicateEmployeeCodeModal: boolean = false;
  public enableEmployeeCheckerModal: boolean = false;
  public enableSalaryStructureCheckerModal: boolean = false;
  public calculateShortNoticeDedutionSeparatelyModal: boolean = false;
  public enableGroupDateJoiningModal: boolean = false;
  public commonReportingHeadModal: boolean = false;
  public reimbApproverSelectionModal: boolean = false;
  public exitClearenceModal: boolean = false;
  public allowLeaveApplicationMobileAppModal: boolean = false;
  public checkOdForConveyenceReimbModal: boolean = false;
  public shortLeaveOptionHourModal: boolean = false;
  public commonQueryHandlerModal: boolean = false;
  public enableOdReimbModal: boolean = false;
  public odMandatoryFieldModal: boolean = false;
  public enableFeedbackModal: boolean = false;
  public attendCodeSameAsEmployeeCodeModal: boolean = false;
  public defaultAbsentModal: boolean = false;
  public payslipYtdAmountModal: boolean = false;
  public insertGatepassInLogsModal: boolean = false;
  public companyLogoImage = 'assets/images/user-avatar.png';
  public companyLogoImageName = '';
  public docImage: string = '';
  public updateAlert: boolean = false;
  public advSettingData: any = [];
  public logoUploaded: boolean = false;
  public documentsUpdated: boolean = false;
  public settingsUpdated: boolean = false;
  public advSettingsUpdated: boolean = false;
  public submitted: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  isCompanyExist: any;

  constructor(public fb: FormBuilder, public configurationService: ConfigurationService, 
    private crudOperationsService: CrudOperationsService, public companyService: CompanyService,
    private notification: NotifierService) {
  }
  public form = this.fb.group({
    companyName: [this.companyData.companyName, Validators.required],
    line1: ["", Validators.required],
    line2: [""],
    city: ["", Validators.required],
    pinCode: ["", Validators.required],
    panNumber: [""],
    email: [""],
    attendenceMonth: [this.attendanceMonths[0]],
    softwareStartMonth: [this.softwareStartMonths[0], Validators.required],
    softwareStartYear: ["2021", Validators.required],
    pfRegistrationNumber: [""],
    regionalOffice: [""],
    pfGroup: [""],
    codeStartAt: [1],
    suffix: [""],
    prefix: [""],
    state: ["", Validators.required],
    country: ["", Validators.required],
    contactNumber: ["", Validators.required],
    companyWebsite: ["", Validators.required],
    attendenceYear: [this.attendanceYears[0], Validators.required],
    companyCode: ["", Validators.required],
    esicRegistrationNo: [""],
    localOffice: [""],
    principleEmployer: [""],
    designation: [""],
    cbaeCode: [""],
    mbaeCode: [""],
  });
  get form_() { return this.form.controls; };

  public docform = this.fb.group({
    companyDocumentName: ["", Validators.required],
    documentTypeName: ["", Validators.required],
    companyDocumentsRemarks: [""]
  });
  get docform_() { return this.docform.controls; };

  public settingForm = this.fb.group({
    confirmationAfter: ["", Validators.required],
    leaveEncash: ["", Validators.required],
    noticePeriod: ["", Validators.required],
    totalAbsentMultiplyWith: ["", Validators.required],
    companyPayslipFormat: ["", Validators.required],
    companySalarySheetVertical: ["", Validators.required],
    allowDaysPresentManual: ["", Validators.required],
    stopSalaryProcessIncaseOfHold: ["", Validators.required],
    weekOfMinus: ["", Validators.required],
    divisionWiseReport: ["", Validators.required],
    markLeaveWithTimeProcess: ["", Validators.required],
    minusWeekoffFromJoinLeftAbsent: ["", Validators.required],
    adhaarNoMandatory: ["", Validators.required],
    panNoMandatory: ["", Validators.required],
    duplicateEmployee: ["", Validators.required],
    showClientCode: ["", Validators.required],
    showCshowTaDaDeatilsButtonReimbursementlientCode: ["", Validators.required],
    enableDrugFoodLicense: ["", Validators.required],
    divisionDays: ["", Validators.required],
    enableAttendanceCycle: ["", Validators.required],
    coPlusApproval: ["", Validators.required],
    considerNextDayShiftForWeekoff: ["", Validators.required],
    enableMissPunchModule: ["", Validators.required],
    approveWithoutRemarks: ["", Validators.required],
    displayGradeInEssProfile: ["", Validators.required]
  });

  public advSettingForm = this.fb.group({
    allowPreviousMontLeaveApprove: ["", Validators.required],
    checkDuplicateEmployeeCode: ["", Validators.required],
    enableEmployeeChecker: ["", Validators.required],
    enableSalaryStructureChecker: ["", Validators.required],
    enableGroupDateJoining: ["", Validators.required],
    commonReportingHead: ["", Validators.required],
    reimbApproverSelection: ["", Validators.required],
    exitClearence: ["", Validators.required],
    allowLeaveApplicationMobileApp: ["", Validators.required],
    checkOdForConveyenceReimb: ["", Validators.required],
    shortLeaveOptionHour: ["", Validators.required],
    commonQueryHandler: ["", Validators.required],
    enableOdReimb: ["", Validators.required],
    odMandatoryField: ["", Validators.required],
    enableFeedback: ["", Validators.required],
    attendCodeSameAsEmployeeCode: ["", Validators.required],
    defaultAbsent: ["", Validators.required],
    payslipYtdAmount: ["", Validators.required],
    coLapseDays: ["", Validators.required],
    coHcoCredit: ["", Validators.required],
    tdsApprover: ["", Validators.required],
    calculateShortNoticeDedutionSeparately: ["", Validators.required],
    insertGatepassInLogs: ["", Validators.required]
  });

  ngOnInit(): void {
    this.companyId = sessionStorage.getItem("companyId");
    this.fetchCompanyById(this.companyId);
    this.fetchCompaniesLogo(this.companyId);
    this.fetchCountries();

  }
  fetchCompanyById(companyId: any) {
    this.configurationService.fetchCompanyById(companyId).subscribe((res: any) => {
      this.companyData = res.data;
      console.log('res.data', res.data);
      this.setFormValue(res.data);
    })
  }

  setFormValue(data: any) {
    this.form.controls['companyName'].setValue(data.companyName);
    this.form.controls['line1'].setValue(data.line1);
    this.form.controls['line2'].setValue(data.line2);
    this.form.controls['panNumber'].setValue(data.panNumber);
    this.form.controls['email'].setValue(data.email);
    this.form.controls['attendenceMonth'].setValue(data.attendenceMonth);
    this.form.controls['softwareStartMonth'].setValue(data.softwareStartMonth);
    this.form.controls['pfRegistrationNumber'].setValue(data.pfRegistrationNumber);
    this.form.controls['regionalOffice'].setValue(data.regionalOffice);
    this.form.controls['pfGroup'].setValue(data.pfGroup);
    this.form.controls['codeStartAt'].setValue(data.codeStartAt);
    this.form.controls['suffix'].setValue(data.suffix);
    this.form.controls['prefix'].setValue(data.prefix);
    this.form.controls['contactNumber'].setValue(data.contactNumber);
    this.form.controls['companyWebsite'].setValue(data.companyWebsite);
    this.form.controls['attendenceYear'].setValue(data.attendenceYear);
    this.form.controls['companyCode'].setValue(data.companyCode);
    this.form.controls['esicRegistrationNo'].setValue(data.esicRegistrationNo);
    this.form.controls['localOffice'].setValue(data.localOffice);
    this.form.controls['principleEmployer'].setValue(data.principleEmployer);
    this.form.controls['designation'].setValue(data.designation);
    this.form.controls['cbaeCode'].setValue(data.cbaeCode);
    this.form.controls['mbaeCode'].setValue(data.mbaeCode);

    console.log(data.city);
    if (data.city != null) {
      this.form.controls['state'].setValue(data.city.state.name);
      this.form.controls['country'].setValue(data.city.state.country.name);
      this.form.controls['city'].setValue(data.city.name);
      this.form.controls['pinCode'].setValue(data.city.pincode);
    }
    this.cityData = data.city;
    this.countryId = this.cityData.state.country.countryId;
    this.stateId = this.cityData.state.stateId;
    this.cityId = this.cityData.cityId;
    this.fetchCountries();
    this.fetchStates();
    this.fetchCities();
  }

  saveCompany() {
    this.submitted = true;
    if (!this.isCompanyExist && this.form.valid) {
    this.form.value.city = this.cityData;
    this.configurationService.updateCompany(Number(this.companyData.companyId), this.form.value).subscribe((res: any) => {
      if (res.status == "success") {
        this.submitted = false;
        this.notification.notify('success', 'Company Details Updated Successfully!');
      }
    })
  }
  }

  check() {
    this.isCompanyExist = false;
    let api = 'company/validate?name=' + this.form.value.companyName;
    this.crudOperationsService.validate(api)
      .subscribe((data: any) => {
        this.isCompanyExist = data;
      },
        (_error: any) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }

  fetchCountries() {
    this.configurationService.fetchCountries().subscribe((res: any) => {
      this.countryList = res.data.content;
    })
  }

  fetchStates() {
    this.configurationService.fetchStates(this.countryId).subscribe((res: any) => {
      this.stateList = res.data;
    })
  }
  fetchCities() {
    this.configurationService.fetchCities(this.stateId).subscribe((res: any) => {
      this.cityList = res.data;
    })
  }
  changeCountry() {
    this.stateList = [];
    this.cityList = [];
    this.fetchStates();
  }
  changeState() {
    this.cityList = [];
    this.fetchCities();
  }
  changeCity() {
    const index = this.cityList.findIndex((x: any) => x.cityId == this.cityId);
    this.cityData = this.cityList[index];
    this.form.controls['pinCode'].setValue(this.cityData.pincode);
  }

  documentsUpload() {
    this.toggleLoader = true;
    this.companyService.fetchDocuments(this.companyId).subscribe((res: any) => {
      this.toggleLoader = false;
      this.companyDocuments = res.data;
    })
  }
  @ViewChild('attachFile')
  myInputVariable!: ElementRef;
  public toggleLoader: boolean = false;
  public submittedDoc = false;
  public docModel: any = '';
  saveDocument() {
    this.submittedDoc = true;
    const fileBrowser = this.attachFile.nativeElement;
    if (this.docform.valid && fileBrowser.files && fileBrowser.files[0]) {
      const formData = new FormData();
      formData.append('attachedFile', fileBrowser.files[0]);
      formData.append('id', this.companyId);
      formData.append('documentName', this.form.value.companyDocumentName);
      formData.append('documentType', this.form.value.documentTypeName);
      formData.append('remarks', this.form.value.companyDocumentsRemarks);
      this.companyService.saveDocument(formData).subscribe((res: any) => {
        if (res.status == "success") {
          this.resetDocumentForm();
          this.notification.notify('success', 'Document Added Successfully!');
          this.documentsUpload();
        }
      })
    }
  }
  resetDocumentForm() {
    this.submittedDoc = false;
    this.docModel ='';
    this.form.controls['companyDocumentName'].setValue('');
    this.form.controls['documentTypeName'].setValue('');
    this.form.controls['companyDocumentsRemarks'].setValue('');
    this.myInputVariable.nativeElement.value = '';
  }
  saveSetting() {
    console.log(this.form);
  }
  setting() {

  }
  saveAdvSetting() {
    if (this.advSettingsUpdated) {
      this.advSettingForm.value.company = this.companyData;
      this.companyService.updateAdvSetting(Number(this.advSettingData.companyConfigurations1Id), this.advSettingForm.value).subscribe((res: any) => {
        if (res.status == "success") {
          window.scroll(0, 0);
          this.updateAlert = true;
          this.fetchAdvSetting();
          setTimeout(() => {
            this.updateAlert = false;
          }, 4000);
        }
      })
    } else {
      this.advSettingForm.value.company = this.companyData;
      this.companyService.saveAdvSetting(this.advSettingForm.value).subscribe((res: any) => {
        if (res.status == "success") {
          window.scroll(0, 0);
          this.updateAlert = true;
          this.fetchAdvSetting();
          setTimeout(() => {
            this.updateAlert = false;
          }, 4000);
        }
      })
    }
  }
  advSetting() {
    this.fetchAdvSetting();
  }
  public toggleAdvLoader: boolean = false;
  fetchAdvSetting() {
    this.toggleAdvLoader = true;
    this.companyService.fetchAdvSetting(this.companyId).subscribe((res: any) => {
      this.toggleAdvLoader = false;
      this.advSettingData = res.data;
      if (this.advSettingData.companyConfigurations1Id != null) {
        this.advSettingsUpdated = true;
        this.setAdvSettingFormvalue(this.advSettingData);
      }
    })
  }
  setAdvSettingFormvalue(data: any) {
    this.advSettingForm.controls['allowPreviousMontLeaveApprove'].setValue(data.allowPreviousMontLeaveApprove);
    this.advSettingForm.controls['checkDuplicateEmployeeCode'].setValue(data.checkDuplicateEmployeeCode);
    this.advSettingForm.controls['enableEmployeeChecker'].setValue(data.enableEmployeeChecker);
    this.advSettingForm.controls['enableSalaryStructureChecker'].setValue(data.enableSalaryStructureChecker);
    this.advSettingForm.controls['enableGroupDateJoining'].setValue(data.enableGroupDateJoining);
    this.advSettingForm.controls['commonReportingHead'].setValue(data.commonReportingHead);
    this.advSettingForm.controls['reimbApproverSelection'].setValue(data.reimbApproverSelection);
    this.advSettingForm.controls['exitClearence'].setValue(data.exitClearence);
    this.advSettingForm.controls['allowLeaveApplicationMobileApp'].setValue(data.allowLeaveApplicationMobileApp);
    this.advSettingForm.controls['checkOdForConveyenceReimb'].setValue(data.checkOdForConveyenceReimb);
    this.advSettingForm.controls['shortLeaveOptionHour'].setValue(data.shortLeaveOptionHour);
    this.advSettingForm.controls['commonQueryHandler'].setValue(data.commonQueryHandler);
    this.advSettingForm.controls['enableOdReimb'].setValue(data.enableOdReimb);
    this.advSettingForm.controls['odMandatoryField'].setValue(data.odMandatoryField);
    this.advSettingForm.controls['enableFeedback'].setValue(data.enableFeedback);
    this.advSettingForm.controls['attendCodeSameAsEmployeeCode'].setValue(data.attendCodeSameAsEmployeeCode);
    this.advSettingForm.controls['defaultAbsent'].setValue(data.defaultAbsent);
    this.advSettingForm.controls['payslipYtdAmount'].setValue(data.payslipYtdAmount);
    this.advSettingForm.controls['coLapseDays'].setValue(data.coLapseDays);
    this.advSettingForm.controls['coHcoCredit'].setValue(data.coHcoCredit);
    this.advSettingForm.controls['tdsApprover'].setValue(data.tdsApprover);
    this.advSettingForm.controls['calculateShortNoticeDedutionSeparately'].setValue(data.calculateShortNoticeDedutionSeparately);
    this.advSettingForm.controls['insertGatepassInLogs'].setValue(data.insertGatepassInLogs);

    this.allowDaysPresentManualModal = data.allowDaysPresentManual;
    this.stopSalaryProcessIncaseOfHoldModal = data.stopSalaryProcessIncaseOfHold;
    this.weekOfMinusModal = data.weekOfMinus;
    this.divisionWiseReportModal = data.divisionWiseReport;
    this.markLeaveWithTimeProcessModal = data.markLeaveWithTimeProcess;
    this.minusWeekoffFromJoinLeftAbsentModal = data.minusWeekoffFromJoinLeftAbsent;
    this.adhaarNoMandatoryModal = data.adhaarNoMandatory;
    this.panNoMandatoryModal = data.panNoMandatory;
    this.duplicateEmployeeModal = data.duplicateEmployee;
    this.showClientCodeModal = data.showClientCode;
    this.showCshowTaDaDeatilsButtonReimbursementlientCodeModal = data.showCshowTaDaDeatilsButtonReimbursementlientCode;
    this.enableDrugFoodLicenseModal = data.enableDrugFoodLicense;
    this.divisionDaysModal = data.divisionDays;
    this.enableAttendanceCycleModal = data.enableAttendanceCycle;
    this.coPlusApprovalModal = data.coPlusApproval;
    this.considerNextDayShiftForWeekoffModal = data.considerNextDayShiftForWeekoff;
    this.enableMissPunchModuleModal = data.enableMissPunchModule;
    this.approveWithoutRemarksModal = data.approveWithoutRemarks;
    this.displayGradeInEssProfileModal = data.displayGradeInEssProfile;
    this.allowPreviousMontLeaveApproveModal = data.allowPreviousMontLeaveApprove;
    this.checkDuplicateEmployeeCodeModal = data.checkDuplicateEmployeeCode;
    this.enableEmployeeCheckerModal = data.enableEmployeeChecker;
    this.enableSalaryStructureCheckerModal = data.enableSalaryStructureChecker;
    this.calculateShortNoticeDedutionSeparatelyModal = data.calculateShortNoticeDedutionSeparately;
    this.enableGroupDateJoiningModal = data.enableGroupDateJoining;
    this.commonReportingHeadModal = data.commonReportingHead;
    this.reimbApproverSelectionModal = data.reimbApproverSelection;
    this.exitClearenceModal = data.exitClearence;
    this.allowLeaveApplicationMobileAppModal = data.allowLeaveApplicationMobileApp;
    this.checkOdForConveyenceReimbModal = data.checkOdForConveyenceReimb;
    this.shortLeaveOptionHourModal = data.shortLeaveOptionHour;
    this.commonQueryHandlerModal = data.commonQueryHandler;
    this.enableOdReimbModal = data.enableOdReimb;
    this.odMandatoryFieldModal = data.odMandatoryField;
    this.enableFeedbackModal = data.enableFeedback;
    this.attendCodeSameAsEmployeeCodeModal = data.attendCodeSameAsEmployeeCode;
    this.defaultAbsentModal = data.defaultAbsent;
    this.payslipYtdAmountModal = data.payslipYtdAmount;
    this.insertGatepassInLogsModal = data.insertGatepassInLogs;
    this.companyPayslipFormatModal = data.companyPayslipFormat;
    this.companySalarySheetVerticalModal = data.companySalarySheetVertical;
  }
  changeAttendanceMonth() {
    this.form.controls['attendenceMonth'].setValue(this.attendenceMonthModel);
  }
  changeSoftwareStartMonth() {
    this.form.controls['softwareStartMonth'].setValue(this.softwareStartMonthModel);
  }
  changeAttendanceYear() {
    this.form.controls['attendenceYear'].setValue(this.attendenceYearModel);
  }

  public submittedLogo = false;
  public logoModel: any = '';
  uploadLogo() {
    this.submittedLogo = true;
    const fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      const formData = new FormData();
      formData.append('uploadFile', fileBrowser.files[0]);
      formData.append('id', this.companyId);
      formData.append('path', this.companyId);
      if (this.companyLogoData.length > 0) {
        console.log('if');
        formData.append('companyLogoId', this.companyLogoData[0].companyLogoId);
        this.companyService.updateLogoPath(formData).subscribe((res: any) => {
          if (res.status == "success") {
            this.submittedLogo = false;
            this.logoModel = '';
            this.notification.notify('success', 'Company Logo Updated Successfully!');
            this.fetchCompaniesLogo(this.companyId);
          }
        })
      } else {
        console.log('else');
        this.companyService.uploadLogoPath(formData).subscribe((res: any) => {
          if (res.status == "success") {
            this.submittedLogo = false;
            this.logoModel = '';
            this.notification.notify('success', 'Company Logo Updated Successfully!');
            this.fetchCompaniesLogo(this.companyId);
          }
        })
      }
    }
  }

  fetchCompaniesLogo(companyId: any) {
    this.companyService.fetchCompaniesLogo(companyId).subscribe((res: any) => {
      this.companyLogoData = res.data;
      if (this.companyLogoData.length > 0) {
        this.companyLogoImage = 'data:image/jpeg;base64,' + this.companyLogoData[0].logoData;
        this.companyLogoImageName = this.companyLogoData[0].fileName;
      }
    })
  }

  changeAllowDaysPresentManual() {
    this.settingForm.controls['allowDaysPresentManual'].setValue(!this.allowDaysPresentManualModal);
    this.allowDaysPresentManualModal = !this.allowDaysPresentManualModal;
  }
  changeStopSalaryProcessIncaseOfHold() {
    this.settingForm.controls['stopSalaryProcessIncaseOfHold'].setValue(!this.stopSalaryProcessIncaseOfHoldModal);
    this.stopSalaryProcessIncaseOfHoldModal = !this.stopSalaryProcessIncaseOfHoldModal;
  }
  changeWeekOfMinus() {
    this.settingForm.controls['weekOfMinus'].setValue(!this.weekOfMinusModal);
    this.weekOfMinusModal = !this.weekOfMinusModal;
  }
  changeDivisionWiseReport() {
    this.settingForm.controls['divisionWiseReport'].setValue(!this.divisionWiseReportModal);
    this.divisionWiseReportModal = !this.divisionWiseReportModal;
  }
  changeMarkLeaveWithTimeProcess() {
    this.settingForm.controls['markLeaveWithTimeProcess'].setValue(!this.markLeaveWithTimeProcessModal);
    this.markLeaveWithTimeProcessModal = !this.markLeaveWithTimeProcessModal;
  }
  changeMinusWeekoffFromJoinLeftAbsent() {
    this.settingForm.controls['minusWeekoffFromJoinLeftAbsent'].setValue(!this.minusWeekoffFromJoinLeftAbsentModal);
    this.minusWeekoffFromJoinLeftAbsentModal = !this.minusWeekoffFromJoinLeftAbsentModal;
  }
  changeAadhaarNoMandatory() {
    this.settingForm.controls['adhaarNoMandatory'].setValue(!this.adhaarNoMandatoryModal);
    this.adhaarNoMandatoryModal = !this.adhaarNoMandatoryModal;
  }
  changePanNoMandatory() {
    this.settingForm.controls['panNoMandatory'].setValue(!this.panNoMandatoryModal);
    this.panNoMandatoryModal = !this.panNoMandatoryModal;
  }
  changeDuplicateEmployee() {
    this.settingForm.controls['duplicateEmployee'].setValue(!this.duplicateEmployeeModal);
    this.duplicateEmployeeModal = !this.duplicateEmployeeModal;
  }
  changeShowClientCode() {
    this.settingForm.controls['showClientCode'].setValue(!this.showClientCodeModal);
    this.showClientCodeModal = !this.showClientCodeModal;
  }
  changeShowCshowTaDaDeatilsButtonReimbursementlientCode() {
    this.settingForm.controls['showCshowTaDaDeatilsButtonReimbursementlientCode'].setValue(!this.showCshowTaDaDeatilsButtonReimbursementlientCodeModal);
    this.showCshowTaDaDeatilsButtonReimbursementlientCodeModal = !this.showCshowTaDaDeatilsButtonReimbursementlientCodeModal;
  }
  changeEnableDrugFoodLicense() {
    this.settingForm.controls['enableDrugFoodLicense'].setValue(!this.enableDrugFoodLicenseModal);
    this.enableDrugFoodLicenseModal = !this.enableDrugFoodLicenseModal;
  }
  changeDivisionDays() {
    this.settingForm.controls['divisionDays'].setValue(!this.divisionDaysModal);
    this.divisionDaysModal = !this.divisionDaysModal;
  }
  changeEnableAttendanceCycle() {
    this.settingForm.controls['enableAttendanceCycle'].setValue(!this.enableAttendanceCycleModal);
    this.enableAttendanceCycleModal = !this.enableAttendanceCycleModal;
  }
  changeCoPlusApproval() {
    this.settingForm.controls['coPlusApproval'].setValue(!this.coPlusApprovalModal);
    this.coPlusApprovalModal = !this.coPlusApprovalModal;
  }
  changeConsiderNextDayShiftForWeekoff() {
    this.settingForm.controls['considerNextDayShiftForWeekoff'].setValue(!this.considerNextDayShiftForWeekoffModal);
    this.considerNextDayShiftForWeekoffModal = !this.considerNextDayShiftForWeekoffModal;
  }
  changeEnableMissPunchModule() {
    this.settingForm.controls['enableMissPunchModule'].setValue(!this.enableMissPunchModuleModal);
    this.enableMissPunchModuleModal = !this.enableMissPunchModuleModal;
  }
  changeApproveWithoutRemarks() {
    this.settingForm.controls['approveWithoutRemarks'].setValue(!this.approveWithoutRemarksModal);
    this.approveWithoutRemarksModal = !this.approveWithoutRemarksModal;
  }

  changeDisplayGradeInEssProfile() {
    this.settingForm.controls['displayGradeInEssProfile'].setValue(!this.displayGradeInEssProfileModal);
    this.displayGradeInEssProfileModal = !this.displayGradeInEssProfileModal;
  }
  changeAllowPreviousMontLeaveApprove() {
    this.advSettingForm.controls['allowPreviousMontLeaveApprove'].setValue(!this.allowPreviousMontLeaveApproveModal);
    this.allowPreviousMontLeaveApproveModal = !this.allowPreviousMontLeaveApproveModal;
  }
  changeCheckDuplicateEmployeeCode() {
    this.advSettingForm.controls['checkDuplicateEmployeeCode'].setValue(!this.checkDuplicateEmployeeCodeModal);
    this.checkDuplicateEmployeeCodeModal = !this.checkDuplicateEmployeeCodeModal;
  }
  changeEnableEmployeeChecker() {
    this.advSettingForm.controls['enableEmployeeChecker'].setValue(!this.enableEmployeeCheckerModal);
    this.enableEmployeeCheckerModal = !this.enableEmployeeCheckerModal;
  }
  changeEnableSalaryStructureChecker() {
    this.advSettingForm.controls['enableSalaryStructureChecker'].setValue(!this.enableSalaryStructureCheckerModal);
    this.enableSalaryStructureCheckerModal = !this.enableSalaryStructureCheckerModal;
  }
  changeCalculateShortNoticeDedutionSeparately() {
    this.advSettingForm.controls['calculateShortNoticeDedutionSeparately'].setValue(!this.calculateShortNoticeDedutionSeparatelyModal);
    this.calculateShortNoticeDedutionSeparatelyModal = !this.calculateShortNoticeDedutionSeparatelyModal;
  }
  changeEnableGroupDateJoining() {
    this.advSettingForm.controls['enableGroupDateJoining'].setValue(!this.enableGroupDateJoiningModal);
    this.enableGroupDateJoiningModal = !this.enableGroupDateJoiningModal;
  }
  changeCommonReportingHead() {
    this.advSettingForm.controls['commonReportingHead'].setValue(!this.commonReportingHeadModal);
    this.commonReportingHeadModal = !this.commonReportingHeadModal;
  }
  changeReimbApproverSelection() {
    this.advSettingForm.controls['reimbApproverSelection'].setValue(!this.reimbApproverSelectionModal);
    this.reimbApproverSelectionModal = !this.reimbApproverSelectionModal;
  }
  changeExitClearence() {
    this.advSettingForm.controls['exitClearence'].setValue(!this.exitClearenceModal);
    this.exitClearenceModal = !this.exitClearenceModal;
  }
  changeAllowLeaveApplicationMobileApp() {
    this.advSettingForm.controls['allowLeaveApplicationMobileApp'].setValue(!this.allowLeaveApplicationMobileAppModal);
    this.allowLeaveApplicationMobileAppModal = !this.allowLeaveApplicationMobileAppModal;
  }
  changeCheckOdForConveyenceReimb() {
    this.advSettingForm.controls['checkOdForConveyenceReimb'].setValue(!this.checkOdForConveyenceReimbModal);
    this.checkOdForConveyenceReimbModal = !this.checkOdForConveyenceReimbModal;
  }

  changeShortLeaveOptionHour() {
    this.advSettingForm.controls['shortLeaveOptionHour'].setValue(!this.shortLeaveOptionHourModal);
    this.shortLeaveOptionHourModal = !this.shortLeaveOptionHourModal;
  }
  changeCommonQueryHandler() {
    this.advSettingForm.controls['commonQueryHandler'].setValue(!this.commonQueryHandlerModal);
    this.commonQueryHandlerModal = !this.commonQueryHandlerModal;
  }
  changeEnableOdReimb() {
    this.advSettingForm.controls['enableOdReimb'].setValue(!this.enableOdReimbModal);
    this.enableOdReimbModal = !this.enableOdReimbModal;
  }
  changeOdMandatoryField() {
    this.advSettingForm.controls['odMandatoryField'].setValue(!this.odMandatoryFieldModal);
    this.odMandatoryFieldModal = !this.odMandatoryFieldModal;
  }
  changeEnableFeedback() {
    this.advSettingForm.controls['enableFeedback'].setValue(!this.enableFeedbackModal);
    this.enableFeedbackModal = !this.enableFeedbackModal;
  }
  changeAttendCodeSameAsEmployeeCode() {
    this.advSettingForm.controls['attendCodeSameAsEmployeeCode'].setValue(!this.attendCodeSameAsEmployeeCodeModal);
    this.attendCodeSameAsEmployeeCodeModal = !this.attendCodeSameAsEmployeeCodeModal;
  }
  changeDefaultAbsent() {
    this.advSettingForm.controls['defaultAbsent'].setValue(!this.defaultAbsentModal);
    this.defaultAbsentModal = !this.defaultAbsentModal;
  }
  changePayslipYtdAmount() {
    this.advSettingForm.controls['payslipYtdAmount'].setValue(!this.payslipYtdAmountModal);
    this.payslipYtdAmountModal = !this.payslipYtdAmountModal;
  }
  changeInsertGatepassInLogs() {
    this.advSettingForm.controls['insertGatepassInLogs'].setValue(!this.insertGatepassInLogsModal);
    this.insertGatepassInLogsModal = !this.insertGatepassInLogsModal;
  }
  changeCompanyPayslipFormat() {
    this.advSettingForm.controls['companyPayslipFormat'].setValue(!this.companyPayslipFormatModal);
    this.companyPayslipFormatModal = !this.companyPayslipFormatModal;
  }
  changeCompanySalarySheetVertical() {
    this.advSettingForm.controls['companySalarySheetVertical'].setValue(!this.companySalarySheetVerticalModal);
    this.companySalarySheetVerticalModal = !this.companySalarySheetVerticalModal;
  }

  docImageView(doc: any) {
    this.docImage = 'data:image/jpeg;base64,' + doc.documentData;
  }
}
