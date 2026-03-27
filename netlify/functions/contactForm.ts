import type { Handler, HandlerResponse } from '@netlify/functions';
import { validationContactFormJson, isValidContactForm, type TContactForm } from '@scripts/contact_form';
import { TemplateNames, createTransporter, getEmailHtml, sendMail } from './lib/mailService.ts';
import Dahm from '@data/dahm.json';
import dahmText from '@data/dahm_text.json';
import type { ContactFormVariables } from './lib/mailVariables.ts';

function handlerResponse(resCode: number, resMessage: string): HandlerResponse {
	if (resCode >= 400) console.error('resMessage: ' + resCode + ', ' + resMessage);
	return {
		statusCode: resCode,
		body: JSON.stringify({
			message: resMessage,
		}),
	};
}

export const handler: Handler = async (event, context) => {
	if (!event || !event.body) return handlerResponse(400, 'Ungültige Anfrage');

	const contactForm = validationContactFormJson(event.body);
	if (!contactForm) return handlerResponse(400, 'Ungültiges Datenformat.');
	if (!isValidContactForm(contactForm, false)) return handlerResponse(400, 'Falsche Anfragedaten.');

	// const { lang, subject, topic, name, email, message, now } = messageData;
	const getHtmlVariables = (toCompany: boolean): ContactFormVariables => ({
		subject: toCompany ? 'Neue Kontaktanfrage (Website)' : 'Bestätigung Ihrer Anfrage bei ' + Dahm.company_fullname,
		hello: toCompany ? 'Guten Tag,' : `Hallo ${contactForm.firstName},`,
		main_text: toCompany ? dahmText.cf_main_text_company : dahmText.cf_main_text_client,
		...(toCompany && { to_company: 'true' }),
		auto_email_text: toCompany ? dahmText.cf_auto_email_text_company : dahmText.cf_auto_email_text_client,
		topic: contactForm.topic,
		name: contactForm.firstName + ' ' + contactForm.lastName,
		email: contactForm.email,
		phone: contactForm.phone ? contactForm.phone : '-',
		message: contactForm.message,
	});

	const { transporter, emailFrom, emailToDahm } = createTransporter(process.env.DAHM_SMTP_HOST!);
	const htmlVariablesDahm = getHtmlVariables(true);
	if (
		!(await sendMail(transporter, {
			from: emailFrom,
			to: emailToDahm,
			subject: htmlVariablesDahm.subject,
			html: getEmailHtml(TemplateNames.contact_form, htmlVariablesDahm),
		}))
	) {
		return handlerResponse(500, 'Fehler beim Senden der Anfrage.');
	} else {
		// Отправляем письмо клиенту только если письмо для Антрепризы успешно отправлено
		// Результат отправки письма клиенту не критичен, поэтому не обрабатываем
		// возможные ошибки при отправке клиентского письма
		const htmlVariablesClient = getHtmlVariables(false);
		await sendMail(transporter, {
			from: emailFrom,
			to: contactForm.email,
			subject: htmlVariablesClient.subject,
			html: getEmailHtml(TemplateNames.contact_form, htmlVariablesClient),
		});
		return handlerResponse(200, 'Ihre Anfrage wurde erfolgreich übermittelt');
	}
};
