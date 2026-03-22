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
                <p class="text-body-2">Название</p>
                <VTextField variant="plain" v-model="categoriesStore.newCategory.name" autocomplete="off"
                    class="custom-tf mt-1 pa-0" />


                <VCheckboxBtn class="text-body-2 mt-2" v-model="isSubcategory" label="Это подкатегория" />
                <div v-if="isSubcategory">
                    <p class="mt-2 text-body-2">Выберите родительскую категорию</p>
                    <VSelect v-model="parentCategory" variant="plain" class="custom-tf mt-1 input-select"
                        density="compact" :items="categoriesStore.categoriesWithSubcategories" autocomplete="off">
                        <template v-slot:item="{ props, item }">
                            <VListItem v-bind="props" :title="item?.raw?.name ? item.raw.name : ''" />
                        </template>
                        <template v-slot:selection="{ item }">
                            <VListItem :title="item?.raw?.name ? item.raw.name : ''" />
                        </template>
                    </VSelect>
                </div>
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
import { ref } from 'vue';
import { useCategoriesStore } from '@/stores/categoriesStore';
import Sidebar from 'primevue/sidebar';
import { useToast } from 'vue-toastification';


const categoriesStore = useCategoriesStore()
const toast = useToast()
const isSubcategory = ref(false)
const parentCategory = ref()
const progressShow = ref(false)


const show = defineModel<boolean>()


async function createCategory() {

    if (!((categoriesStore.newCategory.name ? categoriesStore.newCategory.name : '').trim())) {
        toast.error("Укажите название категории")
        return
    }

    if (isSubcategory.value && !parentCategory.value) {
        toast.error("Укажите родительскую категорию")
        return
    }

    categoriesStore.newCategory.parentId = parentCategory?.value?.id ? parentCategory.value.id : null
    progressShow.value = true

    if (isSubcategory.value && parentCategory.value != null) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response: any = await categoriesStore.createNewSubcategory()
        if (response.status === 200) {
            progressShow.value = false
            toast.success("Категория успешно создана")
            show.value = false
        } else {
            progressShow.value = false
            toast.error(response.value.response.data.description);
        }
    } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response: any = await categoriesStore.createNewCategory()
        if (response.status === 200) {
            progressShow.value = false
            toast.success("Категория успешно создана")
            show.value = false
        } else {
            progressShow.value = false
            toast.error(response.value.response.data.description);
        }
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