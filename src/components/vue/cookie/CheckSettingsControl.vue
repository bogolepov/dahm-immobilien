<script setup lang="ts">
import { ref } from 'vue';
import { ConsentInfos } from '@scripts/cookies';
import { cccConsent, cccSettingsShow } from './stateStore';

interface Props {
	type?: string;
}

const { type } = defineProps<Props>();
const checkStatus = ref(type && type.length > 0);

function getTitle(type: string | undefined): string {
	if (!type) return '';
	return ConsentInfos[type as keyof typeof ConsentInfos].title;
}
function getStatus(type: string | undefined): string {
	if (!type) return '';
	return cccConsent.value[type as keyof typeof cccConsent.value] ? 'aktiv' : 'nicht aktiv';
}
</script>

<template>
	<div class="control-box">
		<p v-show="checkStatus" class="status">
			{{ getTitle(type) }} ist <span>{{ getStatus(type) }}</span>
		</p>
		<p>
			Hier können Sie einsehen und anpassen, welche Dienste auf unserer Website möglicherweise Cookies benutzen und/oder
			Informationen über Sie speichern:
		</p>
		<button type="button" class="red-button" @click="cccSettingsShow = true">Datenschutzeinstellungen prüfen</button>
	</div>
</template>

<style>
.control-box {
	font-size: calc(var(--font-size) * 0.92);
	border: 1px solid var(--border-color);
	padding: 0.8em 1.2em;
}
.control-box .status span {
	color: var(--color-dahm-bordo-dark);
	font-weight: bold;
}

.control-box .status {
	font-size: 1.1em;
	font-weight: 540;
	margin-bottom: 0.4em;
}

.control-box .red-button {
	width: 100%;
	padding: 0.5em 0.8em;
	margin-top: 1em;
	background-color: var(--color-dahm-bordo-dark);
	transition: background-color 400ms ease-in-out;
}
@media (hover: hover) {
	.control-box .red-button:hover {
		background-color: var(--color-dahm-bordo);
	}
}
</style>
