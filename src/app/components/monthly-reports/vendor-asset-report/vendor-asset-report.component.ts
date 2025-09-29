import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-vendor-asset-report',
  templateUrl: './vendor-asset-report.component.html',
  styleUrls: ['./vendor-asset-report.component.css']
})
export class VendorAssetReportComponent implements OnInit {

  public companyId = Number(sessionStorage.getItem('companyId'));
  public headers: any = ['Asset Name', 'Bar Code', 'Vendor Name', 'Actual Problem', 'Resolved Problem', 'Repair date', 'Amount'];
  public VendorDetailsList: any = [];
  public reportList: any = [];
  public statusList: any = ['Requested Asset', 'Repaired Closed Asset'];
  public statusModel: any = '';
  public submitted: any = false;
  public formData: any = {};

  public dropdownSettingsVendor = {
    singleSelection: false,
    idField: 'vendorId',
    textField: 'vendorName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 2,
    allowSearchFilter: false,
  };
  public selectedItems: any = [];

  constructor(private crudOperationsService: CrudOperationsService, private notification: NotifierService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.fetchVendors();
  }

  onSelectAllVendor(event: any) { };
  onItemSelectVendor(data: any) { };

  fetchVendors() {
    let api = "vendors/dropdownList?companyId=" + this.companyId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      if (data.data != null) {
        this.VendorDetailsList = data.data;
      }
    })
  }

  search() {
    this.submitted = true;
    let vendorIds = [];
    if (this.selectedItems.length > 0) {
      for (let i = 0; i < this.selectedItems.length; i++) {
        vendorIds.push(this.selectedItems[i].vendorId);
      }
    }
    if (vendorIds.length > 0 && this.statusModel) {
      this.reportList = [];
      this.spinner.show();
      this.formData = { "vendorIds": vendorIds, "status": this.statusModel };
      let url = 'repair-request/assetstatus_report/' + this.companyId;
      this.crudOperationsService.create(this.formData, url).subscribe((resp: any) => {
        this.reportList = resp.data;
        this.spinner.hide();
        this.submitted = false;
      }, (error) => {
        this.spinner.hide();
      });
    }
  }

  clear() {
    this.statusModel = '';
    this.selectedItems = [];
    this.reportList = [];
    this.formData = {};
    this.submitted = false;
  }

  exportTable(type: string) {
    //spinner show
    this.spinner.show();
    var fileType = '';
    let fileName='vendors-asset-report';
    if (type == 'EXCEL') {
      fileName=fileName+'.xls';
      fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }
    else {
      fileName=fileName+'.pdf';
      fileType = 'application/pdf';
    }

    let api: any = "reports/vendorAssetReport/" + this.companyId + "/" + type;
    this.crudOperationsService.downloadDocumentExpenseReport(api, this.formData)
      .subscribe((response: any) => {
        //spinner hide
        this.spinner.hide();
        let blob: any = new Blob([response], { type: fileType });
        const url = window.URL.createObjectURL(blob);
        if(type!='EXCEL'){
          window.open(url);
        }
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = fileName;

        anchor.click();
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
}
