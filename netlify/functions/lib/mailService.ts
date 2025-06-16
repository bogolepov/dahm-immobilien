import type { HandlerResponse } from '@netlify/functions';
import nodemailer from 'nodemailer';

// IDEAL OPTION:
// LOCALHOST: transport/from - GMAIL, to Dahm - developer email
// DEVELOP: transport/from - INFO email, to Dahm - developer email
// PRODUCTION: transport/from - INFO email, to Dahm - transport/INFO

// CURRENT OPTION:
// LOCALHOST: transport/from - GMAIL, to Dahm - developer email
// DEVELOP: transport/from - GMAIL, to Dahm - developer email
// PRODUCTION: transport/from - GMAIL, to Dahm - INFO email

export type TMail = {
	to: string;
	subject: string;
	html: string;
};

function getTransporterEmailAddress() {
	if (!process.env.DAHM_GMAIL_EMAIL) console.error('Error: transporter email is empty.');
	return process.env.DAHM_GMAIL_EMAIL;
	// if (!process.env.DAHM_EMAIL_INFO) console.error('Error: transporter email is empty.');
	// return process.env.DAHM_EMAIL_INFO;
}
function getTransporterEmailPassword() {
	if (!process.env.DAHM_EMAIL_INFO) console.error('Error: transporter p.email is empty.');
	return process.env.DAHM_EMAIL_INFO;
}
export function getDahmEmailAddress() {
	if (!process.env.DAHM_EMAIL_BOGOLEPOV) console.error('Error: develop email is empty.');
	if (!process.env.DAHM_EMAIL_INFO) console.error('Error: info-email is empty.');
	return process.env.MODE === process.env.MODE_PRODUCTION
		? process.env.DAHM_EMAIL_INFO
		: process.env.DAHM_EMAIL_BOGOLEPOV;
}

// export async function sendMails(clientMail: TMail): Promise<HandlerResponse>;
// export async function sendMails(clientMail: TMail, dahmMail: TMail): Promise<HandlerResponse>;
// export async function sendMails(clientMail: TMail, dahmMail?: TMail): Promise<HandlerResponse> {
export async function sendMails(clientMail: TMail, dahmMail: TMail): Promise<boolean> {
	const transporter = createTransporter();

	const companyName: string = 'Dahm Immobilien Verwaltung GmbH';
	const fromEmail: string = `${companyName}<${process.env.DAHM_GMAIL_EMAIL}>`;

	const mailOptionsClient = {
		from: fromEmail,
		to: clientMail.to,
		subject: clientMail.subject,
		html: clientMail.html,
	};
	const mailOptionsDahm = {
		from: fromEmail,
		to: dahmMail.to,
		subject: dahmMail.subject,
		html: dahmMail.html,
	};
	// console.log(mailOptionsClient);
	// console.log(mailOptionsDahm);

	try {
		await transporter.sendMail(mailOptionsDahm);

		try {
			await transporter.sendMail(mailOptionsClient);
		} catch (error) {
			console.error(error);
		}

		return true;
		// return  {
		// 	statusCode: 200,
		// 	body: JSON.stringify({
		// 		message: 'Email sent successfully',
		// 	}),
		// };
	} catch (error) {
		console.error(error);
		return false;
		// return {
		// 	statusCode: 500,
		// 	body: JSON.stringify({
		// 		message: error.message,
		// 	}),
		// };
	}
}

function createTransporter() {
	return nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.DAHM_GMAIL_EMAIL,
			pass: process.env.DAHM_GMAIL_PASSWORD,
		},
	});
	/*
	return process.env.MODE === process.env.MODE_LOCALHOST
		? nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: process.env.DAHM_GMAIL_EMAIL,
					pass: process.env.DAHM_GMAIL_PASSWORD,
				},
			})
		: nodemailer.createTransport({
				pool: true,
				host: process.env.DAHM_SMTP_HOST,
				port: 587,
				secure: false, // use TLS
				ignoreTLS: true,
				auth: {
					user: transporterMail,
					pass: process.env.DAHM_SMTP_PASSWORD,
				},
			});
	*/
}
