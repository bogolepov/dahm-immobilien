<script setup lang="ts">
import type { DeletePropertyInput, Properties, PropertyFormData, UpdatePropertiesShowInput, UserRole } from '@scripts/zod';
import { useObjectsData } from '@vue/Objects/useObjectsData';
import { computed, nextTick, onMounted, ref } from 'vue';
import ObjectEdit from './ObjectEdit.vue';
import type { ActionType } from '@scripts/supabase_types';
import Loader from '@vue/forms/Loader.vue';
import EditIcon from '@vue/icons/EditIcon.vue';
import DeleteIcon from '@vue/icons/DeleteIcon.vue';
import PdfIcon from '@vue/icons/PdfIcon.vue';
import EyeIcon from '@vue/icons/EyeIcon.vue';

type ShowItem = Record<number, boolean>;

interface Props {
	role: UserRole | undefined;
	type: ActionType;
}
const { role, type } = defineProps<Props>();

const objectsList = ref<PropertyFormData[]>([]);
const isLoaded = ref<boolean>(false);

const editObject = ref<PropertyFormData | null | undefined>(undefined);

const canDelete = computed(() => role === 'developer');
const canEdit = computed(() => role === 'admin' || role === 'developer');
const canShowHide = computed(() => role !== undefined);
const isJustVisiter = computed(() => role === undefined);

const showItems = ref<ShowItem>({});
const showItemsUpd = ref<ShowItem>({});
const showItemsChanged = computed<boolean>(() => {
	return Object.keys(showItemsUpd.value).some(id => showItemsUpd.value[Number(id)] !== showItems.value[Number(id)]);
});

const { getProperties } = useObjectsData();

onMounted(() => {
	downloadProperties();
});

const downloadProperties = () => {
	getProperties(true, properties => {
		if (properties) {
			nextTick(() => {
				updateList(properties);
			});
		} else {
			isLoaded.value = true;
			showItems.value = {};
			showItemsUpd.value = {};
		}
	});
};

const updateList = (objects: Properties) => {
	if (type === 'sale') {
		objectsList.value = objects.objectsSale;
	} else if (type === 'rent') {
		objectsList.value = objects.objectsRent;
	}
	isLoaded.value = true;

	showItems.value = {};
	objectsList.value.forEach(object => {
		if (object.id) {
			showItems.value[object.id] = object.show;
			if (showItemsUpd.value[object.id] === undefined) showItemsUpd.value[object.id] = object.show;
		}
	});
	Object.keys(showItemsUpd.value).forEach(id => {
		if (showItems.value[Number(id)] === undefined) delete showItemsUpd.value[Number(id)];
	});
};

const addProp = () => {
	editObject.value = null;
};
const editProp = (object: PropertyFormData) => {
	editObject.value = object;
};

const cancelEditProp = () => {
	editObject.value = undefined;
};
const savedEditProp = () => {
	editObject.value = undefined;
	isLoaded.value = false;
	downloadProperties();
};

const deleteProp = async (object: PropertyFormData) => {
	if (!object.id) return;
	if (!confirm('Objekt wirklich löschen?')) return;

	const input: DeletePropertyInput = { id: object.id };

	try {
		const response = await fetch('/.netlify/functions/deleteProperty', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(input),
			credentials: 'include',
		});
		if (!response.ok) console.error('Anzeige konnte nicht gelöscht werden');
	} catch (err) {
		console.error(err);
	} finally {
		isLoaded.value = false;
		downloadProperties();
	}
};

const saveShowProperties = async () => {
	const updates: UpdatePropertiesShowInput = Object.keys(showItemsUpd.value).reduce(
		(acc, id) => {
			if (showItemsUpd.value[Number(id)] !== showItems.value[Number(id)]) {
				acc.push({ id: Number(id), show: showItemsUpd.value[Number(id)] });
			}
			return acc;
		},
		[] as { id: number; show: boolean }[],
	);

	if (updates.length === 0) return;

	try {
		const response = await fetch('/.netlify/functions/updatePropertiesShow', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(updates),
			credentials: 'include',
		});
		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData);
		}
	} catch (err) {
		console.log(err);
	} finally {
		isLoaded.value = false;
		downloadProperties();
	}
};
</script>

<template>
	<template v-if="isLoaded">
		<button v-if="canShowHide && showItemsChanged" class="action save-show-changes" @click.prevent="saveShowProperties">
			<div>Änderungen speichern <EyeIcon :see="true" /></div>
		</button>
		<ul class="card-list">
			<li v-if="canEdit" class="card-item sticker color edit new not-zoom">
				<button class="border" @click.prevent="addProp">Neues Objekt<br />hinzufügen</button>
			</li>
			<template v-for="object in objectsList" :key="object.id">
				<li v-if="!(isJustVisiter && !object.show)" class="card-item sticker color property" :class="{ 'not-zoom': !isJustVisiter }">
					<img v-if="object.url_image" :src="object.url_image" :alt="object.marketing_title" />
					<p v-if="object.marketing_title" class="title">{{ object.marketing_title }}</p>
					<p v-if="object.address?.zip || object.address?.city"><span>Ort:</span>{{ object.address?.zip }} {{ object.address?.city }}</p>
					<p v-if="object.areas?.usable_area" class="price"><span>Nutzfläche:</span>{{ object.areas?.usable_area }}</p>
					<p v-if="object.areas?.living_area" class="price"><span>Wohnfläche:</span>{{ object.areas?.living_area }}</p>
					<p v-if="object.finance?.purchase_price" class="price"><span>Kaufpreis:</span>{{ object.finance?.purchase_price }}</p>
					<p v-if="object.tech_details?.year_built"><span>Baujahr:</span>{{ object.tech_details?.year_built }}</p>
					<p v-if="object.url_expose" class="expose-link">
						<a :href="object.url_expose" target="_blank" rel="noopener noreferrer">
							Expose
							<button class="pdf-button">
								<PdfIcon />
							</button>
						</a>
					</p>
					<!-- <p v-if="isJustVisiter && object.property_sid" class="property-sid">{{ object.property_sid }}</p> -->
					<div v-show="!isJustVisiter && object.id && showItemsUpd[object.id] === false" class="blur-layer"></div>
					<div v-if="!isJustVisiter && object.id" class="card-control-layer">
						<button v-if="canShowHide" type="button" @click.prevent="showItemsUpd[object.id] = !showItemsUpd[object.id]">
							<EyeIcon :see="showItemsUpd[object.id]" />
						</button>
						<button v-if="canEdit" type="button" @click.prevent="editProp(object)">
							<EditIcon />
						</button>
						<button v-if="canDelete" type="button" @click.prevent="deleteProp(object)">
							<DeleteIcon />
						</button>
					</div>
				</li>
			</template>
			<li></li>
			<li></li>
		</ul>
		<ObjectEdit
			v-if="editObject !== undefined"
			:type="type"
			:object="editObject"
			@cancel-handler="cancelEditProp"
			@saved-handler="savedEditProp"
		/>
	</template>
	<Loader v-else :transparent="true"></Loader>
</template>

<style src="./ObjectsList.css"></style>
<style lang="css" src="../../../styles/list.css"></style>
