import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlacesPage } from './places.page';
import { DiscoverPage } from './discover/discover.page';

const routes: Routes = [
    {
        path: 'tabs',
        component: PlacesPage,
        children: [
            {
                path: 'discover',
                children: [
                    {
                        path: '',
                        loadChildren: './discover/discover.module#DiscoverPageModule'
                    },
                    {
                        path: ':placeId',
                        loadChildren: './discover/place-details/place-details.module#PlaceDetailsPageModule'
                    }
                ]
            },
            {
                path: 'offers',
                children: [
                    {
                        path: '',
                        loadChildren: './offers/offers.module#OffersPageModule'
                    },
                    {
                        path: ':new',
                        loadChildren: './offers/new-offer/new-offers.module#NewOfferPageModule'
                    },
                    {
                        path: 'edit/:offerId',
                        loadChildren: './offers/edir-offer/edit-offers.module#EditOfferPageModule'
                    },
                    {
                        path: ':placeId',
                        loadChildren: './offers/offer-bookings/offer-bookings.module#OfferBookingsPageModule'
                    }
                ]
            },
            {
                path: '',
                redirectTo: '/places/tabs/discover',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: '/places/tabs/discover',
        pathMatch: 'full'
    }
];

@NgModule({
    imports:  [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PlacesRoutingModule {

}