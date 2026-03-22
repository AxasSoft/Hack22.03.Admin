<template>
    <ClientSidebar v-if="clientsStore.selectEditClient" v-model="showSidebar" />
    <AddClientSidebar v-model="showAddSidebar" />

    <VCard class="ma-5 container d-flex flex-column">
        <VProgressLinear v-show="progressShow" style="position: absolute; left: 0; width: 100%;  z-index: 99999;"
            color="var(--main-color)" indeterminate />
        <div class="header d-flex align-center justify-center v-align-center">
            <div class="mt-4 ml-4 mr-auto pb-2" style="width: 30%;">
                <VTextField class="small-custom-tf" v-model="search" style="max-width: 100%;" variant="plain"
                    density="compact" label="Поиск" autocomplete="off" />
            </div>


            <VBtn class="ml-auto mt-2 mr-4 mb-4 black-button" width="auto" append-icon="mdi-plus" @click="addClient">
                Создать
            </VBtn>
        </div>


        <!-- HINT -->
        <div v-if="clientsStore.clients.length <= 0 && showHint" class="hint">
            <VImg :src="hint" width="240px" height="240px" />
            <h2>Здесь пока пусто</h2>
            <p>Вы можете добавить нового клиента самостоятельно</p>
            <VBtn class="black-button mt-8" @click="addClient">Создать</VBtn>
        </div>

        <!-- MARK: TABLE -->
        <div v-else>


            <VTable class="pb-12 mb-5" fixed-header style="height:calc(100vh - 224px) !important">
                <thead class="table-head">
                    <tr>
                        <td width="10%"></td>
                        <td>Имя</td>
                        <td>Телефон</td>
                        <td>E-mail</td>
                        <td>Город/Адрес</td>
                        <td>Последний визит</td>
                        <td>Профессия</td>
                        <td>Статус</td>
                    </tr>
                </thead>
                <ClientItem v-for="(client) in clientsStore.clients" :key="client.id" :client
                    @editClient="showClientSidebar($event)" />

            </VTable>
            <div class="d-flex position-absolute bottom-0 w-100 flex-end table-head">
                <VPagination class="bg-white ml-auto table-head" v-model="clientsStore.clientsPage" :total-visible="7"
                    :length="clientsStore?.clientsPaginator?.total" @update:modelValue="clientsStore.getClients()" />
            </div>
        </div>
    </VCard>

</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import ClientSidebar from './ClientSidebar.vue';
import AddClientSidebar from './AddClientSidebar.vue';
import ClientItem from './ClientItem.vue';
import hint from '@/assets/images/CatalogHint@3x.png'
import { useToast } from 'vue-toastification';
import { useClientsStore } from '@/stores/clientsStore';
import type { Profile } from '@/types/Profile';


const clientsStore = useClientsStore()
const toast = useToast()

const showSidebar = ref(false)
const showAddSidebar = ref(false)
const progressShow = ref(false)
const showHint = ref(false)

// SEARCH
const search = ref('')
watch(
    () => search.value,
    async () => {
        if (search.value.length > 1) {
            clientsStore.clientsPage = 1
            clientsStore.search = search.value
            await clientsStore.getClients()
        }

        if (search.value.length == 0) {
            clientsStore.clientsPage = 1
            clientsStore.search = ''
            await clientsStore.getClients()
        }
    })


// CHANGE TAB
const tab = ref('all')

watch(
    () => tab.value,
    async () => {
        showHint.value = false
        progressShow.value = true
        if (tab.value == 'all') {
            clientsStore.clients = []
            clientsStore.clientsPage = 1
            clientsStore.onlyActiveClients = null
            clientsStore.search = search.value
            await clientsStore.getClients()
        } else if (tab.value == 'active') {
            clientsStore.clients = []
            clientsStore.clientsPage = 1
            clientsStore.onlyActiveClients = true
            clientsStore.search = search.value
            await clientsStore.getClients()
        } else if (tab.value == 'inactive') {
            clientsStore.clients = []
            clientsStore.clientsPage = 1
            clientsStore.onlyActiveClients = false
            clientsStore.search = search.value
            await clientsStore.getClients()
        }
        progressShow.value = false
        showHint.value = true
    })

onMounted(async () => {
    progressShow.value = true
    clientsStore.search = ''
    clientsStore.clientsPage = 1

    await clientsStore.getClients()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    showHint.value = true
    progressShow.value = false
});

const addClient = () => {
    showAddSidebar.value = true
}

const showClientSidebar = async (client: Profile) => {
    // productsStore.selectEditProduct = JSON.parse(JSON.stringify(product)) as typeof product;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await clientsStore.getOneClient(client.id)
    if (response.status == 200) {
        clientsStore.selectEditClient = response.data.data


        showSidebar.value = true
    } else {
        // toast.error("Не удалось отредактировать категорию")
    }
}

</script>

<style>
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