import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { IonItemSliding } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {

  placesSubscription: Subscription;
  offers: Place[];
  isLoading = false;

  constructor(private placesService: PlacesService,
              private router: Router) { }

  ngOnInit() {
    this.isLoading = true;
    this.placesSubscription = this.placesService.fetchPlaces()
      .subscribe(places => {
        this.isLoading = false;
        this.offers = places;
      });
  }

  ngOnDestroy() {
    if (this.placesSubscription) {
      this.placesSubscription.unsubscribe();
    }
  }

  onEdit(offerId: string, slidingItem: IonItemSliding): void {
    slidingItem.close();
    console.log(offerId);
    this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', offerId]);
  }
}
