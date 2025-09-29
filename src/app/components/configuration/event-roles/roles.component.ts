import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { EmployeeMastersService } from '../../master/employee.masters.service';
declare var $: any;
@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class EventRolesComponent implements OnInit {
  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure you want delete';
  public cancelClicked: boolean = false;
  public headers: any = ["Role Name", "Description", "Action"];
  public exist2: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public submitted: boolean = false;
  public roleMastersForm!: FormGroup;
  public editButtonEnable!: boolean;
  public roleList!: any[];
  public roleObject!: any;
  public roleId!: any;
  public roleMasterList!: any[];

  public companyId!: number;
  public permissionRoleName: any;
  public permissionRoleId: any;
  public permissionsList: any[] = [];
  public destinationPermissionsList: any[] = [];
  public tempDestinationPermissionsList: any[] = [];
  public submitted2: boolean = false;
  public allSelectedInPermissions: boolean = false;
  public selectedList: any[] = [];
  public permissionsInStringFormat: any = "";
  public isFormValuesSame: any;
  public searchItem: any;
  public toggleLoader: any;
  public searchInput: any;
  public toggleLoaderDestination: any;
  public checkIfalreadyExist: any;
  originalPermissionList: any;
  originalRestrictionList: any;
  constructor(private formBuilder: FormBuilder, private employeMasterService: EmployeeMastersService,
    private notification: NotifierService, private crudOperationsService: CrudOperationsService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    console.log(this.editButtonEnable, "editbutton value")
    this.roleMastersForm = this.formBuilder.group({

      roleName: ['', Validators.required],
      roleDescreption: ['', Validators.required],

    })

    //get role list
    this.fetchRoleList();
  }
  get form_() { return this.roleMastersForm.controls; };
  //clear form values
  modelShow() {
    console.log(this.editButtonEnable, "editbutton value")

    this.exist2 = false;
    this.roleMastersForm.reset();
    //hide edit button
    this.editButtonEnable = false;

  }

  //get role list
  fetchRoleList() {
    //getting companyId from session-storage
    this.spinner.show();
    this.companyId = Number(sessionStorage.getItem('companyId'));
    let api: any = "roles/eventRolesList?companyId=" + this.companyId;
    this.crudOperationsService.getList(api)
      .subscribe((data: any) => {
        this.spinner.hide();
        this.roleList = data.data;
      },
        (error) => {
          this.spinner.hide();
          this.notification.notify('error', 'Something Went Worng');
        })
  }

  checkIfalreadyExist2() {
    console.log(this.editButtonEnable, "editbutton value")
    let typedCode = this.roleMastersForm.value.roleName;
    if (this.editButtonEnable == true) {

      let roleList2: any[] = this.roleList.filter(y => y.roleId != this.roleId);

      let code: any[] = roleList2.filter(
        x => x.roleName.toLowerCase() == typedCode.toLowerCase());

      if (code.length > 0) {
        this.exist2 = true;
      } else {
        this.exist2 = false;
      }
    } else {
      let code: any[] = this.roleList.filter(
        x => x.roleName.toLowerCase() == typedCode.toLowerCase());

      if (code.length > 0) {
        this.exist2 = true;
      } else {
        this.exist2 = false;
      }
    }
  }
  //update role master
  updateRoleMaster(id: number) {
    console.log(this.editButtonEnable, "editbutton value")
    this.submitted = true;

    if (this.roleMastersForm.valid == true && this.exist2 == false) {

      this.roleObject =
      {

        "roleId": this.roleId,
        "roleName": this.roleMastersForm.value.roleName,
        "roleDescreption": this.roleMastersForm.value.roleDescreption,
        "remarks":"event",
        // "company":{
        //     "companyId":  this.companyId
        // }

      }
      let api: any = "roles/" + this.roleId;
      this.crudOperationsService.update(this.roleObject, api)
        .subscribe((data: any) => {
          this.submitted = false;

          this.notification.notify('success', data.message);
          $('#rolePopup').modal('hide');
          //get role list
          this.fetchRoleList();
        }
          ,
          (error) => {
            this.notification.notify('error', 'Something Went Worng');
          })

    }
  }
  //delete roleMaster
  deleteRoleById(id: number) {
    console.log(this.editButtonEnable, "editbutton value")
    let api: any = "roles/";
    this.crudOperationsService.delete2(id, api)
      .subscribe((data: any) => {
        this.notification.notify('success', data.message);
        //get role list
        this.fetchRoleList();
      }
        ,
        (error: any) => {
          this.spinner.hide();
          let erroe: any = error.error.message;
          this.notification.notify("error", erroe);
        })
  }

  //append form controls
  editRole(data: any) {
    console.log(this.editButtonEnable, "editbutton value")
    //show edit button
    this.editButtonEnable = true;

    this.roleId = data.roleId;
    let api: any = "roles/" + this.roleId;
    this.roleMastersForm.patchValue({
      roleName: data.roleName,
      roleDescreption: data.roleDescreption,

    })

  }
  //submit form data
  onSubmit() {

    this.submitted = true;
    this.companyId = Number(sessionStorage.getItem('companyId'));
    if (this.roleMastersForm.valid == true && this.exist2 == false) {
      this.roleObject =
      {
        "roleName": this.roleMastersForm.value.roleName,
        "roleDescreption": this.roleMastersForm.value.roleDescreption,
        "remarks":"event",
        "company": {
          "companyId": this.companyId
        }
      }
      let api: any = "roles";
      this.crudOperationsService.create(this.roleObject, api)
        .subscribe((data: any) => {
          this.notification.notify('success', data.message);
          this.submitted = false;
          $('#rolePopup').modal('hide');
          //get role list
          this.fetchRoleList();
        }, (error) => {
          $('#rolePopup').modal('hide');
          error instanceof HttpErrorResponse
          console.log(error)
          if (error.error.status == 406) {
            this.notification.notify('error', 'RoleName/RoleCode Already Exits');
          }
          else {
            this.notification.notify('error', 'Something Went Wrong');
          }
        })
    }
  }

  getRolePermissionDetails(t: any) {
    this.permissionsList = [];
    this.destinationPermissionsList = [];
    this.permissionRoleName = t.roleName;
    this.permissionRoleId = t.roleId;
    let api2: any = "roles/" + this.permissionRoleId;
    this.crudOperationsService.getList(api2).subscribe((resp: any) => {
      this.originalPermissionList = resp.data.restircted;
      for (let i = 0; i < this.originalPermissionList.length; i++) {
        let obj: any = {
          "id": i,
          "permission": this.originalPermissionList[i]
        }
        this.permissionsList.push(obj);
      }
      this.originalRestrictionList = resp.data.permissions;
      for (let i = 0; i < this.originalRestrictionList.length; i++) {
        let obj: any = {
          "id": this.originalPermissionList.length + i,
          "permission": this.originalRestrictionList[i]
        }
        this.destinationPermissionsList.push(obj);
      }
    })
  }

  selectAll(event: any) {
    const checked = event.target.checked;
    this.permissionsList.forEach((item: any) => item.selected = checked);
  }

  onClickCheckBox(data: any) {
    const i = this.permissionsList.findIndex((obj: any) => obj.id == data.id);
    this.permissionsList[i].selected = !this.permissionsList[i].selected;
  }

  addRight() {
    const eItems = this.permissionsList.filter((item: any) => item.selected === true);
    if (eItems.length > 0) {
      eItems.forEach((element: any) => {
        this.destinationPermissionsList.push(element);
        this.tempDestinationPermissionsList.push(element);
        if (this.permissionsList.indexOf(element) != -1) {
          this.permissionsList.splice(this.permissionsList.indexOf(element), 1);
          this.destinationPermissionsList.map(function (obj: any) {
            obj.selected = false;
          })
        }
      });
      console.log(this.destinationPermissionsList)
    }

  }

  addLeft() {
    const eItems = this.destinationPermissionsList.filter((item: any) => item.selected === true);
    if (eItems.length > 0) {
      eItems.forEach((element: any) => {
        this.permissionsList.push(element);
        if (this.permissionsList.indexOf(element) != -1) {
          this.destinationPermissionsList.splice(this.destinationPermissionsList.indexOf(element), 1);
          this.permissionsList.map(function (obj: any) {
            obj.selected = false;
          })
        }
      });

    }

  }

  onClickCheckBoxDestination(data: any) {
    const i = this.destinationPermissionsList.findIndex((obj: any) => obj == data);
    this.destinationPermissionsList[i].selected = !this.destinationPermissionsList[i].selected;
  }
  update() {
    this.submitted2 = true;
    let employeeIdList = [];
    this.permissionsInStringFormat = '';

    if (this.destinationPermissionsList.length > 0) {
      for (let i = 0; i < this.destinationPermissionsList.length; i++) {
        this.permissionsInStringFormat = this.permissionsInStringFormat.concat(this.destinationPermissionsList[i].permission).concat(",");
      }
    } else {
      this.permissionsInStringFormat = null;
    }
    var filterJson = {
      "roleId": this.permissionRoleId,
      "rolePermissions": this.permissionsInStringFormat
    }
    let api = 'roles/' + this.permissionRoleId;
    this.crudOperationsService.update(filterJson, api)
      .subscribe((data: any) => {
        this.notification.notify('success', data.message);
        this.submitted = false;
        //get role list
        this.fetchRoleList();
        $('#rolePermission_modal').modal('hide');
      },
        (error) => {
          this.notification.notify('error', error.error.message);
        })
  }

  clear() {
    this.permissionsList = [];
    let api: any = "employee/getAllPermissions";
    this.crudOperationsService.getList(api).subscribe((resp: any) => {
      let array1: any[] = resp.data;
      for (let i = 0; i < array1.length; i++) {
        let obj: any = {
          "id": i,
          "permission": array1[i]
        }
        this.permissionsList.push(obj);
      }

    })
    this.destinationPermissionsList = [];
  }

  onClick() {
    this.submitted2 = false;
    this.clear();
  }

  selectAllDestination(event: any) {
    const checked = event.target.checked;
    this.destinationPermissionsList.forEach((item: any) => item.selected = checked);
  }
}
