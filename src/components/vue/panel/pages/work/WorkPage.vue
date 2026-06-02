<script setup lang="ts">
import type { ActionType } from '@scripts/supabase_types';
import type { UserRole } from '@scripts/zod';
import ObjectsList from '@vue/objectsList/ObjectsList.vue';
import { ref } from 'vue';

const props = defineProps<{
	role: UserRole;
}>();
const emit = defineEmits<{
	logoutHandler: [];
}>();

const currentObjsType = ref<ActionType>('sale');
</script>

<template>
	<div>
		<header class="button-menu">
			<button type="button" @click.prevent="currentObjsType = 'sale'" class="link" :class="{ active: currentObjsType === 'sale' }">
				Verkauf
			</button>
			<button type="button" @click.prevent="currentObjsType = 'rent'" class="link" :class="{ active: currentObjsType === 'rent' }">
				Vermiete
			</button>
			<button type="button" @click.prevent="emit('logoutHandler')" class="action logout-button">Abmelden</button>
		</header>

		<main>
			<ObjectsList v-if="currentObjsType === 'sale'" type="sale" :role="role" />
			<ObjectsList v-else type="rent" :role="role" />
		</main>
	</div>
</template>

<style src="./WorkPage.css"></style>
