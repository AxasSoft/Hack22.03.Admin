<template>
    <Sidebar class="sidebar w-50 pb-4" v-model:visible="show" @show="willAppear()" position="right">
        <div class="sidebar-header py-4 px-8 fixed ">
            <VBtn class="sidebar-close" @click="show = false" width="32px" height="32px">
                <VIcon icon="mdi-close" />
            </VBtn>
            <h2 class="sidebar-header-title"> Редактирование баннера</h2>
        </div>
        <VProgressLinear v-show="progressShow" style="position: absolute; width: 100%; top: 68px; z-index: 99999;"
            color="var(--main-color)" indeterminate />
        <div class="pa-4 d-flex flex-column sidebar-content pb-12">
            <div class="mb-12" style="padding-bottom: 58px;">

                <p class="mt-2 text-body-2">Изображение баннера*</p>
                <VFileInput v-model="addedFiles" class="d-none" ref="fileInput" variant="solo" :clearable="false"
                    hide-details prepend-icon="null" flat accept="image/jpeg, image/png, image/jpg" :multiple="false" />

                <VImg md="4" height="140px" width="320px" class=" ma-1 upload-image rounded" style="max-width: 320px;"
                    @click="($refs.fileInput as HTMLInputElement)?.click()"
                    :src="(promoStore.selectEditPromo.cover?.url ? promoStore.selectEditPromo.cover?.url : placeholder)"
                    cover />


                <span class="gray-text text-body-2">Баннеры отображаются на главном экране</span>
                <br />
                <br />


                <span class="gray-text text-body-2" style="position: relative; margin-top: -135px;">Баннер может
                    направлять пользователя
                    на категорию объявлений, конкретное объявление, или статью</span>
                <!-- CATEGORY  -->


                <VRadioGroup inline v-model="type">
                    <VRadio class="text-body-2" label="Категория" value="category" density="compact" />
                    <VRadio class="text-body-2" label="Объявление" value="ad" />
                    <VRadio class="text-body-2" label="Статья" value="article" />
                    <VRadio class="text-body-2" label="Новая статья" value="newArticle" />
                </VRadioGroup>


                <div v-if="type == 'category'" class="align-center">
                    <VSlideGroup v-if="categoriesStore.subcategories.length > 0">
                        <VSlideGroupItem v-for="category in categoriesStore.subcategories" :key="category.id">
                            <VCard :class="{ select_image: promoStore.selectEditPromo?.subcategory?.id == category.id }"
                                variant="flat" class="pa-0 mx-1 d-flex flex-column ad-image text-center"
                                @click="setCategory(category)">
                                <div class="text-center justify-center align-center mx-2">
                                    <b>
                                        <p class="mb-1 mx-1 text-body-2" style="max-width: 120px;">
                                            {{ category.name }}</p>
                                    </b>
                                </div>
                            </VCard>
                        </VSlideGroupItem>
                    </VSlideGroup>
                    <div v-else class="mx-auto text-center mt-4">
                        <VProgressCircular indeterminate />
                    </div>

                </div>



                <div v-if="type == 'ad'">
                    <VTextField class="small-custom-tf" v-model="search" style="max-width: 100%; margin-top: 4px"
                        variant="plain" density="compact" label="Поиск" autocomplete="off" />

                    <VSlideGroup v-if="adStore.ads.length > 0">
                        <VSlideGroupItem v-for="ad in adStore.ads" :key="ad.id">
                            <VCard :class="{ select_image: promoStore.selectEditPromo?.ad?.id == ad.id }" variant="flat"
                                class="pa-0 d-flex flex-column ad-image text-center" @click="setAd(ad)">
                                <VImg width="120px" height="120px" class="ad-image"
                                    style="min-width: 120px; min-height: 120px; max-width: 120px; max-height: 120px;"
                                    :src="ad?.images.length > 0 ? ad?.images[0]?.link : placeholder" alt="" />

                                <div class="text-center">
                                    <b>
                                        <p class="mb-1 mx-1 text-body-2" style="max-width: 120px;">
                                            {{ ad?.title }}</p>
                                    </b>
                                </div>
                            </VCard>
                        </VSlideGroupItem>
                    </VSlideGroup>
                    <div v-else class="mx-auto text-center mt-4">
                        <VProgressCircular indeterminate />
                    </div>
                </div>



                <div v-if="type == 'article'">
                    <VSlideGroup v-if="infoStore.infos.length > 0">
                        <VSlideGroupItem v-for="info in infoStore.infos" :key="info.id">
                            <VCard :class="{ select_image: promoStore.selectEditPromo?.info?.id == info.id }"
                                variant="flat" class="pa-0 d-flex flex-column ad-image text-center"
                                @click="setInfo(info)">
                                <VImg width="120px" height="120px" class="ad-image"
                                    style="min-width: 120px; min-height: 120px; max-width: 120px; max-height: 120px;"
                                    :src="info?.image ? info.image : placeholder" alt="" />

                                <div class="text-center">
                                    <b>
                                        <p class="mb-1 text-body-2" style="max-width: 120px;">
                                            {{ info.title }}</p>
                                    </b>
                                </div>
                            </VCard>
                        </VSlideGroupItem>
                    </VSlideGroup>

                </div>
                <div v-if="type == 'newArticle'">
                    <h4 class="mb-4">Новая статья</h4>
                    <p class="text-body-2">Заголовок*</p>
                    <VTextField variant="plain" v-model="infoStore.newInfo.title" autocomplete="off"
                        class="custom-tf mt-1 pa-0" />

                    <p class="text-body-2 mt-5">Категория*</p>
                    <VSelect v-model="infoStore.newInfo.category" variant="plain" class="custom-tf mt-1 input-select"
                        density="compact" :items="infoStore.infoCategories" autocomplete="off">
                        <template v-slot:item="{ props, item }">
                            <VListItem v-bind="props" :title="item?.raw?.title ? item.raw.title : ''" />
                        </template>
                        <template v-slot:selection="{ item }">
                            <VListItem :title="item?.raw?.title ? item.raw.title : ''" />
                        </template>
                    </VSelect>

                    <p class="text-body-2">Изображение статьи*</p>
                    <VFileInput v-model="articleFiles" class="d-none" ref="articleFileInput" variant="solo"
                        :clearable="false" hide-details prepend-icon="null" flat
                        accept="image/jpeg, image/png, image/jpg" :multiple="false" />

                    <VImg md="4" height="140px" width="320px" class=" ma-1 upload-image rounded"
                        style="max-width: 320px;" @click="($refs.articleFileInput as HTMLInputElement)?.click()"
                        :src="(infoStore.newInfo.image?.url ? infoStore.newInfo.image?.url : placeholder)" cover />

                    <p class="text-body-2 mt-6">Текст*</p>
                    <VTextarea variant="plain" v-model="infoStore.newInfo.body" class="mt-1 pa-0 custom-textarea" />
                </div>

            </div>



            <div class="d-flex position-absolute bottom-0 py-2 bg-white w-100">
                <VBtn prepend-icon="mdi-check" class="black-button mr-4" @click="updatePromo">
                    Изменить
                </VBtn>


                <!-- DELETE DIALOG -->
                <VDialog v-model="deletePromoDialog" max-width="400" persistent>
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

                        <p class="mt-4 text-body-2">Вы действительно хотите удалить баннер <b>{{
                            promoStore.selectEditPromo.name
                                }}</b>?
                            Все данные будут удалены без возможности восстановления.
                        </p>
                        <template v-slot:actions>
                            <VBtn @click=" deletePromoDialog = false">
                                Отмена
                            </VBtn>


                            <VBtn class="text-red" @click="deletePromo">
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
import { ref, watch } from 'vue';
import Sidebar from 'primevue/sidebar';
import { useToast } from 'vue-toastification';
import placeholder from "@/assets/images/Placeholder.png"
import { fromBlob } from 'image-resize-compress';
import { usePromosStore } from '@/stores/promoStore';
import { VImg, VTextField } from 'vuetify/components';
import { useInfoStore } from '@/stores/infoStore';
import { useAdsStore } from '@/stores/adStore';
import { useCategoriesStore } from '@/stores/categoriesStore';
import type { Ad } from '@/types/Ad';
import type { Category } from '@/types/Category';
import type { Info } from '@/types/Info';


const promoStore = usePromosStore()
const infoStore = useInfoStore()
const adStore = useAdsStore()
const categoriesStore = useCategoriesStore()
const toast = useToast()
const progressShow = ref(false)
const type = ref('category')
const deletePromoDialog = ref(false)
const search = ref()
watch(
    () => search.value,
    async () => {
        if (search.value.length > 1) {
            adStore.adsPage = 1
            await adStore.getAds()
        }

        if (search.value.length == 0) {
            adStore.adsPage = 1
            await adStore.getAds()
        }

        console.log(search.value)
    })


const show = defineModel<boolean>()
const willAppear = () => {
    infoStore.newInfo.source = null
    infoStore.newInfo.title = null
    infoStore.newInfo.body = null
    infoStore.newInfo.image.url = ''

    promoStore.selectEditPromo.cover = {
        url: promoStore?.selectEditPromo?.cover,
        file: <Blob | null>null,
        isChanged: false,
    }

    promoStore.selectEditPromo.ad = promoStore.selectEditPromo.order

    categoriesStore.getCategoriesWithSubcategories()
    adStore.adsPage = 1
    adStore.getAds()
    infoStore.infoPage = 1
    infoStore.getInfos()

    if (promoStore.selectEditPromo?.category) {
        type.value = 'category'
    } else if (promoStore.selectEditPromo?.ad) {
        type.value = 'ad'
    } else if (promoStore.selectEditPromo?.info) {
        type.value = 'article'
        infoStore.newInfo.id = promoStore.selectEditPromo?.article?.id
        infoStore.newInfo.title = promoStore.selectEditPromo?.info?.title
        infoStore.newInfo.body = promoStore.selectEditPromo?.info?.body
        infoStore.newInfo.category = promoStore.selectEditPromo?.info?.category
        infoStore.newInfo.image.url = promoStore.selectEditPromo?.info?.image

    }
}


const fileInput = ref<HTMLInputElement>();
const addedFiles = ref()
watch(
    () => addedFiles.value,
    async () => {
        if (addedFiles.value) {
            promoStore.selectEditPromo.cover.file = (await fromBlob(addedFiles.value, 50, 'auto', 'auto', 'jpeg'))
            promoStore.selectEditPromo.cover.url = promoStore.selectEditPromo.cover.file != undefined ? URL.createObjectURL(promoStore.selectEditPromo.cover.file) : '';
            promoStore.selectEditPromo.cover.isChanged = true
        }
    }
);
const articleFiles = ref()
watch(
    () => articleFiles.value,
    async () => {
        if (articleFiles.value) {
            infoStore.newInfo.image.file = (await fromBlob(articleFiles.value, 50, 'auto', 'auto', 'jpeg'))
            infoStore.newInfo.image.url = infoStore.newInfo.image.file != undefined ? URL.createObjectURL(infoStore.newInfo.image.file) : '';
            infoStore.newInfo.image.isChanged = true
        }
    }
);

const setCategory = (category: Category) => {
    promoStore.selectEditPromo.category = category
    promoStore.selectEditPromo.ad = null
    promoStore.selectEditPromo.info = null
}

const setAd = (ad: Ad) => {
    console.log(ad)
    promoStore.selectEditPromo.ad = ad
    promoStore.selectEditPromo.category = null
    promoStore.selectEditPromo.info = null

}


const setInfo = (info: Info) => {
    promoStore.selectEditPromo.ad = null
    promoStore.selectEditPromo.category = null
    promoStore.selectEditPromo.info = info

}



async function updatePromo() {

    if (type.value == 'category' && !promoStore.selectEditPromo.subcategory) {
        toast.error("Выберите категорию")
        return
    }


    if (type.value == 'ad' && !promoStore.selectEditPromo.ad) {
        toast.error("Выберите товар")
        return
    }

    progressShow.value = true
    const articleComplete = ref(false)
    if (type.value == 'newArticle') {

        if (!infoStore.newInfo.title) {
            toast.error("Укажите заголовок статьи")
            return
        }

        if (!infoStore.newInfo.image.file) {
            toast.error("Добавьте изображение статьи")
            return
        }

        if (!infoStore.newInfo.body) {
            toast.error("Укажите текст статьи")
            return
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const articleResponse: any = await infoStore.createNewInfo()
        if (articleResponse.status == 200) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const coverResponse: any = await infoStore.updateInfoCover(articleResponse.data.data.id, infoStore.newInfo.image.file)
            if (coverResponse.status == 200) {
                articleComplete.value = true
                promoStore.selectEditPromo.info = articleResponse.data.data
            }

        }
        progressShow.value = false
    } else {
        articleComplete.value = true
        progressShow.value = false
    }

    if (!articleComplete.value) {
        toast.error('Не удалось создать статью')
        return
    }

    progressShow.value = true
    // CREATE PRODUCT
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await promoStore.updatePromo(promoStore.selectEditPromo.id)
    if (response.status == 200) {
        toast.success('Баннер успешно изменён')
        progressShow.value = false
        show.value = false
    } else {
        toast.error('Не удалось изменить баннер')
    }
}

const deletePromo = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await promoStore.deletePromo(promoStore.selectEditPromo.id)
    if (response.status == 200) {
        toast.success('Баннер успешно удалён')
        progressShow.value = false
        show.value = false
    } else {
        toast.error('Не удалось удалить баннер')
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
</style>
