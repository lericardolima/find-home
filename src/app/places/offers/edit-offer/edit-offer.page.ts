import { Component, OnInit, createPlatform } from '@angular/core';
import { PlacesService } from '../../places.service';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Place } from '../../place.model';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss']
})
export class EditOfferPage implements OnInit {
  form: FormGroup;
  _offer: Place;
  formComplete: Boolean = false;

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private placesService: PlacesService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(map => {
      if (!map.has('offerId')) {
        this.navController.navigateBack('/places/tabs/offers');
        return;
      }

      this._offer = this.placesService.getPlace(map.get('offerId'));
      this.createForm();
    });
  }

  createForm(): void {
    this.form = new FormGroup({
      title: new FormControl(this._offer.title, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      description: new FormControl(this._offer.description, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(100)]
      }),
      price: new FormControl(this._offer.price, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      }),
      dateFrom: new FormControl(new Date(), {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      dateTo: new FormControl(new Date(), {
        updateOn: 'blur',
        validators: [Validators.required]
      })
    });

    this.formComplete = true;
  }

  onEditOffer(): void {
    console.log(this.form);
    if (!this.form.valid) {
      return;
    }
  }
}
