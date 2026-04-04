import { pool } from "../db/index.js";
import { sendBookingEmail } from "../utils/email.js";
import { sendWhatsAppMessage } from "../utils/whatsapp.js";

export const createBooking = async (req, res) => {
  try {
    const {
      roomName,
      category,
      price,
      fullName,
      email,
      phone,
      checkIn,
      checkOut,
      guests,
      specialRequest,
    } = req.body;

    // 1. Save to DB
    const result = await pool.query(
      `INSERT INTO bookings 
      (room_name, category, price, full_name, email, phone, check_in, check_out, guests, special_request)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [
        roomName,
        category,
        price,
        fullName,
        email,
        phone,
        checkIn,
        checkOut,
        guests,
        specialRequest,
      ]
    );

    const booking = result.rows[0];

    // 2. Send Emails (parallel)
    await Promise.all([
      // Customer email
      sendBookingEmail({
        to: email,
        subject: "Your Booking Confirmation - Oranto Hotel",
        name: fullName,
        booking,
      }),

      // Hotel email
      sendBookingEmail({
        to: "reservations@orantohotel.com",
        subject: "New Booking Received",
        name: "Hotel Admin",
        booking,
      }),
    ]);

    // 3. Send WhatsApp Messages
    await Promise.all([
      // Customer
      sendWhatsAppMessage(
        phone,
        `Hello ${fullName}, your booking at Oranto Hotel is confirmed from ${checkIn} to ${checkOut}.`
      ),

      // Hotel
      sendWhatsAppMessage(
        "2349160002437", // hotel number
        `New booking from ${fullName}, Room: ${roomName}, ${checkIn} - ${checkOut}, phone: ${phone}, email: ${email}`
      ),
    ]);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to create booking",
    });
  }
};