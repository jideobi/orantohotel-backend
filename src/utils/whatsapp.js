// import twilio from "twilio";

// const client = twilio(
//   process.env.TWILIO_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

// // Format Nigerian numbers to international format
// const formatPhone = (phone) => {
//   if (!phone) throw new Error("Phone number is required");

//   phone = phone.replace(/\s+/g, "").replace(/-/g, "");

//   // +234...
//   if (phone.startsWith("+234")) {
//     return phone;
//   }

//   // 234...
//   if (phone.startsWith("234")) {
//     return `+${phone}`;
//   }

//   // 080...
//   if (phone.startsWith("0")) {
//     return `+234${phone.slice(1)}`;
//   }

//   throw new Error("Invalid phone number format");
// };

// export const sendWhatsAppMessage = async (to, message) => {
//   try {
//     const formattedNumber = formatPhone(to);

//     const response = await client.messages.create({
//       from: "whatsapp:+14155238886", // Twilio sandbox number
//       to: `whatsapp:${formattedNumber}`, // MUST include +
//       body: message,
//     });

//     console.log("✅ WhatsApp sent:", response.sid);
//     return response;

//   } catch (error) {
//     console.error("❌ WhatsApp Error:", error.message);
//     throw error;
//   }
// };

import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Format Nigerian numbers
// const formatPhone = (phone) => {
//   if (!phone) throw new Error("Phone number is required");

//   phone = phone.trim();

//   // ✅ If already correct format
//   if (phone.startsWith("+234") && phone.length === 14) {
//     return phone;
//   }

//   // Remove non-digits AFTER checking +
//   phone = phone.replace(/\D/g, "");

//   if (phone.startsWith("234") && phone.length === 13) {
//     return `+${phone}`;
//   }

//   if (phone.startsWith("0") && phone.length === 11) {
//     return `+234${phone.slice(1)}`;
//   }

//   throw new Error(`Invalid phone number format: ${phone}`);
// };



// ================================
// 📞 FORMAT PHONE (NIGERIA)
// ================================
const formatPhone = (phone) => {
  if (!phone) throw new Error("Phone number is required");

  phone = phone.trim();

  // ✅ Already correct format
  if (phone.startsWith("+234") && phone.length === 14) {
    return phone;
  }

  // Remove non-digits
  phone = phone.replace(/\D/g, "");

  // 234XXXXXXXXXX
  if (phone.startsWith("234") && phone.length === 13) {
    return `+${phone}`;
  }

  // 080XXXXXXXX
  if (phone.startsWith("0") && phone.length === 11) {
    return `+234${phone.slice(1)}`;
  }

  throw new Error(`Invalid phone number format: ${phone}`);
};

// ================================
// 💬 SEND WHATSAPP MESSAGE
// ================================
export const sendWhatsAppMessage = async (to, message) => {
  try {
    const formattedNumber = formatPhone(to);

    console.log("📤 Sending to:", formattedNumber);

    const response = await client.messages.create({
      from: "whatsapp:+14155238886", // Twilio Sandbox
      to: `whatsapp:${formattedNumber}`,
      body: message,
    });

    console.log("✅ WhatsApp sent:", response.sid);
    return response;

  } catch (error) {
    console.error("❌ WhatsApp Error:", error.message);
    throw error;
  }
};

