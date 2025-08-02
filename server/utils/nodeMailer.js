const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 465,
	secure: true, // use TLS
	auth: {
		user: process.env.EMAIL_USER_NAME,
		pass: process.env.EMAIL_PASSWORD,
	},
});

const sendEmail = async ({ from, to, subject, text, html }) => {
	try {
		const info = await transporter.sendMail({
			from,
			to,
			subject,
			text,
			html,
		});
	} catch (error) {
    console.log("Error Sending Email",error);
  }
};

module.exports = sendEmail;
