<script setup lang="ts">
import { ref, computed } from 'vue';
import DahmTexts from '@data/dahm_text.json';
import PrivacyPolicyControl from './PrivacyPolicyControl.vue';

const topics: string[] = ['Verwaltung', 'Verkauf', 'Vermietung', 'Anderes'];

const anrede = ref('');
const vorname = ref('');
const nachname = ref('');
const phoneNumber = ref();
const emailAddress = ref();
const topic = ref('');
const message = ref();
const acceptedPolicy = ref(false);
const buttonValid = computed(() => {
	return (
		acceptedPolicy.value &&
		// anrede.value.trim().length &&
		vorname.value.trim().length &&
		nachname.value.trim().length &&
		emailAddress.value.trim().length &&
		topic.value.trim().length &&
		message.value.trim().length
	);
});

function handlePolicyStatus(accepted: boolean): void {
	acceptedPolicy.value = accepted;
}
</script>

<template>
	<form class="message-form">
		<!-- <select v-model="anrede" required>
			<option disabled value="" hidden>Anrede*</option>
			<option v-for="iAnrede in DahmTexts.anrede_list" :value="iAnrede">
				{{ iAnrede }}
			</option>
		</select> -->
		<div class="form-flex2">
			<input type="text" v-model="vorname" placeholder="Vorname*" required />
			<input type="text" v-model="nachname" placeholder="Nachname*" required />
		</div>
		<div class="form-flex2">
			<input type="email" v-model="emailAddress" placeholder="E-Mail*" required />
			<input type="tel" v-model="phoneNumber" placeholder="Telefon" />
		</div>
		<select v-model="topic" class="ctrl-half" required>
			<option disabled value="" selected hidden>Betreff*</option>
			<option v-for="iBetreff in topics" :value="iBetreff">
				{{ iBetreff }}
			</option>
		</select>
		<textarea
			v-model="message"
			rows="5"
			maxlength="2000"
			placeholder="Nachricht*"
			class="ctrl-full"
			required
		></textarea>
		<PrivacyPolicyControl ctrl-id="policy_feedback" @policy-status="handlePolicyStatus" />
		<button class="red-button" :disabled="!buttonValid">Absenden</button>
	</form>
</template>

<style src="/src/styles/form.css"></style>

<style scoped>
.message-form textarea {
	resize: none;
	margin-top: 0.4em;
}

.message-form .red-button {
	margin-top: 0.2em;
}
</style>
