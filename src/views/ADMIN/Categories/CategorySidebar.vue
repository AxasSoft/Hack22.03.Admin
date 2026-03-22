<template>
    <Sidebar class="sidebar w-50" v-model:visible="show" @show="willAppear" position="right">
        <div class="sidebar-header py-4 px-8 fixed ">
            <VBtn class="sidebar-close" @click="show = false" width="32px" height="32px">
                <VIcon icon="mdi-close" />
            </VBtn>
            <h2 class="sidebar-header-title" style="min-height: 36px;">{{ categoriesStore.selectEditCategory.name }}
            </h2>
        </div>
        <VProgressLinear v-show="progressShow" style="position: absolute; width: 100%; top: 68px; z-index: 99999;"
            color="var(--main-color)" indeterminate />
        <div class="pa-4 d-flex flex-column sidebar-content">
            <div class="mb-4" style="padding-bottom: 58px;">
                <p>Название</p>
                <VTextField variant="plain" v-model="categoriesStore.selectEditCategory.name" autocomplete="off"
                    class="custom-tf mt-1 pa-0" />


                <VCheckboxBtn class="mt-2" v-if="isSubcategory" v-model="isSubcategory" label="Это подкатегория" />
                <div v-if="isSubcategory">
                    <p class="mt-2">Выберите родительскую категорию</p>
                    <VSelect v-model="parentCategory" variant="plain" class="custom-tf mt-1 input-select"
                        density="compact"
                        :items="categoriesStore.categories.filter(category => category.name != categoriesStore.selectEditCategory.name)"
                        item-title='name' item-value="id" autocomplete="off" />
                </div>
            </div>


            <div class="d-flex position-absolute bottom-0 py-2 bg-white w-100">
                <VBtn class="black-button mr-4" @click="editCategory()">
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
                            categoriesStore.selectEditCategory.name
                                }}</b>?
                            Все объявления из этой категории будут удалены без возможности
                            восстановления.
                            <br /> Для удаления введите название категории в поле подтверждения
                        </p>
                        <VTextField class="mt-4" variant="outlined"
                            :placeholder="categoriesStore.selectEditCategory.name ? categoriesStore.selectEditCategory?.name : ''"
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
import { computed, ref } from 'vue';
import Sidebar from 'primevue/sidebar';
import { useToast } from 'vue-toastification';
import { useCategoriesStore } from '@/stores/categoriesStore';

const categoriesStore = useCategoriesStore()
const toast = useToast()
const show = defineModel<boolean>()
const progressShow = ref(false)
const parentCategory = ref()
const isSubcategory = ref(false)

const deleteCategoryDialog = ref(false)
const deleteCategoryName = ref()
const deleteCategoryEnable = computed(() => {
    return deleteCategoryName.value == categoriesStore.selectEditCategory?.name ? false : true
})

const willAppear = async () => {
    isSubcategory.value = false
    parentCategory.value = null

    for (const category of categoriesStore.categoriesWithSubcategories) {
        console.log(category)
        for (const subcategory of category?.subcategories) {
            console.log(subcategory)
            if (subcategory?.name == categoriesStore.selectEditCategory.name) {
                parentCategory.value = category
                isSubcategory.value = true
                return
            }
        }
    }
}

const deleteCategory = async () => {
    progressShow.value = true

    if (isSubcategory.value && parentCategory.value != null) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response: any = await categoriesStore.deleteSubcategory(categoriesStore.selectEditCategory.id)
        if (response.status == 200) {
            toast.success("Категория успешно удалёна")
            categoriesStore.selectEditCategory = null
            deleteCategoryDialog.value = false
            show.value = false
            progressShow.value = false
        } else {
            toast.error(response.response.data.description);
            progressShow.value = false
        }
    } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response: any = await categoriesStore.deleteCategory(categoriesStore.selectEditCategory.id)
        if (response.status == 200) {
            toast.success("Категория успешно удалёна")
            categoriesStore.selectEditCategory = null
            deleteCategoryDialog.value = false
            show.value = false
            progressShow.value = false
        } else {
            toast.error(response.response.data.description);
            progressShow.value = false
        }
    }


}


const editCategory = async () => {

    if (!categoriesStore.selectEditCategory.isSubcategory) {
        categoriesStore.selectEditCategory.parentId = null
    }


    if (!((categoriesStore.selectEditCategory.name ? categoriesStore.selectEditCategory.name : '').trim())) {
        toast.error("Укажите название категории")
        return
    }

    if (categoriesStore.selectEditCategory.isSubcategory && !categoriesStore.selectEditCategory.parentId) {
        toast.error("Укажите родительскую категорию")
        return
    }

    progressShow.value = true
    console.log(parentCategory)

    if (isSubcategory.value && parentCategory.value != null) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response: any = await categoriesStore.updateSubcategory(categoriesStore.selectEditCategory.id, parentCategory.value.id ? parentCategory.value.id : parentCategory.value)
        if (response.status == 200) {
            toast.success("Категория успешно обновлена")
            progressShow.value = false
        } else {
            toast.error("Не удалось обновить данные категории")
            progressShow.value = false
        }
    } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response: any = await categoriesStore.updateCategory(categoriesStore.selectEditCategory.id)
        if (response.status == 200) {
            toast.success("Категория успешно обновлена")
            progressShow.value = false
        } else {
            toast.error("Не удалось обновить данные категории")
            progressShow.value = false
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