const nodemailer = require('nodemailer');
import {
  FROM_EMAIL,
  FROM_NAME,
  SMTP_EMAIL,
  SMTP_HOST,
  SMTP_PASSWORD,
  SMTP_PORT
} from '../config/env-varialbes';

export const sendMail = async (options: any) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD
    }
  });

  // send mail with defined transport object
  let message = {
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: `<b>${options.message}</b>`
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};
