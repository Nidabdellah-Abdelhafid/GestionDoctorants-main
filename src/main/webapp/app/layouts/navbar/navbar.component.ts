import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {SessionStorageService} from 'ngx-webstorage';
import { ChefLabService } from 'app/entities/chef-lab/service/chef-lab.service';
import { IChefLab } from 'app/entities/chef-lab/chef-lab.model';

import {VERSION} from 'app/app.constants';
import {LANGUAGES} from 'app/config/language.constants';
import {Account} from 'app/core/auth/account.model';
import {AccountService} from 'app/core/auth/account.service';
import {LoginService} from 'app/login/login.service';
import {ProfileService} from 'app/layouts/profiles/profile.service';
import {EntityNavbarItems} from 'app/entities/entity-navbar-items';
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {NotificationService} from "../../entities/notification/service/notification.service";
import {HttpResponse} from "@angular/common/http";
import {CountPub} from "../../entities/ChartsModels/CountPub";
import {Notification} from "../../entities/notification/notification.model";
import {Doctorant, IDoctorant} from "../../entities/doctorant/doctorant.model";

@Component({
  selector: 'jhi-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  inProduction?: boolean;
  isNavbarCollapsed = true;
  languages = LANGUAGES;
  openAPIEnabled?: boolean;
  version = '';
  account: Account | null = null;
  entitiesNavbarItems: any[] = [];
  nbNotification!: number;
  notification!: Notification[];
  chefLabs: IChefLab[]=[];
  isLoggedIn!: boolean;
  hasChefLab! :boolean ;


  constructor(
    private loginService: LoginService,
    protected notificationService: NotificationService,
    private translateService: TranslateService,
    private sessionStorageService: SessionStorageService,
    public accountService: AccountService,
    private profileService: ProfileService,
    private router: Router
    ,private cheflaboratoireservice: ChefLabService
    , public _sanitizer: DomSanitizer
  ) {

    if (VERSION) {
      this.version = VERSION.toLowerCase().startsWith('v') ? VERSION : `v${VERSION}`;
    }
  }
  decode(base64String: string): SafeResourceUrl {
    return this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + base64String);
  }

  loadAll(): void {

    this.notificationService.findNonLu().subscribe({
      next:(res: HttpResponse<Notification[]>) => {
        this.notification = res.body ?? [];
      },
    })

    this.notificationService.count().subscribe({
      next:(res: HttpResponse<number>) => {
        if(res.body){
          this.nbNotification = res.body ;
        }
      },
    })
    this.profileService.getProfileInfo().subscribe(profileInfo => {
      this.inProduction = profileInfo.inProduction;
      this.openAPIEnabled = profileInfo.openAPIEnabled;
    });

    this.accountService.getAuthenticationState().subscribe(account => {
      this.account = account;
    });



  }
  ngOnInit(): void {
    this.loadall1();
    this.loadAll();
    this.entitiesNavbarItems = EntityNavbarItems;

  }


  loadall1(): void {
    this.chefLabs.splice(0, this.chefLabs.length);

    this.cheflaboratoireservice.queryparuser().subscribe({
      next: (res: HttpResponse<IChefLab[]>) => {
        this.chefLabs = res.body ?? [];
        if (this.chefLabs.length !== 0) {

          this.hasChefLab = true;

        }else{
          this.chefLabs.splice(0, this.chefLabs.length);

        }
        // Mettre à jour les entités de l'équipe
      }
    });
  }

  changeLanguage(languageKey: string): void {
    this.sessionStorageService.store('locale', languageKey);
    this.translateService.use(languageKey);
  }

  collapseNavbar(): void {
    this.loadall1();

    this.isNavbarCollapsed = true;
  }

  login(): void {
    this.loadall1();

    this.router.navigate(['/login']);
    this.loadall1();

  }

  logout(): void {
    this.collapseNavbar();
    this.loginService.logout();
    this.router.navigate(['']);
    this.chefLabs.splice(0, this.chefLabs.length);



  }

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }


  changeTrue(notif : Notification): void {
    this.notificationService.update({ ...notif, vu: true }).subscribe(() =>{
    this.loadAll();
    this.loadall1();
     } );
  }
}
