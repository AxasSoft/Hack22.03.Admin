<template>

    <ClientSidebar v-if="clientsStore.selectEditClient" v-model="showSidebar" />

    <VCard class="ma-5 container d-flex flex-column">
        <VProgressLinear v-show="progressShow" style="position: absolute; left: 0; width: 100%;  z-index: 99999;"
            color="var(--main-color)" indeterminate />
        <div class="header d-flex align-center justify-center v-align-center">
            <h2 class="ma-4 mr-auto">Заявки на трансфер</h2>
            <span></span>
        </div>


        <!-- HINT -->
        <div v-if="transferStore.transfers.length <= 0 && showHint" class="hint">
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
                        <td>Тип машины</td>
                        <td>Кол-во пассажиров</td>
                        <td>Опции</td>
                        <td>Комментарий</td>
                    </tr>
                </thead>
                <TransferItem v-for="(transfer) in transferStore.transfers" :key="transfer.id" :transfer
                    @editTransfer="showClientSidebar($event)" />

            </VTable>
            <div class="d-flex position-absolute align-center bottom-0 w-100 flex-end table-head">

                <VPagination class="bg-white ml-auto table-head" v-model="transferStore.transferPage" :total-visible="7"
                    :length="transferStore?.transferPaginator?.total"
                    @update:modelValue=" transferStore.getTransfers()" />
            </div>
        </div>
    </VCard>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import TransferItem from './TransferItem.vue';
import hint from '@/assets/images/CatalogHint@3x.png'
import ClientSidebar from '../Clients/ClientSidebar.vue';
import { useTransferStore } from '@/stores/transferStore';
import { useClientsStore } from '@/stores/clientsStore';
import type { Transfer } from '@/types/Transfer';

const clientsStore = useClientsStore()
const transferStore = useTransferStore()
const showHint = ref(false)
const showSidebar = ref(false)
const progressShow = ref(false)


onMounted(async () => {
    transferStore.transferPage = 1
    await transferStore.getTransfers()

    showHint.value = true
});

const showClientSidebar = async (transfer: Transfer) => {
    // productsStore.selectEditProduct = JSON.parse(JSON.stringify(product)) as typeof product;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await clientsStore.getOneClient(transfer.userId || 0)
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