<script setup lang="ts">
import { cccSettingsShow } from './stateStore';

const emit = defineEmits<{
	handleNecessary: [];
	handleAll: [];
}>();
</script>

<template>
	<div class="cookie-init-dialog">
		<div class="init-dialog-content">
			<p>
				Folgende Dienste auf unserer Website benutzen möglicherweise Cookies und/oder sammeln und verarbeiten Ihre
				persönlichen Daten für die folgenden Zwecke: <b>Notwendige Funktionen, Externe Dienste & Besucher-Statistik</b>.
			</p>
			<div class="actions">
				<button type="button" class="settings-button" @click.prevent="cccSettingsShow = true">
					Einstellungen anpassen
				</button>
				<button type="button" class="border-button" @click.prevent="$emit('handleNecessary')">
					Nur Notwendige akzeptieren
				</button>
				<button type="button" class="border-button" @click.prevent="$emit('handleAll')">Alle akzeptieren</button>
			</div>
		</div>
	</div>
</template>

<style>
.cookie-init-dialog {
	position: fixed;
	right: 1em;
	bottom: 0.8em;
	width: 750px;
	border: 1px solid var(--border-color-form);
	background-color: var(--color-dahm-background-light);
	font-size: 0.95em;
	z-index: 50005;
}
.cookie-init-dialog .init-dialog-content {
	padding: 1em 1.5em;
}
.cookie-init-dialog .actions {
	display: flex;
	column-gap: 1em;
	margin-top: 1em;
}
.cookie-init-dialog .settings-button {
	margin-right: auto;
	text-decoration: underline;
}
.cookie-init-dialog .border-button {
	border: 1px solid var(--border-color-form);
	padding: 0.75em 1em;
}

@media screen and (max-width: 800px) {
	.cookie-init-dialog {
		left: 0;
		right: 0;
		bottom: 0;
		width: auto;
	}
}
</style>
