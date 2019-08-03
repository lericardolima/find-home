import { Component, OnInit, OnDestroy } from '@angular/core';
import { Place } from '../../place.model';
import { NavController, ModalController, ActionSheetController, LoadingController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { PlacesService } from '../../places.service';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';
import { Subscription } from 'rxjs';
import { BookingsService } from '../../../bookings/bookings.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-place-details',
  templateUrl: './place-details.page.html',
  styleUrls: ['./place-details.page.scss'],
})
export class PlaceDetailsPage implements OnInit, OnDestroy {

  placeSubscription: Subscription;
  place: Place;
  isBookable = false;

  constructor(private navController: NavController,
              private route: ActivatedRoute,
              private placesService: PlacesService,
              private modalController: ModalController,
              private actionSheetController: ActionSheetController,
              private bookingService: BookingsService,
              private loadingController: LoadingController,
              private authService: AuthService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(map => {
      if (!map.has('placeId')) {
        this.navController.navigateBack('/places/tabs/discover');
        return;
      }

      this.placeSubscription = this.placesService.getPlace(map.get('placeId'))
        .subscribe(place => {
          this.place = place;
          this.isBookable = place.userId !== this.authService.getCurrentUserId();
        });
    });
  }

  onBookClick(): void {

    this.actionSheetController.create({
      header: 'Choose an action',
      buttons: [
        {
          text: 'Select date',
          handler: () => {
            this.openBookingModel('select');
          }
        },
        {
          text: 'Random date',
          handler: () => {
            this.openBookingModel('random');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    }).then(actionSheetEl => {
      actionSheetEl.present();
    });
  }

  openBookingModel(mode: 'select' | 'random'): void {
    this.modalController.create({
      component: CreateBookingComponent,
      componentProps: { selectedPlace: this.place, selectedMode: mode }
    }).then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    }).then(resultData => {
      if (resultData.role === 'confirm') {
        const data = resultData.data.bookingData;
        this.loadingController.create({
          message: 'Creating your new booking...'
        }).then(loadingEl => {
          loadingEl.present();
          this.bookingService.addBooking(
            this.place.id,
            this.place.title,
            this.place.imageUrl,
            data.firstName,
            data.lastName,
            data.guestNumber,
            data.startDate,
            data.endDate
          ).subscribe(() => {
            loadingEl.dismiss();
          });

        });
      }
    });

  }

  ngOnDestroy() {
    if (this.placeSubscription) {
      this.placeSubscription.unsubscribe();
    }
  }

}
