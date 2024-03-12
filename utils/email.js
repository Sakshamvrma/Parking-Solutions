const nodemailer = require(`nodemailer`);
const catchAsync = require('./catchAsync');

const sendEmail = catchAsync(async (options) => {
  //1.Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  //2.Define email options
  const emailOptions = {
    from: `Dhruv Chauhan <22bma011@nith.ac.in>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };
  //3.Actually send the email
  await transporter.sendMail(emailOptions);
});

module.exports = sendEmail;