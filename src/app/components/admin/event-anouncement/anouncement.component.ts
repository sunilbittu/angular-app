import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-anouncement',
  templateUrl: './anouncement.component.html',
  styleUrls: ['./anouncement.component.css']
})
export class EventAnouncementComponent implements OnInit {
  public togglebtn: boolean = false;
  public announcementId: any;
  public submitted: boolean = false;
  public toDay = new Date();

  constructor(private formBuilder: FormBuilder, private crudOperationsService: CrudOperationsService,
    private notification: NotifierService, private datePipe: DatePipe, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.fetchAnnouncements();
  }

  public headers: any = ["Event Name", "Place", "From", "To", "Action"];
  public announcementData: any;
  AnnouncementaForm = this.formBuilder.group({
    announcementName: ["", Validators.required],
    announcementDate: [""],
    announcementSubject: ["", Validators.required],
    announcementFrom: ["", Validators.required],
    announcementTo: ["", Validators.required],
  })
  get form_() { return this.AnnouncementaForm.controls; };
  fetchAnnouncements() {
    this.spinner.show();
    let api = "announcement/" + sessionStorage.getItem("companyId") + "/Event";
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.announcementData = data.data;
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
    this.AnnouncementaForm.value.announcementDate = new Date();
    this.submitted = true;
    if (this.AnnouncementaForm.valid) {
     
      this.AnnouncementaForm.value.remarks = "event";
      this.AnnouncementaForm.value.company = { companyId: sessionStorage.getItem("companyId") };
      this.AnnouncementaForm.value.announcementType = "Event";
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
      this.AnnouncementaForm.value.remarks = "event";
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
