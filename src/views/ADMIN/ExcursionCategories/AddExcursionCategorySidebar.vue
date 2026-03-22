<template>
    <Sidebar class="sidebar w-50" v-model:visible="show" position="right">
        <div class="sidebar-header py-4 px-8 fixed ">
            <VBtn class="sidebar-close" @click="show = false" width="32px" height="32px">
                <VIcon icon="mdi-close" />
            </VBtn>
            <h2 class="sidebar-header-title"> Новая категория</h2>
        </div>
        <VProgressLinear v-show="progressShow" style="position: absolute; width: 100%; top: 68px; z-index: 99999;"
            color="var(--main-color)" indeterminate />
        <div class="pa-4 d-flex flex-column sidebar-content">
            <div class="mb-4" style="padding-bottom: 58px;">
                <p class="text-body-2">Название*</p>
                <VTextField variant="plain" v-model="categoriesStore.newExcursionCategory.name" autocomplete="off"
                    class="custom-tf mt-1 pa-0" />

                <p class="text-body-2">Описание*</p>
                <VTextarea variant="plain" v-model="categoriesStore.newExcursionCategory.description"
                    class="mt-1 pa-0 custom-textarea" />

                <p class="mt-2 text-body-2">Обложка категории*</p>
                <VFileInput v-model="addedFiles" class="d-none" ref="fileInput" variant="solo" :clearable="false"
                    hide-details prepend-icon="null" flat accept="image/jpeg, image/png, image/jpg" />
                <VImg @click="($refs.fileInput as HTMLInputElement)?.click()" class="mt-2 upload-image" :src="thumbnail"
                    cover />
            </div>



            <div class="d-flex position-absolute bottom-0 py-2 bg-white w-100">
                <VBtn prepend-icon="mdi-check" class="black-button" @click="createCategory">
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
import { fromBlob } from 'image-resize-compress';
import { useExcursionCategoriesStore } from '@/stores/excursionCategoriesStore';


const categoriesStore = useExcursionCategoriesStore()
const toast = useToast()
const progressShow = ref(false)



const thumbnail = ref(categoriesStore.newExcursionCategory?.backgroundImage?.url ? categoriesStore.newExcursionCategory?.backgroundImage?.url : placeholder)
const show = defineModel<boolean>()

const fileInput = ref<HTMLInputElement>();
const addedFiles = ref()
watch(
    () => addedFiles.value,
    async () => {
        if (addedFiles.value) {
            categoriesStore.newExcursionCategory.backgroundImage.file = (await fromBlob(addedFiles.value, 50, 'auto', 'auto', 'jpeg'))
            categoriesStore.newExcursionCategory.backgroundImage.url = categoriesStore.newExcursionCategory.backgroundImage.file != undefined ? URL.createObjectURL(categoriesStore.newExcursionCategory.backgroundImage.file) : '';
            thumbnail.value = categoriesStore.newExcursionCategory.backgroundImage.url
            categoriesStore.newExcursionCategory.backgroundImage.isChanged = true;
        }
    }
);

async function createCategory() {

    if (!((categoriesStore.newExcursionCategory.name ? categoriesStore.newExcursionCategory.name : '').trim())) {
        toast.error("Укажите название категории")
        return
    }

    if (!((categoriesStore.newExcursionCategory.description ? categoriesStore.newExcursionCategory.description : '').trim())) {
        toast.error("Укажите описание категории")
        return
    }

    if (categoriesStore.newExcursionCategory?.backgroundImage?.file == undefined || categoriesStore.newExcursionCategory?.backgroundImage?.file == null) {
        toast.error("Добавьте обложку категории")
        return
    }

    progressShow.value = true
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await categoriesStore.createNewExcursionCategory()
    if (response.status === 200) {
        progressShow.value = false
        toast.success("Категория успешно создана")
        show.value = false
    } else {
        progressShow.value = false
        toast.error(response.response.data.description);
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
    width: 120px;
    height: 120px;
    border-radius: 8px;
    background-color: black;
}
</style>