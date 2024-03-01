import { createTransport } from "nodemailer";

const transporter = createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

export const sendMail = (
  subject: string,
  to: string,
  template: string,
  data?: any,
) => {
  transporter.sendMail({
    from: "Geral <geral@queroajudar.pt>",
    to,
    subject,
    html: `<b>Hello world ${data} ?</b>`,
  });
};
