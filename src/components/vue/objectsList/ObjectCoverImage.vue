<script setup lang="ts">
import PictureIcon from '@vue/icons/PictureIcon.vue';

interface Props {
	url?: string | null;
	alt?: string;
	customClass?: string;
}
const props = defineProps<Props>();
</script>

<template>
	<div class="property-cover-image" :class="props.customClass">
		<img v-if="props.url" :src="props.url" :alt="props.alt" />
		<PictureIcon v-else />
		<slot />
	</div>
</template>

<style src="./ObjectCoverImage.css"></style>
