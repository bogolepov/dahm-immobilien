<script setup lang="ts">
import { PROPERTY_STATUSES, type ActionType } from '@scripts/supabase_types';
import { compactDeepCopy, createPropertyFormData, ensurePropertyFormData } from '@scripts/utils';
import { zPropertyFormData, type PropertyFormData, type PropertyFormState } from '@scripts/zod';
import { computed, reactive, ref, watch } from 'vue';
import EyeEdit from '../components/EyeEdit/EyeEdit.vue';
import { netlifySaveObject } from '@vue/panel/lib/netlify.ts';
import AddPhotoIcon from '@vue/icons/AddPhotoIcon.vue';
import RemovePhotoIcon from '@vue/icons/RemovePhotoIcon.vue';
import { ALLOWED_EXPOSE_TYPES, ALLOWED_IMAGE_TYPES, Z_MARKETING_TITLE_MIN, Z_PROPERTY_SID_MIN } from '@scripts/consts.ts';
import RemovePdfIcon from '@vue/icons/RemovePdfIcon.vue';
import AddPdfIcon from '@vue/icons/AddPdfIcon.vue';
import WorldIcon from '@vue/icons/WorldIcon.vue';
import ComputerIcon from '@vue/icons/ComputerIcon.vue';
import Loader from '@vue/forms/Loader.vue';
import { checkExposeFile, checkImageFile } from '@scripts/file.ts';
import { useNotifications } from '@vue/panel/lib/notification/useNotifications.ts';
import type { ZodError } from 'zod';
import { StatusList } from '@vue/panel/lib/types.ts';
import ObjectCoverImage from './ObjectCoverImage.vue';
import { savePropertyDB } from '@scripts/supabase_utils.ts';

interface Props {
	type: ActionType;
	object: PropertyFormData | null;
}

const { object, type } = defineProps<Props>();

const emit = defineEmits<{
	cancelHandler: [];
	savedHandler: [];
}>();

const statusOptions = PROPERTY_STATUSES.filter(option => {
	if (type === 'rent' && option === 'sold') return false;
	if (type === 'sale' && option === 'rented') return false;
	return true;
});

let timer: number | undefined = undefined;
const anyChanges = ref<boolean>(false);
const isSaving = ref<boolean>(false);

const { toast } = useNotifications();

const normalizedObject = reactive<PropertyFormState>(
	ensurePropertyFormData(JSON.parse(JSON.stringify(object || createPropertyFormData()))),
);
const updatedObject = reactive<PropertyFormState>(JSON.parse(JSON.stringify(normalizedObject)));
const { address, finance, areas, spaces, tech_details } = updatedObject;

const exposeFile = ref<File | null>(null);
const imageFile = ref<File | null>(null);
const imagePreviewUrl = ref<string | null>(null);

const hasExpose = computed(() => updatedObject.url_expose || exposeFile.value);
const exposeFilename = computed(() => {
	if (updatedObject.url_expose) {
		const url = new URL(updatedObject.url_expose);
		const encodedFilename = url.pathname.split('/').pop() || '';
		const filename = decodeURIComponent(encodedFilename);
		return filename;
	}
	if (exposeFile.value) return exposeFile.value?.name;
	return undefined;
});

watch([updatedObject, exposeFile, imageFile], () => {
	if (timer) window.clearTimeout(timer);
	timer = window.setTimeout(() => {
		anyChanges.value =
			!!exposeFile.value || !!imageFile.value || JSON.stringify(compactDeepCopy(object)) !== JSON.stringify(compactDeepCopy(updatedObject));
		timer = undefined;
	}, 450);
});

const normalizeSlug = (slug: string) => {
	return slug
		.toLowerCase()
		.replace(/[^a-z0-9_äöüß]/g, '')
		.replaceAll('ä', 'ae')
		.replaceAll('ö', 'oe')
		.replaceAll('ü', 'ue')
		.replaceAll('ß', 'ss');
};

function saveObject() {
	if (!anyChanges.value) return;

	try {
		const parsed = JSON.parse(JSON.stringify(updatedObject));
		const result = zPropertyFormData.safeParse(parsed);

		if (result.success && result.data) {
			const saveProperty = result.data;
			let slug = saveProperty.property_sid.replace(' ', '_');
			if (saveProperty.address?.zip?.length) slug += '_' + saveProperty.address?.zip;
			if (saveProperty.address?.city?.length) slug += '_' + saveProperty.address?.city;
			saveProperty.slug = normalizeSlug(slug);

			isSaving.value = true;
			// netlifySaveObject(saveProperty, exposeFile.value, imageFile.value, (ok: boolean, error?: string) => {
			savePropertyDB(saveProperty, exposeFile.value, imageFile.value, (ok: boolean, error?: string) => {
				isSaving.value = false;
				if (!ok && error) toast(error, { variant: 'error', dismissible: false });
				if (ok) emit('savedHandler');
			});
		} else {
			const errors = (result.error satisfies ZodError).issues;
			errors.forEach(error => {
				error.path.forEach(field =>
					toast(error.message, { title: getFieldLabel(field) || (field as string), variant: 'error', dismissible: false }),
				);
			});
		}
	} catch (error) {
		console.error(error);
		return;
	}
}
function getFieldLabel(field: PropertyKey) {
	switch (field) {
		case 'marketing_title':
			return 'Titel';
		case 'property_sid':
			return 'Objekt-ID';
		default:
			return field as string;
	}
}

async function onExposeSelected(event: Event) {
	const target = event.target as HTMLInputElement;
	const file = target.files?.[0];
	target.value = '';

	if (!file) return;

	const { ok, errorMsg } = await checkExposeFile(file);
	if (errorMsg || !ok) {
		if (errorMsg?.length) toast('Expose: ' + errorMsg, { variant: 'error' });
		return;
	}

	exposeFile.value = file;
	updatedObject.url_expose = null;
}
function onExposeRemove() {
	exposeFile.value = null;
	updatedObject.url_expose = null;
}

async function onImageSelected(event: Event) {
	const target = event.target as HTMLInputElement;
	const file = target.files?.[0] || null;
	target.value = '';

	if (!file) return;

	const { ok, errorMsg } = await checkImageFile(file);
	if (errorMsg || !ok) {
		if (errorMsg?.length) toast('Bilder: ' + errorMsg, { variant: 'error' });
		return;
	}

	imageFile.value = file;
	updatedObject.url_image = null;
	imagePreviewUrl.value = URL.createObjectURL(file);
}

function onImageRemove() {
	imageFile.value = null;
	updatedObject.url_image = null;
	imagePreviewUrl.value = null;
}
</script>

<template>
	<div class="layer-on-window">
		<div class="edit-layer" :class="{ changed: anyChanges }">
			<div class="edit-layer-body">
				<div class="category-list prop-cover-image">
					<div class="cover-image-preview">
						<div class="cover-image-container">
							<ObjectCoverImage :url="imagePreviewUrl || updatedObject.url_image" />
						</div>
						<div class="picture-control">
							<label title="Auswählen">
								<input type="file" :accept="ALLOWED_IMAGE_TYPES.join()" style="display: none" @change.prevent="onImageSelected" />
								<AddPhotoIcon />
							</label>
							<label v-if="updatedObject.url_image?.length || imageFile" @click="onImageRemove" title="Löschen">
								<RemovePhotoIcon />
							</label>
						</div>
					</div>
				</div>

				<div class="category-list status eye-edit">
					<div>Status</div>
					<select v-model="updatedObject.status" class="list-select">
						<option disabled value="" hidden>Auswählen:</option>
						<option v-for="option in statusOptions" :value="option">
							{{ StatusList[option] }}
						</option>
					</select>
				</div>

				<div class="separator"></div>

				<div class="category-list property-root">
					<EyeEdit
						v-model="updatedObject.marketing_title"
						label="Titel"
						type="string"
						:placeholder="`mind. ${Z_MARKETING_TITLE_MIN} Zeichen`"
						required
					/>
					<EyeEdit
						v-model="updatedObject.property_sid"
						label="Objekt Nr."
						type="string"
						:placeholder="`mind. ${Z_PROPERTY_SID_MIN} Zeichen`"
						required
					/>
					<EyeEdit v-model="updatedObject.property_type" label="Objektart" type="string" />
				</div>

				<div class="separator"></div>

				<div class="category-list expose">
					<div>
						<div class="expose-item">
							Expose (5MB max.)
							<label :title="hasExpose ? 'Ändern' : 'Hinzufügen'">
								<input type="file" :accept="ALLOWED_EXPOSE_TYPES.join()" style="display: none" @change.prevent="onExposeSelected" />
								<AddPdfIcon />
							</label>
							<button v-if="hasExpose" @click.prevent="onExposeRemove" class="remove" title="Löschen">
								<RemovePdfIcon />
							</button>
						</div>
						<div v-if="hasExpose" class="expose-filename">
							[
							<WorldIcon v-if="updatedObject.url_expose" />
							<ComputerIcon v-else />
							'{{ exposeFilename }}' ]
						</div>
					</div>
				</div>

				<div class="separator"></div>

				<div class="category-list address">
					<div class="edit-row">
						<EyeEdit
							v-model="address.street"
							v-model:hidden="address.hidden_fields"
							label="Straße"
							type="string"
							class="max-column"
							fieldname="street"
						/>
						<EyeEdit
							v-model="address.building"
							v-model:hidden="address.hidden_fields"
							label="Nr."
							type="string"
							input-class="i-building"
							fieldname="building"
						/>
					</div>
					<div class="edit-row">
						<EyeEdit
							v-model="address.zip"
							v-model:hidden="address.hidden_fields"
							label="PLZ"
							type="string"
							input-class="i-zip"
							fieldname="zip"
						/>
						<EyeEdit
							v-model="address.city"
							v-model:hidden="address.hidden_fields"
							label="Ort"
							type="string"
							class="max-column"
							fieldname="city"
						/>
					</div>
					<EyeEdit
						v-model="address.url_location"
						v-model:hidden="address.hidden_fields"
						label="Map URL"
						type="string"
						fieldname="url_location"
					/>
				</div>

				<div class="separator"></div>

				<div class="category-list finance">
					<EyeEdit
						v-if="type === 'sale'"
						v-model="finance.purchase_price"
						v-model:hidden="finance.hidden_fields"
						label="Kaufpreis"
						type="string"
						fieldname="purchase_price"
					/>
					<EyeEdit
						v-if="type === 'rent'"
						v-model="finance.cold_rent"
						v-model:hidden="finance.hidden_fields"
						label="Kaltmiete"
						type="string"
						fieldname="cold_rent"
					/>
					<EyeEdit
						v-model="finance.additional_costs"
						v-model:hidden="finance.hidden_fields"
						label="Nebenkosten"
						type="string"
						fieldname="additional_costs"
					/>
					<EyeEdit
						v-if="type === 'sale'"
						v-model="finance.broker_commission"
						v-model:hidden="finance.hidden_fields"
						label="Courtage"
						type="string"
						fieldname="broker_commission"
					/>
					<EyeEdit
						v-if="type === 'sale'"
						v-model="finance.land_registry_costs"
						v-model:hidden="finance.hidden_fields"
						label="Grundbucheintrag"
						type="string"
						fieldname="land_registry_costs"
					/>
					<EyeEdit
						v-if="type === 'sale'"
						v-model="finance.property_transfer_tax"
						v-model:hidden="finance.hidden_fields"
						label="Grunderwerbsteuer"
						type="string"
						fieldname="property_transfer_tax"
					/>
					<EyeEdit
						v-if="type === 'sale'"
						v-model="finance.monthly_rental_income"
						v-model:hidden="finance.hidden_fields"
						label="Mieteinnahmen monat."
						type="string"
						fieldname="monthly_rental_income"
					/>
					<EyeEdit
						v-if="type === 'sale'"
						v-model="finance.annual_rental_income"
						v-model:hidden="finance.hidden_fields"
						label="Mieteinnahmen jähr."
						type="string"
						fieldname="annual_rental_income"
					/>
					<EyeEdit
						v-if="type === 'rent'"
						v-model="finance.warm_rent"
						v-model:hidden="finance.hidden_fields"
						label="Warmmiete"
						type="string"
						fieldname="warm_rent"
					/>
					<EyeEdit
						v-if="type === 'rent'"
						v-model="finance.security_deposit"
						v-model:hidden="finance.hidden_fields"
						label="Kaution"
						type="string"
						fieldname="security_deposit"
					/>
					<EyeEdit
						v-model="finance.price_per_sqm"
						v-model:hidden="finance.hidden_fields"
						label="Preis/m²"
						type="string"
						fieldname="price_per_sqm"
					/>
				</div>

				<div class="separator"></div>

				<div class="category-list areas">
					<EyeEdit
						v-model="areas.plot_area"
						v-model:hidden="areas.hidden_fields"
						label="Grundstücksfläche"
						type="string"
						fieldname="plot_area"
					/>
					<EyeEdit
						v-model="areas.building_footprint_area"
						v-model:hidden="areas.hidden_fields"
						label="Grundfläche"
						type="string"
						fieldname="building_footprint_area"
					/>
					<EyeEdit
						v-model="areas.total_area"
						v-model:hidden="areas.hidden_fields"
						label="Gesamtfläche"
						type="string"
						fieldname="total_area"
					/>
					<EyeEdit
						v-model="areas.usable_area"
						v-model:hidden="areas.hidden_fields"
						label="Nutzfläche"
						type="string"
						fieldname="usable_area"
					/>
					<EyeEdit
						v-model="areas.living_area"
						v-model:hidden="areas.hidden_fields"
						label="Wohnfläche"
						type="string"
						fieldname="living_area"
					/>
					<EyeEdit
						v-model="areas.storage_production_area"
						v-model:hidden="areas.hidden_fields"
						label="Lager-/Produktionsfläche"
						type="string"
						fieldname="storage_production_area"
					/>
					<EyeEdit
						v-model="areas.office_practice_area"
						v-model:hidden="areas.hidden_fields"
						label="Büro-/Praxisfläche"
						type="string"
						fieldname="office_practice_area"
					/>
					<EyeEdit
						v-model="areas.commercial_area"
						v-model:hidden="areas.hidden_fields"
						label="Gewerbe"
						type="string"
						fieldname="commercial_area"
					/>

					<EyeEdit
						v-if="type === 'sale'"
						v-model="areas.site_coverage_ratio"
						v-model:hidden="areas.hidden_fields"
						label="Grundflächenzahl (GRZ) "
						type="string"
						fieldname="site_coverage_ratio"
					/>
					<EyeEdit
						v-if="type === 'sale'"
						v-model="areas.floor_area_ratio"
						v-model:hidden="areas.hidden_fields"
						label="Geschossflächenzahl (GFZ)"
						type="string"
						fieldname="floor_area_ratio"
					/>
				</div>

				<div class="separator"></div>

				<div class="category-list spaces">
					<EyeEdit
						v-model="spaces.ceiling_height"
						v-model:hidden="spaces.hidden_fields"
						label="Hallen-/ Geschosshöhe"
						type="string"
						fieldname="ceiling_height"
					/>
					<EyeEdit
						v-model="spaces.number_of_floors"
						v-model:hidden="spaces.hidden_fields"
						label="Etagenzahl"
						type="string"
						fieldname="number_of_floors"
					/>
					<EyeEdit
						v-model="spaces.residential_units"
						v-model:hidden="spaces.hidden_fields"
						label="Wohneinheiten"
						type="string"
						fieldname="residential_units"
					/>

					<EyeEdit v-model="spaces.rooms" v-model:hidden="spaces.hidden_fields" label="Zimmer" type="string" fieldname="rooms" />
					<EyeEdit
						v-model="spaces.bedrooms"
						v-model:hidden="spaces.hidden_fields"
						label="Schlafzimmer"
						type="string"
						fieldname="bedrooms"
					/>
					<EyeEdit
						v-model="spaces.bathrooms"
						v-model:hidden="spaces.hidden_fields"
						label="Badezimmer "
						type="string"
						fieldname="bathrooms"
					/>

					<EyeEdit v-model="spaces.balcony" v-model:hidden="spaces.hidden_fields" label="Balkon" type="string" fieldname="balcony" />
					<EyeEdit v-model="spaces.terrace" v-model:hidden="spaces.hidden_fields" label="Terrasse" type="string" fieldname="terrace" />
					<EyeEdit v-model="spaces.garden" v-model:hidden="spaces.hidden_fields" label="Garten" type="string" fieldname="garden" />
					<EyeEdit v-model="spaces.elevator" v-model:hidden="spaces.hidden_fields" label="Aufzug" type="string" fieldname="elevator" />
					<EyeEdit v-model="spaces.basement" v-model:hidden="spaces.hidden_fields" label="Keller" type="string" fieldname="basement" />
					<EyeEdit v-model="spaces.garage" v-model:hidden="spaces.hidden_fields" label="Garage" type="string" fieldname="garage" />
					<EyeEdit v-model="spaces.parking" v-model:hidden="spaces.hidden_fields" label="Stellplatz" type="string" fieldname="parking" />
				</div>

				<div class="separator"></div>

				<div class="category-list tech-details">
					<EyeEdit
						v-model="tech_details.year_built"
						v-model:hidden="tech_details.hidden_fields"
						label="Baujahr"
						type="string"
						fieldname="year_built"
					/>
					<EyeEdit
						v-model="tech_details.heating_type"
						v-model:hidden="tech_details.hidden_fields"
						label="Heizungsart"
						type="string"
						fieldname="heating_type"
					/>
					<EyeEdit
						v-model="tech_details.primary_energy_source"
						v-model:hidden="tech_details.hidden_fields"
						label="Wesentliche Energieträger"
						type="string"
						fieldname="primary_energy_source"
					/>
					<EyeEdit
						v-model="tech_details.energy_certificate_available"
						v-model:hidden="tech_details.hidden_fields"
						label="Energieausweis"
						type="string"
						fieldname="energy_certificate_available"
					/>
					<EyeEdit
						v-model="tech_details.energy_certificate_type"
						v-model:hidden="tech_details.hidden_fields"
						label="Energie­ausweistyp"
						type="string"
						fieldname="energy_certificate_type"
					/>
					<EyeEdit
						v-model="tech_details.energy_consumption"
						v-model:hidden="tech_details.hidden_fields"
						label="Energieverbrauch"
						type="string"
						fieldname="energy_consumption"
					/>
					<EyeEdit
						v-model="tech_details.energy_efficiency_class"
						v-model:hidden="tech_details.hidden_fields"
						label="Energie­effizienz­klasse"
						type="string"
						fieldname="energy_efficiency_class"
					/>
					<EyeEdit
						v-model="tech_details.property_condition"
						v-model:hidden="tech_details.hidden_fields"
						label="Zustand"
						type="string"
						fieldname="property_condition"
					/>
					<EyeEdit
						v-model="tech_details.last_modernization_year"
						v-model:hidden="tech_details.hidden_fields"
						label="Modernisierungsjahr"
						type="string"
						fieldname="last_modernization_year"
					/>
					<EyeEdit
						v-model="tech_details.last_renovation_year"
						v-model:hidden="tech_details.hidden_fields"
						label="Letzte Sanierung"
						type="string"
						fieldname="last_renovation_year"
					/>
				</div>

				<div class="separator"></div>

				<!-- <div class="category-list">
				<EyeEdit v-model="updatedObject.description" v-model:hidden="updatedObject.hidden_fields" label="Objektbeschreibung" type="string" />
			</div>

			<div class="separator"></div>
			-->
				<div class="button-actions">
					<button type="button" class="border" @click.prevent="emit('cancelHandler')" :disabled="isSaving">Abbrechen</button>
					<button type="button" class="action" @click.prevent="saveObject" :disabled="!anyChanges || isSaving">Speichern</button>
				</div>
			</div>

			<div v-if="isSaving" class="edit-loader-layer">
				<Loader :transparent="true" />
			</div>
		</div>
	</div>
</template>

<style src="./ObjectEdit.css"></style>
