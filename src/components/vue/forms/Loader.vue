<script setup lang="ts">
interface Props {
	transparent: boolean;
}
const { transparent } = defineProps<Props>();
</script>

<template>
	<div class="loader-layer" :class="{ not_transparent: !transparent }">
		<div class="dahm-loader"></div>
	</div>
</template>

<style>
.loader-layer {
	display: grid;
	place-items: center;
	position: absolute;
	inset: 0;
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
	-webkit-mask:
		repeating-conic-gradient(#0000 0deg, #000 1deg 20deg, #0000 21deg 36deg),
		radial-gradient(farthest-side, #0000 calc(100% - 9px), #000 calc(100% - 8px));
	mask:
		repeating-conic-gradient(#0000 0deg, #000 1deg 20deg, #0000 21deg 36deg),
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
