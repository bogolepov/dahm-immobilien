<script setup lang="ts">
import { ref } from 'vue';

interface Props {
	background: boolean;
}
const { background } = defineProps<Props>();
const isActive = ref<boolean>(false);

function start() {
	isActive.value = true;
}
function stop() {
	isActive.value = false;
}

defineExpose({ start, stop });
</script>

<template>
	<div v-if="isActive" class="loader-layer" :class="{ not_transparent: background }">
		<div class="dahm-loader"></div>
	</div>
</template>

<style>
.loader-layer {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;

	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
}

.not_transparent {
	background-color: inherit;
}

.dahm-loader {
	display: block;
	width: 50px;
	height: 50px;
	border-radius: 50%;
	padding: 1px;
	background: conic-gradient(#0000 10%, var(--color-dahm-bordo)) content-box;
	-webkit-mask: repeating-conic-gradient(#0000 0deg, #000 1deg 20deg, #0000 21deg 36deg),
		radial-gradient(farthest-side, #0000 calc(100% - 9px), #000 calc(100% - 8px));
	mask: repeating-conic-gradient(#0000 0deg, #000 1deg 20deg, #0000 21deg 36deg),
		radial-gradient(farthest-side, #0000 calc(100% - 9px), #000 calc(100% - 8px));
	-webkit-mask-composite: destination-in;
	mask-composite: intersect;
	animation: s4 1s infinite steps(10);
}

@keyframes s4 {
	to {
		transform: rotate(1turn);
	}
}
</style>
