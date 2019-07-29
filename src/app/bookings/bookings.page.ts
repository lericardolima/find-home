import { Component, OnInit } from '@angular/core';
import { BookingsService } from './bookings.service';
import { Booking } from './booking.model';
import { IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {

  bookings: Booking[];
  constructor(private bookingsService: BookingsService) { }

  ngOnInit() {
    this.bookings = this.bookingsService.getBookings();
  }

  onCancelBooking(bookingId: string, slidingItem: IonItemSliding): void {
    slidingItem.close();
    this.bookings = this.bookings.filter(booking => !(booking.id === bookingId));
  }

}
