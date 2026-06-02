<script setup lang="ts">
import { extractSchemaFromJson, zLoginInput, zUserInfo, type LoginInput, type UserRole } from '@scripts/zod';
import EyeEdit from '@vue/components/EyeEdit/EyeEdit.vue';
import { useNotifications } from '@vue/panel/lib/notification/useNotifications';
import { computed, reactive } from 'vue';

const emit = defineEmits<{
	loginHandler: [role: UserRole];
}>();

const { toast } = useNotifications();

const formData = reactive<LoginInput>({ login: '', password: '' });

const loginPossible = computed(() => zLoginInput.safeParse(formData).success);

function resetFormData() {
	formData.email = undefined;
	formData.login = '';
	formData.password = '';
}

const handleSubmit = () => {
	if (formData.email?.length) return;

	netlifyLogin();
};

const netlifyLogin = async () => {
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(formData),
	};

	try {
		const response = await fetch('/.netlify/functions/login', options);
		const data = await response.json();

		if (!response.ok) {
			if (response.status === 400 || response.status === 401) {
				toast('Ungültige Eingabe. Bitte überprüfen Sie Ihre Daten.', { variant: 'error' });
				return;
			}
			throw new Error(data);
		}

		console.log('data: ', data);

		const user = extractSchemaFromJson(zUserInfo, JSON.stringify(data));
		if (!user) throw new Error('Invalid response data: extractSchemaFromJson');

		resetFormData();
		emit('loginHandler', user.role);
	} catch (err) {
		console.log(err);
	}
};
</script>

<template>
	<main>
		<form @submit.prevent="handleSubmit" class="login-form" novalidate>
			<img class="logo" src="/logo.svg" alt="Dahm Immobilien Verwaltung GMBH - Logo" />
			<input type="nickname" v-model.trim="formData.login" placeholder="Login" autocorrect="off" required />
			<input
				type="email"
				v-model.trim="formData.email"
				placeholder="E-Mail"
				autocomplete="off"
				autocorrect="off"
				tabindex="-1"
				style="display: none"
			/>
			<EyeEdit v-model="formData.password" placeholder="Kennwort" type="password" componentClass="password-input"></EyeEdit>
			<button type="submit" :disabled="!loginPossible" class="action">Anmelden</button>
		</form>
	</main>
</template>

<style src="./LoginPage.css"></style>
