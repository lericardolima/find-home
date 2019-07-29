import { Component, OnInit } from '@angular/core';
import { Place } from '../../place.model';
import { NavController, ModalController, ActionSheetController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { PlacesService } from '../../places.service';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';

@Component({
  selector: 'app-place-details',
  templateUrl: './place-details.page.html',
  styleUrls: ['./place-details.page.scss'],
})
export class PlaceDetailsPage implements OnInit {

  _place: Place;

  constructor(private navController: NavController,
              private route: ActivatedRoute,
              private placesService: PlacesService,
              private modalController: ModalController,
              private actionSheetController: ActionSheetController) { }

  ngOnInit() {
    this.route.paramMap.subscribe(map => {
      if (!map.has('placeId')) {
        this.navController.navigateBack('/places/tabs/discover');
        return;
      }

      this._place = this.placesService.getPlace(map.get('placeId'));
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

  openBookingModel(role: 'select' | 'random'): void {
    this.modalController.create({
      component: CreateBookingComponent,
      componentProps: { selectedPlace: this._place }
    }).then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    }).then(resultData => {
      console.log(resultData.data, resultData.role);
      if (resultData.role === 'confirm') {
        console.log('Booked!');
      }
    });

  }

}
