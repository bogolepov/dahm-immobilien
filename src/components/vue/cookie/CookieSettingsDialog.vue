<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { cccConsent, cccSettingsShow } from './stateStore';
import ToogleSwitch from '@vue/forms/ToogleSwitch.vue';
import { type CookieConsent, ConsentInfos } from '@scripts/cookies';

const mounted = ref(false);

const emit = defineEmits<{
	handleNecessary: [];
	handleAll: [];
	handleChoice: [newConsents: CookieConsent];
}>();

let consentKeys: string[] = [];
let tmpConsents = ref({ ...cccConsent.value });

const activeChoiseButton = computed(() => {
	tmpConsents.value.necessary = true;

	return (
		consentKeys.find(
			key => tmpConsents.value[key as keyof CookieConsent] !== cccConsent.value[key as keyof CookieConsent]
		) !== undefined
	);
});

onMounted(() => {
	consentKeys = Object.keys(cccConsent.value);
	tmpConsents.value = { ...cccConsent.value };
	mounted.value = true;
});

function cancelDialog(): void {
	tmpConsents.value = { ...cccConsent.value };
	cccSettingsShow.value = false;
}
function saveNecessary(): void {
	emit('handleNecessary');
	tmpConsents.value = { ...cccConsent.value };
}
function saveChoice(): void {
	emit('handleChoice', tmpConsents.value);
	tmpConsents.value = { ...cccConsent.value };
}
function saveAll(): void {
	emit('handleAll');
	tmpConsents.value = { ...cccConsent.value };
}

function changeState(name: string, newState: boolean): void {
	tmpConsents.value[name as keyof CookieConsent] = newState;
}
</script>

<template>
	<div class="cookie-settings-layer">
		<div class="cookie-settings-dialog">
			<form>
				<div class="header-flex">
					<h3>{{ 'Dienste, die wir nutzen'.toUpperCase() }}</h3>
					<button class="close-button" @click.prevent="cancelDialog">&#10006;</button>
				</div>
				<p class="annotation">
					Hier können Sie einsehen und anpassen, welche Dienste auf unserer Website möglicherweise Cookies benutzen
					und/oder Informationen über Sie speichern. Um mehr zu erfahren, lesen Sie bitte unsere
					<a href="/datenschutz/">Datenschutzerklärung</a>.
				</p>
				<ul v-if="mounted">
					<li v-for="key in consentKeys" :key>
						<ToogleSwitch
							:name="key"
							:checked="tmpConsents[key as keyof CookieConsent]"
							:disabled="key === 'necessary'"
							@change-state="changeState"
						/>
						<div class="consent-info">
							<div class="consent-title">{{ ConsentInfos[key as keyof typeof ConsentInfos].title }}</div>
							<p class="consent-description">{{ ConsentInfos[key as keyof typeof ConsentInfos].description }}</p>
							<div class="consent-type">{{ ConsentInfos[key as keyof typeof ConsentInfos].type }}</div>
						</div>
					</li>
				</ul>
				<div class="actions">
					<button class="border-button" @click.prevent="saveNecessary">Nur Notwendige akzeptieren</button>
					<button class="border-button" :class="{ active: activeChoiseButton }" @click.prevent="saveChoice">
						Auswahl speichern
					</button>
					<button class="border-button" @click.prevent="saveAll">Alle akzeptieren</button>
				</div>
			</form>
		</div>
	</div>
</template>

<style>
.cookie-settings-layer {
	display: grid;
	place-items: center;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(211, 210, 207, 0.75);
	z-index: 50008;
}

.cookie-settings-dialog {
	border: 1px solid var(--border-color-form);
	background-color: var(--color-dahm-background-light);
	padding: 1.5em 2.2em;
	width: 650px;
	max-width: 90dvw;
	max-height: 90dvh;
	overflow-y: auto;
}

.cookie-settings-dialog .header-flex {
	display: flex;
	align-items: flex-start;
	column-gap: 2em;
}
.cookie-settings-dialog form .annotation {
	padding: 0.6em 0 1.5em 0;
	line-height: 1.25;
	font-size: 0.95em;
}
.cookie-settings-dialog form a {
	text-decoration: underline;
}
.cookie-settings-dialog .close-button {
	font-size: 1.17em;
	margin-left: auto;
	user-select: none;
}
.cookie-settings-dialog .actions {
	display: flex;
	column-gap: 1em;
	margin-top: 0.8em;
}
.cookie-settings-dialog .actions button {
	flex-grow: 1;
	flex-basis: 33%;
	font-size: 0.97em;
	border: 1px solid var(--border-color-form);
	padding: 0.6em 1em;
	transition: border-color 350ms ease-in-out;
}
.cookie-settings-dialog .actions button.active {
	border-color: var(--color-dahm-bordo);
}

.cookie-settings-dialog li {
	display: flex;
	column-gap: 1em;
	flex-wrap: nowrap;
	padding-bottom: 1.3em;
}

.consent-info {
	display: flex;
	flex-direction: column;
	line-height: 1.05;
}
.consent-title {
	font-size: 1.05em;
	font-weight: 540;
}
.consent-description {
	padding: 0.35em 0 0.15em 0;
	font-size: 0.92em;
}
.consent-type {
	font-size: 0.92em;
	color: rgb(65, 0, 0);
}
.consent-type::before {
	content: 'Zweck: ';
	font-weight: 450;
	color: rgb(65, 0, 0, 0.8);
}

@media screen and (max-width: 500px) {
	.cookie-settings-dialog .actions {
		flex-direction: column;
		row-gap: 0.75em;
	}
	.cookie-settings-dialog .actions button {
		padding: 0.5em;
	}
}
</style>
