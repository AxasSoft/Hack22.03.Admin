<template>

    <CategorySidebar v-if="categoriesStore.selectEditExcursionCategory" v-model="showSidebar" />
    <AddCategorySidebar v-model="showAddSidebar" />
    <VCard class="ma-5 container d-flex flex-column">
        <VProgressLinear v-show="progressShow" style="position: absolute; left: 0; width: 100%;  z-index: 99999;"
            color="var(--main-color)" indeterminate />
        <div class="header d-flex align-center justify-center v-align-center">
            <div class="mt-4 ml-4 mr-auto pb-2" style="width: 30%;">
                <h2 class="ma-4">Категории экскурсий</h2>
            </div>

            <VBtn class="ml-auto mt-2 mr-4 mb-4 black-button" width="auto" append-icon="mdi-plus" @click="addCategory">
                Создать
            </VBtn>
        </div>


        <!-- HINT -->
        <div v-if="categoriesStore.excursionCategoriesWithSubcategories.length <= 0 && showHint" class="hint">
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
                    <td width="10%">Обложка</td>
                    <td width="300px">Название</td>
                    <td>Описание</td>
                </tr>
            </thead>
            <CategoryItem v-for="(category) in categoriesStore.excursionCategoriesWithSubcategories" :key="category.id"
                :category @editCategory="showCategorySidebar($event)" />
        </VTable>
    </VCard>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import CategorySidebar from './ExcursionCategorySidebar.vue';
import AddCategorySidebar from './AddExcursionCategorySidebar.vue';
import CategoryItem from './ExcursionCategoryItem.vue';
import hint from '@/assets/images/CatalogHint@3x.png'
import type { Category } from '@/types/Category';
import { useExcursionCategoriesStore } from '@/stores/excursionCategoriesStore';

const categoriesStore = useExcursionCategoriesStore()
const showHint = ref(false)
const showSidebar = ref(false)
const showAddSidebar = ref(false)
const progressShow = ref(false)


onMounted(async () => {
    progressShow.value = true
    await categoriesStore.getExcursionCategoriesWithSubcategories()
    progressShow.value = false
    showHint.value = true
});

const addCategory = () => {
    showAddSidebar.value = true
}

const showCategorySidebar = async (category: Category) => {
    progressShow.value = true
    categoriesStore.selectEditExcursionCategory = JSON.parse(JSON.stringify(category)) as typeof category;
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
</style>