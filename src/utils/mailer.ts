import nodemailer, { SendMailOptions } from "nodemailer";
import log from "./logger";
import AppConfig from "../config/appConfig";
const config = AppConfig.getInstance().config;

const smtp = config.email.smtp;
const auth = config.email.auth;
const defaults = config.email.defaults;

// spread object
// const transporter = nodemailer.createTransport({
//   ...smtp,
//   auth: { ...auth },
// });

// async function createTestCreds() {
//   const creds = await nodemailer.createTestAccount();
//   console.log({ creds });
// }
// createTestCreds();

const transporter = nodemailer.createTransport(
  {
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: {
      user: auth.user,
      pass: auth.pass,
    },
  },
  defaults
);

// with callback wont't block waiting result only to log
// async function sendEmail(payload: SendMailOptions) {
function sendEmail(payload: SendMailOptions) {
  transporter.sendMail(payload, (err, info) => {
    if (err) {
      log.error(err, "Error sending email");
      return;
    }
    // Preview only available when sending through an Ethereal account
    log.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  });
}

// with await will block waiting result only to log
// async function sendEmail(payload: SendMailOptions) {
//   try {
//     const info = await transporter.sendMail(payload);
//     // Preview only available when sending through an Ethereal account
//     log.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
//   } catch (err: any) {
//     log.error("Error sending email", err.message);
//     return;
//   }
// }

export default sendEmail;
