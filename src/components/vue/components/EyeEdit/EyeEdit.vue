<script setup lang="ts">
import EyeIcon from '@vue/icons/EyeIcon.vue';
import { computed, ref, onMounted } from 'vue';

type EyeState = 'see' | 'not_see';

interface Props {
	fieldname?: string;
	label?: string;
	placeholder?: string;
	type: 'string' | 'number' | 'password';
	required?: boolean;
	componentClass?: string;
	inputClass?: string;
}
const { fieldname, label, placeholder, type, required = false, componentClass, inputClass } = defineProps<Props>();

const model = defineModel<string | number | null>();
const hidden_fields = defineModel<string[] | undefined>('hidden');

const hasContent = computed<boolean>(() => {
	if (model.value && typeof model.value === 'string') return model.value.length > 0;
	if (model.value && typeof model.value === 'number') return model.value !== 0;
	return false;
});

const needEye = computed<boolean>(() => {
	if (type === 'password') return true;
	return hidden_fields.value !== undefined && hasContent.value;
});

const eyeState = ref<EyeState>('not_see');

const inputType = computed<string>(() => {
	if (type === 'password') {
		return eyeState.value === 'see' ? 'text' : 'password';
	}
	return type;
});

onMounted(() => {
	if (hidden_fields.value !== undefined && !fieldname?.trim()) {
		if (import.meta.env.NODE_ENV !== 'production') throw new Error('⚠️ I need fieldname');
		else console.error('⚠️ I need fieldname');
	}
	if (type === 'password') {
		eyeState.value = 'not_see';
	} else {
		if (hidden_fields.value !== undefined && fieldname?.length) {
			eyeState.value = hidden_fields.value.includes(fieldname) ? 'not_see' : 'see';
		} else {
			eyeState.value = 'see';
		}
	}
});

function changeEyeState() {
	eyeState.value = eyeState.value === 'see' ? 'not_see' : 'see';
	if (type !== 'password') {
		if (hidden_fields.value !== undefined && fieldname?.length) setHidden(fieldname, eyeState.value === 'not_see');
	}
}

function setHidden(fieldName: string, hidden: boolean) {
	if (hidden_fields.value === undefined) return;

	const current = hidden_fields.value;
	if (hidden) {
		if (!current.includes(fieldName)) {
			hidden_fields.value = [...current, fieldName];
		}
	} else {
		hidden_fields.value = current.filter(item => item !== fieldName);
	}
}
</script>

<template>
	<div class="eye-edit" :class="componentClass">
		<label v-if="label">{{ label }}<sup v-if="required">*</sup></label>
		<div class="input-field" :class="[inputClass, { eye: needEye }]">
			<input
				:type="inputType"
				v-model="model"
				:placeholder="placeholder"
				autocorrect="off"
				:class="{ hidden: eyeState === 'not_see' && type !== 'password' }"
			/>
			<button v-if="needEye" type="button" @click.prevent="changeEyeState">
				<EyeIcon :see="eyeState === 'see'" />
			</button>
		</div>
	</div>
</template>

<style src="./EyeEdit.css"></style>
