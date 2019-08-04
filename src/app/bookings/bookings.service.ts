import { Injectable } from '@angular/core';
import { Booking } from './booking.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { take, tap, switchMap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

const FIREBASE_URL = 'https://ionic-angular-course-fcbef.firebaseio.com/bookings';
const FIREBASE_URL_EXT = '.json';

interface BookingData {
    bookedFrom: string;
    bookedTo: string;
    firstName: string;
    guestNumber: number;
    lastName: string;
    placeId: string;
    placeImage: string;
    placeTitle: string;
    userId: string;
}

@Injectable({
    providedIn: 'root'
})
export class BookingsService {

    private bookings = new BehaviorSubject<Booking[]>([
        {
            id: 'xyz',
            placeId: 'p1',
            placeTitle: 'Manhattan Mansion',
            guestNumber: 2,
            userId: 'abc',
            firstName: 'Ricardo',
            lastName: 'Rocha',
            bookedFrom: new Date(),
            bookedTo: new Date(),
            placeImage: 'https://bit.ly/33bTCLK'
        }
    ]);

    constructor(private authService: AuthService,
                private http: HttpClient) { }

    getBookings(): Observable<Booking[]> {
        return this.bookings.asObservable();
    }

    addBooking(
        placeId: string,
        placeTitle: string,
        placeImage: string,
        firstName: string,
        lastName: string,
        guestNumber: number,
        dateFrom: Date,
        dateTo: Date)
        : Observable<Booking[]> {

        let generatedId: string;
        const newBooking = new Booking(
            Math.random().toString(),
            placeId,
            this.authService.getCurrentUserId(),
            placeImage,
            placeTitle,
            firstName,
            lastName,
            guestNumber,
            dateFrom,
            dateTo
        );

        return this.http.post<{ name: string }>(FIREBASE_URL + FIREBASE_URL_EXT,
            { ...newBooking, id: null }
        ).pipe(
            switchMap(res => {
                generatedId = res.name;
                return this.bookings;
            }),
            take(1),
            tap(bookings => {
                newBooking.id = generatedId;
                this.bookings.next(bookings.concat(bookings));
            })
        );
    }

    cancelBooking(bookingId: string): Observable<Booking[]> {
        return this.http.delete(`${FIREBASE_URL}/${bookingId}${FIREBASE_URL_EXT}`)
            .pipe(
                switchMap(() => {
                    return this.bookings;
                }),
                take(1),
                tap(bookings => {
                    this.bookings.next(
                        bookings.filter(b => {
                            return b.id !== bookingId;
                        })
                    );
                })
            );
        return this.bookings.pipe(
            take(1),
            tap(bookings => {
                this.bookings.next(bookings.filter(booking => booking.id !== bookingId));
            }));
    }

    fetchBookings() {
        const userId = this.authService.getCurrentUserId();
        return this.http.get<{ [key: string]: BookingData }>(`${FIREBASE_URL}${FIREBASE_URL_EXT}?orderBy="userId"&equalTo="${userId}"`)
            .pipe(
                map(bookingsData => {
                    const bookings = [];
                    for (const key in bookingsData) {
                        if (bookingsData.hasOwnProperty(key)) {
                            const data: BookingData = bookingsData[key];
                            bookings.push(
                                new Booking(
                                    key,
                                    data.placeId,
                                    data.userId,
                                    data.placeImage,
                                    data.placeTitle,
                                    data.firstName,
                                    data.lastName,
                                    data.guestNumber,
                                    new Date(data.bookedFrom),
                                    new Date(data.bookedTo)
                                )
                            );
                        }
                    }

                    return bookings;
                }),
                tap(bookings => {
                    this.bookings.next(bookings);
                })
            );
    }
}
