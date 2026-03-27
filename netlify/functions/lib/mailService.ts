import nodemailer from 'nodemailer';
import { readFileSync } from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import type { ContactFormVariables } from './mailVariables';
import dahm from '@data/dahm.json';

const TEMPLATES_DIR = path.resolve(__dirname, './lib/emails/html');

export const TemplateNames = {
	contact_form: 'contact_form',
} as const;

export type TemplateNames = (typeof TemplateNames)[keyof typeof TemplateNames];

function getHdbrTemplate(templateName: TemplateNames) {
	const filePath = path.join(TEMPLATES_DIR, `${templateName}.html`);
	return readFileSync(filePath, 'utf8');
}

export function getEmailHtml(templateName: TemplateNames, emailVariables: ContactFormVariables) {
	try {
		const hdbrTemplateContent = getHdbrTemplate(templateName);
		const template = Handlebars.compile(hdbrTemplateContent);
		return template(emailVariables);
	} catch (error) {
		console.error('Prepare EEmail [fatal]:');
		console.error(error);
		return undefined;
	}
}

// IDEAL OPTION:
// LOCALHOST: transport/from - GMAIL, to Dahm - developer email
// DEVELOP: transport/from - INFO email, to Dahm - developer email
// PRODUCTION: transport/from - INFO email, to Dahm - INFO email

// CURRENT OPTION:
// LOCALHOST: transport/from - GMAIL, to Dahm - developer email
// DEVELOP: transport/from - GMAIL, to Dahm - developer email
// PRODUCTION: transport/from - GMAIL, to Dahm - INFO email

export type TransporterInfo = {
	transporter: nodemailer.Transporter;
	emailFrom: string;
	emailToDahm: string;
};
export function createTransporter(transporterMail: string): TransporterInfo {
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.DAHM_GMAIL_EMAIL,
			pass: process.env.DAHM_GMAIL_PASSWORD,
		},
	});

	/*
	const transporter =
		process.env.MODE === process.env.MODE_LOCALHOST
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
					port: 465,
					secure: true,
					auth: {
						user: transporterMail,
						pass: process.env.DAHM_SMTP_PASSWORD,
					},
					// debug: true,  // включите, чтобы увидеть больше логов
					// logger: true,
				});
	*/

	const fromEmailDescription: string = `${dahm.company_fullname} `;
	const emailFrom: string = `${fromEmailDescription}<${process.env.DAHM_GMAIL_EMAIL}>`;
	/*
	const emailFrom: string =
		process.env.MODE === process.env.MODE_LOCALHOST
			? `${fromEmailDescription}<${process.env.DAHM_GMAIL_EMAIL}>`
			: `${fromEmailDescription}<${transporterMail}>`;
			*/

	const emailToDahm: string =
		process.env.MODE === process.env.MODE_PRODUCTION ? process.env.DAHM_EMAIL_INFO! : process.env.DAHM_EMAIL_BOGOLEPOV!;

	return { transporter, emailFrom, emailToDahm };
}

export type TMailData = {
	from: string;
	to: string;
	subject: string;
	html?: string;
};

export async function sendMail(transporter: nodemailer.Transporter, mailData: TMailData): Promise<boolean> {
	try {
		if (mailData.html === undefined) {
			throw new Error('Email HTML content is undefined');
		}
		await transporter.sendMail(mailData);
		return true;
	} catch (error) {
		console.error('Nodemailer: sendEmail() [fatal]:');
		console.error(error);
		return false;
	}
}
