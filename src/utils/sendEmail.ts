import nodemailer from "nodemailer";
import winston from "winston";
 
export async function sendEmail(to: string, html: string) { 
  //the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "olaf.tremblay17@ethereal.email", // generated ethereal user
      pass: "NFuCQgrbUHeVbQtUB4", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Proud of Mom support" <support@pom.com>', // sender address
    to: to, // list of receivers
    subject: "Change password", // Subject line
    html,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  winston.log('info', nodemailer.getTestMessageUrl(info));
}
