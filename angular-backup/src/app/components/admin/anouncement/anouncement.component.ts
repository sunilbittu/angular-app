import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-anouncement',
  templateUrl: './anouncement.component.html',
  styleUrls: ['./anouncement.component.css']
})
export class AnouncementComponent implements OnInit {
  public togglebtn: boolean = false;
  public announcementId: any;
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
  bsDatepickerConfig: Partial<BsDatepickerConfig>;
  bsDatepickerConfig1: Partial<BsDatepickerConfig>;

  constructor(private formBuilder: FormBuilder, private crudOperationsService: CrudOperationsService,
    private notification: NotifierService, private datePipe: DatePipe, private spinner: NgxSpinnerService) {
      this.bsDatepickerConfig = {
        isAnimated: true,
        dateInputFormat: 'DD-MM-YYYY',
        minDate: new Date(), 
      };
      this.bsDatepickerConfig1 = {
        isAnimated: true,
        dateInputFormat: 'DD-MM-YYYY',
        minDate: new Date(), 
      };
     }

  ngOnInit(): void {
    this.fetchAnnouncements();
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
    this.fetchAnnouncements();
  }

  public headers: any = ["Id", "Date", "Subject", "Anouncement", "From", "To", "Action"];
  announcementData: any="";
  AnnouncementaForm = this.formBuilder.group({
    announcementName: ["", Validators.required],
    announcementDate: ["", Validators.required],
    announcementSubject: ["", Validators.required],
    announcementFrom: ["", Validators.required],
    announcementTo: ["", Validators.required],
  })
  get form_() { return this.AnnouncementaForm.controls; };

  public searchModel="";
  fetchAnnouncements() {
    this.spinner.show();
    let api = "announcement/list?search="+this.searchModel+'&page='+this.pageNumber+'&size=10'; // + sessionStorage.getItem("companyId") + "/Announcement";
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.announcementData = data.data.content;
      this.handlePagination(data);
    },
      (error) => {
        this.spinner.hide();
        this.notification.notify('error', 'Something Went Worng');
      })
  }
  add() {
    this.togglebtn = true;
  }

  onSubmit() {
    this.submitted = true;
    if (this.AnnouncementaForm.valid) {
      this.AnnouncementaForm.value.company = { companyId: sessionStorage.getItem("companyId") };
      this.AnnouncementaForm.value.announcementType = "Announcement";
      this.crudOperationsService.create(this.AnnouncementaForm.value, "announcement").subscribe((data: any) => {
        this.clear();
        this.fetchAnnouncements();
      })
    }
  }

  onStartDateValueChange1(event: any) {
    this.AnnouncementaForm.value.announcementDate = this.datePipe.transform(event, 'dd-MM-yyyy');
  }
  onStartDateValueChange2(event: any) {
    this.AnnouncementaForm.value.announcementFrom = this.datePipe.transform(event, 'dd-MM-yyyy');
    console.log(event)
    if (event) {
      this.bsDatepickerConfig1 = {
        ...this.bsDatepickerConfig1,
        minDate: event 
      };
    }
  }
  onStartDateValueChange3(event: any) {
    this.AnnouncementaForm.value.announcementTo = this.datePipe.transform(event, 'dd-MM-yyyy');
  }

  editAnnnouncement(data: any) {
    console.log(data);

    this.togglebtn = false;
    this.announcementId = data.announcementId;
    this.AnnouncementaForm = this.formBuilder.group({
      announcementName: [data.announcementName, Validators.required],
      announcementDate: [this.datePipe.transform(data.announcementDate, 'dd-MM-yyyy'), Validators.required],
      announcementSubject: [data.announcementSubject, Validators.required],
      announcementFrom: [this.datePipe.transform(data.announcementFrom, 'dd-MM-yyyy'), Validators.required],
      announcementTo: [this.datePipe.transform(data.announcementTo, 'dd-MM-yyyy'), Validators.required]
    });
  }

  updateAnnouncements() {
    this.submitted = true;
    if (this.AnnouncementaForm.valid) {
      this.AnnouncementaForm.value.announcementDate = new Date(this.AnnouncementaForm.value.announcementDate);
      this.AnnouncementaForm.value.announcementFrom = new Date(this.AnnouncementaForm.value.announcementFrom);
      this.AnnouncementaForm.value.announcementTo = new Date(this.AnnouncementaForm.value.announcementTo);
      let api: any = "announcement/" + this.announcementId;
      this.AnnouncementaForm.value.company = { companyId: sessionStorage.getItem("companyId") };
      this.crudOperationsService.update(this.AnnouncementaForm.value, api).subscribe((data: any) => {
        this.fetchAnnouncements();
        this.togglebtn = true;
        this.clear();
      })
    }
  };
  removeAnnouncement(data: any) {
    this.announcementId = data.announcementId;
  }

  deleteAnnouncement() {
    let api: any = "announcement/" + this.announcementId;
    this.crudOperationsService.delete(api).subscribe((data: any) => {
      this.fetchAnnouncements();
    })
  }

  clear() {
    (<any>$('#myModal-add')).modal('hide');
    this.submitted = false;
    this.AnnouncementaForm.reset();
  }

}
