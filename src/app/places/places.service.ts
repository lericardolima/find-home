import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { take, map, tap, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { PlaceLocation } from './place-location.model';

const FIREBASE_URL = 'https://ionic-angular-course-fcbef.firebaseio.com/offered-places';
const FIREBASE_URL_EXT = '.json';

interface PlaceData {
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  availableFrom: Date;
  availableTo: Date;
  userId: string;
  location: PlaceLocation;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private places = new BehaviorSubject<Place[]>([
    new Place(
      'p1',
      'Manhattan Mansion',
      'In the heart of New York City.',
      'https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200',
      149.99,
      new Date('2019-01-01'),
      new Date('2021-01-01'),
      'abc',
      null
    ),
    new Place(
      'p2',
      "L'Amour Toujours",
      'A romantic place in Paris!',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Paris_Night.jpg/1024px-Paris_Night.jpg',
      189.99,
      new Date('2019-01-01'),
      new Date('2021-01-01'),
      'abc',
      null
    ),
    new Place(
      'p3',
      'The Foggy Palace',
      'Not your average city trip!',
      'https://upload.wikimedia.org/wikipedia/commons/0/01/San_Francisco_with_two_bridges_and_the_fog.jpg',
      99.99,
      new Date('2019-01-01'),
      new Date('2021-01-01'),
      'xyz',
      null
    )
  ]);


  constructor(private authService: AuthService,
              private http: HttpClient) { }

  getPlaces(): Observable<Place[]> {
    return this.fetchPlaces();
  }

  fetchPlaces() {
    return this.http.get<{ [key: string]: PlaceData }>(FIREBASE_URL + FIREBASE_URL_EXT)
      .pipe(map(res => {
        const places = [];
        for (const key in res) {
          if (res.hasOwnProperty(key)) {
            const resPlace = res[key];
            places.push(new Place(
              key,
              resPlace.title,
              resPlace.description,
              resPlace.imageUrl,
              resPlace.price,
              resPlace.availableFrom,
              resPlace.availableTo,
              resPlace.userId,
              resPlace.location
            ));
          }
        }
        return places;
      }),
        tap(places => {
          this.places.next(places);
        }));
  }

  getPlace(id: string): Observable<Place> {
    return this.http.get<Place>(`${FIREBASE_URL}/${id}${FIREBASE_URL_EXT}`)
      .pipe(
        map(placeData => {
          return new Place(
            id,
            placeData.title,
            placeData.description,
            placeData.imageUrl,
            placeData.price,
            new Date(placeData.availableFrom),
            new Date(placeData.availableTo),
            placeData.userId,
            placeData.location);
        })
      );
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date, location: PlaceLocation): Observable<Place[]> {
    let generatedId: string;
    const newPlace: Place = new Place(
      null,
      title,
      description,
      'https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200',
      price,
      dateFrom,
      dateTo,
      this.authService.getCurrentUserId(),
      location
    );

    return this.http.post<{ name: string }>(
      FIREBASE_URL + FIREBASE_URL_EXT, { ...newPlace, id: null }
    ).pipe(
      switchMap(res => {
        generatedId = res.name;
        return this.places;
      }),
      take(1),
      tap(places => {
        newPlace.id = generatedId;
        this.places.next(places.concat(newPlace));
      }));
  }

  updatePlace(placeId: string, title: string, description: string): Observable<Place> {
    let updatedPlaces: Place[];
    return this.places.pipe(
      take(1),
      switchMap(places => {
        if (!places || places.length <= 0) {
          return this.fetchPlaces();
        } else {
          return of(places);
        }
      }),
      switchMap(places => {
        const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
        updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId,
        oldPlace.location);

        return this.http.put<Place>(
          `${FIREBASE_URL}/${placeId}${FIREBASE_URL_EXT}`, { ...updatedPlaces[updatedPlaceIndex], id: null }
        );
      }),
      tap(() => {
        this.places.next(updatedPlaces);
      })
    );
  }
}
