<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';
import { useObjectsData } from '../useObjectsData';
import type { ActionType } from '@scripts/supabase_types';

type ControlType = 'management' | ActionType;
type Elements = Record<ControlType, Element | null>;

const showSale = ref<boolean>(false);
const showRent = ref<boolean>(false);
const show = computed(() => showSale.value || showRent.value);
const selected = ref<boolean>(true);

const type = ref<ControlType>('management');
const elements: Elements = { management: null, sale: null, rent: null };

const { getProperties } = useObjectsData();

onMounted(async () => {
	elements.management = document.querySelector('.s-objects.management');

	const properties = await getProperties(false);
	if (properties) {
		nextTick(() => {
			showSale.value = properties.objectsSale.length > 0;
			showRent.value = properties.objectsRent.length > 0;
		});
	}
});

const selectType = (newType: ControlType) => {
	if (selected.value === false) return; // wait for ending of previous animation

	const prevType = type.value;
	if (prevType === newType) return;

	if (!elements[newType]) elements[newType] = document.querySelector(`.s-objects.${newType}`);
	if (!elements[prevType]) elements[prevType] = document.querySelector(`.s-objects.${prevType}`);

	if (!elements[newType] || !elements[prevType]) return;

	selected.value = false;
	(elements[newType] as HTMLElement).style.display = 'block';
	window.setTimeout(() => {
		if (elements[prevType]) elements[prevType].classList.remove('show');
		if (elements[newType]) elements[newType].classList.add('show');
	}, 50);
	window.setTimeout(() => {
		if (elements[prevType]) (elements[prevType] as HTMLElement).style.display = 'none';
		selected.value = true;
	}, 500);

	type.value = newType;
};
</script>

<template>
	<div v-if="show" class="objects-control">
		<button :class="{ active: type === 'management' }" @click.prevent="selectType('management')">Verwaltung</button>
		<button v-if="showSale" :class="{ active: type === 'sale' }" @click.prevent="selectType('sale')">Verkauf</button>
		<button v-if="showRent" :class="{ active: type === 'rent' }" @click.prevent="selectType('rent')">Vermietung</button>
	</div>
</template>

<style lang="css" src="./ObjectsControl.css"></style>
