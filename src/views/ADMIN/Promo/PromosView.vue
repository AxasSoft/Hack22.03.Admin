<template>

    <PromoSidebar v-if="promosStore.selectEditPromo" v-model="showSidebar" />
    <AddPromoSidebar v-model="showAddSidebar" />
    <InfoSidebar v-if="infoStore.selectEditInfo" v-model="showArticleSidebar" />

    <VCard class="ma-5 container d-flex flex-column">
        <VProgressLinear v-show="progressShow" style="position: absolute; left: 0; width: 100%;  z-index: 99999;"
            color="var(--main-color)" indeterminate />
        <div class="header d-flex align-center justify-center v-align-center">
            <h2 class="ma-4">Реклама</h2>

            <VBtn class="ml-auto mt-2 mr-4 mb-4 black-button" width="auto" append-icon="mdi-plus" @click="addPromo">
                Создать
            </VBtn>
        </div>


        <!-- HINT -->
        <div v-if="promosStore.promosFiltered.length <= 0 && showHint" class="hint">
            <VImg :src="hint" width="240px" height="240px" />
            <h2>Здесь пока пусто</h2>
            <p>Добавьте новый баннер</p>
            <VBtn class="black-button mt-8" @click="addPromo">Создать</VBtn>
        </div>

        <!-- MARK: TABLE -->
        <div v-else>

            <!-- BANNERS -->
            <VTable class="pb-12 mb-5" fixed-header style="height:calc(100vh - 184px) !important">
                <thead class="table-head">
                    <tr>
                        <td width="180px">Обложка</td>
                        <td>Тип</td>
                        <td>Дата создания</td>
                    </tr>
                </thead>
                <PromoItem v-for="(promo) in promosStore.promos" :key="promo.id" :promo
                    @editPromo="showPromoSidebar($event)" />
            </VTable>

            <div class="d-flex position-absolute bottom-0 w-100 flex-end table-head">
                <VPagination class="bg-white ml-auto table-head" v-model="promosStore.promosPage" :total-visible="7"
                    :length="promosStore?.promosPaginator?.total" @update:modelValue=" promosStore.getPromos()" />
            </div>
        </div>
    </VCard>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import hint from '@/assets/images/CatalogHint@3x.png'
import { useAppStore } from '@/stores/appStore';
import { useToast } from 'vue-toastification';
import { usePromosStore } from '@/stores/promoStore';
import type { Promo } from '@/types/Promo';
import PromoSidebar from './PromoSidebar.vue';
import PromoItem from './PromoItem.vue';
import AddPromoSidebar from './AddPromoSidebar.vue';
import { useInfoStore } from '@/stores/infoStore';
import { useCategoriesStore } from '@/stores/categoriesStore';
import { useAdsStore } from '@/stores/adStore';
import InfoSidebar from '../Info/InfoSidebar.vue';

const promosStore = usePromosStore()
const adStore = useAdsStore()
const categoriesStore = useCategoriesStore()
const infoStore = useInfoStore()
const appStore = useAppStore()
const toast = useToast()
const showHint = ref(false)
const showSidebar = ref(false)
const showAddSidebar = ref(false)
const showArticleSidebar = ref(false)
const progressShow = ref(false)

// SEARCH
const search = ref('')
watch(
    () => search.value,
    async () => {
        if (search.value.length > 1) {
            promosStore.promosPage = 1
            promosStore.search = search.value
            await promosStore.getPromos()
        }

        if (search.value.length == 0) {
            promosStore.promosPage = 1
            promosStore.search = ''
            await promosStore.getPromos()
        }
    })


onMounted(async () => {
    progressShow.value = true
    await promosStore.getPromos()
    await adStore.getAds()
    await categoriesStore.getCategoriesWithSubcategories()
    await infoStore.getInfos()
    progressShow.value = false
    showHint.value = true
});

const addPromo = () => {
    if (appStore.selectApp?.id) {
        showAddSidebar.value = true
    } else {
        toast.error('Для создания баннера выберите существующий магазин или создайте новый')
    }
}

const showPromoSidebar = async (promo: Promo) => {


    promosStore.selectEditPromo = JSON.parse(JSON.stringify(promo)) as typeof promo;
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