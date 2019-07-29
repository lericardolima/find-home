import { Injectable } from '@angular/core';
import { Booking } from './booking.model';

@Injectable({
    providedIn: 'root'
})
export class BookingsService {

    private bookings: Booking[] = [
        {
            id: 'xyz',
            placeId: 'p1',
            placeTitle: 'Manhattan Mansion',
            guestNumber: 2,
            userId: 'abc'
        }
    ];

    getBookings(): Booking[] {
        return [...this.bookings];
    }

}
