export interface IContactForm {
	firstName: string;
	lastName: string;
	email: string;
	phone?: string;
	subject: string;
	topic: string;
	message: string;
}

export function validPhoneNumber(phone: string | undefined): boolean {
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

export function sendContactForm(formData: IContactForm, handleSendResult: (isOk: boolean, msg: string) => void): void {
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

function codeSubject(formData: IContactForm): string {
	return (
		formData.email.slice(-1) +
		formData.email.charAt(0) +
		'+' +
		formData.message.slice(-5, -4) +
		formData.message.charAt(7)
	);
}
