const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendMail = async (email, subject, content) => {
  try {
    var mailOptions = {
      from: { name: "SoleSphere", address: process.env.SMTP_USER },
      to: email,
      subject: subject,
      html: content,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      }
      console.log("Message sent : ", info.messageId);
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = sendMail;
