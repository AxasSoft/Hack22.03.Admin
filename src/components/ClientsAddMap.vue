<template>
	<VDialog class="axas-modal absolute" v-model="dialog" @click.self="closeMapModal">
		<VContainer class="py-8 color-white">
			<VCard class="white pa-4" title="Адрес доставки" style="overflow:visible;">
				<!-- <VResponsive class="mx-auto" max-width="800"> -->
				<VBtn class="sidebar-close" @click="closeMapModal" style="left: calc(100% - 16px); top: -16px"
					width="32px" height="32px">
					<VIcon icon="mdi-close" />
				</VBtn>
				<div>
					<span class="title"></span>

					<GoogleAutocomplete v-model="newAddress" class="mb-8 autocomplete"
						api-key="AIzaSyAKcYO57qXN9id12mnHBvaNE2SD1IBNy3I" style="
							width: 100%;
							box-shadow: 0px 0px 2px 0px #000000;
							padding: 10px;
							z-index: 999999 !important;
						" placeholder="Адрес" @set="callbackFunction($event)" />

					<GoogleMap :mapTypeControl="true" :clickableIcons="true" :draggable="true" :center="center"
						:api-key="apiGoogle" style="width: 100%; height: 400px; margin-bottom: 20px" :zoom="15"
						@click="selectMarker">
						<Marker v-if="newPosition.lat && newPosition.lng" :options="{ position: center }" />
					</GoogleMap>

					<div>
						<VBtn class="black-button waves-effect waves-light auth-submit" type="submit"
							@click="confirmAddress">
							Выбрать
						</VBtn>
					</div>
				</div>
				<!-- </VResponsive> -->
			</VCard>
		</VContainer>
	</VDialog>
</template>

<script lang='ts' setup>
import axios from "axios";
import { computed, ref } from "vue";
import { GoogleMap, Marker } from "vue3-google-map";
import { VDialog } from "vuetify/components/VDialog";
import { GoogleAutocomplete } from "vue3-google-autocomplete";

const apiGoogle = ref("AIzaSyAKcYO57qXN9id12mnHBvaNE2SD1IBNy3I");

const props = defineProps({
	address: String,
	position: {
		type: Object,
	},
	showMap: Boolean,
});

const newAddress = ref(props.address);
const newPosition = ref({
	lat: props.position?.lat ? props.position?.lat : 45.0391179,
	lng: props.position?.lng ? props.position?.lng : 38.9861764,
});

const dialog = ref(props.showMap);

const emit = defineEmits(["closeMap", "confirmAddress"]);

const getReverseGeocoding = (lat: number, lng: number) => {
	const latlng = [lat, lng].join(",");
	return axios.get(
		`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng}&key=AIzaSyAKcYO57qXN9id12mnHBvaNE2SD1IBNy3I`
	);
};

const center = computed(() => {
	return {
		lat: newPosition.value.lat,
		lng: newPosition.value.lng,
	};
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const callbackFunction = (place: any) => {
	console.log(place)
	newPosition.value = {
		lat: place.latitude,
		lng: place.longitude,
	};

	console.log(center)

	getReverseGeocoding(
		place.latitude,
		place.longitude
	).then((r) => {
		newAddress.value = r.data.results[1].formatted_address;
	});
};

const selectMarker = (e: { latLng: { lat: () => number; lng: () => number; }; }) => {
	newPosition.value.lat = e.latLng.lat();
	newPosition.value.lng = e.latLng.lng();

	getReverseGeocoding(e.latLng.lat(), e.latLng.lng()).then((r) => {
		console.log(r.data.results);
		if (r.data.results[0]) {
			newAddress.value = r.data.results[0].formatted_address;
			for (let i = 0; i < r.data.results[0].address_components.length; ++i) {
				if (r.data.results[0].address_components[i].types[0] === "locality") {
					newAddress.value = r.data.results[1].formatted_address;
				}
			}
		}
	});
};
const closeMapModal = () => {
	emit("closeMap");
};
const confirmAddress = () => {
	emit("confirmAddress", newAddress, newPosition);
	emit("closeMap");
};
</script>

<style>
.pac-container {
	z-index: 99999 !important;

}
</style>