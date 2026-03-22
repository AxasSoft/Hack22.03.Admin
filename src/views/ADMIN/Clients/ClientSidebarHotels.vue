<template>
    <VSheet class="pa-6">
        <VItemGroup v-if="clientsStore.selectClientAdverts?.length > 0">
            <VCard class=" my-2 mx-6 rounded-lg" v-for="(advert) in clientsStore.selectClientAdverts" :key="advert.id"
                style="background-color: var(--back-color);">
                <div class="bg-color2 d-flex flex-column rounded-lg">
                    <div class="d-flex pt-2 mx-5">
                        <VCarousel v-if="advert?.images?.length > 0" class="mb-2 carousel">
                            <VCarouselItem v-for="image, index in advert?.images" :key="image?.id">
                                <!-- <div class="mx-2 d-flex flex-column align-center" > -->
                                <VImg class="mx-auto rounded" :src="image?.link ? image.link : placeholder" alt=""
                                    @click="openGallery(advert, index)" />
                                <!-- </div> -->

                            </VCarouselItem>
                        </VCarousel>
                    </div>
                    <div style="height: 1px;" class="bg-color my-2"></div>
                    <div class="ml-5">
                        <div class="d-flex">
                            <p class="text-color2 mb-1" style="font-size: 12px; color: gray;">{{
                                getDateFromUnix(advert?.created ?
                                    advert?.created : 0, 'datehour') }}</p>

                            <!-- DELETE DIALOG -->
                            <VDialog v-model="advert.showDelete" max-width="400" persistent>
                                <template v-slot:activator="{ props: advert }">
                                    <VIcon icon="mdi-delete-outline" class="cursor-pointer ml-auto mr-4" color="red"
                                        style="bottom: 4px;" v-bind="advert" />
                                </template>

                                <VCard class="pa-6">
                                    <div class="d-flex">
                                        <VIcon icon="mdi-alert-outline" color="red" />
                                        <p class="ml-2 text-red">ВНИМАНИЕ</p>
                                    </div>

                                    <p class="mt-4 text-body-2">Вы действиельно хотите удалить объявление? Данные будут
                                        удалены без
                                        возможности
                                        восстановления.
                                    </p>
                                    <template v-slot:actions>
                                        <VBtn @click="advert.showDelete = false">
                                            Отмена
                                        </VBtn>


                                        <VBtn class="text-red" @click="deleteAdvert(advert?.id)">
                                            Удалить
                                        </VBtn>
                                    </template>
                                </VCard>
                            </VDialog>
                        </div>

                        <b style="font-size: 14px;">{{ advert?.title }}</b>
                        <div class="d-flex" style="font-size: 14px;">
                            <span style="color: gray;" class="mr-2">Стоимость:</span>
                            <b>{{ moneyMask(advert?.profit * 100) }} ₽</b>
                        </div>
                        <div class="d-flex" style="font-size: 14px;">
                            <span style="color: gray;" class="mr-2">Адрес:</span>
                            <span>{{ advert?.address }}</span>
                        </div>
                        <div class="d-flex" style="font-size: 14px;">
                            <span style="color: gray;" class="mr-2">Категория:</span>
                            <span>{{ advert?.category?.name }}</span>
                        </div>

                        <VDivider class="my-2" />

                        <div class="mr-4">


                            <p v-if="!advert.readMore" style="font-size: 14px;">{{ advert?.body?.slice(0, 150) }} {{
                                advert?.body?.length
                                    > 150 ? "..." : ""
                            }}</p>
                            <p v-else style="font-size: 14px;">{{ advert?.body }}</p>

                            <div v-if="advert?.body?.length > 150" class="mt-1">
                                <span v-if="!advert?.readMore" class="d-block mt-n1 cursor-pointer"
                                    style="font-size: 12px; color: var(--main-color);" @click="advert.readMore = true">
                                    Развернуть
                                </span>
                                <span v-else class="d-block mt-n1 cursor-pointer"
                                    style="font-size: 12px; color: var(--main-color);" @click="advert.readMore = false">
                                    Скрыть
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="d-flex mt-4 MB-4">
                    <span></span>
                    <div class="d-flex  mr-4 ml-auto">
                        <VBtn>
                            <VIcon icon="mdi-heart-outline" />{{ advert?.countFavorite }}
                        </VBtn>
                        <VBtn class="ml-2">
                            <VIcon icon="mdi-eye-outline" />{{ advert?.viewsCounter }}
                        </VBtn>
                    </div>
                </div>
                <div style="width: 100%; height: 1px;" class="bg-color my-2"></div>

            </VCard>

            <LoadMarker top="-1000px"
                @load="clientsStore.selectClientAdvertsPage++; clientsStore.getClientAdverts(clientsStore.selectEditClient.id)" />
        </VItemGroup>
        <p v-else class="align-center text-center mt-12">У пользователя нет забронированных отелей</p>
        <VueEasyLightbox class="vel-modals" :visible="showGallery" :imgs="advertImages" :index="galleryIndex"
            @hide="showGallery = false" />
    </VSheet>
</template>

<script setup lang="ts">
import placeholder from '@/assets/images/Placeholder.png'
import { getDateFromUnix } from '@/plugins/unixTime';
import { useClientsStore } from '@/stores/clientsStore';
import LoadMarker from '@/components/LoadMarker.vue';
import VueEasyLightbox from 'vue-easy-lightbox';
import { ref } from 'vue';
import { VDivider } from 'vuetify/components';
import moneyMask from '@/plugins/moneyMask';
import { useToast } from 'vue-toastification';

const clientsStore = useClientsStore()

const advertImages = ref<string[]>([])
const showGallery = ref(false)
const galleryIndex = ref(0)
const toast = useToast()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const openGallery = (advert: any, index: number) => {
    advertImages.value = []
    for (const img of advert.images) {
        advertImages.value.push(img.mainLink || '')
    }
    showGallery.value = true
    galleryIndex.value = index
}

const deleteAdvert = async (advertId: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await clientsStore.deleteAdvert(advertId)
    console.log(response)
    if (response.status == 200) {
        toast.success("Объявление успешно удалено")
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