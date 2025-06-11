<script setup lang="ts">
import { ref, computed, useId } from 'vue';
import DahmTexts from '@data/dahm_text.json';
import PrivacyPolicyControl from './PrivacyPolicyControl.vue';
import type { IContactForm } from '@scripts/contact_form';

const topics: string[] = ['Verwaltung', 'Verkauf', 'Vermietung', 'Anderes'];
const agreeId = useId();
// const agreeId2 = useId();
const MSG_MIN_LENGTH = 10;
const MSG_MAX_LENGTH = 2000;
const MSG_PLACEHOLDER = 'Nachricht* (' + MSG_MIN_LENGTH + '-' + MSG_MAX_LENGTH + ' Zeichen)';

const validationMode = ref<boolean>(false);

const firstName = ref<string>('');
const lastName = ref<string>('');
const phoneNumber = ref<string>('');
const emailAddress = ref<string>('');
const subject = ref<string>('');
const topic = ref<string>('');
const message = ref<string>('');
const acceptedPolicy = ref(false);
const agreedConnection = ref(false);
const buttonValid = computed(() => {
	return (
		agreedConnection.value &&
		acceptedPolicy.value &&
		firstName.value?.trim().length &&
		lastName.value?.trim().length &&
		emailAddress.value?.trim().length &&
		topic.value?.trim().length &&
		message.value?.trim().length
	);
});

function handlePolicyStatus(accepted: boolean): void {
	acceptedPolicy.value = accepted;
}

function handleSendMessage() {
	validationMode.value = true;
	const formData = validateFormData();
	console.log(formData);
}

function validateFormData(): IContactForm | undefined {
	const formData: IContactForm = {
		firstName: firstName.value,
		lastName: lastName.value,
		email: emailAddress.value,
		phone: phoneNumber.value?.replaceAll(' ', ''),
		subject: subject.value,
		topic: topic.value,
		message: message.value,
	};

	if (
		formData.topic?.length > 3 &&
		validMessage(formData.message) &&
		!formData.subject?.length &&
		validPhoneNumber(formData.phone) &&
		validEmailAddress(formData.email)
	)
		return formData;

	return undefined;
}

function validPhoneNumber(phone: string | undefined): boolean {
	if (!phone || !phone.length) return true;
	const PHONE_REGEX = /^[0\+]{1}[0-9]{7,16}$/;
	return PHONE_REGEX.test(phone);
}

function validEmailAddress(email: string): boolean {
	// const EMAIL_REGEX: RegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
	const EMAIL_REGEX: RegExp = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
	if (email && EMAIL_REGEX.test(email)) return true;
	return false;
}

function validMessage(msg: string): boolean {
	return msg?.length >= MSG_MIN_LENGTH && msg?.length <= MSG_MAX_LENGTH;
}
</script>

<template>
	<form class="message-form">
		<div class="form-flex2">
			<input
				type="text"
				:class="{ 'not-valid': validationMode && !firstName.length }"
				v-model.trim="firstName"
				placeholder="Vorname*"
				required
			/>
			<input
				type="text"
				:class="{ 'not-valid': validationMode && !lastName.length }"
				v-model.trim="lastName"
				placeholder="Nachname*"
				required
			/>
		</div>
		<div class="form-flex2">
			<input
				type="email"
				:class="{ 'not-valid': validationMode && !validEmailAddress(emailAddress) }"
				v-model.trim="emailAddress"
				placeholder="E-Mail*"
				required
			/>
			<input
				type="tel"
				:class="{ 'not-valid': validationMode && !validPhoneNumber(phoneNumber) }"
				v-model.trim="phoneNumber"
				placeholder="Telefon"
			/>
		</div>
		<input type="hidden" v-model="subject" placeholder="Subject" />
		<select v-model.trim="topic" class="ctrl-half" required>
			<option disabled value="" selected hidden>Betreff*</option>
			<option v-for="iBetreff in topics" :value="iBetreff">
				{{ iBetreff }}
			</option>
		</select>
		<textarea
			v-model.trim="message"
			rows="5"
			:minlength="MSG_MIN_LENGTH"
			:maxlength="MSG_MAX_LENGTH"
			:placeholder="MSG_PLACEHOLDER"
			class="ctrl-full"
			:class="{ 'not-valid': validationMode && !validMessage(message) }"
			required
		></textarea>
		<div class="flex-checkbox-label">
			<input
				:id="agreeId"
				type="checkbox"
				v-model="agreedConnection"
				@keypress.enter.prevent="agreedConnection = !agreedConnection"
			/>
			<label :for="agreeId">Hiermit erlaube ich Ihnen mich per E-Mail und/oder Telefon zu kontaktieren.</label>
		</div>
		<PrivacyPolicyControl @policy-status="handlePolicyStatus" />
		<button type="button" class="red-button" @click="handleSendMessage" :disabled="!buttonValid">Absenden</button>
	</form>
</template>

<style src="/src/styles/form.css"></style>

<style scoped>
.message-form textarea {
	resize: none;
	margin-top: 0.4em;
}

.message-form .red-button {
	margin-top: 0.6em;
}

.message-form .not-valid {
	outline: 1px solid #ff0000;
}
</style>
