<template>

    <ComplaintStorySidebar v-if="complaintStore.selectEditComplaint" v-model="showStorySidebar" />
    <ComplaintUserSidebar v-if="complaintStore.selectEditComplaint" v-model="showUserSidebar" />

    <VTabs v-model="tab" class="w-100 bg-clear ma-5 mb-0">
        <VTab selected-class="selected-item" base-color="var(--gray-text)" value="story">На истории</VTab>
        <VTab selected-class="selected-item" base-color="var(--gray-text)" value="user">На пользователей</VTab>
    </VTabs>

    <VCard class="ml-5 container d-flex flex-column">
        <VProgressLinear v-show="progressShow" style="position: absolute; left: 0; width: 100%;  z-index: 99999;"
            color="var(--main-color)" indeterminate />
        <div class="header d-flex align-center justify-center v-align-center">
            <h2 class="ma-4 mr-auto" v-if="tab == 'user'">Жалобы на пользователей</h2>
            <h2 class="ma-4 mr-auto" v-else>Жалобы на истории</h2>
            <p></p>
        </div>


        <!-- HINT -->
        <div v-if="complaintStore?.complaintsUser?.length <= 0 && showHint && tab == 'user'" class="hint">
            <VImg :src="hint" width="240px" height="240px" />
            <h2>Здесь пока пусто</h2>
        </div>




        <!-- MARK: TABLE -->
        <div v-else-if="complaintStore?.complaintsUser?.length > 0 && showHint && tab == 'user'">
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
                <ComplaintItem v-for="(complaint) in complaintStore.complaintsUser" :key="complaint.id" :complaint
                    @editComplaint="showComplaintUserSidebar($event)" />
            </VTable>


            <div class="d-flex position-absolute align-center bottom-0 w-100 flex-end table-head">

                <VPagination class="bg-white ml-auto table-head" v-model="complaintStore.complaintPage"
                    :total-visible="7" :length="complaintStore?.complaintPaginator?.total"
                    @update:modelValue=" complaintStore.getUsersComplaints()" />
            </div>
        </div>


        <div v-if="complaintStore?.complaintsStories?.length <= 0 && showHint && tab == 'story'" class="hint">
            <VImg :src="hint" width="240px" height="240px" />
            <h2>Здесь пока пусто</h2>
        </div>

        <div v-else-if="complaintStore?.complaintsStories?.length > 0 && showHint && tab == 'story'">
            <VTable class="pb-12 mb-5" fixed-header style="height:calc(100vh - 224px) !important">
                <thead class="table-head">
                    <tr>
                        <td>От</td>
                        <td>На</td>
                        <td>Катeгория</td>
                        <td>Текст</td>
                        <td>Дата создания</td>
                        <td>Статус</td>
                    </tr>
                </thead>
                <ComplaintItem v-for="(complaint) in complaintStore.complaintsStories" :key="complaint.id" :complaint
                    @editComplaint="showComplaintStorySidebar($event)" />
            </VTable>
        </div>
    </VCard>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ComplaintItem from './ComplaintsStoryItem.vue';
import hint from '@/assets/images/CatalogHint@3x.png'
import ComplaintStorySidebar from './ComplaintsStorySidebar.vue';
import { useComplaintStore } from '@/stores/complaintStore';

const complaintStore = useComplaintStore()
const showHint = ref(false)
const showUserSidebar = ref(false)
const showStorySidebar = ref(false)
const progressShow = ref(false)
const tab = ref('story')

onMounted(async () => {
    complaintStore.complaintPage = 1
    await complaintStore.getUsersComplaints()
    await complaintStore.getStoreisComplaints()

    showHint.value = true
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const showComplaintUserSidebar = async (story: any) => {
    complaintStore.selectEditComplaint = story
    showUserSidebar.value = true
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const showComplaintStorySidebar = async (story: any) => {
    complaintStore.selectEditComplaint = story
    showStorySidebar.value = true
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