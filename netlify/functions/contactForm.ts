import type { Handler, HandlerResponse } from '@netlify/functions';
import { validationContactFormJson, isValidContactForm, type TContactForm } from '@scripts/contact_form';
// import { LANG_LIST, EMAIL_REGEX } from '@scripts/consts.ts';
// import { fromHtmlToPlainText, getJsonDictionary, getJsonTheater, nonBreakingSpace } from './lib/utils.ts';
import { makeHtmlEmail } from './lib/mailUtils.ts';
import { type TMail, getDahmEmailAddress, sendMails } from './lib/mailService.ts';
import { fromHtmlToPlainText, nonBreakingSpace } from './lib/utils.ts';
import Dahm from '@data/dahm.json';

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

	let clientMail: TMail = {
		to: contactForm.email,
		subject: contactForm.topic,
		html: makeHtmlEmail(contactForm.topic, makeContent(contactForm, false)),
	};
	let dahmMail: TMail = {
		to: getDahmEmailAddress(),
		subject: contactForm.topic,
		html: makeHtmlEmail(contactForm.topic, makeContent(contactForm, true)),
	};

	const isSent = await sendMails(clientMail, dahmMail);
	if (isSent) return handlerResponse(200, 'Ihre Anfrage wurde erfolgreich übermittelt');
	else return handlerResponse(500, 'Fehler beim Senden der Anfrage.');
};

function makeContent(contactForm: TContactForm, toDahm: boolean): string {
	return makePersonalMessage(contactForm, toDahm) + makeContactFormBlock(contactForm);
}

function makePersonalMessage(contactForm: TContactForm, toDahm: boolean): string {
	let diffText: string;

	if (toDahm) {
		const strHello: string = 'Hallo Dahm Immobilien Team,';
		const formText = 'eine neue Anfrage wurde über das Kontaktformular auf der Website gesendet.';

		diffText = `\
<tr><td style="font-size: 125%; padding-bottom: 15px; line-height: 120%; color: #000000; font-weight: 500">${strHello}</td></tr>\
<tr><td style="line-height: 120%; color: #000000">${formText}</td></tr>\
`;
	} else {
		const strHello: string = 'Hallo ' + contactForm.firstName + ',';
		const formText =
			'Ihre Anfrage wurde erfolgreich gesendet. Bei Bedarf werden wir uns schnellstmöglich mit Ihnen in Verbindung setzen.';

		diffText = `\
<tr><td style="font-size: 125%; padding-bottom: 15px; line-height: 120%; color: #000000; font-weight: 500">${strHello}</td></tr>\
<tr><td style="line-height: 120%; color: #000000; padding-bottom: 15px">${formText}</td></tr>\
<tr><td style="line-height: 120%; color: #000000">${Dahm.company_fullname}</td></tr>\
<tr><td style="line-height: 120%">\
<a href='${Dahm.website_link}/' style="line-height: 120%; color: #000000">${Dahm.domain}</a>\
</td></tr>\
`;
	}

	return `\
<table border="0" role="presentation" style="width: 100%; margin: 0; padding: 0 0 15px 0; border-bottom: 1px solid #000000">\
<tbody>\
${diffText}\
</tbody>\
</table>\
`;
}

function makeContactFormBlock(contactForm: TContactForm): string {
	return `\
<table border="0" cellpadding="0" role="presentation" style="width: 100%; margin: 0; padding: 15px 0 0 0">\
<tbody>\
<tr>\
<td style="line-height: 120%; color: #222222; vertical-align: top">${nonBreakingSpace('Betreff :')}</td>\
<td style="line-height: 120%; color: #000000; vertical-align: top; padding: 0 0 10px 8px">${fromHtmlToPlainText(contactForm.topic)}</td>\
</tr>\
<tr>\
<td style="line-height: 120%; color: #222222; vertical-align: top">${nonBreakingSpace('Name :')}</td>\
<td style="line-height: 120%; color: #000000; vertical-align: top; padding: 0 0 10px 8px">${fromHtmlToPlainText(contactForm.firstName + ' ' + contactForm.lastName)}</td>\
</tr>\
<tr>\
<td style="line-height: 120%; color: #222222; vertical-align: top">${nonBreakingSpace('E-Mail :')}</td>\
<td style="line-height: 120%; color: #000000; vertical-align: top; padding: 0 0 10px 8px">\
<a href='${'mailto:' + fromHtmlToPlainText(contactForm.email)}' style="line-height: 120%; color: #000000">${fromHtmlToPlainText(contactForm.email)}</a></td>\
</tr>\
<tr>\
<td style="line-height: 120%; color: #222222; vertical-align: top">${nonBreakingSpace('Telefon :')}</td>\
<td style="line-height: 120%; color: #010101; vertical-align: top; padding: 0 0 10px 8px">${fromHtmlToPlainText(contactForm.phone ? contactForm.phone : '-')}</td>\
</tr>\
<tr>\
<td style="line-height: 120%; color: #222222; vertical-align: top"><span style="color: #222222">${nonBreakingSpace('Nachricht :')}</span></td>\
<td style="line-height: 120%; color: #010101; vertical-align: top; padding: 0 0 10px 8px">${fromHtmlToPlainText(contactForm.message)}</td>\
</tr>\
</tbody>\
</table>\
`;
}
