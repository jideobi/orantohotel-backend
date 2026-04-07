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
      <h2>Booking Details</h2>
      <p>Name: ${booking.full_name}</p>
      <p>Room: ${room || booking.room_type || booking.room_name}</p>
      <p>phone: ${booking.phone}</p>
 <p>Check-in: ${formatDate(booking.check_in)}</p>
<p>Check-out: ${formatDate(booking.check_out)}</p>
    `,
  });
};