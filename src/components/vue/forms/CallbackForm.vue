<script setup lang="ts">
import { ref, computed } from 'vue';
import DahmTexts from '@data/dahm_text.json';
import PrivacyPolicyControl from './PrivacyPolicyControl.vue';

const anrede = ref('');
const vorname = ref('');
const nachname = ref('');
const phoneNumber = ref();
const acceptedPolicy = ref(false);
const buttonValid = computed(() => {
	return (
		acceptedPolicy.value &&
		anrede.value.trim().length &&
		vorname.value.trim().length &&
		nachname.value.trim().length &&
		phoneNumber.value.trim().length
	);
});

function handlePolicyStatus(accepted: boolean): void {
	acceptedPolicy.value = accepted;
}
</script>

<template>
	<form class="callback-form">
		<select v-model="anrede" class="ctrl-half">
			<option disabled value="" hidden>Anrede*</option>
			<option v-for="iAnrede in DahmTexts.anrede_list" :value="iAnrede">
				{{ iAnrede }}
			</option>
		</select>
		<div class="form-flex2">
			<input type="text" v-model="vorname" placeholder="Vorname*" required />
			<input type="text" v-model="nachname" placeholder="Nachname*" required />
		</div>
		<input type="tel" v-model="phoneNumber" placeholder="Rückrufnummer*" class="ctrl-full" required />
		<PrivacyPolicyControl ctrl-id="policy_callback" @policy-status="handlePolicyStatus" />
		<button class="red-button" :disabled="!buttonValid">Absenden</button>
	</form>
</template>

<style src="/src/styles/form.css"></style>

<style scoped>
.callback-form .red-button {
	margin-top: 0.2em;
}
</style>
