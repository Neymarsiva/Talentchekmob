import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { StorageService } from '../storage.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { TcFormPage } from '../tc-form/tc-form.page';
import { ConsentFormPage } from '../consent-form/consent-form.page';

@Component({
  selector: 'app-org-profile',
  templateUrl: './org-profile.page.html',
  styleUrls: ['./org-profile.page.scss'],
})
export class OrgProfilePage implements OnInit {

  docForm:FormGroup;
  industryList: any;
  orgTypeList: any;
  currentUserId: string;
  profileList: any;
  Orgdetails: any;
  showcountyResults : boolean = false;
  selectedCountry: any;
  countryResponse: any;
  stateResponse: any;
  searchResults: string[] = [];
  countrysearchCtrl = new FormControl('');
  cityOptions:any;
  countryVal: string;
countryIdVal:string;
  cityList:[]
  IsSearchListShow: boolean = false;
  stateResponseBackup: any;
  desiredItem: any;
//image
base64img1: string = '';
cBoxIAgreeVal: boolean = true;
cBoxIAgreeConsentVal: boolean = true;
  desiredcityItem: any;
  desiredstateItem: any;

  constructor(private fb: FormBuilder,public storageservice:StorageService,public modalController: ModalController,
    private camera: Camera, public router:Router,private toastController: ToastController) { }

  ngOnInit() {


    this.currentUserId = localStorage.getItem("userId");
    
    this.docForm = this.fb.group({
      orgName: ["", [Validators.required]],
      domain: [""],
      orgEmail: ['', [Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      orgMobile:["",[Validators.required]],
      cinReg: ["", [Validators.required]],
      dob:["", [Validators.required]], 
      size: ["",[Validators.required]],
      orgType: [""],
      taxId:[""],
      permAddress:[""],
      permCity:[""], 
      permState:[""],
      permCountry:[""],
     permPinCode:[""],
     // orgLogo: ["",[Validators.required]],
      details: ["",[Validators.required]],
      currentUserId:[""]
  })
this.OrgtypeList();
  this.domainList();
  

  this.getCountryList(); 
  this.editprofile();
}

profileView(){
  this.router.navigate(['/org-profile-view']);


}


///
//country list

getCountryList(){

  var countryURL = "api/auth/app/CommonUtility/countryList";
  const InsList = this.storageservice.getrequest(countryURL).subscribe(result => {
    this.countryResponse = result["countryList"];
    console.log(`countryResponse: ${JSON.stringify(this.countryResponse)}`);
  });
}


onCountrySearch(value: string) {
  if (value.length > 2) {
    this.showcountyResults = true;
    this.searchResults = this.countryResponse.filter(country => country.text.toLowerCase().indexOf(value.toLowerCase()) > -1);
  } else {
    this.showcountyResults = false;
    this.searchResults = [];
  }
}

selectcountry(contry: string,id:string) {
  this.selectedCountry = contry; 
  this.docForm.patchValue({
    'permCountry' : id
  })
   this.showcountyResults = false;
  this.searchResults = []; 
  this.getstatelist(id);
  this.countrysearchCtrl.setValue('');
}


removeCountry() {
  this.selectedCountry = undefined;
}


//state list
async getstatelist(CtryId): Promise<any> {

  console.log(CtryId)
  var industryURL = "api/auth/app/CommonUtility/stateList?countryId="+CtryId;
  this.storageservice.getrequest(industryURL).subscribe(result => {
    this.stateResponseBackup = result["stateList"];
    this.stateResponse = result["stateList"];
    console.log(`countryResponse: ${JSON.stringify(this.countryResponse)}`);
  });

  return industryURL;
}
///citylist
getcitylist(stateId,countryId){
 
  console.log(stateId)
  var industryURL = "api/auth/app/CommonUtility/cityList?countryId="+countryId +"&stateId="+stateId;
  this.storageservice.getrequest(industryURL).subscribe(result => {
   this.cityList = result['cityList'];
   this.cityOptions = result['cityList'];
  console.log(`cityList: ${JSON.stringify(this.cityOptions)}`);
   
});
}

goToSearchSelectedItem(CtryName, CtryId) {  
  this.countryVal = CtryName;
  this.countryIdVal = CtryId;
  this.IsSearchListShow = false;
  this.getstatelist(CtryId);
}

goTostateSelectedItem( stateId) {
  //var CtryId =this.talentorgform.value.countryId; 
  var CtryId=this.docForm.value.permCountry;
  this.getcitylist(stateId,CtryId);
}
//domainList 
domainList () {
  var industryListUrl = "api/auth/app/CommonUtility/industryList";
  this.storageservice.getrequest(industryListUrl).subscribe(result => {

    if (result["success"] == true) {
      this.industryList = result["industryList"];
      console.log(`industryList: ${JSON.stringify(this.industryList)}`);
    }
  });
}

//OrgtypeList 
OrgtypeList () {
  var orgTypeListUrl = "api/auth/app/CommonUtility/orgTypeList";
  this.storageservice.getrequest(orgTypeListUrl).subscribe(result => {

    if (result["success"] == true) {
      this.orgTypeList = result["orgTypeList"];
      console.log(`orgTypeList: ${JSON.stringify(this.orgTypeList)}`);
    }
  });
}

//editprofileDetails 
editprofile(){

  var EditprofileDetails = "api/auth/app/OrganizationProfileDetails/orgeditprofiledetails?currentUserId="+this.currentUserId ;
  this.storageservice.getrequest(EditprofileDetails).subscribe(result => {
  
    
    if (result["success"] == true) {
this.getCountryList();
      
      this.searchForId(result["profileList"][0].permCountry); 
      this.selectedCountry = this.desiredItem.text;

      this.getstatelist(result["profileList"][0].permCountry);
       
      this.getcitylist(result["profileList"][0].permState,result["profileList"][0].permCountry)
      this.profileList = result["profileList"]; 
     }
    this.docForm.patchValue({
      
      'orgName':this.profileList[0].orgName,
      'domain':this.profileList[0].domain,
      'orgEmail':this.profileList[0].orgEmail,
      'orgMobile':this.profileList[0].orgMobile,
      'cinReg':this.profileList[0].cinReg,
       'dob':this.profileList[0].dob,
      'size':this.profileList[0].size,
      'orgType':this.profileList[0].orgType,
      'taxId':this.profileList[0].taxId,
      'details':this.profileList[0].details,
      'permAddress':this.profileList[0].permAddress,
        'permCity':this.profileList[0].permCity,
         'permState':this.profileList[0].permState,
        // 'permCountry':this.profileList[0].this.desiredItem.text,
         'permPinCode':this.profileList[0].permPinCode,
     'languagesknown':this.profileList[0].languagesknown,
    })

  })
}

///profileDetails  Update
async Update(){
  const errors = this.checkFormValidity(this.docForm);

  if (errors.length > 0) {
    // Display errors in a popup
    const alert = await this.toastController.create({
    
      message: 'Please provide all the required values!',
      duration: 3000,
    });

    await alert.present();
  } else{
    this.docForm.value.dob =formatDate(this.docForm.value.dob, 'yyyy/MM/dd','en-IN');
    this.docForm.value.currentUserId=this.currentUserId;
    this.Orgdetails = this.docForm.value;
    console.log(` data: ${JSON.stringify(this.Orgdetails)}`);
    var updateprofile = "api/auth/app/mobile/orgupdateProfile";
  
     this.storageservice.postrequest(updateprofile, this.Orgdetails).subscribe(result => {  
        console.log("Image upload response: " + result)
       if (result["success"] == true) {
      
        this.presentToast()
        }
     });
}
  
}

async presentToast() {
  const toast = await this.toastController.create({
    message: 'Saved Successfully',
    duration: 3000,
    cssClass: 'custom-toast'
  });
  this.router.navigate(['/org-profile-view']);
await toast.present();
}
checkFormValidity(form: FormGroup): string[] {
  const errors: string[] = [];
  
  // Check each form control for errors
  Object.keys(form.controls).forEach(key => {
    const controlErrors: ValidationErrors = form.controls[key].errors;
    if (controlErrors != null) {
      Object.keys(controlErrors).forEach(keyError => {
        errors.push(`${key} ${keyError}`);
      });
    }
  });

  return errors;
}

searchForId(id: string) {
  this.desiredItem = null;
  for (const item of  this.countryResponse ) {
    if (item.id === id) {
      this.desiredItem = item; 
      break;
    }
  }
  if (this.desiredItem === null) {
    console.log('Item not found');
  } else {
    console.log(this.desiredItem.text); 
  }
}
searchstateId(id: string) {
  this.desiredstateItem = null;
  for (const item of this.stateResponse  ) {
    if (item.id === id) {
      this.desiredstateItem = item; 
      break;
    }
  }
  if (this.desiredstateItem === null) {
    console.log('Item not found');
  } else {
    console.log(this.desiredstateItem.text); 
  }
}
searchcityId(id: string) {
  this.desiredcityItem = null;
  for (const item of  this.cityOptions ) {
    if (item.id === id) {
      this.desiredcityItem = item; 
      break;
    }
  }
  if (this.desiredcityItem === null) {
    console.log('Item not found');
  } else {
    console.log(this.desiredcityItem.text); 
  }
}

////img 

////image
opengallery() {
  const options: CameraOptions = {
    quality: 70,
    destinationType: this.camera.DestinationType.DATA_URL,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    saveToPhotoAlbum: false
  }
  this.camera.getPicture(options).then((ImageData => {
    this.base64img1 = "data:image/jpeg;base64," + ImageData;
  }), error => {
    console.log(error);
  })

}

opencamera() {
  const options: CameraOptions = {
    quality: 70,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }
  this.camera.getPicture(options).then((ImageData => {
    this.base64img1 = "data:image/jpeg;base64," + ImageData;
  }), error => {
    console.log(error);
  })
}

openTCForm() {
  this.goto_TCFormModal();
}
async goto_TCFormModal() {

  const modal = await this.modalController.create({
    component: TcFormPage,
    cssClass: 'my-custom-class'
  });


  modal.onDidDismiss().then((dataReturned) => {
    if (dataReturned !== null) {

      //#region Getting values from popup
      console.table("One: " + dataReturned);
      var IsAgree = dataReturned.data["IsAgree"];
      console.log("IsAgree: " + IsAgree);
      //#endregion

      if (IsAgree == "Yes") {
        this.cBoxIAgreeVal = true;
      }
      else if (IsAgree == "No") {
        this.cBoxIAgreeVal = false;
      }
    }
  });

  return await modal.present();
}

openConsentForm() {
  this.goto_ConsentFormModal();
}

async goto_ConsentFormModal() {

  const modal = await this.modalController.create({
    component: ConsentFormPage,
    cssClass: 'my-custom-class'
  });

  modal.onDidDismiss().then((dataReturned) => {
    if (dataReturned !== null) {

      //#region Getting values from popup
      console.table("One: " + dataReturned);
      var IsAgree = dataReturned.data["IsAgree"];
      console.log("IsAgree: " + IsAgree);
      //this.storageservice.warningToast('Modal Sent Data :' + dataReturned);
      //#endregion

      if (IsAgree == "Yes") {
        this.cBoxIAgreeConsentVal = true;
      }
      else if (IsAgree == "No") {
        this.cBoxIAgreeConsentVal = false;
      }
    }
  });

  return await modal.present();
}
}