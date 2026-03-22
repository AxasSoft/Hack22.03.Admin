<template>

    <EventSidebar v-if="eventStore.selectEditEvent" v-model="showSidebar" />
    <AddEventSidebar v-model="showAddSidebar" />
    <EventFeedbacksSidebar v-model="showFeedbackSidebar" />

    <VCard class="ma-5 container d-flex flex-column">
        <VProgressLinear v-show="progressShow" style="position: absolute; left: 0; width: 100%;  z-index: 99999;"
            color="var(--main-color)" indeterminate />
        <div class="header d-flex align-center justify-center v-align-center">
            <h2 class="ma-4">Мероприятия</h2>

            <VBtn class="ml-auto mt-2 mr-4 mb-4 black-button" width="auto" append-icon="mdi-plus" @click="addEvent">
                Создать
            </VBtn>
        </div>


        <!-- HINT -->
        <div v-if="eventStore.events.length <= 0 && showHint" class="hint">
            <VImg :src="hint" width="240px" height="240px" />
            <h2>Здесь пока пусто</h2>
            <p>Добавьте новое мероприятие</p>
            <VBtn class="black-button mt-8" @click="addEvent">Создать</VBtn>
        </div>

        <!-- MARK: TABLE -->
        <div v-else>


            <VTable class="pb-12 mb-5" fixed-header style="height:calc(100vh - 224px) !important">
                <thead class="table-head">
                    <tr>
                        <td width="10%">Обложка</td>
                        <td width="130px">Инфо</td>
                        <td width="200px">Название</td>
                        <td>Место проведения</td>
                        <td>Начало</td>
                        <td>Окончание</td>
                        <td>Кол-во участников</td>
                        <td>Стоимость</td>
                        <td width="100px"> Тип </td>
                    </tr>
                </thead>
                <EventItem v-for="(event) in eventStore.events" :key="event.id" :event
                    @editEvent="showEventSidebar($event)" @showFeedbacks="showEventFeedbacks($event)" />

            </VTable>
            <div class="d-flex position-absolute bottom-0 w-100 flex-end table-head">
                <VPagination class="bg-white ml-auto table-head" v-model="eventStore.eventsPage" :total-visible="7"
                    :length="eventStore?.eventsPaginator?.total" @update:modelValue=" eventStore.getEvents()" />
            </div>
        </div>
    </VCard>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import EventSidebar from './EventSidebar.vue';
import AddEventSidebar from './AddEventSidebar.vue';
import EventItem from './EventItem.vue';
import hint from '@/assets/images/CatalogHint@3x.png'
import { useEventsStore } from '@/stores/eventStore';
import EventFeedbacksSidebar from './EventFeedbacksSidebar.vue';
import type { Event } from '@/types/Event';

const eventStore = useEventsStore()

const showSidebar = ref(false)
const showAddSidebar = ref(false)
const showFeedbackSidebar = ref(false)
const progressShow = ref(false)
const showHint = ref(false)

onMounted(async () => {

    eventStore.eventsPage = 1
    await eventStore.getEvents()
    showHint.value = false
});

const addEvent = () => {
    showAddSidebar.value = true
}

const showEventSidebar = async (event: Event) => {
    eventStore.selectEditEvent = event
    showSidebar.value = true
}

const showEventFeedbacks = async (event: Event) => {
    eventStore.selectFeedbackEvent = event
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