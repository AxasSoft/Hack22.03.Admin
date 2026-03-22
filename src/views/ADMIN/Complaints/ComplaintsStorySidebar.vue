<template>
    <Sidebar class="sidebar w-50 pb-4" v-model:visible="show" @show="willAppear()" position="right">
        <div class="sidebar-header py-4 px-8 fixed ">
            <VBtn class="sidebar-close" @click="show = false" width="32px" height="32px">
                <VIcon icon="mdi-close" />
            </VBtn>
            <h2 class="sidebar-header-title">Жалоба на историю</h2>
        </div>
        <VProgressLinear v-show="progressShow" style="position: absolute; width: 100%; top: 68px; z-index: 99999;"
            color="var(--main-color)" indeterminate />

        <h3 style="margin-top: 100px;" class="ml-6">{{ getDateFromUnix(complaintStore.selectEditComplaint.created,
            'datehour') }}</h3>
        <VCard class="mx-6 mt-4 rounded-lg" style="background-color: var(--back-color); ">

            <!-- DELETE DIALOG -->
            <!-- <VDialog v-model="complaintStore.selectEditComplaint.object.showDelete" max-width="400" persistent>
                <template v-slot:activator="{ props: complaintStore }">
                    <VIcon icon="mdi-delete-outline" class="cursor-pointer" color="red"
                        style="right: 4px; top:4px; position: absolute;"
                        v-bind="complaintStore?.selectEditComplaint?.object" />
                </template>

<VCard class="pa-6">
    <div class="d-flex">
        <VIcon icon="mdi-alert-outline" color="red" />
        <p class="ml-2 text-red">ВНИМАНИЕ</p>
    </div>

    <p class="mt-4 text-body-2">Вы действиельно хотите удалить публикацию? Данные будут
        удалены без
        возможности
        восстановления.
    </p>
    <template v-slot:actions>
                        <VBtn @click="complaintStore.selectEditComplaint.object.showDelete = false">
                            Отмена
                        </VBtn>


                        <VBtn class="text-red" @click="deletePost(complaintStore.selectEditComplaint.object?.id)">
                            Удалить
                        </VBtn>
                    </template>
</VCard>
</VDialog> -->

            <div class="bg-color2 d-flex flex-column rounded-lg">
                <div class="d-flex pt-2 mx-5">
                    <VCarousel v-if="complaintStore.selectEditComplaint.object?.gallery?.length > 0"
                        class="mb-2 carousel">
                        <VCarouselItem v-for="image, index in complaintStore.selectEditComplaint.object?.gallery"
                            :key="image?.id">
                            <!-- <div class="mx-2 d-flex flex-column align-center" > -->
                            <VImg class="mx-auto rounded" :src="image?.mainLink ? image.mainLink : placeholder" alt=""
                                @click="openGallery(complaintStore.selectEditComplaint.object, index)" />
                            <!-- </div> -->

                        </VCarouselItem>
                    </VCarousel>
                </div>
                <div style="height: 1px;" class="bg-color my-2"></div>
                <div class="ml-5">
                    <p class="text-color2 mb-1" style="font-size: 12px; color: gray;">{{
                        getDateFromUnix(complaintStore.selectEditComplaint.object?.created ?
                            complaintStore.selectEditComplaint.object?.created : 0, 'datehour') }}</p>

                    <p v-if="!complaintStore.selectEditComplaint.object?.readMore" style="font-size: 14px;">{{
                        complaintStore.selectEditComplaint.object?.text.slice(0, 150) }} {{
                            complaintStore.selectEditComplaint.object?.text.length
                                > 150 ? "..." : ""
                        }}</p>
                    <p v-else style="font-size: 14px;">{{ complaintStore.selectEditComplaint.object?.text }}</p>

                    <div v-if="complaintStore.selectEditComplaint.object?.text.length > 150" class="mt-1">
                        <span v-if="!complaintStore.selectEditComplaint.object?.readMore"
                            class="d-block mt-n1 cursor-pointer" style="font-size: 12px; color: var(--main-color);"
                            @click="complaintStore.selectEditComplaint.object.readMore = true">
                            Развернуть
                        </span>
                        <span v-else class="d-block mt-n1 cursor-pointer"
                            style="font-size: 12px; color: var(--main-color);"
                            @click="complaintStore.selectEditComplaint.object.readMore = false">
                            Скрыть
                        </span>
                    </div>

                    <span v-for="hashtag in complaintStore.selectEditComplaint.object?.hashtags" :key="hashtag.id"
                        class="d-block mt-2" style="font-size: 13px; color: var(--main-color);">
                        #{{ hashtag?.text }}
                    </span>
                    <div class="d-flex mt-4">
                        <span></span>
                        <div class="d-flex  mr-4 ml-auto">
                            <VBtn>
                                <VIcon icon="mdi-heart-outline" />{{
                                    complaintStore.selectEditComplaint.object?.hugsCount }}
                            </VBtn>
                            <VBtn class="ml-2">
                                <VIcon icon="mdi-eye-outline" />{{ complaintStore.selectEditComplaint.object?.viewsCount
                                }}
                            </VBtn>
                            <VBtn class="ml-2">
                                <VIcon icon="mdi-thumb-up-outline" />{{
                                    complaintStore.selectEditComplaint.object?.commentsCount }}
                            </VBtn>
                        </div>
                    </div>

                </div>
            </div>
            <div style="width: 100%; height: 1px;" class="bg-color my-2"></div>
        </VCard>

        <div class="ml-6 mt-4">


            <p class="text-body-2"><b>От кого</b></p>
            <div class="d-flex py-4 align-center">
                <VImg class="avatar mr-6"
                    :src="complaintStore.selectEditComplaint?.subject?.avatar ? complaintStore.selectEditComplaint?.subject?.avatar : placeholder"
                    cover />
                <div class="flex-grow-1 d-flex flex-column">
                    <div class="mr-auto mb-2">
                        <span v-if="complaintStore.selectEditComplaint?.subject?.lastName" class=" mr-1"><b>{{
                            complaintStore.selectEditComplaint?.subject?.lastName }}</b></span>
                        <span v-if="complaintStore.selectEditComplaint?.subject?.firstName" class=" mr-1"><b>{{
                            complaintStore.selectEditComplaint?.subject?.firstName }}</b></span>
                        <span v-if="complaintStore.selectEditComplaint?.subject?.patronymic" class=" mr-1"><b>{{
                            complaintStore.selectEditComplaint?.subject?.patronymic }}</b></span>
                    </div>
                    <div class="d-flex py-1 align-center">
                        <VIcon icon="mdi-email" class="mr-2" />
                        <a v-if="complaintStore.selectEditComplaint?.subject?.email"
                            :href="('mailto:' + complaintStore.selectEditComplaint?.subject?.email)"
                            class="text-body-2 cursor-pointer" style="color: var(--text-color); cursor: pointer;"><b>{{
                                complaintStore.selectEditComplaint?.subject?.email }}</b></a>
                        <p v-else class="text-body-2"><b>Не указан</b></p>
                    </div>

                    <div class="d-flex py-1 align-center">
                        <VIcon icon="mdi-cellphone" class="mr-2" />
                        <a v-if="complaintStore.selectEditComplaint?.subject?.tel"
                            :href="('tel:' + complaintStore.selectEditComplaint?.subject?.email)"
                            class="text-body-2 cursor-pointer" style="color: var(--text-color); cursor: pointer;"><b>{{
                                complaintStore.selectEditComplaint?.subject?.tel }}</b></a>
                        <p v-else class="text-body-2"><b>Не указан</b></p>
                    </div>

                    <div class="d-flex py-1 align-center">
                        <VIcon icon="mdi-map-marker" class="mr-2" />
                        <p v-if="complaintStore.selectEditComplaint?.subject?.address"
                            class="text-body-2 cursor-pointer">
                            <b>{{
                                complaintStore.selectEditComplaint?.subject?.address }}</b>
                        </p>
                        <p v-else class="text-body-2"><b>Не указан</b></p>
                    </div>

                    <div class="d-flex pt-1 align-center">
                        <!-- <p class="text-body-2">Оплата</p> -->
                        <span v-if="!complaintStore.selectEditComplaint?.subject.isBlock"
                            class="text-body-2 active"><b>Активен</b></span>
                        <span v-else class="text-body-2 inactive ml-auto"><b>Заболкирован</b></span>
                    </div>
                </div>
            </div>

            <p class="text-body-2"><b>На кого</b></p>
            <div class="d-flex py-4 align-center">
                <VImg class="avatar mr-6"
                    :src="complaintStore.selectEditComplaint?.object?.user?.avatar ? complaintStore.selectEditComplaint?.object?.user?.avatar : placeholder"
                    cover />
                <div class="flex-grow-1 d-flex flex-column">
                    <div class="mr-auto mb-2">
                        <span v-if="complaintStore.selectEditComplaint?.object?.user?.lastName" class=" mr-1"><b>{{
                            complaintStore.selectEditComplaint?.object?.user?.lastName }}</b></span>
                        <span v-if="complaintStore.selectEditComplaint?.object?.user?.firstName" class=" mr-1"><b>{{
                            complaintStore.selectEditComplaint?.object?.user?.firstName }}</b></span>
                        <span v-if="complaintStore.selectEditComplaint?.object?.user?.patronymic" class=" mr-1"><b>{{
                            complaintStore.selectEditComplaint?.object?.user?.patronymic }}</b></span>
                    </div>
                    <div class="d-flex py-1 align-center">
                        <VIcon icon="mdi-email" class="mr-2" />
                        <a v-if="complaintStore.selectEditComplaint?.object?.user?.email"
                            :href="('mailto:' + complaintStore.selectEditComplaint?.object?.user?.email)"
                            class="text-body-2 cursor-pointer" style="color: var(--text-color); cursor: pointer;"><b>{{
                                complaintStore.selectEditComplaint?.object?.user?.email }}</b></a>
                        <p v-else class="text-body-2"><b>Не указан</b></p>
                    </div>

                    <div class="d-flex py-1 align-center">
                        <VIcon icon="mdi-cellphone" class="mr-2" />
                        <a v-if="complaintStore.selectEditComplaint?.object?.user?.tel"
                            :href="('tel:' + complaintStore.selectEditComplaint?.object?.user?.email)"
                            class="text-body-2 cursor-pointer" style="color: var(--text-color); cursor: pointer;"><b>{{
                                complaintStore.selectEditComplaint?.object?.user?.tel }}</b></a>
                        <p v-else class="text-body-2"><b>Не указан</b></p>
                    </div>

                    <div class="d-flex py-1 align-center">
                        <VIcon icon="mdi-map-marker" class="mr-2" />
                        <p v-if="complaintStore.selectEditComplaint?.object?.user?.address"
                            class="text-body-2 cursor-pointer">
                            <b>{{
                                complaintStore.selectEditComplaint?.object?.user?.address }}</b>
                        </p>
                        <p v-else class="text-body-2"><b>Не указан</b></p>
                    </div>

                    <div class="d-flex pt-1 align-center">
                        <!-- <p class="text-body-2">Оплата</p> -->
                        <span v-if="!complaintStore.selectEditComplaint?.object?.user.isBlock"
                            class="text-body-2 active"><b>Активен</b></span>
                        <span v-else class="text-body-2 inactive ml-auto"><b>Заболкирован</b></span>
                    </div>
                </div>
            </div>

            <div class="d-flex mr-6">
                <p class="text-body-2">Категория:</p>
                <p class="text-body-2 ml-auto" v-if="category?.length > 0"><b>{{ category[0]?.title }}</b></p>
            </div>
            <div class="d-flex mr-6 mt-1">
                <p class="text-body-2">Текст:</p>
                <p class="text-body-2 ml-auto" v-if="category.length > 0"><b>{{
                    complaintStore.selectEditComplaint?.additionalText }}</b></p>
            </div>
        </div>



        <div class=" ml-5 d-flex position-absolute bottom-0 py-2 bg-white w-100">

            <VBtn prepend-icon="mdi-check" class="background-button mr-4"
                style="width: 190px; background-color: lightgreen;" @click="updateComplaint(true)">
                Принять
            </VBtn>

            <VBtn prepend-icon="mdi-close" class="background-button mr-4"
                style="width: 190px; background-color: lightcoral;" @click="updateComplaint(false)">
                Отклонить
            </VBtn>
        </div>
        <VueEasyLightbox class="vel-modals" :visible="showGallery" :imgs="postImages" :index="galleryIndex"
            @hide="showGallery = false" />
    </Sidebar>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Sidebar from 'primevue/sidebar';
import { useToast } from 'vue-toastification';
import placeholder from "@/assets/images/Placeholder.png"
import { VImg } from 'vuetify/components';
import { useComplaintStore } from '@/stores/complaintStore';
import { getDateFromUnix } from '@/plugins/unixTime';
import VueEasyLightbox from 'vue-easy-lightbox';

const complaintStore = useComplaintStore()
const toast = useToast()
const progressShow = ref(false)

const show = defineModel<boolean>()

const postImages = ref<string[]>([])
const showGallery = ref(false)
const galleryIndex = ref(0)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const openGallery = (post: any, index: number) => {
    postImages.value = []
    for (const img of post?.gallery) {
        postImages.value.push(img.mainLink || '')
    }
    showGallery.value = true
    galleryIndex.value = index
}

const category = ref([])
const willAppear = () => {
    complaintStore.newComplaint.body = null
    complaintStore.newComplaint.title = null
    complaintStore.newComplaint.important = false
    complaintStore.newComplaint.category = {
        title: "",
        value: 0
    }
    complaintStore.newComplaint.isHidden = false
    complaintStore.newComplaint.image.url = ''

    complaintStore.newComplaint.id = complaintStore.selectEditComplaint?.id
    complaintStore.newComplaint.title = complaintStore.selectEditComplaint?.title
    complaintStore.newComplaint.body = complaintStore.selectEditComplaint?.body
    complaintStore.newComplaint.important = complaintStore.selectEditComplaint?.important
    complaintStore.newComplaint.category = complaintStore.selectEditComplaint?.category
    complaintStore.newComplaint.image.url = complaintStore.selectEditComplaint?.image
    complaintStore.newComplaint.source = complaintStore.selectEditComplaint?.source

    category.value = complaintStore.complaintCategories.filter(obj =>
        obj.value === complaintStore.selectEditComplaint?.reason
    )
    console.log(category)
}

async function updateComplaint(satisfy: boolean) {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await complaintStore.updateStoriesComplaint(satisfy)
    if (response.status == 200) {
        toast.success('Статья успешно обновлена')
        progressShow.value = false
        show.value = false
    } else {
        toast.error('Не удалось обновить статью')
        progressShow.value = false
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

.product-image {
    border-radius: 8px;
    border: 3px solid white;
}

.select_image {
    border-radius: 8px;
    border: 3px solid black;
}

.avatar {
    align-self: center;
    width: 150px;
    max-width: 150px;
    height: 150px;
    margin: 0 auto;
    background-color: var(--back-color);
    border-radius: 50%;
}
</style>
