import nodemailer from "nodemailer";
import envConfig from "@/config/envConfig";

const sendEmail = async (email: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: envConfig.nodemailer.host,
    port: envConfig.nodemailer.port,
    secure: envConfig.env === "production",
    auth: {
      user: envConfig.nodemailer.user,
      pass: envConfig.nodemailer.pass,
    },
  });

  const mailOptions = {
    from: envConfig.nodemailer.from,
    to: email,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
