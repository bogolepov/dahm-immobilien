import { z } from 'zod/v4';

const ContactFormSchema = z.object({
	firstName: z.string(),
	lastName: z.string(),
	email: z.string(),
	phone: z.string(),
	subject: z.string(),
	topic: z.string(),
	message: z.string(),
});

export type TContactForm = z.infer<typeof ContactFormSchema>;

export function validPhoneNumber(phone: string): boolean {
	const PHONE_REGEX = /^[0\+]{1}[0-9]{7,16}$/;
	return !phone?.length || PHONE_REGEX.test(phone);
}

export function validEmailAddress(email: string): boolean {
	// const EMAIL_REGEX: RegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
	const EMAIL_REGEX: RegExp = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
	if (email && EMAIL_REGEX.test(email)) return true;
	return false;
}

export const MSG_MIN_LENGTH = 10;
export const MSG_MAX_LENGTH = 2000;

export function validMessage(msg: string): boolean {
	return msg?.length >= MSG_MIN_LENGTH && msg?.length <= MSG_MAX_LENGTH;
}

export function sendContactForm(formData: TContactForm, handleSendResult: (isOk: boolean, msg: string) => void): void {
	formData.subject = codeSubject(formData);

	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(formData),
	};

	let isOk: boolean;
	fetch('/.netlify/functions/contactForm', options)
		.then(response => {
			isOk = response.ok;
			return response.json();
		})
		.then(data => {
			// console.log(data.message);
			if (isOk) handleSendResult(true, data.message);
			else throw new Error(data.message);
		})
		.catch(err => handleSendResult(false, err.message));
}

export function validationContactFormJson(json_data: string): TContactForm | undefined {
	console.log(json_data);
	const result = ContactFormSchema.safeParse(JSON.parse(json_data));
	if (result.success) {
		const contactForm: TContactForm = result.data;
		return contactForm;
	} else {
		return undefined;
	}
}

export function isValidContactForm(contactForm: TContactForm, emptySubject: boolean): boolean {
	if (
		contactForm.firstName.length &&
		contactForm.lastName.length &&
		contactForm.topic.length > 3 &&
		validMessage(contactForm.message) &&
		validPhoneNumber(contactForm.phone) &&
		validEmailAddress(contactForm.email)
	) {
		if (emptySubject) return !contactForm.subject.length;
		else return contactForm.subject === codeSubject(contactForm);
	}

	return false;
}

function codeSubject(formData: TContactForm): string {
	return (
		formData.email.slice(-1) +
		formData.email.charAt(0) +
		'+' +
		formData.message.slice(-5, -4) +
		formData.message.charAt(7)
	);
}
