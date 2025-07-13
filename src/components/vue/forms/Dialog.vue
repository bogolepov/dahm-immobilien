<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
	handleClose: [];
}>();

const isShow = ref<boolean>(false);
const dlgMessage = ref<string>('');

function show(message: string) {
	dlgMessage.value = message;
	isShow.value = true;
}
function close() {
	isShow.value = false;
}
defineExpose({ show, close });
</script>

<template>
	<div v-if="isShow" class="dialog-layer">
		<div class="msg-dialog">
			<p>{{ dlgMessage }}</p>
			<button @click.prevent="$emit('handleClose')">OK</button>
		</div>
	</div>
</template>

<style>
.dialog-layer {
	display: grid;
	place-items: center;
	/* display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center; */

	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
}

.msg-dialog {
	display: flex;
	flex-direction: column;
	border: 1px solid var(--border-color-form-active);
	border-radius: 3px;
	/* background-color: var(--color-dahm-background-light); */
	background-color: rgb(215, 215, 215);
	background-color: rgb(219, 220, 223);
	padding: 1em 1.6em;
	max-width: 60%;
	min-width: 160px;
	overflow-y: auto;
}

.msg-dialog p {
	margin-bottom: 0.6em;
	text-align: center;
}
.msg-dialog button {
	/* border: 1px solid var(--border-color-form); */
	background-color: var(--color-dahm-bordo);
	color: #ffffff;
	width: min-content;
	padding: 0.25em 1.4em;
	align-self: center;
}
</style>
