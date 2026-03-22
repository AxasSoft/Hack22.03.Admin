<template>
    <Sidebar class="sidebar w-50 pb-4" v-model:visible="show" position="right">
        <div class="sidebar-header py-4 px-8 fixed ">
            <VBtn class="sidebar-close" @click="show = false" width="32px" height="32px">
                <VIcon icon="mdi-close" />
            </VBtn>
            <h2 class="sidebar-header-title">Создание аудио</h2>
        </div>
        <VProgressLinear v-show="progressShow" style="position: absolute; width: 100%; top: 68px; z-index: 99999;"
            color="var(--main-color)" indeterminate />
        <div class="pa-4 d-flex flex-column sidebar-content pb-12">
            <div class="mb-12" style="padding-bottom: 58px;">
                <p class="text-body-2">Название*</p>
                <VTextField variant="plain" v-model="audioStore.newAudio.title" autocomplete="off"
                    class="custom-tf mt-1 pa-0" />

                <p class="text-body-2">Описание*</p>
                <VTextarea variant="plain" v-model="audioStore.newAudio.description"
                    class="mt-1 pa-0 custom-textarea" />



                <div class="w-100 pa-0">
                    <p class="text-body-2 mt-1">Локация*</p>

                    <GoogleMap :mapTypeControl="false" :fullscreenControl="false" :streetViewControl="false"
                        :clickableIcons="false" :draggable="true" :center="center" :api-key="apiGoogle"
                        style="width: 100%; height: calc(100vh - 220px); margin-bottom: 20px" :zoom="15"
                        @click="selectMarker">
                        <Marker :options="{ position: center }" />
                    </GoogleMap>
                </div>


                <p class="text-body-2">Изображение*</p>
                <VFileInput v-model="addedFiles" class="d-none" ref="fileInput" variant="solo" :clearable="false"
                    hide-details prepend-icon="null" flat accept="image/jpeg, image/png, image/jpg" :multiple="false" />

                <VImg md="4" height="140px" width="320px" class=" ma-1 upload-image rounded" style="max-width: 320px;"
                    @click="($refs.fileInput as HTMLInputElement)?.click()"
                    :src="(audioStore.newAudio.image.url ? audioStore.newAudio.image.url : placeholder)" cover />


                <p class="text-body-2">Аудио*</p>
                <VFileInput v-model="audioFile" class="d-none" ref="audioInput" variant="solo" :clearable="false"
                    hide-details prepend-icon="null" flat accept="audio/*" :multiple="false" />

                <audio controls :src="audioStore.newAudio.audio.url" class="w-100"></audio>

                <VBtn class="black-button" @click="($refs.audioInput as HTMLInputElement)?.click()">
                    Добавить
                </VBtn>
                <p class="mt-4 text-black">Озвучка доступна <a style="color: black;"
                        href="https://luvvoice.com/">здесь</a></p>
            </div>



            <div class="d-flex position-absolute bottom-0 py-2 bg-white w-100">
                <VBtn prepend-icon="mdi-check" class="black-button" @click="createAudio">
                    Сохранить
                </VBtn>

            </div>

        </div>

    </Sidebar>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import Sidebar from 'primevue/sidebar';
import { useToast } from 'vue-toastification';
import placeholder from "@/assets/images/Placeholder.png"
import { useAudiosStore } from '@/stores/audioStore';
import { fromBlob } from 'image-resize-compress';
import { GoogleMap, Marker } from 'vue3-google-map';
import axios from 'axios';


const audioStore = useAudiosStore()
const toast = useToast()
const progressShow = ref(false)
const show = defineModel<boolean>()

const fileInput = ref<HTMLInputElement>();
const addedFiles = ref()
watch(
    () => addedFiles.value,
    async () => {
        if (addedFiles.value) {
            audioStore.newAudio.image.file = (await fromBlob(addedFiles.value, 50, 'auto', 'auto', 'jpeg'))
            audioStore.newAudio.image.url = audioStore.newAudio.image.file != undefined ? URL.createObjectURL(audioStore.newAudio.image.file) : '';
            audioStore.newAudio.image.isChanged = true
        }
    }
);

const audioInput = ref<HTMLInputElement>();
const audioFile = ref()
watch(
    () => audioFile.value,
    async () => {
        if (audioFile.value) {
            audioStore.newAudio.audio.file = audioFile.value
            audioStore.newAudio.audio.url = audioStore.newAudio.audio.file != undefined ? URL.createObjectURL(audioStore.newAudio.audio.file) : '';
            audioStore.newAudio.audio.isChanged = true
        }
    }
);

async function createAudio() {

    if (!((audioStore.newAudio.title ? audioStore.newAudio.title : '').trim())) {
        toast.error("Укажите название")
        return
    }

    if (!((audioStore.newAudio.description ? audioStore.newAudio.description : '').trim())) {
        toast.error("Укажите описание")
        return
    }


    if (!audioStore.newAudio?.image.url) {
        toast.error("Добавьте картинку")
        return
    }

    if (!audioStore.newAudio?.audio.url) {
        toast.error("Добавьте аудиофайл")
        return
    }

    audioStore.newAudio.lat = newPosition.value.lat
    audioStore.newAudio.lon = newPosition.value.lon

    progressShow.value = true
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await audioStore.createNewAudio()
    if (response.status === 200) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const responseImage: any = await audioStore.updateAudioFile(response.data.data.id, audioStore.newAudio.audio.file)
        if (responseImage.status === 200) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const responseImage: any = await audioStore.updateAudioImage(response.data.data.id, audioStore.newAudio.image.file)
            if (responseImage.status === 200) {
                progressShow.value = false
                toast.success("Запись гида успешно создана")
                show.value = false
            } else {
                progressShow.value = false
                toast.error("Не удалось загрузить изображение");
            }
        } else {
            progressShow.value = false
            toast.error("Не удалось загрузить аудиофайл");
        }
    } else {
        progressShow.value = false

        toast.error(response.response.data.description);
    }



}




// MAP
const apiGoogle = ref("AIzaSyAKcYO57qXN9id12mnHBvaNE2SD1IBNy3I");
const newPosition = ref({
    lat: 52.9292984,
    lon: 87.98313904,
});
const city = ref(null);

const getReverseGeocoding = (lat: number, lon: number) => {
    const latlon = [lat, lon].join(",");
    return axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlon}&key=AIzaSyAKcYO57qXN9id12mnHBvaNE2SD1IBNy3I`
    );
};

const center = computed(() => {
    return {
        lat: newPosition.value.lat,
        lng: newPosition.value.lon,
    };
});
const selectMarker = (e: { latLng: { lat: () => number; lng: () => number; }; }) => {
    newPosition.value.lat = e.latLng.lat();
    newPosition.value.lon = e.latLng.lng();

    getReverseGeocoding(e.latLng.lat(), e.latLng.lng()).then((r) => {
        if (r.data.results[0]) {
            // newUserDeliveryAddress.value!.address = r.data.results[0].formatted_address;
            for (let i = 0; i < r.data.results[0].address_components.length; ++i) {
                if (r.data.results[0].address_components[i].types[0] === "locality") {
                    city.value = r.data.results[0].address_components[i].short_name;
                }
            }
        }
    });
};
</script>

<style>
.main-container {
    background: var(--color-background-soft);
    height: 100vh;
    margin: 0;
    padding: 0;
}

.container {
    width: calc(100% - 40px);
    height: calc(100% - 40px);
    max-width: calc(100% - 40px);
}

.header {
    border-bottom: 1px solid var(--border-color);
}

.create-app-link {
    text-decoration: none;
    color: rgba(0, 0, 0, 0.627);
    margin: 5px 0;
}

.delete-attr-btn {
    background-color: var(--back-color);
    border: 1px solid var(--back-color);
    width: 30px;
    min-width: 30px;
    border-radius: 50%;
    padding: 0;
    height: 30px;
    min-height: 30px;
}

.left_p {
    /* padding-left: 20px !important; */
    margin-left: 30px !important;
}

.active {
    background-color: var(--active-back-color);
    color: var(--active-color);
    padding: 2px 8px;
    border-radius: 8px;
    height: 28px;
    font-size: 14px;
}

.inactive {
    background-color: var(--alert-back-color);
    color: var(--alert-color);
    padding: 2px 8px;
    border-radius: 8px;
    height: 28px;
    font-size: 14px;
}

.upload-image {
    width: 140px;
    height: 140px;
    border-radius: 8px;
    background-color: black;
    border: 3px solid white;
}

.thumbnail_image {
    width: 140px;
    height: 140px;
    border-radius: 8px;
    background-color: black;
    border: 3px solid black;
}

.pac-container {
    z-index: 9999999 !important;
}
</style>
