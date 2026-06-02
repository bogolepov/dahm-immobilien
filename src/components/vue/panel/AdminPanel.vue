<script setup lang="ts">
import { getCurrentInstance, onBeforeMount, ref, useTemplateRef } from 'vue';
import LoginPage from './pages/login/LoginPage.vue';
import WorkPage from './pages/work/WorkPage.vue';
import { createPinia } from 'pinia';
import { extractSchemaFromJson, zUserInfo, type UserRole } from '@scripts/zod';
import Loader from '@vue/forms/Loader.vue';
import NotificationManager from './NotificationManager.vue';

const app = getCurrentInstance()?.appContext.app;
app?.use(createPinia());

const meChecked = ref<boolean>(false);
const userRole = ref<UserRole | undefined>(undefined);

const loginHandler = (role: UserRole) => {
	userRole.value = role;
};
const logoutHandler = () => {
	userRole.value = undefined;
	fetch('/.netlify/functions/logout', { credentials: 'include' });
};

const getMe = async () => {
	try {
		const response = await fetch('/.netlify/functions/getMe', { credentials: 'include' });
		const data = await response.json();

		if (!response.ok) {
			throw new Error(data);
		}

		const user = extractSchemaFromJson(zUserInfo, JSON.stringify(data));
		if (!user) throw new Error('Invalid response data: extractSchemaFromJson');

		userRole.value = user.role;
	} catch (err) {
		console.log(err);
	} finally {
		meChecked.value = true;
	}
};

onBeforeMount(() => {
	getMe();
});
</script>

<template>
	<div class="admin-panel">
		<template v-if="meChecked">
			<LoginPage v-if="!userRole" @login-handler="loginHandler"></LoginPage>
			<WorkPage v-else :role="userRole" @logout-handler="logoutHandler"></WorkPage>
			<NotificationManager />
		</template>
		<template v-else>
			<Loader :transparent="true" />
		</template>
	</div>
</template>

<style src="./admin.css"></style>
