<template>
    <Sidebar class="sidebar w-50 pb-4" v-model:visible="show" @show="willAppear()" position="right">
        <div class="sidebar-header py-4 px-8 fixed ">
            <VBtn class="sidebar-close" @click="show = false" width="32px" height="32px">
                <VIcon icon="mdi-close" />
            </VBtn>
            <h2 class="sidebar-header-title"> Отзывы на "{{ excursionsStore.selectFeedbackExcursion.name }}"</h2>

        </div>
        <VProgressLinear v-show="progressShow" style="position: absolute; width: 100%; top: 68px; z-index: 99999;"
            color="var(--main-color)" indeterminate />
        <div class="pa-4 d-flex flex-column sidebar-content">


            <VItemGroup class="mt-1" v-if="excursionsStore.selectExcursionFeedbacks?.length > 0">
                <VRow class="d-flex my-2 mx-6 rounded-lg" v-for="(feedback) in excursionsStore.selectExcursionFeedbacks"
                    :key="feedback.id" style="background-color: var(--back-color);">
                    <div class="bg-color2 d-flex flex-column rounded-lg">
                        <div class="d-flex pt-2">
                            <div class="d-flex">

                                <b class="text-color ml-6" style="font-size: 13px;">{{ feedback?.firstName }}</b>


                                <!-- DELETE DIALOG -->
                                <VDialog v-model="feedback.showDelete" max-width="400" persistent>
                                    <template v-slot:activator="{ props: feedback }">
                                        <VIcon icon="mdi-delete-outline" class="cursor-pointer" color="red"
                                            style="right: 34px; position: absolute;" v-bind="feedback.showDelete" />
                                    </template>

                                    <VCard class="pa-6">
                                        <div class="d-flex">
                                            <VIcon icon="mdi-alert-outline" color="red" />
                                            <p class="ml-2 text-red">ВНИМАНИЕ</p>
                                        </div>

                                        <p class="mt-4 text-body-2">Вы действиельно хотите удалить отзыв? Данные будут
                                            удалены без
                                            возможности
                                            восстановления.
                                        </p>
                                        <template v-slot:actions>
                                            <VBtn @click="feedback.showDelete = false">
                                                Отмена
                                            </VBtn>


                                            <VBtn class="text-red" @click="deleteFeedback(feedback.id)">
                                                Удалить
                                            </VBtn>
                                        </template>
                                    </VCard>
                                </VDialog>

                            </div>

                        </div>
                        <b class="text-color ml-6 mt-2" style="font-size: 16px;">{{ feedback?.description }}</b>
                        <div class="ml-6">
                            <VRating empty-icon="mdi-star" :readonly="true" :length="5" :size="30" class="text-color2"
                                :model-value="feedback?.rating" active-color="orange" />
                            <p class="text-color2 ml-1" style="font-size: 12px;">{{
                                getDateFromUnix(feedback?.created ?
                                    feedback?.created : 0, 'date') }}</p>
                            <p class="text-color2 ml-1 mt-1 mb-2" style="font-size: 14px;">{{ feedback?.text }}</p>
                            <VSlideGroup v-if="feedback?.images?.length > 0" prev-icon="" next-icon="" class="mb-2"
                                style="    max-width: calc(50vw - 120px);
">
                                <VSlideGroupItem v-for="image, index in feedback?.images" :key="image?.id">
                                    <div class="mx-2 d-flex flex-column align-center"
                                        @click="openGallery(feedback, index)">
                                        <VImg class="mx-auto rounded" width="60px" height="60px" cover
                                            style="min-height: 60px; min-width: 60px; max-width: 60px; max-height: 60px"
                                            :src="image?.image ? image.image : placeholder" alt="" />
                                    </div>

                                </VSlideGroupItem>
                            </VSlideGroup>
                        </div>
                    </div>
                    <div style="width: 100%; height: 1px;" class="bg-color my-2"></div>
                </VRow>
                <LoadMarker top="-1000px"
                    @load="excursionsStore.selectExcursionFeedbacksPage++; excursionsStore.getExcursionFeedbacks(excursionsStore.selectFeedbackExcursion.id)" />
            </VItemGroup>
            <VueEasyLightbox class="vel-modals" :visible="showGallery" :imgs="feedbackImages" :index="galleryIndex"
                @hide="showGallery = false" />

        </div>



    </Sidebar>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Sidebar from 'primevue/sidebar';
import { useExcursionsStore } from '@/stores/excursionStore';
import VueEasyLightbox from 'vue-easy-lightbox';
import LoadMarker from '@/components/LoadMarker.vue';
import { getDateFromUnix } from '@/plugins/unixTime';
import placeholder from '@/assets/images/Placeholder.png'
import { useToast } from 'vue-toastification';

const excursionsStore = useExcursionsStore()
const toast = useToast()
const show = defineModel<boolean>()
const progressShow = ref(false)

const willAppear = async () => {
    excursionsStore.selectExcursionFeedbacksPage = 1
    await excursionsStore.getExcursionFeedbacks(excursionsStore.selectFeedbackExcursion.id)
}

const feedbackImages = ref<string[]>([])
const showGallery = ref(false)
const galleryIndex = ref(0)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const openGallery = (feedback: any, index: number) => {
    feedbackImages.value = []
    for (const img of feedback.images) {
        feedbackImages.value.push(img.image || '')
    }
    showGallery.value = true
    galleryIndex.value = index
}


const deleteFeedback = async (feedbackId: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await excursionsStore.deleteExcursionFeedback(feedbackId)
    if (response.status == 200) {
        toast.success("Отзыв успешно удалён")
    } else {
        toast.error("Не удалось удалить отзыв")
    }
}

</script>

<style scoped>
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

.vel-modals {
    left: -100% !important;
}
</style>