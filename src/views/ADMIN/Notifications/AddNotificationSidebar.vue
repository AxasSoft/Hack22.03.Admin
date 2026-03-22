<template>
    <Sidebar class="sidebar w-50 pb-4" v-model:visible="show" @show="willAppear" position="right">
        <div class="sidebar-header py-4 px-8 fixed ">
            <VBtn class="sidebar-close" @click="show = false" width="32px" height="32px">
                <VIcon icon="mdi-close" />
            </VBtn>
            <h2 class="sidebar-header-title"> Новая рассылка</h2>
        </div>
        <VProgressLinear v-show="progressShow" style="position: absolute; width: 100%; top: 68px; z-index: 99999;"
            color="var(--main-color)" indeterminate />

        <div class="pa-4 d-flex flex-column sidebar-content pb-12">
            <div class="mb-12" style="padding-bottom: 58px;">
                <div class="d-flex flex-column mt-2">
                    <div class="w-100">
                        <p class="text-body-2 mt-1">Заголовок*</p>
                        <VTextField variant="plain" v-model="title" autocomplete="off" class="custom-tf mt-1 pa-0" />
                    </div>
                    <div class="w-100">
                        <p class="text-body-2 mt-1">Текст*</p>
                        <VTextField variant="plain" v-model="body" autocomplete="off" class="custom-tf mt-1 pa-0" />
                    </div>
                </div>



                <div class="d-flex position-absolute bottom-0 py-2 bg-white w-100">
                    <VBtn prepend-icon="mdi-check" class="black-button" @click="createNotification">
                        Сохранить
                    </VBtn>

                </div>

            </div>
        </div>

    </Sidebar>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Sidebar from 'primevue/sidebar';
import { useToast } from 'vue-toastification';
import { useNotificationsStore } from '@/stores/notificationStore';


const notificationStore = useNotificationsStore()
const toast = useToast()
const title = ref()
const body = ref()
const progressShow = ref(false)
const show = defineModel<boolean>()
const type = ref('category')
const linkId = ref()


const willAppear = () => {
    linkId.value = null
    title.value = null
    body.value = null
}



async function createNotification() {

    if (!title.value) {
        toast.error('Укажите заголовок рассылки')
        return
    }

    if (!body.value) {
        toast.error('Укажите текст рассылки')
        return
    }


    progressShow.value = true

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await notificationStore.createNewNotification(title.value, body.value, type.value, linkId.value)
    if (response.status == 200) {
        progressShow.value = false
        toast.success("Рассылка успешно создана")
        show.value = false
    } else {
        progressShow.value = false
        toast.error("Не удалось создать рассылку")
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

.product-image {
    border-radius: 8px;
    border: 2px solid white;
}

.select_image {
    border-radius: 8px;
    border: 2px solid black;
}
</style>
