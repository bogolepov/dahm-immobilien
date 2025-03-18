<script setup lang="ts">
import { computed } from 'vue';
import { ConsentInfos } from '@scripts/cookies';
import { cccConsent } from './stateStore';
import { setConsent } from '@scripts/cookies';

interface Props {
	type: string;
}

const { type } = defineProps<Props>();
const isServiceOn = computed(() => {
	return cccConsent.value[type as keyof typeof cccConsent.value];
});
const serviceTitle = computed(() => {
	return ConsentInfos[type as keyof typeof ConsentInfos].title;
});

function doServiceOn(): void {
	cccConsent.value[type as keyof typeof cccConsent.value] = true;
	setConsent(cccConsent.value);
}
</script>

<template>
	<div v-if="!isServiceOn" class="service-off">
		<p>
			<slot name="disabled-message"
				>An dieser Stelle finden Sie Inhalte von {{ serviceTitle }}. Um die Inhalte darzustellen, benötigen wir Ihre
				Zustimmung.</slot
			>
		</p>
		<button type="button" @click="doServiceOn" class="red-button">Inhalte aktivieren</button>
	</div>
	<div v-else class="service-on">
		<slot></slot>
	</div>
</template>

<style>
.service-off {
	width: 100%;
	height: 100%;
	border: 1px solid var(--border-color);
	background-color: var(--color-dahm-background-dark);
	padding: 1em 1.4em;

	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
.service-off p {
	text-align: center;
}
.service-off .red-button {
	margin-top: 0.4em;
}
.service-on {
	width: 100%;
	height: 100%;
	border: 1px solid var(--border-color);
}
</style>
