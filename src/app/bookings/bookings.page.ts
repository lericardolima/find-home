import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookingsService } from './bookings.service';
import { Booking } from './booking.model';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { SubjectSubscriber } from 'rxjs/internal/Subject';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {

  bookingsSubject: Subscription;
  bookings: Booking[];
  isLoading = false;
  constructor(private bookingsService: BookingsService,
              private loadingController: LoadingController) { }

  ngOnInit() {
    this.bookingsSubject = this.bookingsService.getBookings()
      .subscribe(bookings => {
        this.bookings = bookings;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.bookingsService.fetchBookings()
      .subscribe(() => {
        this.isLoading = false;
      });
  }

  onCancelBooking(bookingId: string, slidingItem: IonItemSliding): void {
    slidingItem.close();
    this.loadingController.create({
      message: 'Canceling your booking...'
    }).then(loadingEl => {
      loadingEl.present();
      this.bookingsService.cancelBooking(bookingId)
        .subscribe(() => {
         loadingEl.dismiss();
        });
    });
  }

  ngOnDestroy(): void {
    if (this.bookingsSubject) {
      this.bookingsSubject.unsubscribe();
    }
  }

}
