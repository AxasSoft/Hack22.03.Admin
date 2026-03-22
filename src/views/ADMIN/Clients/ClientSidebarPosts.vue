<template>
    <!-- MY FEEDBACK -->
    <VItemGroup class="mt-1" v-if="clientsStore.selectClientPosts?.length > 0">
        <VCard class=" my-2 mx-6 rounded-lg" v-for="(post) in clientsStore.selectClientPosts" :key="post?.id"
            style="background-color: var(--back-color);">

            <!-- DELETE DIALOG -->
            <VDialog v-model="post.showDelete" max-width="400" persistent>
                <template v-slot:activator="{ props: post }">
                    <VIcon icon="mdi-delete-outline" class="cursor-pointer" color="red"
                        style="right: 4px; top:4px; position: absolute;" v-bind="post" />
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
                        <VBtn @click="post.showDelete = false">
                            Отмена
                        </VBtn>


                        <VBtn class="text-red" @click="deletePost(post?.id)">
                            Удалить
                        </VBtn>
                    </template>
                </VCard>
            </VDialog>

            <div class="bg-color2 d-flex flex-column rounded-lg">
                <div class="d-flex pt-2 mx-5">
                    <VCarousel v-if="post?.gallery?.length > 0" class="mb-2 carousel">
                        <VCarouselItem v-for="image, index in post?.gallery" :key="image?.id">
                            <!-- <div class="mx-2 d-flex flex-column align-center" > -->
                            <VImg class="mx-auto rounded" :src="image?.mainLink ? image.mainLink : placeholder" alt=""
                                @click="openGallery(post, index)" />
                            <!-- </div> -->

                        </VCarouselItem>
                    </VCarousel>
                </div>
                <div style="height: 1px;" class="bg-color my-2"></div>
                <div class="ml-5">
                    <p class="text-color2 mb-1" style="font-size: 12px; color: gray;">{{ getDateFromUnix(post?.created ?
                        post?.created : 0, 'datehour') }}</p>

                    <p v-if="!post?.readMore" style="font-size: 14px;">{{ post?.text.slice(0, 150) }} {{
                        post?.text.length
                            > 150 ? "..." : ""
                    }}</p>
                    <p v-else style="font-size: 14px;">{{ post?.text }}</p>

                    <div v-if="post?.text.length > 150" class="mt-1">
                        <span v-if="!post?.readMore" class="d-block mt-n1 cursor-pointer"
                            style="font-size: 12px; color: var(--main-color);" @click="post.readMore = true">
                            Развернуть
                        </span>
                        <span v-else class="d-block mt-n1 cursor-pointer"
                            style="font-size: 12px; color: var(--main-color);" @click="post.readMore = false">
                            Скрыть
                        </span>
                    </div>

                    <span v-for="hashtag in post?.hashtags" :key="hashtag.id" class="d-block mt-2"
                        style="font-size: 13px; color: var(--main-color);">
                        #{{ hashtag?.text }}
                    </span>
                    <div class="d-flex mt-4">
                        <span></span>
                        <div class="d-flex  mr-4 ml-auto">
                            <VBtn>
                                <VIcon icon="mdi-heart-outline" />{{ post?.hugsCount }}
                            </VBtn>
                            <VBtn class="ml-2">
                                <VIcon icon="mdi-eye-outline" />{{ post?.viewsCount }}
                            </VBtn>
                            <VBtn class="ml-2">
                                <VIcon icon="mdi-thumb-up-outline" />{{ post?.commentsCount }}
                            </VBtn>
                        </div>
                    </div>

                </div>
            </div>
            <div style="width: 100%; height: 1px;" class="bg-color my-2"></div>
        </VCard>
        <LoadMarker top="-1000px"
            @load="clientsStore.selectClientPostsPage++; clientsStore.getClientPosts(clientsStore.selectEditClient.id)" />
    </VItemGroup>
    <p v-else class="align-center text-center mt-12">У пользователя ещё нет постов</p>
    <VueEasyLightbox class="vel-modals" :visible="showGallery" :imgs="postImages" :index="galleryIndex"
        @hide="showGallery = false" />
</template>

<script setup lang="ts">
import { getDateFromUnix } from '@/plugins/unixTime';
import { useClientsStore } from '@/stores/clientsStore';
import placeholder from '@/assets/images/Placeholder.png'
import LoadMarker from '@/components/LoadMarker.vue';
import { ref } from 'vue';
import VueEasyLightbox from 'vue-easy-lightbox';
import { VCarousel, VCarouselItem } from 'vuetify/components';
import { useToast } from 'vue-toastification';

const clientsStore = useClientsStore()
const postImages = ref<string[]>([])
const showGallery = ref(false)
const galleryIndex = ref(0)
const toast = useToast()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const openGallery = (post: any, index: number) => {
    postImages.value = []
    for (const img of post?.gallery) {
        postImages.value.push(img.mainLink || '')
    }
    showGallery.value = true
    galleryIndex.value = index
}

const deletePost = async (postId: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await clientsStore.deletePost(postId)
    console.log(response)
    if (response.status == 200) {
        toast.success("Публикация успешно удалена")
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

.vel-modals {
    left: -100% !important;
}
</style>