import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../places.service';
import { Place } from '../place.model';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {

  _offers: Place[];

  constructor(private placesService: PlacesService) { }

  ngOnInit() {
    this._offers = this.placesService.getPlaces();
  }
}
