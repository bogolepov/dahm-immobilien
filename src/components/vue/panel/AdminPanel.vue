<script setup lang="ts">
import { getCurrentInstance, onBeforeMount, onUnmounted, ref } from 'vue';
import LoginPage from './pages/login/LoginPage.vue';
import WorkPage from './pages/work/WorkPage.vue';
import { createPinia } from 'pinia';
import { type UserRole } from '@scripts/zod';
import Loader from '@vue/forms/Loader.vue';
import NotificationManager from './NotificationManager.vue';
import { getUserRole, supabase } from '@scripts/supabase.ts';
import type { Subscription } from '@supabase/supabase-js';

const app = getCurrentInstance()?.appContext.app;
app?.use(createPinia());

const meChecked = ref<boolean>(false);
const userRole = ref<UserRole | undefined>(undefined);

const supaSubscription = ref<Subscription | undefined>(undefined);

const loginHandler = (role: UserRole) => {
	userRole.value = role;
};
const logoutHandler = async () => {
	await supabase?.auth.signOut();
};

const getMe = async () => {
	if (!supabase) {
		meChecked.value = true;
		return;
	}

	const { data } = await supabase.auth.getSession();
	if (data?.session) userRole.value = await getUserRole(data.session.user.id);

	meChecked.value = true;
};

onBeforeMount(() => {
	getMe();

	const res = supabase?.auth.onAuthStateChange(async (event, session) => {
		if (event === 'SIGNED_OUT') {
			userRole.value = undefined;
		}
		if (event === 'SIGNED_IN' && session?.user.id) {
			userRole.value = await getUserRole(session?.user.id);
		}
	});
	supaSubscription.value = res?.data.subscription;
});

onUnmounted(() => {
	supaSubscription.value?.unsubscribe();
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
