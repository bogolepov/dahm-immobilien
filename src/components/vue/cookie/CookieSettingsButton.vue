<script setup lang="ts">
import { cccSettingsShow } from './stateStore';
</script>

<template>
	<button
		type="button"
		class="cooqie-settings-button"
		@click.prevent="cccSettingsShow = true"
		aria-label="Cookie-Einstellungen"
	>
		<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 50 50">
			<path
				fill="currentColor"
				d="M50,25l-8.2-5.8,3.4-9.7-9.9.4-2.5-10-7.8,6.4L17.2,0l-2.5,10-9.9-.4,3.4,9.7L0,25l8.2,5.8-3.4,9.7,9.9-.4,2.5,10,7.8-6.4,7.8,6.4,2.5-10,9.9.4-3.4-9.7,8.2-5.8ZM31.9,32.5c-.6.9-1.7,1.8-2.7,2.2s-2.3.7-4,.7-3.6-.2-4.8-.9-2.3-1.5-3.2-3.1-1.3-3.5-1.3-5.8.8-5.5,2.3-7.3c1.7-1.8,3.8-2.4,6.7-2.4s4,.4,5.5,1.5,2.3,2.4,2.9,4.4l-4.8.9c-.2-.7-.4-1.1-.6-1.3-.2-.4-.6-.9-1.1-1.1s-1.1-.4-1.5-.4c-1.3,0-2.3.4-2.9,1.5-.4.9-.8,2-.8,3.8s.2,3.5.8,4.4,1.5,1.1,2.5,1.1,1.9-.2,2.5-.9.8-1.5,1.3-2.7l4.8,1.5c-.4,1.5-.8,2.7-1.7,3.8Z"
			/>
		</svg>
	</button>
</template>

<style>
.cooqie-settings-button {
	--button-color: var(--color-dahm-bordo);
	display: grid;
	place-items: center;
	position: fixed;
	right: 0.1em;
	bottom: 0.1em;
	padding: 0.15em;
	color: var(--button-color);
	z-index: 50000;
	outline: 0;
	border-radius: 50%;
	border: 1px solid transparent;
	transition: color 450ms ease-in-out;
}
.cooqie-settings-button:focus-visible {
	border-color: var(--button-color);
}
@media (hover: hover) {
	.cooqie-settings-button:hover {
		color: hsl(from var(--button-color) h s calc(l + 8) / 0.95);
	}
}
</style>
