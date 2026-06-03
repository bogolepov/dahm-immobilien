<script setup lang="ts">
import type { PropertyStatus } from '@scripts/supabase_types';
import { StatusList } from '@vue/panel/lib/types';

interface Props {
	status: PropertyStatus;
}
const { status } = defineProps<Props>();
</script>

<template>
	<div v-if="status !== 'available'" class="property-status-layer" :class="status">
		{{ StatusList[status] }}
	</div>
</template>

<style src="./ObjectStatusSticker.css"></style>
