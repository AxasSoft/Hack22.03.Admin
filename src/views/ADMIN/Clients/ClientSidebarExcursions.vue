<template>
    <VSheet class="pa-6">

        <VItemGroup class="mt-3" v-if="clientsStore.selectClientExcursions?.length > 0">
            <VCard class=" my-2 mx-6 rounded-lg" v-for="(group) in clientsStore.selectClientExcursions" :key="group?.id"
                style="background-color: var(--back-color);">

                <div style="width: 100%;" class="bg-color my-2">
                    <VSheet class="pa-6" style="background-color: transparent;">
                        <div class="d-flex py-0 align-center">
                            <p class="pb-4 text-body-2">Статус</p>
                            <VSelect v-model="group.status" variant="plain" class="custom-tf input-select ml-auto"
                                density="compact" :items="clientsStore.clientExcursionStatus" item-title='name'
                                item-value='id' autocomplete="off" style="max-width: 290px;" />
                        </div>
                        <VDivider />

                        <div class="d-flex py-2 align-center">
                            <p class="text-body-2">Экскурсия</p>
                            <span class="text-body-2 ml-auto"><b>{{ group?.excursionName
                            }}</b></span>
                        </div>
                        <VDivider />

                        <div class="d-flex py-2 align-center">
                            <p class="text-body-2">Начало</p>
                            <span class="ml-auto text-body-2"><b>{{
                                getDateFromUnix(group?.started || 0, 'datehour')
                                    }}</b></span>
                        </div>
                        <VDivider />

                        <div class="d-flex py-2 align-center">
                            <p class="text-body-2">Окончание</p>
                            <span class="text-body-2 ml-auto"><b>{{
                                getDateFromUnix(group?.ended || 0, 'datehour')
                                    }}</b></span>
                        </div>
                        <VDivider />

                        <div class="d-flex py-2 align-center">
                            <p class="text-body-2">Забронировано</p>
                            <span class="text-body-2 ml-auto"><b> {{ getDateFromUnix(group?.created || 0, 'datehour')
                                    }}</b></span>
                        </div>
                        <VDivider />



                        <div class="d-flex py-2 align-center">
                            <p class="text-body-2">Комментарий</p>
                            <span class="text-body-2 ml-auto"><b>{{ group?.comment == '' ? '-' : group?.comment
                            }}</b></span>
                        </div>
                        <VDivider />

                        <div class="mt-4 w-100" v-if="group.members?.length > 0">
                            <h3 class="mx-auto">Участники</h3>
                            <VItemGroup v-for="member in group.members" :key="member?.phone" class="mt-1">
                                <VRow>

                                    <VCol cols="12" md="5">
                                        <b style="font-size: 14px;">{{ member?.fullName }}</b>
                                    </VCol>
                                    <VCol cols="12" md="3">
                                        <b v-if="member?.isAdult" style="font-size: 14px;">взрослый</b>
                                        <b v-else style="font-size: 14px;">ребёнок</b>
                                    </VCol>
                                    <VCol cols="12" md="4" style="font-size: 14px;">
                                        <a :href="'tel:' + '+' + member?.phone" class="text-body"
                                            style="color: black;">+{{
                                                member?.phone }}
                                        </a>
                                    </VCol>
                                </VRow>
                            </VItemGroup>
                        </div>

                    </VSheet>
                </div>
                <VBtn class="black-button ml-4 mb-4" style="width: 180px; "
                    @click="changeStatus(group.id, group.status || 'available')">
                    Изменить статус
                </VBtn>
            </VCard>
            <LoadMarker top="-1000px"
                @load="clientsStore.selectClientExcursionsPage++; clientsStore.getClientExcursions(clientsStore.selectEditClient.id)" />
        </VItemGroup>


        <p v-else class="align-center text-center mt-12">У пользователя ещё нет забронированных экскурсий</p>
        <VueEasyLightbox class="vel-modals" :visible="showGallery" :imgs="excursionImages" :index="galleryIndex"
            @hide="showGallery = false" />
    </VSheet>
</template>

<script setup lang="ts">
import { getDateFromUnix } from '@/plugins/unixTime';
import { useClientsStore } from '@/stores/clientsStore';
import LoadMarker from '@/components/LoadMarker.vue';
import VueEasyLightbox from 'vue-easy-lightbox';
import { ref } from 'vue';
import { VDivider } from 'vuetify/components';
import { useToast } from 'vue-toastification';

const clientsStore = useClientsStore()
const excursionImages = ref<string[]>([])
const showGallery = ref(false)
const galleryIndex = ref(0)
const toast = useToast()

const changeStatus = async (bookingId: number, status: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await clientsStore.updateClientExcursionStatus(bookingId, status)
    console.log(response)
    if (response.status == 200) {
        toast.success("Статус успешно изменен")
    } else {
        toast.error(response.data.description)
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
    padding: 4px 8px;
    border-radius: 8px;
}

.inactive {
    background-color: var(--alert-back-color);
    color: var(--alert-color);
    padding: 4px 8px;
    border-radius: 8px;
}


.new {
    background-color: var(--order-new-back-color);
    color: var(--order-new-color);
    padding: 4px 8px;
    border-radius: 8px;
}

.processing {
    background-color: var(--order-processing-back-color);
    color: var(--order-processing-color);
    padding: 4px 8px;
    border-radius: 8px;
}

.packing {
    background-color: var(--order-packing-back-color);
    color: var(--order-packing-color);
    padding: 4px 8px;
    border-radius: 8px;
}

.delivering {
    background-color: var(--order-delivering-back-color);
    color: var(--order-delivering-color);
    padding: 4px 8px;
    border-radius: 8px;
}

.delivered {
    background-color: var(--order-delivered-back-color);
    color: var(--order-delivered-color);
    padding: 4px 8px;
    border-radius: 8px;
}

.finished {
    background-color: var(--order-finished-back-color);
    color: var(--order-finished-color);
    padding: 4px 8px;
    border-radius: 8px;
}

.canceled {
    background-color: var(--order-canceled-back-color);
    color: var(--order-canceled-color);
    padding: 4px 8px;
    border-radius: 8px;
}


.table-row:hover {
    background-color: var(--back-color-50);
}
</style>