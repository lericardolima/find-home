import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { IonItemSliding } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {

  _offers: Place[];

  constructor(private placesService: PlacesService,
              private router: Router) { }

  ngOnInit() {
    this._offers = this.placesService.getPlaces();
  }

  onEdit(offerId: string, slidingItem: IonItemSliding): void {
    slidingItem.close();
    console.log(offerId);
    this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', offerId]);
  }
}
