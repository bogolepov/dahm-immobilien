<script setup lang="ts">
import ObjectsList from '@vue/objectsList/ObjectsList.vue';
import type { ActionType } from '@scripts/supabase_types';

interface Props {
	type: ActionType;
}
const { type } = defineProps<Props>();
</script>

<template>
	<article class="s-objects sale">
		<p class="text-block mt0">
			Über Details und aktuelle Informationen zu den angebotenen Immobilien können Sie sich auch telefonisch oder per E-Mail informieren.
		</p>
		<ObjectsList :type="type" :role="undefined" />
	</article>
</template>
