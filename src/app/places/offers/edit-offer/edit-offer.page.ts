import { Component, OnInit, createPlatform, OnDestroy } from '@angular/core';
import { PlacesService } from '../../places.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { Place } from '../../place.model';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { error } from '@angular/compiler/src/util';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss']
})
export class EditOfferPage implements OnInit, OnDestroy {
  form: FormGroup;
  offer: Place;
  formComplete: boolean;
  placeSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private placesService: PlacesService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(map => {
      if (!map.has('offerId')) {
        this.navController.navigateBack('/places/tabs/offers');
        return;
      }

      this.placeSubscription = this.placesService.getPlace(map.get('offerId')).subscribe(place => {
        this.offer = place;
        this.createForm();
      });
    });
  }

  createForm(): void {
    this.form = new FormGroup({
      title: new FormControl(this.offer.title, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      description: new FormControl(this.offer.description, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(100)]
      }),
      price: new FormControl(this.offer.price, {
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
    if (!this.form.valid) {
      return;
    }

    this.loadingController.create({
      message: 'Saving changes...'
    }).then(loadingEl => {
      loadingEl.present();
      this.placesService.updatePlace(
        this.offer.id,
        this.form.value.title,
        this.form.value.description
      ).subscribe(() => {
        this.form.reset();
        this.loadingController.dismiss();
        this.router.navigate(['/places/tabs/offers']);
      },
      error => {
        this.alertController.create({
          header: 'An error ocurred',
          message: 'Place could not be fetched. Please, try again later.',
          buttons: [{
            text: 'Okay', handler: () => {
              this.router.navigate(['/places/tabs/offers']);
            }
          }]
        })
          .then(alertEl => {
            loadingEl.dismiss();
            alertEl.present();
          });
      });
    });
  }

  ngOnDestroy() {
    if (this.placeSubscription) {
      this.placeSubscription.unsubscribe();
    }
  }
}
