import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ChefLabService } from 'app/entities/chef-lab/service/chef-lab.service';

import { ILaboratoire } from '../laboratoire.model';
import { LaboratoireService } from '../service/laboratoire.service';

@Component({
  templateUrl: './laboratoire-delete-dialog.component.html',
})
export class LaboratoireDeleteDialogComponent {
  laboratoire?: ILaboratoire;

  constructor(protected laboratoireService: LaboratoireService,protected cheflabservice :ChefLabService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.cheflabservice.delete1(id).subscribe(() => {
      this.laboratoireService.delete(id).subscribe(() => {
        this.activeModal.close('deleted');
      });
    });

  }
}
