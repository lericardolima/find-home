import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {

  placesSubscription: Subscription;
  places: Place[];
  relevantPlaces: Place[];
  isLoading = false;
  constructor(private placesService: PlacesService,
              private authService: AuthService) { }

  ngOnInit() {
    this.placesSubscription = this.placesService.getPlaces()
      .subscribe(places => {
        this.places = places;
        this.relevantPlaces = this.places;
      });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.placesService.fetchPlaces().subscribe(
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    if (this.placesSubscription) {
      this.placesSubscription.unsubscribe();
    }
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>): void {
    if (event.detail.value === 'all') {
      this.relevantPlaces = this.places;
    } else {
      this.relevantPlaces = this.places.filter(
        place => this.authService.getCurrentUserId() !== place.userId
      );
    }
  }

}
