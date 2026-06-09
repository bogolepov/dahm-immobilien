<script setup lang="ts">
import { getUserRole, readSupabase } from '@scripts/readSupabase';
import { zLoginInput, type LoginInput, type UserRole } from '@scripts/zod';
import type { AuthTokenResponsePassword } from '@supabase/supabase-js';
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

	loginSupabase();
};

const loginSupabase = async () => {
	if (!readSupabase) {
		toast('Ungültige Eingabe. Bitte überprüfen Sie Ihre Daten.', { variant: 'error' });
		return;
	}

	const { data, error } = (await readSupabase.auth.signInWithPassword({
		email: formData.login,
		password: formData.password,
	})) as AuthTokenResponsePassword;

	if (!error && data?.user) {
		const role = await getUserRole(data.user.id);
		if (role) {
			resetFormData();
			emit('loginHandler', role);
			return;
		}
	}

	toast('Ungültige Eingabe. Bitte überprüfen Sie Ihre Daten.', { variant: 'error' });
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
