import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { StorageService } from '../storage.service';
import { NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-organization-dashboard',
  templateUrl: './organization-dashboard.page.html',
  styleUrls: ['./organization-dashboard.page.scss'],
})
export class OrganizationDashboardPage implements OnInit {

  userId: string;
  creditPoints: any;
  profileViewCount:any;
  oniRating:any;
  orgCountList:any;
  constructor(public router:Router,public storageservice: StorageService) { }
  ngOnInit() {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.url === '/organization-dashboard') {
        this.setSelectedTab('apps');
      }
    });

    this.userId = localStorage.getItem("userId")  ; 
    this.creditPoints = localStorage.getItem("creditPoints") ;
 
    var indiProfileViewCountURL = "api/auth/app/dashboard/profileviewcount?currentUserId="+this.userId;
    this.storageservice.getrequest(indiProfileViewCountURL).subscribe(result => {
     console.log(result); 
     this.profileViewCount = result['profileviewcount']
        });
 
        var indiProfileViewCountURL = "api/auth/app/dashboard/avgratingForOni?currentUserId="+this.userId;
    this.storageservice.getrequest(indiProfileViewCountURL).subscribe(result => {
     console.log(result); 
     this.oniRating = result['avgrating']
        });


        var organizationCountUrl = "api/auth/app/dashboard/orgCountlist?currentUserId="+this.userId;
        this.storageservice.getrequest(organizationCountUrl).subscribe(result => {
         console.log(result); 
         this.orgCountList = result['orgCountlist'];
            });
  }


  viewList(btnType,title){
    let edit = {

      btntype :btnType,
      title :title
    }

    let navigationExtras: NavigationExtras = {
      queryParams: edit
    };
    this.router.navigate(['/organization-dashboard-list'], navigationExtras);
  }

  viewmatchesList(){

    this.router.navigate(['/oni-job-post-list']);
  }

  selectedTab: string = 'apps';

  setSelectedTab(tabName: string) {
    this.selectedTab = tabName;
  }

  goto_subscribe(){
    this.router.navigate(['subscription-insorg']);
  }
  // footer nav

  goto_profileSearch(){
    this.router.navigate(['/job-search']);
  }
  goto_jobs(){
    this.router.navigate(['/oni-job-post-list']);
  }
  goto_home(){
    this.router.navigate(['/organization-dashboard']);
  }
  goto_profile(){
    this.router.navigate(['/org-profile-view']);
  }
  goto_more(){
    this.router.navigate(['/settings']);
  }


}
