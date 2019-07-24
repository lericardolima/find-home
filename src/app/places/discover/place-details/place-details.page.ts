import { Component, OnInit } from '@angular/core';
import { Place } from '../../place.model';
import { NavController, ModalController } from '@ionic/angular';
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
              private modalController: ModalController) { }

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
    this.modalController.create({
      component: CreateBookingComponent
    }).then(modalEl => modalEl.present());
  }

}
