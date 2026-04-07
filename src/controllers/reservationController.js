import { pool } from "../db/index.js";
import { sendBookingEmail } from "../utils/email.js";
import { sendWhatsAppMessage } from "../utils/whatsapp.js";

export const createReservation = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      roomType,
      checkIn,
      checkOut,
      guests,
      specialRequest,
    } = req.body;

    // ===============================
    // 1️⃣ SAVE TO DATABASE
    // ===============================
    const result = await pool.query(
      `INSERT INTO reservations 
      (full_name, email, phone, room_type, check_in, check_out, guests, special_request)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *`,
      [
        fullName,
        email,
        phone,
        roomType,
        checkIn,
        checkOut,
        guests,
        specialRequest,
      ]
    );

    const reservation = result.rows[0];

    // ===============================
    // 2️⃣ SEND EMAILS (PARALLEL)
    // ===============================
    await Promise.all([
      // 📩 Customer Email
      sendBookingEmail({
        to: email,
        subject: "Reservation Confirmation - Oranto Hotel",
        name: fullName,
        booking: reservation,
        room: roomType,
      }),

      // 📩 Hotel Email
      sendBookingEmail({
        to: "reservations@orantohotel.com",
        subject: "New Reservation Received",
        name: "Hotel Admin",
        booking: reservation,
      }),
    ]);

    // ===============================
    // 3️⃣ SEND WHATSAPP MESSAGES
    // ===============================
    await Promise.all([
      // 📲 Customer
      sendWhatsAppMessage(
        phone,
        `Hello ${fullName}, your reservation at Oranto International Airport Hotel has been received.

📅 Check-in: ${checkIn}
📅 Check-out: ${checkOut}
🛏 Room Type: ${roomType}

We look forward to hosting you.`
      ),

      // 📲 Hotel Admin
      sendWhatsAppMessage(
        "+2349160002437", // ✅ ALWAYS use full format
        `📢 New Reservation Alert

Guest: ${fullName}
Room: ${roomType}
Dates: ${checkIn} → ${checkOut}
Guests: ${guests}

📞 ${phone}
📧 ${email}`
      ),
    ]);

    // ===============================
    // 4️⃣ RESPONSE
    // ===============================
    res.status(201).json({
      success: true,
      message: "Reservation created successfully",
      reservation,
    });

  } catch (error) {
    console.error("❌ Reservation Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create reservation",
    });
  }
};