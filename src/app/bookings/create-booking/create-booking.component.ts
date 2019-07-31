import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { Place } from "src/app/places/place.model";
import { ModalController, IonMenuToggle } from "@ionic/angular";
import { formArrayNameProvider } from '@angular/forms/src/directives/reactive_directives/form_group_name';
import { NgForm } from '@angular/forms';

@Component({
  selector: "app-create-booking",
  templateUrl: "./create-booking.component.html",
  styleUrls: ["./create-booking.component.scss"]
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace: Place;
  @Input() selectedMode: "select" | "random";
  @ViewChild('f') form: NgForm;
  startDate: string;
  endDate: string;

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    const availableFrom = new Date(this.selectedPlace.availableFrom);
    const availableTo = new Date(this.selectedPlace.availableTo);
    if (this.selectedMode === "random") {
      this.startDate = new Date(
        availableFrom.getTime() +
          Math.random() *
            (availableTo.getTime() -
              7 * 24 * 60 * 60 * 1000 -
              availableFrom.getTime())
      ).toISOString();

      this.endDate = new Date(
        new Date(this.startDate).getTime() +
          Math.random() *
            (new Date(this.startDate).getTime() +
              6 * 24 * 60 * 60 * 1000 -
              new Date(this.startDate).getTime())
      ).toISOString();
    }
  }

  onBookPlaceClick(): void {

    if (!this.form.valid || !this.datesValid()) {
      return;
    }

    this.modalController.dismiss(
      {
        message: "This is a dummy message",
        bookingData: {
          firstName: this.form.value['first-name'],
          lastName: this.form.value['last-name'],
          guestNumber: this.form.value['guest-number'],
          startDate: this.form.value['date-from'],
          endDate: this.form.value['date-to'],
        }
      },
      "confirm"
    );
  }

  onCancelClick(): void {
    this.modalController.dismiss(null, "cancel");
  }

  datesValid() {
    const startDate = new Date(this.form.value['date-from']);
    const endDate = new Date(this.form.value['date-to']);
    return startDate < endDate;
  }
}
