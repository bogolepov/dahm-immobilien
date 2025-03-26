<script setup lang="ts">
import { ref, computed, useId } from 'vue';
import Dahm from '@data/dahm.json';
import PhoneOut from '@vue/icons/PhoneOut.vue';

const CHOICE_BY_NAME: string = 'Name';
const radioNameId = useId();
const radioObjectId = useId();

const choiceByName = ref(CHOICE_BY_NAME);
const namePartner = ref();
const objectAddress = ref();

const partners = computed(() => {
	const list = [];
	if (choiceByName.value === CHOICE_BY_NAME && namePartner.value) {
		console.log(namePartner.value);
		list.push(namePartner.value);
	} else if (choiceByName.value !== CHOICE_BY_NAME && objectAddress.value) {
		console.log(objectAddress.value);
		objectAddress.value.person.forEach(sid => list.push(team.find(p => p.sid === sid)));
	}
	console.log(list);

	return list;
});

Dahm.objects.sort((obj1, obj2) => {
	let res: number = obj1.address.str.toLowerCase().localeCompare(obj2.address.str.toLowerCase(), 'de');
	if (!res) res = obj1.address.number.toLowerCase().localeCompare(obj2.address.number.toLowerCase(), 'de');
	if (!res) res = obj1.address.city.toLowerCase().localeCompare(obj2.address.city.toLowerCase(), 'de');
	return res;
});
const team = Dahm.team.filter(person => person.telephone);
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
		<select v-show="choiceByName === CHOICE_BY_NAME" v-model="namePartner" class="ctrl-full">
			<option disabled :value="undefined" hidden>auswählen...</option>
			<option v-for="iPerson in team" :value="iPerson">
				{{ `${iPerson.name} ${iPerson.lastname}` }}
			</option>
		</select>
		<select v-show="choiceByName !== CHOICE_BY_NAME" v-model="objectAddress" class="ctrl-full">
			<option disabled :value="undefined" hidden>auswählen...</option>
			<option v-for="iObject in Dahm.objects" :value="iObject">
				{{ `${iObject.address.str} ${iObject.address.number}, ${iObject.address.plz} ${iObject.address.city}` }}
			</option>
		</select>
		<template v-for="iPartner in partners" :value="iPartner">
			<a
				v-if="choiceByName === CHOICE_BY_NAME"
				:href="`tel: ${iPartner.telephone}`"
				class="red-button icon-link ctrl-full"
				><PhoneOut width="1em" />{{ iPartner.telephone }}</a
			>
			<div v-else class="form-flex2">
				<p>{{ iPartner.name }} {{ iPartner.lastname }}</p>
				<a :href="`tel: ${iPartner.telephone}`" class="red-button icon-link"
					><PhoneOut width="1em" />{{ iPartner.telephone }}</a
				>
			</div>
		</template>
	</form>
</template>

<style src="/src/styles/form.css"></style>
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

.call-form select {
	margin-bottom: 0.8em;
}

.call-form .form-flex2 {
	align-items: center;
	padding: 0.2em 0 0.4em 0;
}
.call-form .form-flex2 + .form-flex2 {
	padding-top: 0.4em;
}
.call-form .form-flex2 p {
	font-weight: 400;
}
.call-form a.red-button {
	padding: 0.3em 0.6em;
	justify-content: center;
}
</style>
