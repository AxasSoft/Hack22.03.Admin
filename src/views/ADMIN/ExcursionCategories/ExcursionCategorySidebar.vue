<template>
    <Sidebar class="sidebar w-50" v-model:visible="show" position="right">
        <div class="sidebar-header py-4 px-8 fixed ">
            <VBtn class="sidebar-close" @click="show = false" width="32px" height="32px">
                <VIcon icon="mdi-close" />
            </VBtn>
            <h2 class="sidebar-header-title" style="min-height: 36px;">{{
                categoriesStore.selectEditExcursionCategory.name }}
            </h2>
        </div>
        <VProgressLinear v-show="progressShow" style="position: absolute; width: 100%; top: 68px; z-index: 99999;"
            color="var(--main-color)" indeterminate />
        <div class="pa-4 d-flex flex-column sidebar-content">
            <div class="mb-4" style="padding-bottom: 58px;">
                <p>Название*</p>
                <VTextField variant="plain" v-model="categoriesStore.selectEditExcursionCategory.name"
                    autocomplete="off" class="custom-tf mt-1 pa-0" />

                <p class="text-body-2">Описание*</p>
                <VTextarea variant="plain" v-model="categoriesStore.selectEditExcursionCategory.description"
                    class="mt-1 pa-0 custom-textarea" />

                <p class="mt-2">Обложка категории*</p>
                <VFileInput v-model="addedFiles" class="d-none" ref="fileInput" variant="solo" :clearable="false"
                    hide-details prepend-icon="null" flat accept="image/jpeg, image/png, image/jpg" />
                <VImg @click="($refs.fileInput as HTMLInputElement)?.click()" class="mt-2 upload-image"
                    :src="categoriesStore.selectEditExcursionCategory.backgroundImage" cover />
            </div>


            <div class="d-flex position-absolute bottom-0 py-2 bg-white w-100">
                <VBtn class="black-button mr-4" @click="updateThumbnailAndEditCategory">
                    Изменить
                </VBtn>

                <!-- DELETE DIALOG -->
                <VDialog v-model="deleteCategoryDialog" max-width="400" persistent>
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

                        <p class="mt-4 text-body-2">Вы действительно хотите удалить категорию <b>{{
                            categoriesStore.selectEditExcursionCategory.name
                                }}</b>?
                            Все экскурсии из этой категории будут удалены без возможности
                            восстановления.
                            <br /> Для удаления введите название категории в поле подтверждения
                        </p>
                        <VTextField class="mt-4" variant="outlined"
                            :placeholder="categoriesStore.selectEditExcursionCategory.name ? categoriesStore.selectEditExcursionCategory?.name : ''"
                            v-model="deleteCategoryName">
                        </VTextField>
                        <template v-slot:actions>
                            <VBtn @click=" deleteCategoryDialog = false">
                                Отмена
                            </VBtn>


                            <VBtn class="text-red" :disabled="deleteCategoryEnable" @click="deleteCategory">
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
import { computed, ref, watch } from 'vue';
import Sidebar from 'primevue/sidebar';
import { useToast } from 'vue-toastification';
import placeholder from '@/assets/images/Placeholder.png'
import { fromBlob } from 'image-resize-compress';
import { useExcursionCategoriesStore } from '@/stores/excursionCategoriesStore';

const categoriesStore = useExcursionCategoriesStore()
const toast = useToast()
const show = defineModel<boolean>()
const progressShow = ref(false)


const deleteCategoryDialog = ref(false)
const deleteCategoryName = ref()
const deleteCategoryEnable = computed(() => {
    return deleteCategoryName.value == categoriesStore.selectEditExcursionCategory?.name ? false : true
})


const deleteCategory = async () => {
    progressShow.value = true
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await categoriesStore.deleteExcursionCategory(categoriesStore.selectEditExcursionCategory.id)
    if (response.status == 200) {
        toast.success("Категория успешно удалёна")
        categoriesStore.selectEditExcursionCategory = null
        deleteCategoryDialog.value = false
        show.value = false
        progressShow.value = false
    } else {
        toast.error(response.response.data.description);
        progressShow.value = false
    }
}


const thumbnail = ref(categoriesStore.selectEditExcursionCategory?.thumbnail ? categoriesStore.selectEditExcursionCategory?.thumbnail : placeholder)
const newThumbnailFile = ref<Blob | null>(null)
const fileInput = ref<HTMLInputElement>();
const addedFiles = ref()
watch(
    () => addedFiles.value,
    async () => {
        if (addedFiles.value) {
            newThumbnailFile.value = (await fromBlob(addedFiles.value, 50, 'auto', 'auto', 'jpeg'))
            categoriesStore.selectEditExcursionCategory.backgroundImage = newThumbnailFile.value != undefined ? URL.createObjectURL(newThumbnailFile.value) : '';
            thumbnail.value = categoriesStore.selectEditExcursionCategory.backgroundImage
        }
    }
);


const updateThumbnailAndEditCategory = async () => {
    progressShow.value = true
    if (newThumbnailFile.value != null) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response: any = await categoriesStore.updateExcursionCategoryThumbnail(categoriesStore.selectEditExcursionCategory.id, newThumbnailFile.value)
        if (response.status == 200) {
            editCategory()
            progressShow.value = false
        } else {
            toast.error("Не удалось обновить изображение категории")
            progressShow.value = false
        }
    } else {
        editCategory()
    }
}

const editCategory = async () => {

    if (!categoriesStore.selectEditExcursionCategory.isSubcategory) {
        categoriesStore.selectEditExcursionCategory.parentId = null
    }


    if (!((categoriesStore.selectEditExcursionCategory.name ? categoriesStore.selectEditExcursionCategory.name : '').trim())) {
        toast.error("Укажите название категории")
        return
    }

    if (!((categoriesStore.selectEditExcursionCategory.description ? categoriesStore.selectEditExcursionCategory.description : '').trim())) {
        toast.error("Укажите описание категории")
        return
    }

    progressShow.value = true

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await categoriesStore.updateExcursionCategory(categoriesStore.selectEditExcursionCategory.id)
    if (response.status == 200) {
        toast.success("Категория успешно обновлена")
        progressShow.value = false
    } else {
        toast.error("Не удалось обновить данные категории")
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
    width: 120px;
    height: 120px;
    border-radius: 8px;
    background-color: black;
}
</style>