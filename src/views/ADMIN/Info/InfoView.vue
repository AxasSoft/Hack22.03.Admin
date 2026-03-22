<template>

    <InfoSidebar v-if="infoStore.selectEditInfo" v-model="showSidebar" />
    <AddInfoSidebar v-model="showAddSidebar" />

    <VCard class="ma-5 container d-flex flex-column">
        <VProgressLinear v-show="progressShow" style="position: absolute; left: 0; width: 100%;  z-index: 99999;"
            color="var(--main-color)" indeterminate />
        <div class="header d-flex align-center justify-center v-align-center">
            <h2 class="ma-4">Информация</h2>
            <VBtn class="ml-auto mt-5 mr-4 mb-7 black-button" width="auto" append-icon="mdi-plus" @click="addInfo">
                Создать
            </VBtn>
        </div>


        <!-- HINT -->
        <div v-if="infoStore.infos.length <= 0 && showHint" class="hint">
            <VImg :src="hint" width="240px" height="240px" />
            <h2>Здесь пока пусто</h2>
            <p>Добавьте новую статью</p>
            <VBtn class="black-button mt-8" @click="addInfo">Создать</VBtn>
        </div>

        <!-- MARK: TABLE -->
        <div v-else>


            <VTable class="pb-12 mb-5" fixed-header style="height:calc(100vh - 224px) !important">
                <thead class="table-head">
                    <tr>
                        <td>Обложка</td>
                        <td>Заголовок</td>
                        <td>Текст</td>
                        <td>Катeгория</td>
                        <td>Дата создания</td>
                    </tr>
                </thead>
                <InfoItem v-for="(info) in infoStore.infos" :key="info.id" :info @editInfo="showInfoSidebar($event)" />

            </VTable>
            <div class="d-flex position-absolute align-center bottom-0 w-100 flex-end table-head">

                <VPagination class="bg-white ml-auto table-head" v-model="infoStore.infoPage" :total-visible="7"
                    :length="infoStore?.infoPaginator?.total" @update:modelValue=" infoStore.getInfos()" />
            </div>
        </div>
    </VCard>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AddInfoSidebar from './AddInfoSidebar.vue';
import InfoItem from './InfoItem.vue';
import hint from '@/assets/images/CatalogHint@3x.png'
import type { FAQ } from '@/types/FAQ';
import InfoSidebar from './InfoSidebar.vue';
import { useInfoStore } from '@/stores/infoStore';

const infoStore = useInfoStore()
const showHint = ref(false)
const showAddSidebar = ref(false)
const showSidebar = ref(false)
const progressShow = ref(false)


onMounted(async () => {
    infoStore.infoPage = 1
    await infoStore.getInfos()

    showHint.value = true
});

const addInfo = () => {
    showAddSidebar.value = true
}

const showInfoSidebar = async (faq: FAQ) => {
    infoStore.selectEditInfo = faq
    showSidebar.value = true
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