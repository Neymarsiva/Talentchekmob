import { formatDate } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import moment from 'moment';
import { StorageService } from '../storage.service';
import { ProfileViewPage as ProfilePage} from '../profile-view/profile-view.page';

@Component({
  selector: 'app-club',
  templateUrl: './club.page.html',
  styleUrls: ['./club.page.scss'],
})
export class ClubPage implements OnInit {
  name: string;

//   public model = {
//     placeholder: '<p>Hello, world!</p>'
// };
  getMaxDate() {
    let maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 10);
    return maxDate.toISOString().split('T')[0];
  }

  clubFrom: FormGroup;
  organisationList: any;
  IsorgListShow: boolean = false;
  organisationVal: any;
  club: any;
  userId: any;
  Extracurricular: any;
  clubid: any;
  isunregIns: boolean;
  unregisteredIns: string;
  searchCtrl = new FormControl('');
  searchOrganisationResults: any;
  selectedOrganisation: any;
  extracurricularBean: any;
  edit: boolean = false;
  disabled: boolean =false;
  desiredItem: any;
  nonMandatory: boolean= false; 
  constructor(public router: Router, public fb: FormBuilder,private route: ActivatedRoute,public modalController: ModalController,
     public storageservice: StorageService, private toastController: ToastController,private elementRef: ElementRef
     ,public alertController: AlertController,) { }
    
  ngOnInit() {

    this.clubFrom = this.fb.group({
       clubName: [""],
      clubBranch: [""],
      titleHeld: [""],
      rolePlayed: [""],
      participatedFrom: ["",Validators.required],
      participatedTill: ["",Validators.required],
      currentMember: [""],
      extId: [""],
      checked: [""],
      unregisteredClub: [""],
      currentUserId: [""]
    });

    this.getOrganisationList();

    //var listConstant = this.initializeItems();

    this.userId = localStorage.getItem("userId");

    this.route.queryParams.subscribe(params => {
      if (params) { 
        if (params != null || params != undefined ) {  
            this.editextracurricular(params.id); 
          console.log(params);
        }
      }
    });

  }



  selectedTab: string = 'profile';

  setSelectedTab(tabName: string) {
    this.selectedTab = tabName;
  }
  

 //  Organisation auto complete 
 onSearchOrganisation(value: string) {
  if (value.length > 0) {

    if(this.isunregIns == false){
      this.unregisteredIns = value ;
    }
    this.isunregIns = false;
    this.IsorgListShow = true;
    this.searchOrganisationResults = this.organisationList.filter(Organisation => Organisation.text.toLowerCase().indexOf(value.toLowerCase()) > -1);
 
    if (this.searchOrganisationResults == 0) {
      this.IsorgListShow = false;
      this.clubFrom.patchValue({
      'clubName':value

      })
    }
    else {
      this.IsorgListShow = true;
    }
 
  } else {
    this.IsorgListShow = false;
    this.searchOrganisationResults = [];
  }
}

selectOrganisation(institutionName: string,id:string) {
  this.selectedOrganisation = institutionName;
  this.name=institutionName;
  this.IsorgListShow = false;
  this.clubid = id;
  this.clubFrom.patchValue({
    'clubName':this.clubid
  })
  this.searchOrganisationResults = [];
  this.searchCtrl.setValue('');
}

getOrganisationList(){
  var organisationListUrl = "api/auth/app/IndividualProfileDetails/organisationList";
  this.storageservice.getrequest(organisationListUrl).subscribe(result => {
   if (result["success"] == true) {
    this.organisationList = result["organisationList"]; 
    }
 });
}
 

 removeOrganisation(selectedOrganisation: string) {
  this.selectedOrganisation = undefined;
}



///
//validate dates
  async validateEndDate(event){
    var startdate = new Date(new Date(this.clubFrom.value.participatedFrom).setFullYear(new Date(this.clubFrom.value.participatedFrom).getFullYear())); //Currentdate - one year.
    console.log("startdate: " + startdate);
    console.log("enddate: " + event);
    var frm = new Date(new Date(event).setHours(new Date(event).getHours() + 0));
    if (frm <= startdate) {
      const alert = await this.toastController.create({
        header: '',
        message: 'Participated Till date should be greater than Participated From date.',
        duration: 3000,
      });
      this.clubFrom.patchValue({
        'participatedTill':""
      })
       await alert.present();
    }
  }


  async validateStartDate(event){

    if(this.clubFrom.value.participatedTill != undefined){
      var endDate = new Date(new Date(this.clubFrom.value.participatedTill).setFullYear(new Date(this.clubFrom.value.participatedTill).getFullYear())); //Currentdate - one year.
      console.log("endDate: " + endDate);
      console.log("startDate: " + event);
      var frm = new Date(new Date(event).setHours(new Date(event).getHours() + 0));
      if (endDate <= frm) {
        const alert = await this.toastController.create({
          header: '',
          message: 'Participated Till date should be greater than Participated From date.',
          duration: 3000,
        });
         await alert.present();
      }
    }
    
  }

  validationForCurMember(event){
    var value  = event;
    if(value == true){
      this.nonMandatory = true
      this.clubFrom.get("participatedTill").disable(); 
      this.clubFrom.patchValue({
          'participatedTill':""
        })
    }else{
      this.nonMandatory = false
      this.clubFrom.get("participatedTill").enable();
    }
  }
  

  getTitle(bookId) {
    var value;
    this.organisationList.forEach(element => {
      if (element.id === bookId) {
        value = element.text;
        this.unregisteredIns = "";
        this.isunregIns = true;
      }
    });
    return value;
  }
  certifications() {
    this.router.navigate(['/profile/addCertifications'])
  }
  connections() {
    this.router.navigate(['/profile/addConnections'])
  }

  async Save() { 
    if(this.clubFrom.value.clubName != ""){
      const errors = this.checkFormValidity(this.clubFrom); 
      if (errors.length > 0) {
        // Display errors in a popup
        const alert = await this.toastController.create({
         
          message: 'Please provide all the required values!',
          duration: 3000,
        });
    
        await alert.present();
      } else{
  
        if(this.unregisteredIns == ""){
          this.clubFrom.value.unregisteredClub = this.clubid;
         }else{
          this.clubFrom.value.unregisteredClub = this.unregisteredIns;
         }
  
         this.clubFrom.value.participatedFrom =formatDate(this.clubFrom.value.participatedFrom, 'dd/MM/yyyy','en-IN');
         if(this.clubFrom.value.participatedTill != undefined){
         this.clubFrom.value.participatedTill =formatDate(this.clubFrom.value.participatedTill, 'dd/MM/yyyy','en-IN');          
         }
         this.clubFrom.value.currentUserId = this.userId;
         this.clubFrom.value.clubName =  this.name; 
         this.Extracurricular = this.clubFrom.value;
         console.log(` data: ${JSON.stringify(this.Extracurricular)}`);
         var saveperonalinfo = "api/auth/app/IndividualProfileDetails/saveExtracurricular";
     
         this.storageservice.postrequest(saveperonalinfo, this.Extracurricular).subscribe(result => {
     
           if (result["success"] == true) {
            // setTimeout(() => {
            //   const profilePage = new ProfilePage(this.router, this.storageservice, this.elementRef, this.modalController, this.alertController);
            //  profilePage.updateData();
            // }, 800);
             this.presentToast()

             
             let edit = {
              clubId:result["extracurricularBean"].clubId,
              extId:result["extracurricularBean"].extId,
           }
           let navigationExtras: NavigationExtras = {
             queryParams: edit
           };
            this.router.navigate(['/activity-verification'],navigationExtras)
    
           }
         });
    
    } 
    }else{
      this.presentToast1();
    }
  }
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Saved Successfully',
      duration: 3000,
      cssClass: 'custom-toast'
     
    });
    

    await toast.present();
  }

  async presentToast1() {
    const toast = await this.toastController.create({
      message: 'Name of the Club/Association is required',
      duration: 3000,
      cssClass: 'custom-toast'
     
    });
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



  profileView()
  {
    this.router.navigate(['/profile-view']) 
  }


   //editextracurricularDetails
   editextracurricular(extId){

    var industryURL = "api/auth/app/IndividualProfileDetails/EditExtracurricular?extId=" + extId ;
    this.storageservice.getrequest(industryURL).subscribe(result => {
    
      
      
      if (result["success"] == true) {

        this.clubFrom.get("clubName").disable();
       
        this.extracurricularBean = result["extracurricularBean"]; 
 
        const containsTF = this.checkForTF(this.extracurricularBean.clubName)
        if(containsTF == true){
          this.searchForId(this.extracurricularBean.clubName);  
        }else{
          this.searchForText(this.extracurricularBean.clubName); 
        }

        this.selectedOrganisation = this.desiredItem.text;
        const participatedFrom =  this.extracurricularBean.participatedFrom;
        const startdate = moment(participatedFrom, 'DD.MM.YYYY').toDate();

        this.validationForCurMember(this.extracurricularBean.currentMember);

        if(this.extracurricularBean.participatedTill != null &&  this.extracurricularBean.participatedTill != ""){
          const expEnd = this.extracurricularBean.participatedTill;
          const enddate = moment(expEnd, 'DD/MM/YYYY').toDate();
          this.clubFrom.patchValue({
            'participatedTill' :enddate.toISOString(),
          })
          }
 
          const participatedTill =  this.extracurricularBean.participatedTill;
          const Enddate = moment(participatedTill, 'DD.MM.YYYY').toDate();
     
         this.edit = true;
         this.disabled =true
         this.clubFrom.patchValue({
            'clubName':this.desiredItem.text,
           'clubBranch' :this.extracurricularBean.clubBranch,
           'titleHeld': this.extracurricularBean.titleHeld,
           'rolePlayed':this.extracurricularBean.rolePlayed,
          // 'participatedFromObj' : extFromdate,
           'participatedFrom': startdate.toISOString(),
           //'participatedTillObj' : extTodate,
          // 'participatedTill' :Enddate.toISOString(),
           'currentMember': this.extracurricularBean.currentMember,
           'extId': this.extracurricularBean.extId,
           })
       }
      
    })
  }


  checkForTF(data: string): boolean {
    if (data.indexOf('TF') !== -1) {
      return true;
    } else {
      return false;
    }
  }

  searchForId(id: string) {
    this.desiredItem = null;
    for (const item of this.organisationList) {
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


  searchForText(text: string) {
    this.desiredItem = null;
    for (const item of this.organisationList) {
      if (item.text === text) {
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

//Updateclub

  async Updateclub(){
    const errors = this.checkFormValidity(this.clubFrom);

  if (errors.length > 0) {
    // Display errors in a popup
    const alert = await this.toastController.create({
      header: '',
      message: 'Please provide all the required values!',
      duration: 3000,
    });

    await alert.present();
  } else {
     this.clubFrom.value.currentUserId = this.userId; 

     this.clubFrom.value.participatedFrom =formatDate(this.clubFrom.value.participatedFrom, 'dd/MM/yyyy','en-IN');
     if(this.clubFrom.value.participatedTill != undefined){
      this.clubFrom.value.participatedTill =formatDate(this.clubFrom.value.participatedTill, 'dd/MM/yyyy','en-IN');          
      }  this.club = this.clubFrom.value;
  console.log(` data: ${JSON.stringify(this.club)}`);
  var updateclub = "api/auth/app/IndividualProfileDetails/UpdateExtracurricular";

   this.storageservice.postrequest(updateclub, this.club).subscribe(async result => {  
      console.log("Image upload response: " + result)
     if (result["success"] == true) {
      // setTimeout(() => {
      //   const profilePage = new ProfilePage(this.router, this.storageservice, this.elementRef, this.modalController, this.alertController);
      //  profilePage.updateData();
      // }, 800);
      this.updateToast()
      let edit = {
        clubId:this.desiredItem.id,
        extId:this.club.extId,
     }
     let navigationExtras: NavigationExtras = {
       queryParams: edit
     };
      this.router.navigate(['/activity-verification'],navigationExtras)

       }else{  

       }
   });
  }
  }


async updateToast() {
  const toast = await this.toastController.create({
    message: 'Updated Successfully',
    duration: 3000,
    cssClass: 'custom-toast'
  });

  // this.router.navigate(['/profile-view']);

await toast.present();
}


// // footer
// goto_profileSearch(){
//   this.router.navigate(['/job-search']);
// }
// goto_jobs(){
//   this.router.navigate(['/job']);
// }
// goto_home(){
//   this.router.navigate(['/home']);
// }
// goto_profile(){
//   this.router.navigate(['/profile-view']);
// }
// goto_more(){
//   this.router.navigate(['/settings']);
// }

}
