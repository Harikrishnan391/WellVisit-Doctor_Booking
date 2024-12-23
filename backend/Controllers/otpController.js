// import Twilio from "twilio";
// import dotenv from "dotenv";
// import nodemailer from "nodemailer"
// dotenv.config();


// const client = new Twilio(
//   process.env.TWILIO_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );
// const verifyServiceSid = process.env.TWILIO_VERIFY;

// const sendOtpTwlio = async (mobileNumber) => {
//   console.log(mobileNumber)
//   try {
//     await client.verify.v2.services(verifyServiceSid).verifications.create({
//       to: `+91${mobileNumber}`,
//       channel: `sms`,
//     });
//   } catch (error) {
//     console.log(error,"error");
//     throw new Error("Failed to send the verification code");
//   }
// };

// const verifyCodeTwilio = async (mobileNumber, code) => {
//   try {
//     const verification = await client.verify.v2
//       .services(verifyServiceSid)
//       .verificationChecks.create({
//         to: ` +91${mobileNumber}`,
//         code: code,
//       });

//     if (verification.status === "approved") {
//       // The code is valid, proceed with the sign-up process
//       console.log("Verification successful!");
//       return true;
//       // You can implement your sign-up logic here.
//     } else {
//       throw new Error("Failed to verify code");

//       return false;
//     }
//   } catch (error) {
//     console.log(error, "error messsge from verification");
//     throw new Error("Failed to verify code");
//   }
// };



// const transporter = nodemailer.createTransport({
//   service: "gmail", 
//   auth: {
//     user: "harivk1998@gmail.com", 
//     pass: process.env.MAIL_PASS, 
//   },
// });

// // Function to send an email
// const sendEmail = async (to, subject, text) => {
//   try {
   
//     const info = await transporter.sendMail({
//       from: "harivk1998@gmail.com",
//       to, 
//       subject,
//       text,
//     });

  
//     return true;
//   } catch (error) {
//     console.error("Error sending email: ", error);
//     return false;
//   }
// };


// export { sendOtpTwlio, verifyCodeTwilio};
