import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const sendEmail = async (config) => {
	const transporter = nodemailer.createTransport({
		service: process.env.SMTP_HOST,
		auth: {
			user: process.env.SMTP_EMAIL,
			pass: process.env.SMTP_PASSWORD,
		},
	})

	const message = {
		from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
		to: config.to,
		subject: config.subject,
		html: `
        <body style="padding: 10px 20px; max-width: 700px; margin: auto;">
            <main>
                <p style="color: #000; font-size: 17px;">${config.greeting}</p>
                <p style="margin-bottom: 5px; color: #000; font-size: 17px;">${
									config.message
								}</p>
                ${config.additionalHTML ? config.additionalHTML : ''}
                ${
									config.urlTitle
										? `
                <a style="display: inline-block; margin: 10px 0; padding: 10px 18px; font-size: 16px; background-color: red; color: white; cursor: pointer; text-decoration: none;" href="${config.url}" target="_blank">${config.urlTitle}</a>
                `
										: ''
								}
            </main>
            <footer style="padding: 16px 0;">
                <p style="font-size: 14px; color: #666;">Upright &copy; 2021. </p>
            </footer>
        </body>
        `,
	}

	const res = await transporter.sendMail(message)

	console.log('Message sent', res.messageId)
}

export default sendEmail
