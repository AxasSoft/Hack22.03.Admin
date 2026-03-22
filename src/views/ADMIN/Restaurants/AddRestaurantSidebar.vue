<template>
    <Sidebar class="sidebar w-50 pb-4" v-model:visible="show" position="right">
        <div class="sidebar-header py-4 px-8 fixed ">
            <VBtn class="sidebar-close" @click="show = false" width="32px" height="32px">
                <VIcon icon="mdi-close" />
            </VBtn>
            <h2 class="sidebar-header-title">Создание ресторана</h2>
        </div>
        <VProgressLinear v-show="progressShow" style="position: absolute; width: 100%; top: 68px; z-index: 99999;"
            color="var(--main-color)" indeterminate />
        <div class="pa-4 d-flex flex-column sidebar-content pb-12">
            <div class="mb-12" style="padding-bottom: 58px;">
                <p class="text-body-2">Название*</p>
                <VTextField variant="plain" v-model="restaurantStore.newRestaurant.name" autocomplete="off"
                    class="custom-tf mt-1 pa-0" />

                <p class="text-body-2">Описание*</p>
                <VTextarea variant="plain" v-model="restaurantStore.newRestaurant.description"
                    class="mt-1 pa-0 custom-textarea" />

                <div class="d-flex flex-column mt-2">
                    <div class="d-flex w-100">
                        <div class=" d-flex flex-column" style="width: calc(50% - 10px)">
                            <div class=" d-flex align-center">
                                <p class="text-body-2">График работы в будние дни*</p>

                            </div>

                            <VTextField variant="plain" v-model="restaurantStore.newRestaurant.workHoursWeekdays"
                                autocomplete="off" class="custom-tf mt-1 pa-0" />
                        </div>
                        <div class="flex-grow-1 ml-4 pa-0">
                            <p class="text-body-2 mt-1">График работы в выходные дни*</p>
                            <VTextField variant="plain" v-model="restaurantStore.newRestaurant.workHoursWeekends"
                                autocomplete="off" class="custom-tf mt-1 pa-0" />
                        </div>
                    </div>


                    <div class="d-flex w-100">
                        <div class="w-50 pa-0">
                            <p class="text-body-2 mt-1">Минимальный чек</p>
                            <VTextField variant="plain" v-model="restaurantStore.newRestaurant.minPrice"
                                autocomplete="off" class="custom-tf mt-1 pa-0" append-inner-icon="mdi-currency-rub"
                                type="number" />
                        </div>
                        <div class="w-50 ml-4 pa-0">
                            <p class="text-body-2 mt-1">Максимальный чек</p>
                            <VTextField variant="plain" v-model="restaurantStore.newRestaurant.maxPrice"
                                autocomplete="off" class="custom-tf mt-1 pa-0" append-inner-icon="mdi-currency-rub"
                                type="number" />
                        </div>
                        <div class="w-50 ml-4 pa-0">
                            <p class="text-body-2 mt-1">Средний чек*</p>
                            <VTextField variant="plain" v-model="restaurantStore.newRestaurant.avgCheck"
                                autocomplete="off" class="custom-tf mt-1 pa-0" append-inner-icon="mdi-currency-rub"
                                type="number" />
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
						" @keydown.enter.prevent="location = null; setLocatoin(null)" autocomplete="off" placeholder="Адрес"
                        @set="setLocatoin($event)" />
                </div>

                <!-- PRODUCT ATTRIBUTE  -->
                <VCheckboxBtn class=" text-body-2" v-model="restaurantStore.newRestaurant.delivery"
                    label="Есть доставка" />


                <p class="mt-2 text-body-2">Изображения ресторана*</p>
                <VFileInput v-model="addedFiles" class="d-none" ref="fileInput" variant="solo" :clearable="false"
                    hide-details prepend-icon="null" flat accept="image/jpeg, image/png, image/jpg" :multiple="true" />

                <VContainer class="pa-1 px-2 mt-2">
                    <VItemGroup>
                        <VRow>
                            <VCol v-for="(image, index) in restaurantStore.newRestaurant.imagesUrls" :key="image"
                                cols="12" md="3" class="pa-1 rounded">
                                <VItem class="pa-0 rounded">
                                    <VImg :class="{ thumbnail_image: image == thumbnail }" :src="image"
                                        class="pa-0 upload-image " height="140" width="140" cover>
                                        <VIcon icon="mdi-close-circle position-absolute right-0"
                                            @click.stop="removeImage(index)" />
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
                <VBtn prepend-icon="mdi-check" class="black-button" @click="createRestaurant">
                    Сохранить
                </VBtn>

            </div>

        </div>

    </Sidebar>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import Sidebar from 'primevue/sidebar';
import { useToast } from 'vue-toastification';
import placeholder from "@/assets/images/Placeholder.png"
import { useRestaurantsStore } from '@/stores/restaurantStore';
import { fromBlob } from 'image-resize-compress';
import { GoogleAutocomplete } from 'vue3-google-autocomplete';


const restaurantStore = useRestaurantsStore()
const toast = useToast()
const progressShow = ref(false)
const thumbnail = ref()
const show = defineModel<boolean>()


const location = ref()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setLocatoin = (newLocatoin: any) => {
    console.log(newLocatoin)
    restaurantStore.newRestaurant.address = ''
    restaurantStore.newRestaurant.address += newLocatoin?.country ? newLocatoin?.country : ''
    restaurantStore.newRestaurant.address += newLocatoin?.state ? ', ' + newLocatoin?.state : ''
    restaurantStore.newRestaurant.address += newLocatoin?.city ? ', ' + newLocatoin?.city : ''
    restaurantStore.newRestaurant.address += newLocatoin?.name ? ', ' + newLocatoin?.name : ''
    restaurantStore.newRestaurant.latitude = newLocatoin?.latitude
    restaurantStore.newRestaurant.longitude = newLocatoin?.longitude
}


const fileInput = ref<HTMLInputElement>();
const addedFiles = ref()
watch(
    () => addedFiles.value,
    async () => {
        if (addedFiles.value) {
            for (const file of addedFiles.value) {
                restaurantStore.newRestaurant.images.push((await fromBlob(file, 50, 'auto', 'auto', 'jpeg')))
                console.log(restaurantStore.newRestaurant.images)
                restaurantStore.newRestaurant.imagesUrls.push(file != undefined ? URL.createObjectURL(file) : '');
                console.log(restaurantStore.newRestaurant.imagesUrls)
            }
        }
    }
);

const removeImage = (index: number) => {
    restaurantStore.newRestaurant.images.splice(index, 1)
    restaurantStore.newRestaurant.imagesUrls.splice(index, 1)
}

async function createRestaurant() {

    if (!((restaurantStore.newRestaurant.name ? restaurantStore.newRestaurant.name : '').trim())) {
        toast.error("Укажите название ресторана")
        return
    }

    if (!((restaurantStore.newRestaurant.description ? restaurantStore.newRestaurant.description : '').trim())) {
        toast.error("Укажите описание ресторана")
        return
    }


    if (!((restaurantStore.newRestaurant.avgCheck ? restaurantStore.newRestaurant.avgCheck : '').trim())) {
        toast.error("Укажите средний чек")
        return
    }

    if (restaurantStore.newRestaurant?.images.length == 0) {
        toast.error("Добавьте картинки ресторана")
        return
    }


    progressShow.value = true
    // CREATE PRODUCT
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await restaurantStore.createNewRestaurant()
    if (response.status === 200) {



        progressShow.value = false
        toast.success("Ресторан успешно создан")
        show.value = false
    } else {
        progressShow.value = false
        toast.error(response.response.data.description);
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
