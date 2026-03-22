<!-- eslint-disable vue/no-unused-vars -->
<template>

    <div class="pa-4 d-flex flex-column pb-12">
        <div class="mb-12">

            <!-- ADD DIALOG  -->
            <VBtn class="black-button ml-auto" style="width: 100px; left: calc(100% - 120px)"
                @click.stop="addNewDialog = true">
                Добавить
            </VBtn>
            <VDialog v-model="addNewDialog" max-width="500" persistent>
                <VCard class="pa-6">
                    <div class="d-flex">
                        <b>Новая группа</b>
                    </div>

                    <div class="d-flex mt-4 w-100">
                        <div class=" d-flex flex-column" style="width: calc(50% - 10px)">
                            <div class=" d-flex align-center">
                                <p class="text-body-2">Начало*</p>
                            </div>
                            <VTextField variant="plain" v-model="newGroupStarted" autocomplete="off"
                                class="custom-tf mt-1 pa-0" type="datetime-local" />
                        </div>
                        <div class="flex-grow-1 ml-4 pa-0">
                            <p class="text-body-2 mt-1">Окончание*</p>
                            <VTextField variant="plain" type="datetime-local" v-model="newGroupEnded" autocomplete="off"
                                class="custom-tf mt-1 pa-0" />
                        </div>
                    </div>
                    <template v-slot:actions>
                        <VBtn @click="addNewDialog = false">
                            Отмена
                        </VBtn>


                        <VBtn @click="addNewGroup">
                            Создать группу
                        </VBtn>
                    </template>
                </VCard>
            </VDialog>








            <VItemGroup class="mt-3" v-if="excursionStore.excursionsGroups?.length > 0">
                <VCard class=" my-2 mx-6 rounded-lg" v-for="(group) in excursionStore.excursionsGroups" :key="group?.id"
                    style="background-color: var(--back-color);">

                    <!-- DELETE DIALOG -->
                    <VDialog v-model="group.showDelete" max-width="400" persistent>
                        <template v-slot:activator="{ props: post }">
                            <VIcon icon="mdi-delete-outline" class="cursor-pointer" color="red"
                                style="right: 4px; top:4px; position: absolute;" v-bind="post" />
                        </template>

                        <VCard class="pa-6">
                            <div class="d-flex">
                                <VIcon icon="mdi-alert-outline" color="red" />
                                <p class="ml-2 text-red">ВНИМАНИЕ</p>
                            </div>

                            <p class="mt-4 text-body-2">Вы действиельно хотите удалить экскурсионную группу? Данные
                                будут
                                удалены без
                                возможности
                                восстановления.
                            </p>
                            <template v-slot:actions>
                                <VBtn @click="group.showDelete = false">
                                    Отмена
                                </VBtn>


                                <VBtn class="text-red" @click="deleteGroup(group)">
                                    Удалить
                                </VBtn>
                            </template>
                        </VCard>
                    </VDialog>


                    <div style="width: 100%;" class="bg-color my-2">
                        <VSheet class="pa-6" style="background-color: transparent;">
                            <div class="d-flex py-0 align-center">
                                <p class="pb-4 text-body-2">Статус</p>
                                <VSelect v-model="group.status" variant="plain" class="custom-tf input-select ml-auto"
                                    density="compact" :items="excursionStore.excursionGroupStatus" item-title='name'
                                    item-value='id' autocomplete="off" style="max-width: 290px;" />
                            </div>
                            <VDivider />

                            <div class="d-flex py-2 align-center">
                                <p class="text-body-2">Начало</p>
                                <span class="ml-auto text-body-2"><b>{{
                                    getDateFromUnix(group?.started || 0, 'datehour')
                                        }}</b></span>
                            </div>
                            <VDivider />

                            <div class="d-flex py-2 align-center">
                                <p class="text-body-2">Окончание</p>
                                <span class="text-body-2 ml-auto"><b>{{
                                    getDateFromUnix(group?.ended || 0, 'datehour')
                                        }}</b></span>
                            </div>
                            <VDivider />

                            <div class="d-flex py-2 align-center">
                                <p class="text-body-2">Максимальное кол-во человек в группе</p>
                                <span class="text-body-2 ml-auto"><b>{{ group?.maxGroupSize
                                }}</b></span>
                            </div>
                            <VDivider />

                            <div class="d-flex py-2 align-center">
                                <p class="text-body-2">Забронировано мест</p>
                                <span class="text-body-2 ml-auto"><b>{{ group?.currentMembers
                                }}</b></span>
                            </div>
                            <VDivider />

                            <div class="d-flex py-2 align-center">
                                <p class="text-body-2">Свободно мест</p>
                                <span class="text-body-2 ml-auto"><b>{{ group?.availableForBooking
                                }}</b></span>
                            </div>
                            <VDivider />

                            <div class="mt-4 w-100" v-if="group.members?.length > 0">
                                <h3 class="mx-auto">Участники</h3>
                                <VItemGroup v-for="member in group.members" :key="member?.phone" class="mt-1">
                                    <VRow>

                                        <VCol cols="12" md="5">
                                            <b style="font-size: 14px;">{{ member?.fullName }}</b>
                                        </VCol>
                                        <VCol cols="12" md="3">
                                            <b v-if="member?.isAdult" style="font-size: 14px;">взрослый</b>
                                            <b v-else style="font-size: 14px;">ребёнок</b>
                                        </VCol>
                                        <VCol cols="12" md="4" style="font-size: 14px;">
                                            <a :href="'tel:' + '+' + member?.phone" class="text-body"
                                                style="color: black;">+{{
                                                    member?.phone }}
                                            </a>
                                        </VCol>
                                    </VRow>
                                </VItemGroup>
                            </div>

                        </VSheet>
                    </div>
                    <VBtn class="black-button ml-4 mb-4" style="width: 180px; "
                        @click="changeStatus(group.id, group.status || 'available')">
                        Изменить статус
                    </VBtn>
                </VCard>
                <LoadMarker top="-1000px"
                    @load="excursionStore.excursionsGroupsPage++; excursionStore.getExcursionsGroups(excursionStore.selectEditExcursion.id)" />
            </VItemGroup>
            <p class="mt-12 text-center" v-else>Экскурсионных групп не добавлено</p>
        </div>

    </div>

</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useExcursionsStore } from '@/stores/excursionStore';
import { getDateFromUnix } from '@/plugins/unixTime';
import LoadMarker from '@/components/LoadMarker.vue';
import { useToast } from 'vue-toastification';
import type { ExcursionGroup } from '@/types/Excursion';

const toast = useToast()
const excursionStore = useExcursionsStore()
const addNewDialog = ref(false)
const newGroupStarted = ref()
const newGroupEnded = ref()
onMounted(async () => {
    await excursionStore.getExcursionsGroups(excursionStore.selectEditExcursion.id)
})


const addNewGroup = async () => {
    if (!newGroupStarted.value) {
        toast.error("Укажите начало экскурсионной группы")
        return
    }

    if (!newGroupEnded.value) {
        toast.error("Укажите начало экскурсионной группы")
        return
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await excursionStore.createExcursionGroup(newGroupStarted.value, newGroupEnded.value)
    if (response.status == 200) {
        toast.success("Группа успешно создана")
    } else {
        toast.error("Не удалось создать группу")
    }
}


const changeStatus = async (id: number, status: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await excursionStore.updateExcursionsGroupStatus(id, status)
    if (response.status == 200) {
        toast.success("Статус успешно изменён")
    } else {
        toast.error("Не удалось изменить статус")
    }
}


const deleteGroup = async (group: ExcursionGroup) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await excursionStore.deleteExcursionGroup(group.id)
    if (response.status == 200) {
        group.showDelete = false
        toast.success("Группа успешлно удалена")
    } else {
        group.showDelete = false
        toast.error("Не удалось изменить группу")
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

.delete-attr-btn {
    background-color: var(--back-color);
    border: 1px solid var(--back-color);
    width: 30px;
    min-width: 30px;
    border-radius: 50%;
    padding: 0;
    height: 30px;
    min-height: 30px;
}

.left_p {
    /* padding-left: 20px !important; */
    margin-left: 30px !important;
}

.active {
    background-color: var(--active-back-color);
    color: var(--active-color);
    padding: 2px 8px;
    border-radius: 8px;
    height: 28px;
    font-size: 14px;
}

.inactive {
    background-color: var(--alert-back-color);
    color: var(--alert-color);
    padding: 2px 8px;
    border-radius: 8px;
    height: 28px;
    font-size: 14px;
}

.upload-image {
    width: 140px;
    height: 140px;
    border-radius: 8px;
    background-color: black;
    border: 3px solid white;
}

.thumbnail_image {
    width: 140px;
    height: 140px;
    border-radius: 8px;
    background-color: black;
    border: 3px solid black;
}

.pac-container {
    z-index: 9999999 !important;
}
</style>
