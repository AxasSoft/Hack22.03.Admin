<template>

    <AdSidebar v-if="adStore.selectEditAd" v-model="showSidebar" />
    <AddAdSidebar v-model="showAddSidebar" />

    <VCard class="ma-5 container d-flex flex-column">
        <VProgressLinear v-show="progressShow" style="position: absolute; left: 0; width: 100%;  z-index: 99999;"
            color="var(--main-color)" indeterminate />
        <div class="header d-flex align-center justify-center v-align-center">
            <h2 class="ma-4">Объявления</h2>

            <VBtn class="ml-auto mt-2 mr-4 mb-4 black-button" width="auto" append-icon="mdi-plus" @click="addAd">
                Создать
            </VBtn>
        </div>


        <!-- HINT -->
        <div v-if="adStore.ads.length <= 0 && showHint" class="hint">
            <VImg :src="hint" width="240px" height="240px" />
            <h2>Здесь пока пусто</h2>
            <p>Добавьте новое объявление</p>
            <VBtn class="black-button mt-8" @click="addAd">Создать</VBtn>
        </div>

        <!-- MARK: TABLE -->
        <div v-else>


            <VTable class="pb-12 mb-5" fixed-header style="height:calc(100vh - 224px) !important">
                <thead class="table-head">
                    <tr>
                        <td width="10%">Обложка</td>
                        <td width="200px">Пользователь</td>
                        <td width="200px">Название</td>
                        <td>Стоимость</td>
                        <td>Категория</td>
                        <td>Адрес</td>
                        <td>Создано</td>
                    </tr>
                </thead>
                <AdItem v-for="(ad) in adStore.ads" :key="ad.id" :ad @editAd="showAdSidebar($event)"
                    @showFeedbacks="showAdFeedbacks($event)" />

            </VTable>
            <div class="d-flex position-absolute bottom-0 w-100 flex-end table-head">
                <VPagination class="bg-white ml-auto table-head" v-model="adStore.adsPage" :total-visible="7"
                    :length="adStore?.adsPaginator?.total" @update:modelValue=" adStore.getAds()" />
            </div>
        </div>
    </VCard>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AdSidebar from './AdSidebar.vue';
import AddAdSidebar from './AddAdSidebar.vue';
import AdItem from './AdItem.vue';
import hint from '@/assets/images/CatalogHint@3x.png'
import { useAdsStore } from '@/stores/adStore';
import type { Ad } from '@/types/Ad';
import { useCategoriesStore } from '@/stores/categoriesStore';

const adStore = useAdsStore()
const categoriesStore = useCategoriesStore()
const showSidebar = ref(false)
const showAddSidebar = ref(false)
const showFeedbackSidebar = ref(false)
const progressShow = ref(false)
const showHint = ref(false)

onMounted(async () => {
    await categoriesStore.getCategoriesWithSubcategories()
    adStore.adsPage = 1
    await adStore.getAds()
    showHint.value = false
});

const addAd = () => {
    showAddSidebar.value = true
}

const showAdSidebar = async (ad: Ad) => {
    adStore.selectEditAd = ad
    showSidebar.value = true
}

const showAdFeedbacks = async (ad: Ad) => {
    adStore.selectFeedbackAd = ad
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
    height: calc(100% - 40x);
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