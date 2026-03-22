<template>
    <Sidebar class="sidebar w-50 pb-4" v-model:visible="show" position="right">
        <div class="sidebar-header py-4 px-8 fixed ">
            <VBtn class="sidebar-close" @click="show = false" width="32px" height="32px">
                <VIcon icon="mdi-close" />
            </VBtn>
            <h2 class="sidebar-header-title"> Новый клиент</h2>
        </div>
        <VProgressLinear v-show="progressShow" style="position: absolute; width: 100%; top: 68px; z-index: 99999;"
            color="var(--main-color)" indeterminate />
        <div class="pa-4 d-flex flex-column sidebar-content pb-12">
            <div class="mb-12" style="padding-bottom: 58px;">

                <div>
                    <VImg class="avatar" :src="avatar" cover @click="($refs.fileInput as HTMLInputElement)?.click()" />
                    <VFileInput v-model="addedFiles" class="d-none" ref="fileInput" variant="solo" :clearable="false"
                        hide-details prepend-icon="null" flat accept="image/jpeg, image/png, image/jpg" />

                </div>

                <div class="d-flex w-100">
                    <div class="w-50 pa-0">
                        <p class="text-body-2 mt-1">Фамилия*</p>
                        <VTextField variant="plain" v-model="clientsStore.newClient.lastName" autocomplete="off"
                            class="custom-tf mt-1 pa-0" type="text" />
                    </div>
                    <div class="w-50 ml-4 pa-0">
                        <p class="text-body-2 mt-1">Имя*</p>
                        <VTextField variant="plain" v-model="clientsStore.newClient.firstName" autocomplete="off"
                            class="custom-tf mt-1 pa-0" type="text" />
                    </div>
                    <div class="w-50 ml-4 pa-0">
                        <p class="text-body-2 mt-1">Отчество</p>
                        <VTextField variant="plain" v-model="clientsStore.newClient.patronymic" autocomplete="off"
                            class="custom-tf mt-1 pa-0" type="text" />
                    </div>
                </div>



                <div class="d-flex w-100">
                    <div class="w-50 pa-0">
                        <p class="text-body-2 mt-1">Телефон*</p>
                        <VTextField variant="plain" v-mask="'+7 (###) ### ## ##'" placeholder="+7 (123) 456 78 90"
                            v-model="clientsStore.newClient.tel" autocomplete="off" class="custom-tf mt-1 pa-0"
                            type="text" />
                    </div>
                    <div class="w-50 ml-4 pa-0">
                        <p class="text-body-2 mt-1">E-mail</p>
                        <VTextField variant="plain" v-model="clientsStore.newClient.email" autocomplete="off"
                            class="custom-tf mt-1 pa-0" type="text" />
                    </div>
                </div>

                <div class="d-flex w-100">
                    <div class="w-50 pa-0">
                        <p class="text-body-2 mt-1">Дата рождения*</p>
                        <VTextField variant="plain" v-model="birthtime" @update:model-value="setNewBirthtime"
                            autocomplete="off" class="custom-tf mt-1 pa-0" type="date" />
                    </div>
                    <div class="w-50 ml-4 pa-0">
                        <p class="text-body-2 mt-1">Пол*</p>
                        <VSelect v-model="gender" @update:model-value="setGender()" class="custom-tf mt-1"
                            variant="plain" density="compact"
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

                <p class="text-body-2">Адрес*</p>
                <GoogleAutocomplete v-model="location" class="custom-tf mt-1 rounded"
                    api-key="AIzaSyAKcYO57qXN9id12mnHBvaNE2SD1IBNy3I" style="
							width: 100%;
							padding: 8px;
							z-index: 999999 !important;
                            background-color: var(--back-color);
						" @keydown.enter.prevent="location = null; setLocatoin(null)" autocomplete="off" placeholder="Адрес"
                    @set="setLocatoin($event)" />
            </div>



            <div class="d-flex position-absolute bottom-0 py-2 bg-white w-100">
                <VBtn prepend-icon="mdi-check" class="black-button" @click="createСlient">
                    Сохранить
                </VBtn>

            </div>

        </div>

    </Sidebar>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import Sidebar from 'primevue/sidebar';
import { useToast } from 'vue-toastification';
import placeholder from "@/assets/images/Placeholder.png"
import { fromBlob } from 'image-resize-compress';
import { mask } from 'vue-the-mask';
import { useClientsStore } from '@/stores/clientsStore';
import { GoogleAutocomplete } from 'vue3-google-autocomplete';
import { checkEmail } from '@/plugins/emailValidation';
import { getUnixTime } from '@/plugins/unixTime';


const toast = useToast()
const vMask = mask;
const gender = ref()
const progressShow = ref(false)
const clientsStore = useClientsStore()

const birthtime = ref()

const setNewBirthtime = () => {
    clientsStore.newClient.birthtime = getUnixTime(birthtime.value)
}


const location = ref()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setLocatoin = (newLocatoin: any) => {
    console.log(newLocatoin)
    clientsStore.newClient.location = ''
    clientsStore.newClient.location += newLocatoin?.country ? newLocatoin?.country : ''
    clientsStore.newClient.location += newLocatoin?.state ? ', ' + newLocatoin?.state : ''
    clientsStore.newClient.location += newLocatoin?.city ? ', ' + newLocatoin?.city : ''
    clientsStore.newClient.location += newLocatoin?.name ? ', ' + newLocatoin?.name : ''
    clientsStore.newClient.lat = newLocatoin?.latitude
    clientsStore.newClient.lon = newLocatoin?.longiude

    console.log(clientsStore.newClient.location)
}

const setGender = () => {
    clientsStore.newClient.gender = gender.value.id
    console.log(clientsStore.newClient.gender)
}



const show = defineModel<boolean>()

const avatar = ref(placeholder)

const fileInput = ref<HTMLInputElement>();
const addedFiles = ref()
watch(
    () => addedFiles.value,
    async () => {
        if (addedFiles.value) {
            clientsStore.newClient.avatar.file = (await fromBlob(addedFiles.value, 50, 'auto', 'auto', 'jpeg'))
            clientsStore.newClient.avatar.url = clientsStore.newClient.avatar.file != undefined ? URL.createObjectURL(clientsStore.newClient.avatar.file) : '';
            avatar.value = clientsStore.newClient.avatar.url
            clientsStore.newClient.avatar.isChanged = true;
        }
    }
);



async function createСlient() {


    if (!clientsStore.newClient.firstName) {
        toast.error("Укажите имя")
        return
    }

    if (!clientsStore.newClient.lastName) {
        toast.error("Укажите фамилию")
        return
    }

    if (!clientsStore.newClient.tel) {
        toast.error("Укажите телефон")
        return
    }

    if (clientsStore.newClient.tel.length < 18) {
        toast.error("Укажите корректный телефон")
        return
    }

    if (clientsStore.newClient.email) {
        if (checkEmail(clientsStore.newClient.email)) {
            toast.error("Укажите email")
            return
        }
    }

    if (!clientsStore.newClient.birthtime) {
        toast.error("Укажите дату рождения")
        return
    }

    if ((clientsStore.newClient.gender ? clientsStore.newClient.gender : -1) >= 0) {
        toast.error("Укажите пол")
        return
    }

    if (!clientsStore.newClient.location) {
        toast.error("Укажите адрес")
        return
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await clientsStore.createNewClient()
    if (response.status == 200) {
        toast.success("Клиент успешно создан")
        show.value = false
    } else {
        toast.error("Не удалось создать нового клиента")
    }

}

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