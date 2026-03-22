<template>
    <Sidebar class="sidebar w-50 pb-4" v-model:visible="show" @show="willAppear()" position="right"
        :class="{ client_sidebar: showSidebarOrder }">
        <div class="sidebar-header py-4 px-8 fixed ">
            <VBtn class="sidebar-close" @click="show = false" width="32px" height="32px">
                <VIcon icon="mdi-close" />
            </VBtn>
            <h2 class="sidebar-header-title" style="color: var(--gray-text)"><span
                    v-if="clientsStore.selectEditClient?.lastName">{{
                        clientsStore.selectEditClient?.lastName }}</span><span
                    v-if="clientsStore.selectEditClient?.firstName">{{ ' ' +
                        clientsStore.selectEditClient?.firstName }}</span></h2>
        </div>
        <VProgressLinear v-show="progressShow" style="position: absolute; width: 100%; top: 68px; z-index: 99999;"
            color="var(--main-color)" indeterminate />
        <div class="pa-4 d-flex flex-column sidebar-content">
            <div class="mb-4" style="padding-bottom: 58px;">

                <VTabs v-model="tab" class="w-100 bg-clear mx-5 mb-0">
                    <VTab base-color="var(--gray-text)" value="info">
                        <VIcon icon="mdi-account-outline" class="mr-2" /> Профиль
                    </VTab>
                    <VTab base-color="var(--gray-text)" value="posts">
                        <VIcon icon="mdi-format-list-bulleted" class="mr-2" />Посты
                    </VTab>
                    <VTab base-color="var(--gray-text)" value="adverts">
                        <VIcon icon="mdi-star-outline" class="mr-2" />Объявления
                    </VTab>
                    <VTab base-color="var(--gray-text)" value="excursions">
                        <VIcon icon="mdi-snowboard" class="mr-2" />Экскурсии
                    </VTab>
                    <VTab base-color="var(--gray-text)" value="hotels">
                        <VIcon icon="mdi-home-account" class="mr-2" />Отели
                    </VTab>
                </VTabs>

                <VTabsWindow v-model="tab">
                    <VTabsWindowItem value="info">
                        <ClientSidebarDetail />
                    </VTabsWindowItem>
                    <VTabsWindowItem value="posts">
                        <ClientSidebarPosts />
                    </VTabsWindowItem>
                    <VTabsWindowItem value="adverts">
                        <ClientSidebarAdverts />
                    </VTabsWindowItem>
                    <VTabsWindowItem value="excursions">
                        <ClientSidebarExcursions />
                    </VTabsWindowItem>
                    <VTabsWindowItem value="hotels">
                        <ClientSidebarHotels />
                    </VTabsWindowItem>
                </VTabsWindow>
            </div>

            <div class="d-flex position-absolute bottom-0 py-2 bg-white w-100">
                <VBtn prepend-icon="mdi-check" class="black-button mr-4" style="width: 190px;" @click="editСlient">
                    Изменить
                </VBtn>

                <!-- DELETE DIALOG -->
                <VDialog v-model="deleteClientDialog" max-width="400" persistent>
                    <template v-slot:activator="{ props: deleteCategoryDialog }">
                        <VBtn class="alert-button mt-auto" style="width: 190px;" v-bind="deleteCategoryDialog">
                            Удалить
                        </VBtn>
                    </template>

                    <VCard class="pa-6">
                        <div class="d-flex">
                            <VIcon icon="mdi-alert-outline" color="red" />
                            <p class="ml-2 text-red">ВНИМАНИЕ</p>
                        </div>

                        <p class="mt-4 text-body-2">Вы действиельно хотите удалить<b>{{
                            clientsStore.selectEditClient.lastName + ' ' +
                            clientsStore.selectEditClient.firstName }}</b>? Данные будут удалены без возможности
                            восстановления.
                        </p>
                        <template v-slot:actions>
                            <VBtn @click="deleteClientDialog = false">
                                Отмена
                            </VBtn>


                            <VBtn class="text-red" @click="deleteClient">
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
import { ref } from 'vue';
import Sidebar from 'primevue/sidebar';
import { useToast } from 'vue-toastification';
import { useClientsStore } from '@/stores/clientsStore';
import { checkEmail } from '@/plugins/emailValidation';
import ClientSidebarDetail from './ClientSidebarDetail.vue';
import ClientSidebarAdverts from './ClientSidebarAdverts.vue';
import ClientSidebarPosts from './ClientSidebarPosts.vue';
import ClientSidebarExcursions from './ClientSidebarExcursions.vue';
import ClientSidebarHotels from './ClientSidebarHotels.vue';

const tab = ref('info')
const toast = useToast()
const progressShow = ref(false)
const clientsStore = useClientsStore()
const show = defineModel<boolean>()
const deleteClientDialog = ref(false)
const showSidebarOrder = ref(false)

const willAppear = async () => {
    clientsStore.selectClientPostsPage = 1
    clientsStore.selectClientPosts = []
    await clientsStore.getClientPosts(clientsStore.selectEditClient.id)
    clientsStore.selectClientAdvertsPage = 1
    clientsStore.selectClientAdverts = []
    await clientsStore.getClientAdverts(clientsStore.selectEditClient.id)
    clientsStore.selectClientExcursions = []
    clientsStore.selectClientExcursionsPage = 1
    await clientsStore.getClientExcursions(clientsStore.selectEditClient.id)
    clientsStore.selectEditClient.avatar = {
        url: clientsStore.selectEditClient.avatar,
        file: null,
        isChanged: false,
    }
}

async function editСlient() {


    if (!clientsStore.selectEditClient.firstName) {
        toast.error("Укажите имя")
        return
    }

    if (!clientsStore.selectEditClient.lastName) {
        toast.error("Укажите фамилию")
        return
    }

    if (!clientsStore.selectEditClient.tel) {
        toast.error("Укажите телефон")
        return
    }

    if (clientsStore.selectEditClient.tel.length < 18) {
        toast.error("Укажите корректный телефон")
        return
    }

    if (clientsStore.selectEditClient.email) {
        if (!checkEmail(clientsStore.selectEditClient.email)) {
            toast.error("Укажите email")
            return
        }
    }

    if (!clientsStore.selectEditClient.birthtime) {
        toast.error("Укажите дату рождения")
        return
    }

    if ((clientsStore.selectEditClient.gender ? clientsStore.selectEditClient.gender : -1) >= 0) {
        toast.error("Укажите пол")
        return
    }

    if (!clientsStore.selectEditClient.location) {
        toast.error("Укажите адрес")
        return
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await clientsStore.updateClient(clientsStore.selectEditClient.id)
    if (response.status == 200) {
        toast.success("Клиент успешно изменён")
        show.value = false
    } else {
        toast.error("Не удалось изменить данные клиента")
    }

}

const deleteClient = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await clientsStore.deleteClient(clientsStore.selectEditClient.id)
    if (response.status == 200) {
        toast.success("Клиент успешно удалён")
        show.value = false
    } else {
        toast.error("Не удалось удалить клиента")
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

.client_sidebar {
    margin-right: 58px !important;
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