<template>

    <div class="pa-4 d-flex flex-column pb-12">
        <div class="mb-12">
            <p class="text-body-2">Название*</p>
            <VTextField variant="plain" v-model="excursionStore.selectEditExcursion.name" autocomplete="off"
                class="custom-tf mt-1 pa-0" />

            <p class="text-body-2">Описание*</p>
            <VTextarea variant="plain" v-model="excursionStore.selectEditExcursion.description"
                class="mt-1 pa-0 custom-textarea" />



            <div class="d-flex flex-column mt-2">


                <div class="d-flex w-100">
                    <div class="w-50 pa-0">
                        <p class="text-body-2 mt-1">Цена до скидки</p>
                        <VTextField variant="plain" v-model="excursionStore.selectEditExcursion.price"
                            autocomplete="off" class="custom-tf mt-1 pa-0" append-inner-icon="mdi-currency-rub"
                            type="number" />
                    </div>
                    <div class="w-50 ml-4 pa-0">
                        <p class="text-body-2 mt-1">Текущая цена*</p>
                        <VTextField variant="plain" v-model="excursionStore.selectEditExcursion.currentPrice"
                            autocomplete="off" class="custom-tf mt-1 pa-0" append-inner-icon="mdi-currency-rub"
                            type="number" />
                    </div>
                </div>

                <div class="d-flex w-100">
                    <div class="w-50 pa-0">
                        <p class="text-body-2 mt-1">Сброс высоты</p>
                        <VTextField variant="plain" v-model="excursionStore.selectEditExcursion.minHeight"
                            autocomplete="off" class="custom-tf mt-1 pa-0" type="number" />
                    </div>
                    <div class="w-50 ml-4 pa-0">
                        <p class="text-body-2 mt-1">Набор высоты</p>
                        <VTextField variant="plain" v-model="excursionStore.selectEditExcursion.maxHeight"
                            autocomplete="off" class="custom-tf mt-1 pa-0" type="number" />
                    </div>
                </div>

                <div class="d-flex w-100">
                    <div class="w-50 pa-0">
                        <p class="text-body-2 mt-1">Длина маршрута (км)*</p>
                        <VTextField variant="plain" v-model="excursionStore.selectEditExcursion.routeLength"
                            autocomplete="off" class="custom-tf mt-1 pa-0" type="number" />
                    </div>
                    <div class="w-50 ml-4 pa-0">
                        <p class="text-body-2 mt-1">Максимальная количество группы (чел)*</p>
                        <VTextField variant="plain" v-model="excursionStore.selectEditExcursion.maxGroupSize"
                            autocomplete="off" class="custom-tf mt-1 pa-0" type="number" />
                    </div>
                </div>

                <div class="d-flex w-100">
                    <div class="w-50 pa-0">
                        <p class="text-body-2 mt-1">Продолжительность (мин)*</p>
                        <VTextField variant="plain" v-model="excursionStore.selectEditExcursion.duration"
                            autocomplete="off" class="custom-tf mt-1 pa-0" type="number" />
                    </div>
                    <div class="w-50 ml-4 pa-0">
                        <p class="text-body-2 mt-1">Категория*</p>
                        <VSelect v-model="excursionStore.selectEditExcursion.category" variant="plain"
                            class="custom-tf mt-1 input-select" density="compact"
                            :items="excursionCategoriesStore.excursionCategoriesWithSubcategories" autocomplete="off">
                            <template v-slot:item="{ props, item }">
                                <VListItem v-bind="props" :title="item?.raw?.name ? item.raw.name : ''" />
                            </template>
                            <template v-slot:selection="{ item }">
                                <VListItem :title="item?.raw?.name ? item.raw.name : ''" />
                            </template>
                        </VSelect>
                    </div>
                </div>
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
                    :placeholder="excursionStore.selectEditExcursion.address" @set="setLocatoin($event)" />
            </div>

            <p class="text-body-2 mt-6">Советы*</p>
            <VTextarea variant="plain" v-model="excursionStore.selectEditExcursion.tips"
                class="mt-1 pa-0 custom-textarea" />


            <p class="mt-2 text-body-2">Изображения экскурсии*</p>
            <VFileInput v-model="addedFiles" class="d-none" ref="fileInput" variant="solo" :clearable="false"
                hide-details prepend-icon="null" flat accept="image/jpeg, image/png, image/jpg" :multiple="true" />

            <VContainer class="pa-1 px-2 mt-2">
                <VItemGroup>
                    <VRow>
                        <VCol v-for="(image, index) in excursionStore.selectEditExcursion.imagesUrls" :key="image"
                            cols="12" md="3" class="pa-1 rounded">
                            <VItem class="pa-0 rounded">
                                <VImg :class="{ thumbnail_image: image == thumbnail }" :src="image.link"
                                    class="pa-0 upload-image " height="140" width="140" cover>
                                    <VIcon icon="mdi-close-circle position-absolute right-0"
                                        @click.stop="removeImage(index, image.id)" />
                                </VImg>
                            </VItem>
                        </VCol>
                        <VImg md="4" height="130px" @click="($refs.fileInput as HTMLInputElement)?.click()"
                            class=" ma-1 upload-image rounded" style="max-width: 140px;" :src="placeholder" cover />
                    </VRow>
                </VItemGroup>
            </VContainer>
        </div>

    </div>

</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import placeholder from "@/assets/images/Placeholder.png"
import { useExcursionsStore } from '@/stores/excursionStore';
import { fromBlob } from 'image-resize-compress';
import { GoogleAutocomplete } from 'vue3-google-autocomplete';
import { useExcursionCategoriesStore } from '@/stores/excursionCategoriesStore';
import { useToast } from 'vue-toastification';


const excursionStore = useExcursionsStore()
const excursionCategoriesStore = useExcursionCategoriesStore()
const thumbnail = ref()
const toast = useToast()
const location = ref()
const imageIds = ref()

onMounted(async () => {
    location.value = excursionStore.selectEditExcursion.address
    excursionStore.selectEditExcursion.imagesUrls = []
    for (const image of excursionStore.selectEditExcursion.images) {
        excursionStore.selectEditExcursion.imagesUrls.push(image)
    }
    excursionStore.selectEditExcursion.image = []
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setLocatoin = (newLocatoin: any) => {
    console.log(newLocatoin)
    excursionStore.selectEditExcursion.address = ''
    excursionStore.selectEditExcursion.address += newLocatoin?.country ? newLocatoin?.country : ''
    excursionStore.selectEditExcursion.address += newLocatoin?.state ? ', ' + newLocatoin?.state : ''
    excursionStore.selectEditExcursion.address += newLocatoin?.city ? ', ' + newLocatoin?.city : ''
    excursionStore.selectEditExcursion.address += newLocatoin?.name ? ', ' + newLocatoin?.name : ''
    excursionStore.selectEditExcursion.latitude = newLocatoin?.latitude
    excursionStore.selectEditExcursion.longitude = newLocatoin?.longiude
}


const fileInput = ref<HTMLInputElement>();
const addedFiles = ref()
watch(
    () => addedFiles.value,
    async () => {
        if (addedFiles.value) {
            for (const file of addedFiles.value) {
                excursionStore.selectEditExcursion.images.push((await fromBlob(file, 50, 'auto', 'auto', 'jpeg')))
                console.log(excursionStore.selectEditExcursion.images)
                excursionStore.selectEditExcursion.imagesUrls.push(file != undefined ? URL.createObjectURL(file) : '');
                console.log(excursionStore.selectEditExcursion.imagesUrls)
            }
        }
    }
);

const removeImage = async (index: number, id: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await excursionStore.deleteImage(id)
    if (response.status == 200) {
        toast.success("Изображение удалено")
        excursionStore.selectEditExcursion.images.splice(index, 1)
        excursionStore.selectEditExcursion.imagesUrls.splice(index, 1)
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
