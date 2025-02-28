<script setup lang="ts">
import { ref } from 'vue';
import Dahm from '@data/dahm.json';

interface Props {
	ctrlId: string;
}
const { ctrlId } = defineProps<Props>();

const emit = defineEmits<{
	policyStatus: [accepted: boolean];
}>();

const acceptedPolicy = ref(false);
function changeStatus() {
	acceptedPolicy.value = !acceptedPolicy.value;
	emit('policyStatus', acceptedPolicy.value);
}
function clickCheckbox(event: KeyboardEvent) {
	if ('Enter' === event.code) {
		event.preventDefault();
		changeStatus();
	}
}
</script>

<template>
	<div class="policy-flex">
		<input :id="ctrlId" type="checkbox" :checked="acceptedPolicy" @change="changeStatus" @keypress="clickCheckbox" />
		<label :for="ctrlId"
			>Ich habe die <a href="/datenschutz/">Datenschutzerklärung</a> zur Kenntnis genommen. Ich stimme zu, dass meine
			Angaben und Daten zur Beantwortung meiner Anfrage elektronisch erhoben und gespeichert werden. Hinweis: Sie können
			Ihre Einwilligung jederzeit für die Zukunft per E-Mail an
			<a :href="`mailto:${Dahm.email}`">{{ Dahm.email }}</a> widerrufen.</label
		>
	</div>
</template>

<style>
.policy-flex {
	display: flex;
	width: 100%;
	padding: 0.4em 0;
}
.policy-flex input {
	width: min-content;
	margin-bottom: auto;
	margin-top: 0.65em;
}
.policy-flex label {
	flex-grow: 1;
	margin-left: 2%;
	font-size: 0.78rem;
	font-variation-settings: 'opsz' var(--text-opsz-max);
	line-height: 1.25;
}
.policy-flex label a {
	color: var(--color-dahm-bordo);
	font-weight: 450;
}
</style>
