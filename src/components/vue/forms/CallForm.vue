<script setup lang="ts">
import { ref, computed, useId } from 'vue';
import { getDayName } from '@scripts/utils';
import Dahm from '@data/dahm.json';
import PhoneOut from '@vue/icons/PhoneOut.vue';
import '@styles/form.css';
import type { IObjectInfo, IPerson } from '@scripts/types';

const CHOICE_BY_NAME: string = 'Name';
const radioNameId = useId();
const radioObjectId = useId();

const choiceByName = ref(CHOICE_BY_NAME);
const namePartner = ref();
const objectAddress = ref<IObjectInfo>();

Dahm.objects.sort((obj1, obj2) => {
	let res: number = obj1.address.str.toLowerCase().localeCompare(obj2.address.str.toLowerCase(), 'de');
	if (!res) res = obj1.address.number.toLowerCase().localeCompare(obj2.address.number.toLowerCase(), 'de');
	if (!res) res = obj1.address.city.toLowerCase().localeCompare(obj2.address.city.toLowerCase(), 'de');
	return res;
});
const team: IPerson[] = Dahm.team.filter(person => person.telephone);

const objectPartners = computed(() => {
	const list: IPerson[] = [];
	// if (choiceByName.value === CHOICE_BY_NAME && namePartner.value) {
	// 	list.push(namePartner.value);
	// } else
	if (choiceByName.value !== CHOICE_BY_NAME && objectAddress.value) {
		objectAddress.value.person.forEach(person_sid => {
			const person = team.find(p => p.sid === person_sid);
			if (person) list.push(person);
		});
	}
	return list;
});
function getOfficeTime(person: IPerson): string {
	if (!person) return '';
	const { days, time } = person.office_time;
	return `${days.von}-${days.bis}: ${time.von}-${time.bis} Uhr`;
}
function getOfficeTimeLong(person: IPerson): string {
	if (!person) return '';
	const { days, time } = person.office_time;
	return `${getDayName(days.von)}-${getDayName(days.bis)}: ${time.von}-${time.bis} Uhr`;
}
</script>

<template>
	<form class="call-form">
		<div class="flex-choice">
			<div class="flex-radio">
				<input type="radio" :id="radioNameId" v-model="choiceByName" value="Name" />
				<label :for="radioNameId">nach Name</label>
			</div>
			<div class="flex-radio">
				<input type="radio" :id="radioObjectId" v-model="choiceByName" value="Objekt" />
				<label :for="radioObjectId">nach Objekt</label>
			</div>
		</div>
		<div v-show="choiceByName === CHOICE_BY_NAME" class="choice-block">
			<select v-model="namePartner" class="ctrl-full">
				<option disabled :value="undefined" hidden>auswählen...</option>
				<option v-for="iPerson in team" :value="iPerson">
					{{ `${iPerson.lastname} ${iPerson.name}` }}
				</option>
			</select>
			<p v-if="namePartner" class="office-time by-name">{{ getOfficeTimeLong(namePartner) }}</p>
			<a
				v-if="namePartner"
				:href="`tel:${namePartner.telephone.replaceAll(' ', '')}`"
				class="red-button icon-link ctrl-full"
				><PhoneOut width="1em" />{{ namePartner.telephone }}</a
			>
		</div>
		<div v-show="choiceByName !== CHOICE_BY_NAME" class="choice-block">
			<select v-model="objectAddress" class="ctrl-full">
				<option disabled :value="undefined" hidden>auswählen...</option>
				<option v-for="iObject in Dahm.objects" :value="iObject">
					{{ `${iObject.address.str} ${iObject.address.number}, ${iObject.address.plz} ${iObject.address.city}` }}
				</option>
			</select>
			<template v-for="iPartner in objectPartners" :value="iPartner">
				<div class="form-flex2">
					<div>
						<p>{{ iPartner.lastname }} {{ iPartner.name }}</p>
						<p class="office-time">{{ getOfficeTime(iPartner) }}</p>
					</div>
					<a :href="`tel:${iPartner.telephone.replaceAll(' ', '')}`" class="red-button icon-link"
						><PhoneOut width="1em" />{{ iPartner.telephone }}</a
					>
				</div>
			</template>
		</div>
	</form>
</template>

<!-- <style src="/src/styles/form.css"></style> -->
<style>
.flex-choice {
	display: flex;
	flex-wrap: wrap;
	column-gap: 1.35em;
	align-items: center;
	padding-bottom: 0.3em;
	font-size: 0.9em;
}
.flex-choice .flex-radio {
	display: flex;
	align-items: center;
}

.flex-choice label {
	padding-left: 0.4em;
}

.call-form .choice-block {
	margin-bottom: 0.8em;
}

.call-form .form-flex2 {
	align-items: center;
	margin: 0;
	padding: 0;
	margin-top: 0.8em;
}

.call-form .form-flex2 p {
	font-weight: 400;
}
.call-form a.red-button {
	padding: 0.3em 0.6em;
	justify-content: center;
}
.call-form .office-time {
	font-size: 0.87em;
	font-weight: 400;
	line-height: 1;
	padding-top: 0.1em;
}
.call-form .office-time.by-name {
	padding-top: 0.45em;
	padding-bottom: 0.8em;
}

.call-form .flex-radio input:focus-visible {
	outline: unset;
}
.call-form .flex-radio:has(input:focus-visible) {
	outline: 1px solid var(--color-dahm-bordo);
	outline-offset: 2px;
}
</style>
