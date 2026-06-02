<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue';
import { useObjectsData } from '../useObjectsData';
import type { ActionType } from '@scripts/supabase_types';

const secretClassName = 'secret';

interface Props {
	type: ActionType;
}
const { type } = defineProps<Props>();
const elObjectsCartd = document.querySelector(`.card-item.objects.${secretClassName}`);

const { getProperties } = useObjectsData();

const show = ref<boolean>(false);
watch(show, newValue => {
	if (!elObjectsCartd) return;
	if (newValue) elObjectsCartd.classList.remove(secretClassName);
	else elObjectsCartd.classList.add(secretClassName);
});

const updateShow = (hasForRent: boolean, hasForSale: boolean) => {
	switch (type) {
		case 'rent':
			show.value = hasForRent;
			break;
		case 'sale':
			show.value = hasForSale;
			break;
		default:
			show.value = false;
	}
};

onMounted(() => {
	getProperties(false, properties => {
		if (properties) {
			nextTick(() => {
				updateShow(properties.objectsRent.length > 0, properties.objectsSale.length > 0);
			});
		}
	});
});
</script>

<template>
	<div v-if="false"></div>
</template>
