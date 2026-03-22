<template>

    <CategorySidebar v-if="categoriesStore.selectEditCategory" v-model="showSidebar" />
    <AddCategorySidebar v-model="showAddSidebar" />

    <VCard class="ma-5 container d-flex flex-column">
        <VProgressLinear v-show="progressShow" style="position: absolute; left: 0; width: 100%;  z-index: 99999;"
            color="var(--main-color)" indeterminate />
        <div class="header d-flex align-center justify-center v-align-center">
            <div class="mt-4 ml-4 mr-auto pb-2" style="width: 30%;">
                <h2 class="ma-4">Категории объявлений</h2>
            </div>

            <VBtn class="ml-auto mt-2 mr-4 mb-4 black-button" width="auto" append-icon="mdi-plus" @click="addCategory">
                Создать
            </VBtn>
        </div>


        <!-- HINT -->
        <div v-if="categoriesStore.categoriesWithSubcategories.length <= 0 && showHint" class="hint">
            <VImg :src="hint" width="240px" height="240px" />
            <h2>Здесь пока пусто</h2>
            <p>Добавьте новую категорию</p>
            <VBtn class="black-button mt-8" @click="addCategory">
                Создать</VBtn>
        </div>

        <!-- MARK: TABLE -->
        <VTable v-else fixed-header style="height:calc(100vh - 224px) !important">
            <thead class="table-head">
                <tr>
                    <td>Название</td>
                    <td width="15%"> Подкатегории </td>
                </tr>
            </thead>
            <CategoryItem v-for="(category) in categoriesStore.categoriesWithSubcategories" :key="category.id" :category
                @editCategory="showCategorySidebar($event)" />
        </VTable>
    </VCard>
</template>

<script setup lang="ts">
// import { VueDraggableNext } from 'vue-draggable-next';
import { onMounted, ref } from 'vue';
import CategorySidebar from './CategorySidebar.vue';
import AddCategorySidebar from './AddCategorySidebar.vue';
import CategoryItem from './CategoryItem.vue';
import hint from '@/assets/images/CatalogHint@3x.png'
import { useCategoriesStore } from '@/stores/categoriesStore';
import type { Category } from '@/types/Category';
const categoriesStore = useCategoriesStore()

const showHint = ref(false)
const showSidebar = ref(false)
const showAddSidebar = ref(false)
const progressShow = ref(false)

onMounted(async () => {
    progressShow.value = true
    // await categoriesStore.getCategories(categoriesStore.categoryPage, false);
    await categoriesStore.getCategoriesWithSubcategories()
    progressShow.value = false
    showHint.value = true
});

const addCategory = () => {
    showAddSidebar.value = true
}

const showCategorySidebar = async (category: Category) => {
    progressShow.value = true
    categoriesStore.selectEditCategory = JSON.parse(JSON.stringify(category)) as typeof category;
    categoriesStore.selectEditCategory.isSubcategory = categoriesStore.selectEditCategory.parentId != null
    showSidebar.value = true
    progressShow.value = false
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
    height: calc(100% - 88px);
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
</style>