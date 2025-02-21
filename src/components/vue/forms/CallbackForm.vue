<script setup lang="ts">
import { ref } from 'vue';
import DahmTexts from '@data/dahm_text.json';
import Dahm from '@data/dahm.json';

const anrede = ref('');
const vorname = ref('');
const nachname = ref('');
const phoneNumber = ref();
const acceptedPolicy = ref(false);
</script>

<template>
	<form class="callback-form">
		<select v-model="anrede" placeholder="Anrede*">
			<option disabled value="">Anrede</option>
			<option v-for="iAnrede in DahmTexts.anrede_list" :value="iAnrede">
				{{ iAnrede }}
			</option>
		</select>
		<div class="name-flex">
			<input type="text" v-model="vorname" placeholder="Vorname*" required />
			<input type="text" v-model="nachname" placeholder="Nachname*" required />
		</div>
		<input type="tel" v-model="phoneNumber" placeholder="Rückrufnummer*" required />
		<div class="policy-flex">
			<input id="privacy-policy" type="checkbox" v-model="acceptedPolicy" />
			<label for="privacy-policy"
				>Ich habe die <a href="/datenschutz/">Datenschutzerklärung</a> zur Kenntnis genommen. Ich stimme zu, dass meine
				Angaben und Daten zur Beantwortung meiner Anfrage elektronisch erhoben und gespeichert werden. Hinweis: Sie
				können Ihre Einwilligung jederzeit für die Zukunft per E-Mail an
				<a href="mailto: {{Dahm.email}}">{{ Dahm.email }}</a> widerrufen.</label
			>
		</div>
		<button class="red-button" :disabled="acceptedPolicy">Absenden</button>
	</form>
</template>

<style src="./src/styles/form.css"></style>

<style scoped>
.callback-form input {
	width: 100%;
}
.callback-form select {
	width: 49%;
}

.name-flex,
.policy-flex {
	display: flex;
	width: 100%;
	padding: 0.4em 0;
}

.name-flex input {
	width: 49%;
	margin-right: 1%;
	display: inline-block;
}
.name-flex input + input {
	margin-right: 0;
	margin-left: 1%;
}
.policy-flex input {
	width: min-content;
	margin-bottom: auto;
	margin-top: 0.65em;
}
.policy-flex label {
	--text-opsz: 60;

	flex-grow: 1;
	margin-left: 2%;
	font-size: 0.8rem;
	font-variation-settings: 'opsz' var(--text-opsz);
}
.policy-flex label a {
	color: var(--color-dahm-bordo);
	font-weight: 450;
}

.callback-form .red-button {
	margin-top: 0.2em;
}
</style>
