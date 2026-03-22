<template>

    <ClientSidebar v-if="clientsStore.selectEditClient" v-model="showSidebar" />

    <VCard class="ma-5 container d-flex flex-column">
        <VProgressLinear v-show="progressShow" style="position: absolute; left: 0; width: 100%;  z-index: 99999;"
            color="var(--main-color)" indeterminate />
        <div class="header d-flex align-center justify-center v-align-center">
            <h2 class="ma-4 mr-auto">Бронирование снегоходов</h2>
            <span></span>
        </div>


        <!-- HINT -->
        <div v-if="snowmobileStore.snowmobiles.length <= 0 && showHint" class="hint">
            <VImg :src="hint" width="240px" height="240px" />
            <h2>Здесь пока пусто</h2>
        </div>

        <!-- MARK: TABLE -->
        <div v-else>


            <VTable class="pb-12 mb-5" fixed-header style="height:calc(100vh - 224px) !important">
                <thead class="table-head">
                    <tr>
                        <td>Пользователь</td>
                        <td>Телефон</td>
                        <td>Дата создания</td>
                        <td>Начало</td>
                        <td>Окончание</td>
                        <td>Кол-во снегоходов</td>
                        <td>Комментарий</td>
                    </tr>
                </thead>
                <SnowmobileItem v-for="(snowmobile) in snowmobileStore.snowmobiles" :key="snowmobile.id" :snowmobile
                    @editSnowmobile="showClientSidebar($event)" />

            </VTable>
            <div class="d-flex position-absolute align-center bottom-0 w-100 flex-end table-head">

                <VPagination class="bg-white ml-auto table-head" v-model="snowmobileStore.snowmobilePage"
                    :total-visible="7" :length="snowmobileStore?.snowmobilePaginator?.total"
                    @update:modelValue=" snowmobileStore.getSnowmobiles()" />
            </div>
        </div>
    </VCard>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import SnowmobileItem from './SnowmobileItem.vue';
import hint from '@/assets/images/CatalogHint@3x.png'
import ClientSidebar from '../Clients/ClientSidebar.vue';
import { useSnowmobileStore } from '@/stores/snowmobileStore';
import { useClientsStore } from '@/stores/clientsStore';
import type { Snowmobile } from '@/types/Snowmobile';

const clientsStore = useClientsStore()
const snowmobileStore = useSnowmobileStore()
const showHint = ref(false)
const showSidebar = ref(false)
const progressShow = ref(false)


onMounted(async () => {
    snowmobileStore.snowmobilePage = 1
    await snowmobileStore.getSnowmobiles()

    showHint.value = true
});

const showClientSidebar = async (snowmobile: Snowmobile) => {
    // productsStore.selectEditProduct = JSON.parse(JSON.stringify(product)) as typeof product;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await clientsStore.getOneClient(snowmobile.userId || 0)
    if (response.status == 200) {
        clientsStore.selectEditClient = response.data.data


        showSidebar.value = true
    } else {
        // toast.error("Не удалось отредактировать категорию")
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
</style>