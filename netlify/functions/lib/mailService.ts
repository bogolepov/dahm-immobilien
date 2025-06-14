import type { HandlerResponse } from '@netlify/functions';
import nodemailer from 'nodemailer';

export type TMail = {
	to: string;
	subject: string;
	html: string;
};
export async function sendMails(lang: string, transporterMail: string, clientMail: TMail): Promise<HandlerResponse>;
export async function sendMails(
	lang: string,
	transporterMail: string,
	clientMail: TMail,
	antreprizaMail: TMail
): Promise<HandlerResponse>;
export async function sendMails(
	lang: string,
	transporterMail: string,
	clientMail: TMail,
	antreprizaMail?: TMail
): Promise<HandlerResponse> {
	const transporter =
		process.env.MODE === process.env.MODE_LOCALHOST
			? nodemailer.createTransport({
					service: 'gmail',
					auth: {
						user: process.env.ANTREPRIZA_GMAIL_EMAIL,
						pass: process.env.ANTREPRIZA_GMAIL_PASSWORD,
					},
				})
			: nodemailer.createTransport({
					pool: true,
					host: process.env.ANTREPRIZA_SMTP_HOST,
					port: 587,
					secure: false, // use TLS
					ignoreTLS: true,
					auth: {
						user: transporterMail,
						pass: process.env.ANTREPRIZA_SMTP_PASSWORD,
					},
				});

	const companyName: string = 'Dahm Immobilien Verwaltung GmbH';
	const fromEmail: string =
		process.env.MODE === process.env.MODE_LOCALHOST
			? `${companyName}<${process.env.ANTREPRIZA_GMAIL_EMAIL}>`
			: `${companyName}<${transporterMail}>`;

	const mailOptionsClient = {
		from: fromEmail,
		to: clientMail.to,
		subject: clientMail.subject,
		html: clientMail.html,
	};
	// console.log(mailOptionsClient);

	try {
		await transporter.sendMail(mailOptionsClient);

		if (antreprizaMail) {
			const antreprizaMailTo: string =
				process.env.MODE === process.env.MODE_PRODUCTION ? transporterMail : process.env.ANTREPRIZA_EMAIL_BOGOLEPOV;

			const mailOptionsAntrepriza = {
				from: fromEmail,
				to: antreprizaMailTo,
				subject: antreprizaMail.subject,
				html: antreprizaMail.html,
			};

			try {
				await transporter.sendMail(mailOptionsAntrepriza);
			} catch (error) {
				console.error(error);
			}
		}

		return {
			statusCode: 200,
			body: JSON.stringify({
				message: 'Email sent successfully',
			}),
		};
	} catch (error) {
		console.error(error);
		return {
			statusCode: 500,
			body: JSON.stringify({
				message: error.message,
			}),
		};
	}
}
