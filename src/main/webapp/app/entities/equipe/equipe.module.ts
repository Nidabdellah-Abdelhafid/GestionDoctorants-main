import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EquipeComponent } from './list/equipe.component';
import { EquipeDetailComponent } from './detail/equipe-detail.component';
import { EquipeUpdateComponent } from './update/equipe-update.component';
import { EquipeDeleteDialogComponent } from './delete/equipe-delete-dialog.component';
import { EquipeRoutingModule } from './route/equipe-routing.module';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import {InformationModule} from "../information/information.module";

import { NgxPaginationModule } from 'ngx-pagination'; // import the module

@NgModule({
    declarations: [EquipeComponent, EquipeDetailComponent, EquipeUpdateComponent, EquipeDeleteDialogComponent],
    entryComponents: [EquipeDeleteDialogComponent],
    imports: [SharedModule, EquipeRoutingModule , NgbPaginationModule , NgxPaginationModule,InformationModule
  ]
})
export class EquipeModule {}
