<template>

    <ExcursionSidebar v-if="excursionStore.selectEditExcursion" v-model="showSidebar" />
    <AddExcursionSidebar v-model="showAddSidebar" />
    <ExcursionFeedbacksSidebar v-model="showFeedbackSidebar" />
    <VCard class="ma-5 container d-flex flex-column">
        <VProgressLinear v-show="progressShow" style="position: absolute; left: 0; width: 100%;  z-index: 99999;"
            color="var(--main-color)" indeterminate />
        <div class="header d-flex align-center justify-center v-align-center">
            <h2 class="ma-4">Экскурсии</h2>

            <VBtn class="ml-auto mt-2 mr-4 mb-4 black-button" width="auto" append-icon="mdi-plus" @click="addExcursion">
                Создать
            </VBtn>
        </div>


        <!-- HINT -->
        <div v-if="excursionStore.excursions.length <= 0 && showHint" class="hint">
            <VImg :src="hint" width="240px" height="240px" />
            <h2>Здесь пока пусто</h2>
            <p>Добавьте новую экскурсию</p>
            <VBtn class="black-button mt-8" @click="addExcursion">Создать</VBtn>
        </div>

        <!-- MARK: TABLE -->
        <div v-else>
            <VTable class="pb-12 mb-5" fixed-header style="height:calc(100vh - 224px) !important">
                <thead class="table-head">
                    <tr>
                        <td width="10%">Обложка</td>
                        <td width="130px">Инфо</td>
                        <td width="200px">Название</td>
                        <td>Описание</td>
                        <td>Адрес</td>
                        <td width="100px"> Ср. чек </td>
                    </tr>
                </thead>
                <ExcursionItem v-for="(excursion) in excursionStore.excursions" :key="excursion.id" :excursion
                    @editExcursion="showExcursionSidebar($event)" @showFeedbacks="showExcursionFeedbacks($event)" />

            </VTable>
            <div class="d-flex position-absolute bottom-0 w-100 flex-end table-head">
                <VPagination class="bg-white ml-auto table-head" v-model="excursionStore.excursionsPage"
                    :total-visible="7" :length="excursionStore?.excursionsPaginator?.total"
                    @update:modelValue=" excursionStore.getExcursions()" />
            </div>
        </div>


    </VCard>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ExcursionSidebar from './ExcursionSidebar.vue';
import AddExcursionSidebar from './AddExcursionSidebar.vue';
import ExcursionItem from './ExcursionItem.vue';
import hint from '@/assets/images/CatalogHint@3x.png'
import { useExcursionsStore } from '@/stores/excursionStore';
import ExcursionFeedbacksSidebar from './ExcursionFeedbacksSidebar.vue';
import type { Excursion } from '@/types/Excursion';
import { useExcursionCategoriesStore } from '@/stores/excursionCategoriesStore';

const excursionStore = useExcursionsStore()
const excursionCategories = useExcursionCategoriesStore()

const showSidebar = ref(false)
const showAddSidebar = ref(false)
const showFeedbackSidebar = ref(false)
const progressShow = ref(false)
const showHint = ref(false)

onMounted(async () => {

    excursionStore.excursionsPage = 1
    await excursionStore.getExcursions()
    await excursionCategories.getExcursionCategoriesWithSubcategories()
    showHint.value = false
});

const addExcursion = () => {
    showAddSidebar.value = true
}

const showExcursionSidebar = async (excursion: Excursion) => {
    excursionStore.selectEditExcursion = JSON.parse(JSON.stringify(excursion)) as typeof excursion;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // const response: any = await excursionStore.getOneExcursion(excursion.id)
    // if (response.status == 200) {
    //     excursionStore.selectEditExcursion = response.data.data
    showSidebar.value = true
    // } else {
    //     // toast.error("Не удалось отредактировать категорию")
    // }

}

const showExcursionFeedbacks = async (excursion: Excursion) => {
    excursionStore.selectFeedbackExcursion = excursion
    showFeedbackSidebar.value = true
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