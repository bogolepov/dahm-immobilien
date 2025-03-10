<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import CookieInitDialog from './CookieInitDialog.vue';
import CookieSettingsButton from './CookieSettingsButton.vue';
import CookieSettingsDialog from './CookieSettingsDialog.vue';
import { getConsent, setConsent, type CookieConsent } from '@scripts/cookies';
import { cccConsent, cccInitialized, cccSettingsShow } from './stateStore';

const loaded = ref(false);

onBeforeMount(() => {
	const savedConsent: CookieConsent | undefined = getConsent();
	if (!savedConsent) cccInitialized.value = false;
	else {
		cccInitialized.value = true;
		cccConsent.value = savedConsent;
	}
	loaded.value = true;
});

function setInitialized(): void {
	cccInitialized.value = true;
	cccSettingsShow.value = false;
}
const handleNecessary = (): void => {
	for (let key in cccConsent.value) {
		if (key === 'necessary') cccConsent.value[key] = true;
		else cccConsent.value[key as keyof CookieConsent] = false;
	}
	setConsent(cccConsent.value);
	setInitialized();
};
const handleAll = (): void => {
	for (let key in cccConsent.value) {
		cccConsent.value[key as keyof CookieConsent] = true;
	}
	setConsent(cccConsent.value);
	setInitialized();
};
const handleChoice = (newConsents: CookieConsent): void => {
	cccConsent.value = { ...newConsents };
	setConsent(cccConsent.value);
	setInitialized();
};
</script>

<template>
	<div v-show="loaded" class="cookie-layer">
		<CookieInitDialog
			v-show="!cccInitialized && !cccSettingsShow"
			@handle-necessary="handleNecessary"
			@handle-all="handleAll"
		/>
		<CookieSettingsButton v-show="cccInitialized && !cccSettingsShow" />
		<CookieSettingsDialog
			v-if="cccSettingsShow"
			@handle-necessary="handleNecessary"
			@handle-all="handleAll"
			@handle-choice="handleChoice"
		/>
	</div>
</template>

<style>
.cookie-layer {
	position: fixed;
	bottom: 0;
	z-index: 5555555;
}
</style>
