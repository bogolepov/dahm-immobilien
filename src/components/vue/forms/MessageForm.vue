<script setup lang="ts">
import { ref, computed, useId, useTemplateRef } from 'vue';
import DahmTexts from '@data/dahm_text.json';
import PrivacyPolicyControl from './PrivacyPolicyControl.vue';
import SendingLoader from './Loader.vue';
import MessageDialog from './Dialog.vue';
import {
	MSG_MAX_LENGTH,
	MSG_MIN_LENGTH,
	sendContactForm,
	isValidContactForm,
	validEmailAddress,
	validMessage,
	validPhoneNumber,
	type TContactForm,
} from '@scripts/contact_form';

type PrivacyPolicyType = InstanceType<typeof PrivacyPolicyControl>;
type SendingLoaderType = InstanceType<typeof SendingLoader>;
type MessageDialogType = InstanceType<typeof MessageDialog>;

const topics: string[] = ['Verwaltung', 'Verkauf', 'Vermietung', 'Anderes'];
const agreeId = useId();
// const agreeId2 = useId();
const MSG_PLACEHOLDER = 'Nachricht* (' + MSG_MIN_LENGTH + '-' + MSG_MAX_LENGTH + ' Zeichen)';

const validationMode = ref<boolean>(false);
const formSent = ref<boolean>(false);

const firstName = ref<string>('');
const lastName = ref<string>('');
const phoneNumber = ref<string>('');
const emailAddress = ref<string>('');
const subject = ref<string>('');
const topic = ref<string>('');
const message = ref<string>('');
const acceptedPolicy = ref(false);
const agreedConnection = ref(false);

const policyComponent = useTemplateRef<PrivacyPolicyType>('policy-ctrl');
const sendingLoader = useTemplateRef<SendingLoaderType>('loader-ctrl');
const msgDialog = useTemplateRef<MessageDialogType>('msg-dialog');

const buttonValid = computed(() => {
	if (!validationMode.value)
		return (
			agreedConnection.value &&
			acceptedPolicy.value &&
			firstName.value?.trim().length &&
			lastName.value?.trim().length &&
			emailAddress.value?.trim().length &&
			topic.value?.trim().length &&
			message.value?.trim().length
		);
	else return validateFormData() !== undefined;
});

function handlePolicyStatus(accepted: boolean): void {
	acceptedPolicy.value = accepted;
}

function handleSendForm() {
	validationMode.value = true;
	const formData = validateFormData();
	if (formData) {
		startSendingLoader();
		sendContactForm(formData, handleSendResult);
	}
}

function handleSendResult(isOk: boolean, msg: string) {
	if (isOk) {
		resetForm();
		formSent.value = true;
	}
	stopSendingLoader();
	msgDialog.value?.show(msg);
}

function validateFormData(): TContactForm | undefined {
	const formData: TContactForm = {
		firstName: firstName.value,
		lastName: lastName.value,
		email: emailAddress.value,
		phone: phoneNumber.value?.replaceAll(' ', ''),
		subject: subject.value,
		topic: topic.value,
		message: message.value,
	};

	if (isValidContactForm(formData, true)) return formData;

	return undefined;
}

function resetForm() {
	validationMode.value = false;
	firstName.value = '';
	lastName.value = '';
	phoneNumber.value = '';
	emailAddress.value = '';
	subject.value = '';
	topic.value = '';
	message.value = '';
	agreedConnection.value = false;
	policyComponent.value?.resetPolicy();
}

function startSendingLoader() {
	sendingLoader.value?.start();
}
function stopSendingLoader() {
	sendingLoader.value?.stop();
}

function closeDialog() {
	msgDialog.value?.close();
	if (formSent.value) closeCardMessage();
}

function closeCardMessage() {
	document.querySelector('.sb-card.message.open')?.classList.remove('open');
	formSent.value = false;
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
			spellcheck="false"
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
		<PrivacyPolicyControl ref="policy-ctrl" @policy-status="handlePolicyStatus" />
		<button type="button" class="red-button" @click="handleSendForm" :disabled="!buttonValid">Absenden</button>
		<SendingLoader ref="loader-ctrl" :background="false" />
		<MessageDialog ref="msg-dialog" @handle-close="closeDialog" />
	</form>
</template>

<style src="/src/styles/form.css"></style>

<style scoped>
.message-form {
	position: relative;
}

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
