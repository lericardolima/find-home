import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../../places.service';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Place } from '../../place.model';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit {

  _offer: Place;

  constructor(private route: ActivatedRoute,
              private navController: NavController,
              private placesService: PlacesService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(map => {
      if (!map.has('offerId')) {
        this.navController.navigateBack('/places/tabs/offers');
        return;
      }

      this._offer = this.placesService.getPlace(map.get('offerId'));
    });
  }

}
