<template>
    <Sidebar class="sidebar w-50 pb-4" v-model:visible="show" @show="willAppear" position="right">
        <div class="sidebar-header py-4 px-8 fixed ">
            <VBtn class="sidebar-close" @click="show = false" width="32px" height="32px">
                <VIcon icon="mdi-close" />
            </VBtn>
            <h2 class="sidebar-header-title">Редактирование объявления</h2>
        </div>
        <VProgressLinear v-show="progressShow" style="position: absolute; width: 100%; top: 68px; z-index: 99999;"
            color="var(--main-color)" indeterminate />
        <div class="pa-4 d-flex flex-column sidebar-content pb-12">
            <div class="mb-12" style="padding-bottom: 58px;">
                <p class="text-body-2">Название*</p>
                <VTextField variant="plain" v-model="adStore.selectEditAd.title" autocomplete="off"
                    class="custom-tf mt-1 pa-0" />

                <p class="text-body-2">Описание*</p>
                <VTextarea variant="plain" v-model="adStore.selectEditAd.body" class="mt-1 pa-0 custom-textarea" />

                <div class="d-flex flex-column mt-2">
                    <div class="d-flex w-100">
                        <div class=" d-flex flex-column" style="width: calc(50% - 10px)">
                            <div class=" d-flex align-center">
                                <p class="text-body-2">Стоимость*</p>
                            </div>
                            <VTextField variant="plain" v-model="adStore.selectEditAd.profit" autocomplete="off"
                                class="custom-tf mt-1 pa-0" append-inner-icon="mdi-currency-rub" type="number" />
                        </div>
                        <div class="flex-grow-1 ml-4 pa-0">
                            <p class="text-body-2 mt-1">Дата окончания публикации*</p>
                            <VTextField variant="plain" type="datetime-local" v-model="adStore.selectEditAd.deadline"
                                autocomplete="off" class="custom-tf mt-1 pa-0" />
                        </div>
                    </div>


                    <div class="d-flex w-100">
                        <div class="flex-grow-1 mr-2 pa-0">
                            <p class="text-body-2 mt-1">Категория*</p>
                            <VSelect v-model="adStore.selectEditAd.category" variant="plain"
                                class="custom-tf mt-1 input-select" density="compact"
                                :items="categoriesStore.categories" item-title='name' item-value="id"
                                autocomplete="off" />
                        </div>
                        <div class="flex-grow-1 ml-2 pa-0">
                            <p class="text-body-2 mt-1">Подкатегория*</p>
                            <VSelect v-model="adStore.selectEditAd.subcategory" variant="plain"
                                class="custom-tf mt-1 input-select" density="compact"
                                :items="categoriesStore.categories.find(category => category.id == adStore.selectEditAd.category)?.subcategories"
                                item-title='name' item-value="id" autocomplete="off" />
                        </div>
                    </div>

                    <VTooltip location="bottom">
                        <template v-slot:activator="{ props }">
                            <VIcon class="gray-text ml-2" icon="mdi-information" size="20" v-bind="props" />
                        </template>
                        <p class="text-center">При окончании срока публикации объявление будет размещено заново
                            автоматически</p>
                    </VTooltip>
                    <VCheckboxBtn v-model="adStore.selectEditAd.isAutoRecreate" label="Пересоздавать автоматически" />
                </div>

                <div class="w-100 pa-0">
                    <p class="text-body-2 mt-1">Адрес*</p>
                    <GoogleAutocomplete v-model="location" class="custom-tf mt-1 rounded"
                        api-key="AIzaSyAKcYO57qXN9id12mnHBvaNE2SD1IBNy3I" style="
							width: 100%;
							padding: 8px;
							z-index: 999999 !important;
                            background-color: var(--back-color);
						" @keydown.enter.prevent="location = null; setLocatoin(null)" autocomplete="off"
                        :placeholder="adStore.selectEditAd.address" @set="setLocatoin($event)" />
                </div>


                <p class="mt-2 text-body-2">Изображения мероприятия*</p>
                <VFileInput v-model="addedFiles" class="d-none" ref="fileInput" variant="solo" :clearable="false"
                    hide-details prepend-icon="null" flat accept="image/jpeg, image/png, image/jpg" :multiple="true" />

                <VContainer class="pa-1 px-2 mt-2">
                    <VItemGroup>
                        <VRow>
                            <VCol v-for="(image, index) in adStore.selectEditAd.imagesUrls" :key="image" cols="12"
                                md="3" class="pa-1 rounded">
                                <VItem class="pa-0 rounded">
                                    <VImg :class="{ thumbnail_image: image == thumbnail }" :src="image"
                                        class="pa-0 upload-image " height="140" width="140" cover>
                                        <VIcon icon="mdi-close-circle position-absolute right-0"
                                            @click.stop="removeImage(index, image)" />
                                    </VImg>
                                </VItem>
                            </VCol>
                            <VImg md="4" height="130px" @click="($refs.fileInput as HTMLInputElement)?.click()"
                                class=" ma-1 upload-image rounded" style="max-width: 140px;" :src="placeholder" cover />
                        </VRow>
                    </VItemGroup>
                </VContainer>
            </div>



            <div class="d-flex position-absolute bottom-0 py-2 bg-white w-100">
                <VBtn prepend-icon="mdi-check" class="black-button" @click="updateAd()">
                    Изменить
                </VBtn>
                <!-- DELETE DIALOG -->
                <VDialog v-model="deleteAdDialog" max-width="400" persistent>
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

                        <p class="mt-4 text-body-2">Вы действительно хотите удалить статью <b>{{
                            adStore.selectEditAd.title
                                }}</b>?
                            Если на статью ссылается баннер, он также будет удалён.
                            Все данные будут удалены без возможности восстановления.
                        </p>
                        <template v-slot:actions>
                            <VBtn @click=" deleteAdDialog = false">
                                Отмена
                            </VBtn>


                            <VBtn class="text-red" @click="deleteAd">
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
import { useAdsStore } from '@/stores/adStore';
import { fromBlob } from 'image-resize-compress';
import { GoogleAutocomplete } from 'vue3-google-autocomplete';
import { getDateFromUnix } from '@/plugins/unixTime';
import { useCategoriesStore } from '@/stores/categoriesStore';


const adStore = useAdsStore()
const categoriesStore = useCategoriesStore()
const toast = useToast()
const progressShow = ref(false)
const thumbnail = ref()
const show = defineModel<boolean>()
const deleteAdDialog = ref(false)

const location = ref()

const willAppear = () => {
    if (adStore.selectEditAd.deadline != null) {
        adStore.selectEditAd.deadline = getDateFromUnix(adStore.selectEditAd.deadline, 'datehourTF')
    }


    adStore.selectEditAd.oldImages = adStore.selectEditAd.images
    location.value = adStore.selectEditAd.address
    adStore.selectEditAd.imagesUrls = []
    for (const image of adStore.selectEditAd.images) {
        adStore.selectEditAd.imagesUrls.push(image.link)
    }
    adStore.selectEditAd.image = []
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setLocatoin = (newLocatoin: any) => {
    console.log(newLocatoin)
    adStore.selectEditAd.address = ''
    adStore.selectEditAd.address += newLocatoin?.country ? newLocatoin?.country : ''
    adStore.selectEditAd.address += newLocatoin?.state ? ', ' + newLocatoin?.state : ''
    adStore.selectEditAd.address += newLocatoin?.city ? ', ' + newLocatoin?.city : ''
    adStore.selectEditAd.address += newLocatoin?.name ? ', ' + newLocatoin?.name : ''
    adStore.selectEditAd.latitude = newLocatoin?.latitude
    adStore.selectEditAd.longitude = newLocatoin?.longiude
}


const fileInput = ref<HTMLInputElement>();
const addedFiles = ref()
watch(
    () => addedFiles.value,
    async () => {
        if (addedFiles.value) {
            for (const file of addedFiles.value) {
                adStore.selectEditAd.images.push((await fromBlob(file, 50, 'auto', 'auto', 'jpeg')))
                console.log(adStore.selectEditAd.images)
                adStore.selectEditAd.imagesUrls.push(file != undefined ? URL.createObjectURL(file) : '');
                console.log(adStore.selectEditAd.imagesUrls)
            }
        }
    }
);

const removeImage = async (index: number, link: string) => {


    const image = adStore.selectEditAd.oldImages.filter((img: { id: number, link: string; }) => img.link == link)
    console.log(adStore.selectEditAd.oldImages)
    console.log(image)
    adStore.selectEditAd.images.splice(index, 1)
    adStore.selectEditAd.imagesUrls.splice(index, 1)
    if (image.length > 0) {
        progressShow.value = true
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response: any = await adStore.deleteImage(image[0].id)
        if (response.status == 200) {
            toast.success('Изображение успешно удалено')
            progressShow.value = false
        } else {
            toast.error('Не удалось удалить изображение')
            progressShow.value = true
        }
    }

}

async function updateAd() {

    if (!((adStore.selectEditAd.title ? adStore.selectEditAd.title : '').trim())) {
        toast.error("Укажите название объявления")
        return
    }

    if (!((adStore.selectEditAd.body ? adStore.selectEditAd.body : '').trim())) {
        toast.error("Укажите описание объявления")
        return
    }


    if (!((adStore.selectEditAd.deadline ? adStore.selectEditAd.deadline : ''))) {
        toast.error("Укажите окончание объявления")
        return
    }

    if (!((adStore.selectEditAd.category ? adStore.selectEditAd.category : ''))) {
        toast.error("Укажите категорию")
        return
    }

    if (!((adStore.selectEditAd.subcategory ? adStore.selectEditAd.subcategory : ''))) {
        toast.error("Укажите подкатегорию")
        return
    }

    if (!((adStore.selectEditAd.profit ? adStore.selectEditAd.profit : ''))) {
        toast.error("Укажите стоимость")
        return
    }

    if (!((adStore.selectEditAd.address ? adStore.selectEditAd.address : ''))) {
        toast.error("Укажите адрес проведения объявления")
        return
    }

    if (adStore.selectEditAd?.images.length == 0) {
        toast.error("Добавьте картинки объявления")
        return
    }

    progressShow.value = true
    // CREATE PRODUCT
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await adStore.updateAd(adStore.selectEditAd.id)
    if (response.status === 200) {
        progressShow.value = false
        toast.success("Мероприятие успешно изменено")
        show.value = false
    } else {
        progressShow.value = false
        toast.error(response.response.data.description);
    }
}

const deleteAd = async () => {
    progressShow.value = true
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await adStore.deleteAd(adStore.selectEditAd.id)
    if (response.status == 200) {
        toast.success('Мероприятие успешно удалено')
        progressShow.value = false
        show.value = false
    } else {
        toast.error('Не удалось удалить мероприятие')
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
