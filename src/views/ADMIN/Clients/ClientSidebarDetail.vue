<template>
    <VSheet class="pa-6">


        <div>
            <VImg class="avatar" :src="avatar" cover @click="($refs.fileInput as HTMLInputElement)?.click()" />
            <VFileInput v-model="addedFiles" class="d-none" ref="fileInput" variant="solo" :clearable="false"
                hide-details prepend-icon="null" flat accept="image/jpeg, image/png, image/jpg" />

        </div>

        <div class="d-flex w-100">
            <div class="w-50 pa-0">
                <p class="text-body-2 mt-1">Фамилия*</p>
                <VTextField variant="plain" v-model="clientsStore.selectEditClient.lastName" autocomplete="off"
                    class="custom-tf mt-1 pa-0" type="text" />
            </div>
            <div class="w-50 ml-4 pa-0">
                <p class="text-body-2 mt-1">Имя*</p>
                <VTextField variant="plain" v-model="clientsStore.selectEditClient.firstName" autocomplete="off"
                    class="custom-tf mt-1 pa-0" type="text" />
            </div>
            <div class="w-50 ml-4 pa-0">
                <p class="text-body-2 mt-1">Отчество</p>
                <VTextField variant="plain" v-model="clientsStore.selectEditClient.patronymic" autocomplete="off"
                    class="custom-tf mt-1 pa-0" type="text" />
            </div>
        </div>



        <div class="d-flex w-100">
            <div class="w-50 pa-0">
                <p class="text-body-2 mt-1">Телефон*</p>
                <VTextField variant="plain" v-mask="'+7 (###) ### ## ##'" placeholder="+7 (123) 456 78 90"
                    v-model="clientsStore.selectEditClient.tel" autocomplete="off" class="custom-tf mt-1 pa-0"
                    type="text" />
            </div>
            <div class="w-50 ml-4 pa-0">
                <p class="text-body-2 mt-1">E-mail</p>
                <VTextField variant="plain" v-model="clientsStore.selectEditClient.email" autocomplete="off"
                    class="custom-tf mt-1 pa-0" type="text" />
            </div>
        </div>

        <div class="d-flex w-100">
            <div class="w-50 pa-0">
                <p class="text-body-2 mt-1">Дата рождения*</p>
                <VTextField variant="plain" v-model="birthtime" @update:model-value="setNewBirthtime" autocomplete="off"
                    class="custom-tf mt-1 pa-0" type="date" />
            </div>
            <div class="w-50 ml-4 pa-0">
                <p class="text-body-2 mt-1">Пол*</p>
                <VSelect v-model="gender" @update:model-value="setGender()" class="custom-tf mt-1" variant="plain"
                    density="compact"
                    :items="[{ id: 0, icon: 'mdi-face-man-outline', name: 'Мужской' }, { id: 1, icon: 'mdi-face-woman-outline', name: 'Женский' }]"
                    autocomplete="off">
                    <template v-slot:item="{ props, item }">
                        <VListItem :prepend-icon="item.raw.icon" v-bind="props" :title="item.raw.name" />
                    </template>
                    <template v-slot:selection="{ item }">
                        <VListItem :prepend-icon="item.raw.icon" :title="item.raw.name" />
                    </template>
                </VSelect>
            </div>
        </div>

        <p class="text-body-2">Город*</p>
        <GoogleAutocomplete v-model="location" class="custom-tf mt-1 rounded"
            api-key="AIzaSyAKcYO57qXN9id12mnHBvaNE2SD1IBNy3I" style="
							width: 100%;
							padding: 8px;
							z-index: 999999 !important;
                            background-color: var(--back-color);
						" autocomplete="off" :placeholder="clientsStore.selectEditClient.location" @set="setLocatoin($event)" />
    </VSheet>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { fromBlob } from 'image-resize-compress';
import { mask } from 'vue-the-mask';
import { useClientsStore } from '@/stores/clientsStore';
import { GoogleAutocomplete } from 'vue3-google-autocomplete';
import { getStringDate, getUnixTime } from '@/plugins/unixTime';
import placeholder from "@/assets/images/Placeholder.png"

const vMask = mask;
const clientsStore = useClientsStore()
const gender = ref(clientsStore.selectEditClient.gender == 0 ? { id: 0, icon: 'mdi-face-man-outline', name: 'Мужской' } : { id: 1, icon: 'mdi-face-woman-outline', name: 'Женский' })
const birthtime = ref(getStringDate(clientsStore.selectEditClient.birthtime))
const location = ref()
const avatar = ref(clientsStore.selectEditClient.avatar || placeholder)




const setNewBirthtime = () => {
    clientsStore.selectEditClient.birthtime = getUnixTime(birthtime.value)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setLocatoin = (newLocatoin: any) => {
    clientsStore.selectEditClient.location = ''
    clientsStore.selectEditClient.location += newLocatoin?.country ? newLocatoin?.country : ''
    clientsStore.selectEditClient.location += newLocatoin?.state ? ', ' + newLocatoin?.state : ''
    clientsStore.selectEditClient.location += newLocatoin?.city ? ', ' + newLocatoin?.city : ''
    clientsStore.selectEditClient.location += newLocatoin?.name ? ', ' + newLocatoin?.name : ''
}

const setGender = () => {
    clientsStore.selectEditClient.gender = gender.value.id
    console.log(clientsStore.selectEditClient.gender)
}





const fileInput = ref<HTMLInputElement>();
const addedFiles = ref()
watch(
    () => addedFiles.value,
    async () => {
        if (addedFiles.value) {
            clientsStore.selectEditClient.avatar.file = (await fromBlob(addedFiles.value, 50, 'auto', 'auto', 'jpeg'))
            clientsStore.selectEditClient.avatar.url = clientsStore.selectEditClient.avatar.file != undefined ? URL.createObjectURL(clientsStore.selectEditClient.avatar.file) : '';
            avatar.value = clientsStore.selectEditClient.avatar.url
            clientsStore.selectEditClient.avatar.isChanged = true;
        }
    }
);

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

.avatar {
    align-self: center;
    width: 150px;
    height: 150px;
    margin: 0 auto;
    background-color: var(--back-color);
    border-radius: 50%;
}

.pac-container {
    z-index: 9999999 !important;
}
</style>