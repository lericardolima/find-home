import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { SegmentChangeEventDetail } from '@ionic/core';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {

  places: Place[];
  constructor(private placesService: PlacesService) { }

  ngOnInit() {
    this.places = this.placesService.getPlaces();
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>): void {
    console.log(event.detail);
  }

}
