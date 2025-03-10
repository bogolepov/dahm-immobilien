<script setup lang="ts">
import { ref } from 'vue';

interface Props {
	checked: boolean;
	name: string;
	disabled?: boolean;
}

const { name, checked, disabled = false } = defineProps<Props>();
const refChecked = ref(checked);

const emit = defineEmits<{
	changeState: [name: string, newState: boolean];
}>();

function switchState() {
	if (!disabled) refChecked.value = !refChecked.value;
}
</script>

<template>
	<label class="switch">
		<input
			type="checkbox"
			v-model="refChecked"
			@change="$emit('changeState', name, refChecked)"
			:disabled="disabled"
			tabindex="-1"
		/>
		<span
			class="slider"
			tabindex="0"
			@keypress.enter.prevent="switchState"
			@keypress.space.prevent="switchState"
		></span>
	</label>
</template>

<style>
.switch {
	/* --width-switch: 60px;
	--height-switch: 34px; */
	--width-switch: 3.3rem;
	--height-switch: calc(var(--width-switch) * 0.6);

	position: relative;
	display: inline-block;
	width: var(--width-switch);
	min-width: var(--width-switch);
	height: var(--height-switch);
}

.slider:focus-visible {
	/* background-color: var(--background-color-form-active); */
	outline: 1px solid white;
	/* outline-color: white; */
}

/* Hide default HTML checkbox */
.switch input {
	opacity: 0;
	width: 0;
	height: 0;
}

/* The slider */
.slider {
	position: absolute;
	cursor: pointer;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #ccc;
	transition: 400ms background-color ease-in-out;
	border-radius: var(--height-switch);
}

.slider:before {
	--padding-slider: calc(1px + 0.1 * var(--height-switch));
	--padding-slider: calc(0.13 * var(--height-switch));
	--size-slider: calc(var(--height-switch) - 2 * var(--padding-slider));
	--move-slider: calc(var(--width-switch) - 2 * var(--padding-slider) - var(--size-slider));

	position: absolute;
	content: '';
	height: var(--size-slider);
	width: var(--size-slider);
	left: var(--padding-slider);
	bottom: var(--padding-slider);
	background-color: white;
	transition: 400ms transform ease-in-out;
	border-radius: 50%;
}

input:checked + .slider {
	background-color: var(--color-dahm-bordo);
}
input[disabled]:checked + .slider {
	background-color: var(--color-dahm-bordo-disabled);
	cursor: not-allowed;
}

/* input:focus + .slider {
	box-shadow: 0 0 1px var(--color-dahm-bordo2);
} */

input:checked + .slider:before {
	transform: translateX(var(--move-slider));
}
</style>
