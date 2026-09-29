import { supabase } from "./supabase";

export type ReservationInput = {
  guests: number;
  date: string;
  time: string;
  seating: string;
  name: string;
  email: string;
  phone?: string;
  occasion?: string;
  notes?: string;
};

export type EventInquiryInput = {
  name?: string;
  email: string;
  message?: string;
};

export async function createReservation(
  reservation: ReservationInput,
) {
  const reference =
    "EMB-" +
    Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

  const { error } = await supabase
    .from("ember_oak_restaurant_reservations")
    .insert({
      reference,
      guests: reservation.guests,
      date: reservation.date,
      time: reservation.time,
      seating: reservation.seating,
      name: reservation.name,
      email: reservation.email,
      phone: reservation.phone || null,
      occasion: reservation.occasion || null,
      notes: reservation.notes || null,
    });

  if (error) {
    console.error("Reservation error:", error);
    throw error;
  }

  return reference;
}

export async function createEventInquiry(
  inquiry: EventInquiryInput,
) {
  const { error } = await supabase
    .from("ember_oak_restaurant_event_inquiries")
    .insert({
      name: inquiry.name || null,
      email: inquiry.email,
      message: inquiry.message || null,
    });

  if (error) {
    console.error("Event inquiry error:", error);
    throw error;
  }
}

export async function subscribeToNewsletter(
  email: string,
) {
  const cleanEmail = email.trim().toLowerCase();

  const { error } = await supabase
    .from("ember_oak_restaurant_newsletter_subscribers")
    .insert({
      email: cleanEmail,
    });

  if (error) {
    console.error("Newsletter error:", error);
    throw error;
  }
}