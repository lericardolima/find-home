import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../places.service';
import { Place } from '../place.model';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {

  constructor(private _placesService: PlacesService) { }
  _places: Place[];

  ngOnInit() {
    this._places = this._placesService.getPlaces();
  }

}
