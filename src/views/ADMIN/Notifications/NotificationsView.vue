<template>

    <AddNotificationSidebar v-model="showAddSidebar" />

    <VCard class="ma-5 container d-flex flex-column">
        <VProgressLinear v-show="progressShow" style="position: absolute; left: 0; width: 100%;  z-index: 99999;"
            color="var(--main-color)" indeterminate />
        <div class="header d-flex align-center justify-center v-align-center">
            <h2 class="ma-4">Рассылки уведомлений</h2>
            <VBtn class="ml-auto mt-5 mr-4 mb-7 black-button" width="auto" append-icon="mdi-plus"
                @click="addNotification">
                Создать
            </VBtn>
        </div>


        <!-- HINT -->
        <div v-if="notificationsStore.notifications.length <= 0 && showHint" class="hint">
            <VImg :src="hint" width="240px" height="240px" />
            <h2>Здесь пока пусто</h2>
            <p>Добавьте новую рассылку</p>
            <VBtn class="black-button mt-8" @click="addNotification">Создать</VBtn>
        </div>

        <!-- MARK: TABLE -->
        <div v-else>


            <VTable class="pb-12 mb-5" fixed-header style="height:calc(100vh - 224px) !important">
                <thead class="table-head">
                    <tr>
                        <td>Заголовок</td>
                        <td>Текст</td>
                        <td>Создан</td>
                        <!-- <td>Успешно доставлено</td>
                        <td>Не доставлено</td> -->
                    </tr>
                </thead>
                <NotificationItem v-for="(notification) in notificationsStore.notifications" :key="notification.id"
                    :notification />

            </VTable>
            <div class="d-flex position-absolute align-center bottom-0 w-100 flex-end table-head">

                <VPagination class="bg-white ml-auto table-head" v-model="notificationsStore.notificationsPage"
                    :total-visible="7" :length="notificationsStore?.notificationsPaginator?.total"
                    @update:modelValue=" notificationsStore.getNotifications()" />
            </div>
        </div>
    </VCard>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AddNotificationSidebar from './AddNotificationSidebar.vue';
import NotificationItem from './NotificationItem.vue';
import hint from '@/assets/images/CatalogHint@3x.png'
import { useAppStore } from '@/stores/appStore';
import { useToast } from 'vue-toastification';
import { useNotificationsStore } from '@/stores/notificationStore';

const notificationsStore = useNotificationsStore()
// const attributesStore = useAttributesStore()
const appStore = useAppStore()
const toast = useToast()
const showHint = ref(false)
const showAddSidebar = ref(false)
const progressShow = ref(false)


onMounted(async () => {
    notificationsStore.notificationsPage = 1
    await notificationsStore.getNotifications()

    showHint.value = true
});

const addNotification = () => {
    if (appStore.selectApp?.id) {
        showAddSidebar.value = true
    } else {
        toast.error('Для создания рассылки выберите существующий магазин или создайте новый')
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