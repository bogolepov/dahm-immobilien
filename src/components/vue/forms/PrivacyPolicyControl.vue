<script setup lang="ts">
import { ref, useId } from 'vue';
import Dahm from '@data/dahm.json';

const id = useId();

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
		<input
			:id
			type="checkbox"
			:checked="acceptedPolicy"
			class="long-text"
			@change="changeStatus"
			@keypress.enter="clickCheckbox"
		/>
		<label :for="id"
			>Ich habe die <a href="/datenschutz/">Datenschutzerklärung</a> zur Kenntnis genommen. Ich stimme zu, dass meine
			Angaben und Daten zur Beantwortung meiner Anfrage elektronisch erhoben und gespeichert werden. Hinweis: Sie können
			Ihre Einwilligung jederzeit für die Zukunft per E-Mail an
			<a :href="`mailto:${Dahm.email}`">{{ Dahm.email }}</a> widerrufen.</label
		>
	</div>
</template>

<style>
.policy-flex label a {
	color: var(--color-dahm-bordo);
	font-weight: 450;
}
.policy-flex input.long-text {
	margin-bottom: auto;
	margin-top: 0.65em;
}
.policy-flex + .policy-flex input.long-text {
	margin-top: 0.1em;
}
</style>
