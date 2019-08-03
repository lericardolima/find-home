import { Injectable } from '@angular/core';
import { Booking } from './booking.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { take, tap } from 'rxjs/operators';

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

    constructor(private authService: AuthService) { }

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

        return this.bookings.pipe(
            take(1),
            tap(bookings => {
                this.bookings.next(bookings.concat(newBooking));
            }));
    }

    cancelBooking(bookingId: string): Observable<Booking[]> {
        return this.bookings.pipe(
            take(1),
            tap(bookings => {
                this.bookings.next(bookings.filter(booking => booking.id !== bookingId));
            }));
    }
}
