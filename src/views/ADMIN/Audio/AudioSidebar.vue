<template>
    <Sidebar class="sidebar w-50 pb-4" v-model:visible="show" @show="willAppear()" position="right">
        <div class="sidebar-header py-4 px-8 fixed ">
            <VBtn class="sidebar-close" @click="show = false" width="32px" height="32px">
                <VIcon icon="mdi-close" />
            </VBtn>
            <h2 class="sidebar-header-title">Редактирование аудио</h2>
        </div>
        <VProgressLinear v-show="progressShow" style="position: absolute; width: 100%; top: 68px; z-index: 99999;"
            color="var(--main-color)" indeterminate />
        <div class="pa-4 d-flex flex-column sidebar-content pb-12">
            <div class="mb-12" style="padding-bottom: 58px;">
                <p class="text-body-2">Название*</p>
                <VTextField variant="plain" v-model="audioStore.selectEditAudio.title" autocomplete="off"
                    class="custom-tf mt-1 pa-0" />

                <p class="text-body-2">Описание*</p>
                <VTextarea variant="plain" v-model="audioStore.selectEditAudio.description"
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
                    :src="(audioStore.selectEditAudio?.image?.url ? audioStore.selectEditAudio.image.url : placeholder)"
                    cover />


                <p class="text-body-2">Аудио*</p>
                <VFileInput v-model="audioFile" class="d-none" ref="audioInput" variant="solo" :clearable="false"
                    hide-details prepend-icon="null" flat accept="audio/*" :multiple="false" />

                <audio v-if="audioStore.selectEditAudio?.audio?.url" controls
                    :src="audioStore.selectEditAudio?.audio?.url" class="w-100"></audio>

                <VBtn class="black-button" @click="($refs.audioInput as HTMLInputElement)?.click()">
                    Добавить
                </VBtn>
                <p class="mt-4 text-black">Озвучка доступна <a style="color: black;"
                        href="https://luvvoice.com/">здесь</a></p>
            </div>


            <div class="d-flex position-absolute bottom-0 py-2 bg-white w-100">
                <VBtn prepend-icon="mdi-check" class="black-button" @click="updateAudio()">
                    Изменить
                </VBtn>
                <!-- DELETE DIALOG -->
                <VDialog v-model="deleteAudioDialog" max-width="400" persistent>
                    <template v-slot:activator="{ props: deleteCategoryDialog }">
                        <VBtn class="alert-button mt-auto" v-bind="deleteCategoryDialog">
                            Удалить
                        </VBtn>
                    </template>

                    <VCard class="pa-6">
                        <div class="d-flex">
                            <VIcon icon="mdi-alert-outline" color="red" />
                            <p class="ml-2 text-red">ВНИМАНИЕ</p>
                        </div>

                        <p class="mt-4 text-body-2">Вы действительно хотите удалить аудио <b>{{
                            audioStore.selectEditAudio.title
                                }}</b>?
                            Все данные будут удалены без возможности восстановления.
                        </p>
                        <template v-slot:actions>
                            <VBtn @click=" deleteAudioDialog = false">
                                Отмена
                            </VBtn>


                            <VBtn class="text-red" @click="deleteAudio">
                                Удалить
                            </VBtn>
                        </template>
                    </VCard>
                </VDialog>
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
import { getDateFromUnix } from '@/plugins/unixTime';
import axios from 'axios';
import { GoogleMap, Marker } from 'vue3-google-map';


const audioStore = useAudiosStore()
const toast = useToast()
const progressShow = ref(false)
const show = defineModel<boolean>()
const deleteAudioDialog = ref(false)


const willAppear = () => {
    audioStore.selectEditAudio.started = getDateFromUnix(audioStore.selectEditAudio.started, 'datehourTF')
    audioStore.selectEditAudio.ended = getDateFromUnix(audioStore.selectEditAudio.ended, 'datehourTF')
    audioStore.selectEditAudio.image = {
        url: audioStore.selectEditAudio?.image || '',
        isChanged: false,
        file: null
    }
    console.log(audioStore.selectEditAudio?.audio?.link)
    audioStore.selectEditAudio.audio = {
        url: audioStore.selectEditAudio?.audio?.link || '',
        isChanged: false,
        file: null
    }
    console.log(audioStore.selectEditAudio?.audio)

    newPosition.value.lat = audioStore.selectEditAudio?.lat || 0
    newPosition.value.lon = audioStore.selectEditAudio?.lon || 0
}

const fileInput = ref<HTMLInputElement>();
const addedFiles = ref()
watch(
    () => addedFiles.value,
    async () => {
        if (addedFiles.value) {
            audioStore.selectEditAudio.image.file = (await fromBlob(addedFiles.value, 50, 'auto', 'auto', 'jpeg'))
            audioStore.selectEditAudio.image.url = audioStore.selectEditAudio.image.file != undefined ? URL.createObjectURL(audioStore.selectEditAudio.image.file) : '';
            audioStore.selectEditAudio.image.isChanged = true
        }
    }
);

const audioInput = ref<HTMLInputElement>();
const audioFile = ref()
watch(
    () => audioFile.value,
    async () => {
        if (audioFile.value) {
            audioStore.selectEditAudio.audio.file = audioFile.value
            audioStore.selectEditAudio.audio.url = audioStore.selectEditAudio.audio.file != undefined ? URL.createObjectURL(audioStore.selectEditAudio.audio.file) : '';
            audioStore.selectEditAudio.audio.isChanged = true
        }
    }
);


async function updateAudio() {

    console.log(audioStore.selectEditAudio.started)


    if (!((audioStore.selectEditAudio.title ? audioStore.selectEditAudio.title : '').trim())) {
        toast.error("Укажите название")
        return
    }

    if (!((audioStore.selectEditAudio.description ? audioStore.selectEditAudio.description : '').trim())) {
        toast.error("Укажите описание")
        return
    }

    audioStore.selectEditAudio.lat = newPosition.value.lat
    audioStore.selectEditAudio.lon = newPosition.value.lon

    if (audioStore.selectEditAudio?.audio.isChanged) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response: any = await audioStore.updateAudioFile(audioStore.selectEditAudio.id, audioStore.selectEditAudio.audio.file)
        if (response.status != 200) {
            toast.success("Не удалось обновить аудио")
        }
    }

    if (audioStore.selectEditAudio?.image.isChanged) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response: any = await audioStore.updateAudioImage(audioStore.selectEditAudio.id, audioStore.selectEditAudio.image.file)
        if (response.status != 200) {
            toast.success("Не удалось обновить изображение")
        }
    }

    progressShow.value = true
    // CREATE PRODUCT
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await audioStore.updateAudio(audioStore.selectEditAudio.id)
    if (response.status === 200) {
        progressShow.value = false
        toast.success("Аудио успешно изменено")
        show.value = false
    } else {
        progressShow.value = false
        toast.error(response.response.data.description);
    }
}

const deleteAudio = async () => {
    progressShow.value = true
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await audioStore.deleteAudio(audioStore.selectEditAudio.id)
    if (response.status == 200) {
        toast.success('Аудио успешно удалено')
        progressShow.value = false
        deleteAudioDialog.value = false
        show.value = false
    } else {
        toast.error('Не удалось удалить аудио')
        progressShow.value = true
    }
}




// MAP
const apiGoogle = ref("AIzaSyAKcYO57qXN9id12mnHBvaNE2SD1IBNy3I");
const newPosition = ref({
    lat: audioStore.selectEditAudio?.lat || 0,
    lon: audioStore.selectEditAudio?.lon || 0,
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
