<script setup lang="ts">
import { type PropertyFormData } from '@scripts/zod';
import ObjectStatusSticker from '@vue/Objects/ObjectStatusSticker/ObjectStatusSticker.vue';
import ObjectCoverImage from './ObjectCoverImage.vue';
import AttachIcon from '@vue/icons/AttachIcon.vue';
import { onMounted, onUnmounted } from 'vue';

interface Props {
	object: PropertyFormData;
}

const { object } = defineProps<Props>();
const { address, finance, areas, spaces, tech_details } = object;

const emit = defineEmits<{
	closeHandler: [];
}>();

const onKeydown = (e: KeyboardEvent) => {
	if (e.key === 'Escape') {
		emit('closeHandler');
	}
};

onMounted(() => {
	window.addEventListener('keydown', onKeydown);
});

onUnmounted(() => {
	window.removeEventListener('keydown', onKeydown);
});
</script>

<template>
	<div class="layer-on-window" @click.self="emit('closeHandler')">
		<Transition name="dialog" appear>
			<div class="view-layer">
				<button type="button" class="close-button" @click.prevent="emit('closeHandler')" aria-label="Schließen" tabindex="0">
					&#10006;
				</button>

				<div class="category-list prop-cover-image">
					<div class="cover-image-container">
						<ObjectCoverImage :url="object.url_image" :alt="object.marketing_title" />
						<ObjectStatusSticker :status="object.status" />
					</div>
				</div>

				<p v-if="object.marketing_title" class="title">{{ object.marketing_title }}</p>

				<ul class="card-list property-content">
					<li class="card-item sticker color category-list not-zoom">
						<p v-if="object.property_sid"><span>Objekt Nr.:</span>{{ object.property_sid }}</p>
						<p v-if="object?.property_type"><span>Objektart:</span>{{ object?.property_type }}</p>
						<p v-if="address?.street || address?.building"><span>Adresse:</span>{{ address?.street }} {{ address?.building }}</p>
						<p v-if="address?.zip || address?.city"><span>Ort:</span>{{ address?.zip }} {{ address?.city }}</p>
						<p v-if="object.url_expose">
							<span>Expose:</span>
							<a :href="object.url_expose" target="_blank" rel="noopener noreferrer">
								PDF
								<button>
									<AttachIcon />
								</button>
							</a>
						</p>
						<p v-if="address?.url_location">
							<span>Map:</span>
							<a :href="address?.url_location" target="_blank" rel="noopener noreferrer"> Google Maps </a>
						</p>
					</li>

					<li class="card-item sticker color category-list finance not-zoom">
						<p v-if="finance?.purchase_price"><span>Kaufpreis:</span>{{ finance?.purchase_price }}</p>
						<p v-if="finance?.cold_rent"><span>Kaltmiete:</span>{{ finance?.cold_rent }}</p>
						<p v-if="finance?.additional_costs"><span>Nebenkosten:</span>{{ finance?.additional_costs }}</p>
						<p v-if="finance?.broker_commission"><span>Courtage:</span>{{ finance?.broker_commission }}</p>
						<p v-if="finance?.land_registry_costs"><span>Grundbucheintrag:</span>{{ finance?.land_registry_costs }}</p>
						<p v-if="finance?.property_transfer_tax"><span>Grunderwerbsteuer:</span>{{ finance?.property_transfer_tax }}</p>
						<p v-if="finance?.monthly_rental_income"><span>Mieteinnahmen monat.:</span>{{ finance?.monthly_rental_income }}</p>
						<p v-if="finance?.annual_rental_income"><span>Mieteinnahmen jähr.:</span>{{ finance?.annual_rental_income }}</p>
						<p v-if="finance?.warm_rent"><span>Warmmiete:</span>{{ finance?.warm_rent }}</p>
						<p v-if="finance?.security_deposit"><span>Kaution:</span>{{ finance?.security_deposit }}</p>
						<p v-if="finance?.price_per_sqm"><span>Preis/m²:</span>{{ finance?.price_per_sqm }}</p>
					</li>

					<li class="card-item sticker color category-list areas not-zoom">
						<p v-if="areas?.plot_area"><span>Grundstücksfläche:</span>{{ areas?.plot_area }}</p>
						<p v-if="areas?.building_footprint_area"><span>Grundfläche:</span>{{ areas?.building_footprint_area }}</p>
						<p v-if="areas?.total_area"><span>Gesamtfläche:</span>{{ areas?.total_area }}</p>
						<p v-if="areas?.usable_area"><span>Nutzfläche:</span>{{ areas?.usable_area }}</p>
						<p v-if="areas?.living_area"><span>Wohnfläche:</span>{{ areas?.living_area }}</p>
						<p v-if="areas?.storage_production_area"><span>Lager-/Produktionsfläche:</span>{{ areas?.storage_production_area }}</p>
						<p v-if="areas?.office_practice_area"><span>Büro-/Praxisfläche:</span>{{ areas?.office_practice_area }}</p>
						<p v-if="areas?.commercial_area"><span>Gewerbe:</span>{{ areas?.commercial_area }}</p>
						<p v-if="areas?.site_coverage_ratio"><span>Grundflächenzahl (GRZ):</span>{{ areas?.site_coverage_ratio }}</p>
						<p v-if="areas?.floor_area_ratio"><span>Geschossflächenzahl (GFZ):</span>{{ areas?.floor_area_ratio }}</p>
					</li>

					<li class="card-item sticker color category-list spaces not-zoom">
						<p v-if="spaces?.ceiling_height"><span>Hallen-/ Geschosshöhe:</span>{{ spaces?.ceiling_height }}</p>
						<p v-if="spaces?.number_of_floors"><span>Etagenzahl:</span>{{ spaces?.number_of_floors }}</p>
						<p v-if="spaces?.residential_units"><span>Wohneinheiten:</span>{{ spaces?.residential_units }}</p>

						<p v-if="spaces?.rooms"><span>Zimmer:</span>{{ spaces?.rooms }}</p>
						<p v-if="spaces?.bedrooms"><span>Schlafzimmer:</span>{{ spaces?.bedrooms }}</p>
						<p v-if="spaces?.bathrooms"><span>Badezimmer:</span>{{ spaces?.bathrooms }}</p>

						<p v-if="spaces?.balcony"><span>Balkon:</span>{{ spaces?.balcony }}</p>
						<p v-if="spaces?.terrace"><span>Terrasse:</span>{{ spaces?.terrace }}</p>
						<p v-if="spaces?.garden"><span>Garten:</span>{{ spaces?.garden }}</p>
						<p v-if="spaces?.elevator"><span>Aufzug:</span>{{ spaces?.elevator }}</p>
						<p v-if="spaces?.basement"><span>Keller:</span>{{ spaces?.basement }}</p>
						<p v-if="spaces?.garage"><span>Garage:</span>{{ spaces?.garage }}</p>
						<p v-if="spaces?.parking"><span>Stellplatz:</span>{{ spaces?.parking }}</p>
					</li>

					<li class="card-item sticker color category-list tech-details not-zoom">
						<p v-if="tech_details?.year_built"><span>Baujahr:</span>{{ tech_details?.year_built }}</p>
						<p v-if="tech_details?.heating_type"><span>Heizungsart:</span>{{ tech_details?.heating_type }}</p>
						<p v-if="tech_details?.primary_energy_source">
							<span>Wesentliche Energieträger:</span>{{ tech_details?.primary_energy_source }}
						</p>
						<p v-if="tech_details?.energy_certificate_available">
							<span>Energieausweis:</span>{{ tech_details?.energy_certificate_available }}
						</p>
						<p v-if="tech_details?.energy_certificate_type"><span>Energie­ausweistyp:</span>{{ tech_details?.energy_certificate_type }}</p>
						<p v-if="tech_details?.energy_consumption"><span>Energieverbrauch:</span>{{ tech_details?.energy_consumption }}</p>
						<p v-if="tech_details?.energy_efficiency_class">
							<span>Energie­effizienz­klasse:</span>{{ tech_details?.energy_efficiency_class }}
						</p>
						<p v-if="tech_details?.property_condition"><span>Zustand:</span>{{ tech_details?.property_condition }}</p>
						<p v-if="tech_details?.last_modernization_year"><span>Modernisierungsjahr:</span>{{ tech_details?.last_modernization_year }}</p>
						<p v-if="tech_details?.last_renovation_year"><span>Letzte Sanierung:</span>{{ tech_details?.last_renovation_year }}</p>
					</li>
					<li></li>
				</ul>
			</div>
		</Transition>
	</div>
</template>

<style src="./ObjectView.css"></style>
