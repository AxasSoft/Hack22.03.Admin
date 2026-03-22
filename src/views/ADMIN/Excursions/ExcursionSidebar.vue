<template>
    <Sidebar class="sidebar w-50 pb-4" v-model:visible="show" @show="willAppear()" position="right">
        <div class="sidebar-header py-4 px-8 fixed ">
            <VBtn class="sidebar-close" @click="show = false" width="32px" height="32px">
                <VIcon icon="mdi-close" />
            </VBtn>
            <h2 class="sidebar-header-title">Редактирование экскурсии</h2>
        </div>
        <VProgressLinear v-show="progressShow" style="position: absolute; width: 100%; top: 68px; z-index: 99999;"
            color="var(--main-color)" indeterminate />
        <div class="pa-4 d-flex flex-column sidebar-content pb-12">
            <div class="mb-12" style="padding-bottom: 58px;">

                <VTabs v-model="tab" class="w-100 bg-clear mx-5 mb-0">
                    <VTab base-color="var(--gray-text)" value="info">
                        <VIcon icon="mdi-account-outline" class="mr-2" /> Профиль
                    </VTab>
                    <VTab base-color="var(--gray-text)" value="groups">
                        <VIcon icon="mdi-format-list-bulleted" class="mr-2" />Группы
                    </VTab>
                    <VTab base-color="var(--gray-text)" value="adverts">
                        <VIcon icon="mdi-star-outline" class="mr-2" />Объявления
                    </VTab>
                </VTabs>

                <VTabsWindow v-model="tab">
                    <VTabsWindowItem value="info">
                        <ExcursionSidebarDetail />
                    </VTabsWindowItem>

                    <VTabsWindowItem value="groups">
                        <ExcursionSidebarGroups />
                    </VTabsWindowItem>
                    <VTabsWindowItem value="adverts">
                        <ClientSidebarAdverts />
                    </VTabsWindowItem>
                </VTabsWindow>
            </div>



            <div class="d-flex position-absolute bottom-0 py-2 bg-white w-100">
                <VBtn prepend-icon="mdi-check" class="black-button" @click="updateExcursion()">
                    Изменить
                </VBtn>
                <!-- DELETE DIALOG -->
                <VDialog v-model="deleteExcursionDialog" max-width="400" persistent>
                    <template v-slot:activator="{ props: deleteExcursionDialog }">
                        <VBtn class="alert-button mt-auto" v-bind="deleteExcursionDialog">
                            Удалить
                        </VBtn>
                    </template>

                    <VCard class="pa-6">
                        <div class="d-flex">
                            <VIcon icon="mdi-alert-outline" color="red" />
                            <p class="ml-2 text-red">ВНИМАНИЕ</p>
                        </div>

                        <p class="mt-4 text-body-2">Вы действительно хотите удалить экскурсию <b>{{
                            excursionStore.selectEditExcursion.title
                                }}</b>?
                            Все данные будут удалены без возможности восстановления.
                        </p>
                        <template v-slot:actions>
                            <VBtn @click=" deleteExcursionDialog = false">
                                Отмена
                            </VBtn>


                            <VBtn class="text-red" @click="deleteExcursion">
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
import { useExcursionsStore } from '@/stores/excursionStore';
import ExcursionSidebarDetail from './ExcursionSidebarDetail.vue';
import ExcursionSidebarGroups from './ExcursionSidebarGroups.vue';


const excursionStore = useExcursionsStore()
const toast = useToast()
const progressShow = ref(false)
const show = defineModel<boolean>()
const deleteExcursionDialog = ref(false)
const tab = ref('info')

const location = ref()

const willAppear = () => {
    location.value = excursionStore.selectEditExcursion.address
    excursionStore.selectEditExcursion.imagesUrls = []
    for (const image of excursionStore.selectEditExcursion.images) {
        excursionStore.selectEditExcursion.imagesUrls.push(image)
    }
    excursionStore.selectEditExcursion.image = []
}


async function updateExcursion() {

    if (!((excursionStore.selectEditExcursion.name ? excursionStore.selectEditExcursion.name : '').trim())) {
        toast.error("Укажите название экскурсии")
        return
    }

    if (!((excursionStore.selectEditExcursion.description ? excursionStore.selectEditExcursion.description : ''))) {
        toast.error("Укажите описание экскурсии")
        return
    }


    if (!((excursionStore.selectEditExcursion.currentPrice ? excursionStore.selectEditExcursion.currentPrice : ''))) {
        toast.error("Укажите стоимость")
        return
    }

    if (!((excursionStore.selectEditExcursion.duration ? excursionStore.selectEditExcursion.duration : ''))) {
        toast.error("Укажите длительность")
        return
    }

    if (!((excursionStore.selectEditExcursion.maxGroupSize ? excursionStore.selectEditExcursion.maxGroupSize : ''))) {
        toast.error("Укажите максимальное количество участников")
        return
    }

    if (excursionStore.selectEditExcursion?.images.length == 0) {
        toast.error("Добавьте картинки экскурсии")
        return
    }



    progressShow.value = true
    // CREATE PRODUCT
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await excursionStore.updateExcursion(excursionStore.selectEditExcursion.id)
    if (response.status === 200) {



        progressShow.value = false
        toast.success("Экскурстя успешно создана")
        show.value = false
    } else {
        progressShow.value = false
        toast.error(response.response.data.description);
    }
}

const deleteExcursion = async () => {
    progressShow.value = true
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await excursionStore.deleteExcursion(excursionStore.selectEditExcursion.id)
    if (response.status == 200) {
        toast.success('Экскурсия успешно удалена')
        progressShow.value = false
        show.value = false
    } else {
        toast.error('Не удалось удалить экскурсию.')
        progressShow.value = true
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
