import nodemailer from "nodemailer";

const generateMail = async (verificationCode, email) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,

      auth: {
        user: process.env.FROM_EMAIL,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: email,
      subject: "Account verification",
      text: `Your verification code is ${verificationCode}`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        reject({ success: false });
      } else {
        console.log("Email has been sent -", info.response);
        resolve({ success: true });
      }
    });
  });
};

export default generateMail;
