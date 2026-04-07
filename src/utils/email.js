import SibApiV3Sdk from "sib-api-v3-sdk";

export const sendBookingEmail = async ({ to, subject, name, booking, room }) => {
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-NG", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  const client = SibApiV3Sdk.ApiClient.instance;
  client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  await apiInstance.sendTransacEmail({
    sender: { email: "oranto900@gmail.com", name: "Oranto Hotel" },
    to: [{ email: to, name }],
    subject,
 htmlContent: `
<div style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, Helvetica, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 0;">
    <tr>
      <td align="center">

        <!-- MAIN CONTAINER -->
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.08);">

          <!-- HEADER -->
          <tr>
            <td style="background:#0f172a; padding:30px; text-align:center;">
              <h1 style="color:#ffffff; margin:0; font-size:24px; letter-spacing:1px;">
                ORANTO INTERNATIONAL AIRPORT HOTEL
              </h1>
              <p style="color:#cbd5f5; margin-top:8px; font-size:14px;">
                Booking Confirmation
              </p>
            </td>
          </tr>

          <!-- SUCCESS MESSAGE -->
          <tr>
            <td style="padding:30px 40px;">
              <h2 style="margin:0 0 10px; color:#16a34a;">
                Your Reservation is Confirmed 🎉
              </h2>
              <p style="color:#555; font-size:15px; line-height:1.6;">
                Dear ${booking.full_name},<br/><br/>
                Thank you for choosing Oranto International Airport Hotel Enugu. Your booking has been successfully received and confirmed.
              </p>
            </td>
          </tr>

          <!-- BOOKING DETAILS CARD -->
          <tr>
            <td style="padding:0 40px 30px;">
              <div style="border:1px solid #e5e7eb; border-radius:10px; padding:20px; background:#f9fafb;">

                <h3 style="margin-top:0; color:#111827;">Booking Details</h3>

                <table width="100%" cellpadding="8" cellspacing="0" style="font-size:14px; color:#374151;">
                  <tr>
                    <td><strong>Guest Name:</strong></td>
                    <td>${booking.full_name}</td>
                  </tr>
                  <tr>
                    <td><strong>Room Type:</strong></td>
                    <td>${room || booking.room_type || booking.room_name}</td>
                  </tr>
                  <tr>
                    <td><strong>Phone:</strong></td>
                    <td>${booking.phone}</td>
                  </tr>
                  <tr>
                    <td><strong>Check-in:</strong></td>
                    <td>${formatDate(booking.check_in)}</td>
                  </tr>
                  <tr>
                    <td><strong>Check-out:</strong></td>
                    <td>${formatDate(booking.check_out)}</td>
                  </tr>
                </table>

              </div>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td align="center" style="padding:20px 40px;">
              <a href="https://orantohotel.vercel.app"
                 style="display:inline-block; padding:14px 28px; background:#16a34a; color:#ffffff; text-decoration:none; border-radius:8px; font-weight:bold;">
                Visit Our Website
              </a>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#f9fafb; padding:25px 40px; text-align:center; font-size:13px; color:#6b7280;">
              <p style="margin:0;">
                Oranto International Airport Hotel<br/>
                Enugu, Nigeria
              </p>

              <p style="margin:10px 0 0;">
                Need help? Contact us anytime.<br/>
                📞 +234 916 000 2437
              </p>

              <p style="margin-top:15px; font-size:12px; color:#9ca3af;">
                © ${new Date().getFullYear()} Oranto Hotel. All rights reserved.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</div>
`
  });
};