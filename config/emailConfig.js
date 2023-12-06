import nodeMailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const configEmail = {
    //send email verification link
sendEmailOtp: async (name, email, otp) => {
    try {
      const transporter = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.USER_MAIL,
          pass: process.env.PASS,
        },
      });
      const mailOptions = {
        from: "Event Management",
        to: email,
        subject: "For verification",
        html: `<p>Hello ${name}, Your Event Management One-Time Password is <strong>${otp}</strong></p>`,
      };
      const info = await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error(error.message);
    }
  },
  
}