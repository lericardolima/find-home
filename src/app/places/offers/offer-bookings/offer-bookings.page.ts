import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-offer-bookings',
  templateUrl: './offer-bookings.page.html',
  styleUrls: ['./offer-bookings.page.scss'],
})
export class OfferBookingsPage implements OnInit, OnDestroy {

  placesSubscription: Subscription;
  place: Place;

  constructor(private route: ActivatedRoute,
              private navController: NavController,
              private placesService: PlacesService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(map => {
      if (!map.has('placeId')) {
        this.navController.navigateBack('/places/tabs/offers');
        return;
      }

      this.placesSubscription = this.placesService.getPlace(map.get('placeId'))
        .subscribe(place =>  this.place = place);
    });
  }

  ngOnDestroy() {
    if (this.placesSubscription) {
      this.placesSubscription.unsubscribe();
    }
  }
}
