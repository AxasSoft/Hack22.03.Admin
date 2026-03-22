<template>
    <Sidebar class="sidebar w-50 pb-4" v-model:visible="show" @show="willAppear()" position="right">
        <div class="sidebar-header py-4 px-8 fixed ">
            <VBtn class="sidebar-close" @click="show = false" width="32px" height="32px">
                <VIcon icon="mdi-close" />
            </VBtn>
            <h2 class="sidebar-header-title"> Новая статья</h2>
        </div>
        <VProgressLinear v-show="progressShow" style="position: absolute; width: 100%; top: 68px; z-index: 99999;"
            color="var(--main-color)" indeterminate />
        <div class="pa-4 d-flex flex-column sidebar-content pb-12">
            <div class="mb-12" style="padding-bottom: 58px;">
                <p class="text-body-2">Заголовок*</p>
                <VTextField variant="plain" v-model="infoStore.newInfo.title" autocomplete="off"
                    class="custom-tf mt-1 pa-0" />

                <div class="d-flex align-center">
                    <span v-if="infoStore.newInfo.isHidden == false" class="active mr-auto">Активная</span>
                    <span v-else class="inactive">Скрытый</span>
                    <VTooltip location="bottom">
                        <template v-slot:activator="{ props }">
                            <VIcon class="gray-text ml-2" icon="mdi-information" size="20" v-bind="props" />
                        </template>
                        <p class="text-center">Скрытые статьи не видны пользователям</p>
                    </VTooltip>
                    <VCheckboxBtn v-model="infoStore.newInfo.isHidden" label="Скрыть статью" />

                    <VTooltip location="bottom">
                        <template v-slot:activator="{ props }">
                            <VIcon class="gray-text ml-2" icon="mdi-information" size="20" v-bind="props" />
                        </template>
                        <p class="text-center">Важная информация отображается вверху категории</p>
                    </VTooltip>
                    <VCheckboxBtn v-model="infoStore.newInfo.important" label="Важное" />
                </div>

                <p class="text-body-2 mt-5">Категория*</p>
                <VSelect v-model="infoStore.newInfo.category" variant="plain" class="custom-tf mt-1 input-select"
                    density="compact" :items="infoStore.infoCategories" autocomplete="off">
                    <template v-slot:item="{ props, item }">
                        <VListItem v-bind="props" :title="item?.raw?.title ? item.raw.title : ''" />
                    </template>
                    <template v-slot:selection="{ item }">
                        <VListItem :title="item?.raw?.title ? item.raw.title : ''" />
                    </template>
                </VSelect>


                <p class="text-body-2">Изображение статьи*</p>
                <VFileInput v-model="addedFiles" class="d-none" ref="fileInput" variant="solo" :clearable="false"
                    hide-details prepend-icon="null" flat accept="image/jpeg, image/png, image/jpg" :multiple="false" />

                <VImg md="4" height="140px" width="320px" class=" ma-1 upload-image rounded" style="max-width: 320px;"
                    @click="($refs.fileInput as HTMLInputElement)?.click()"
                    :src="(infoStore.newInfo.image.url ? infoStore.newInfo.image.url : placeholder)" cover />

                <p class="text-body-2 mt-6">Текст*</p>
                <VTextarea variant="plain" v-model="infoStore.newInfo.body" class="mt-1 pa-0 custom-textarea" />

                <p class="text-body-2">Ссылка на источник
                    <VTooltip text="Данные о том, откуда взята первоначальная информация" location="bottom">
                        <template v-slot:activator="{ props }">
                            <VIcon class="gray-text ml-2" icon="mdi-information" size="20" v-bind="props" />
                        </template>
                    </VTooltip>
                </p>
                <VTextField variant="plain" v-model="infoStore.newInfo.source" autocomplete="off"
                    class="custom-tf mt-1 pa-0" />
            </div>



            <div class="d-flex position-absolute bottom-0 py-2 bg-white w-100">
                <VBtn prepend-icon="mdi-check" class="black-button mr-4" @click="createInfo">
                    Сохранить
                </VBtn>


                <!-- DELETE DIALOG -->
                <VDialog v-model="deleteArticleDialog" max-width="400" persistent>
                    <template v-slot:activator="{ props: deleteCategoryDialog }">
                        <VBtn class="alert-button mt-auto" v-bind="deleteCategoryDialog">
                            Удалить
                        </VBtn>
                    </template>

                    <VCard class="pa-6">
                        <div class="d-flex">
                            <VIcon icon="mdi-alert-outline" color="red" />
                            <p class="ml-2 text-red">ВНИМАНИЕ</p>
                        </div>

                        <p class="mt-4 text-body-2">Вы действительно хотите удалить статью <b>{{
                            infoStore.selectEditInfo.title
                                }}</b>?
                            Если на статью ссылается баннер, он также будет удалён.
                            Все данные будут удалены без возможности восстановления.
                        </p>
                        <template v-slot:actions>
                            <VBtn @click=" deleteArticleDialog = false">
                                Отмена
                            </VBtn>


                            <VBtn class="text-red" @click="deleteArticle">
                                Удалить
                            </VBtn>
                        </template>
                    </VCard>
                </VDialog>
            </div>
        </div>

    </Sidebar>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import Sidebar from 'primevue/sidebar';
import { useToast } from 'vue-toastification';
import placeholder from "@/assets/images/Placeholder.png"
import { fromBlob } from 'image-resize-compress';
import { VImg, VTextField } from 'vuetify/components';
import { useInfoStore } from '@/stores/infoStore';

const infoStore = useInfoStore()
const toast = useToast()
const progressShow = ref(false)
const deleteArticleDialog = ref(false)

const show = defineModel<boolean>()

const willAppear = () => {
    infoStore.newInfo.body = null
    infoStore.newInfo.title = null
    infoStore.newInfo.important = false
    infoStore.newInfo.category = {
        title: "",
        value: 0
    }
    infoStore.newInfo.image.url = ''
}

const fileInput = ref<HTMLInputElement>();
const addedFiles = ref()
watch(
    () => addedFiles.value,
    async () => {
        if (addedFiles.value) {
            infoStore.newInfo.image.file = (await fromBlob(addedFiles.value, 50, 'auto', 'auto', 'jpeg'))
            infoStore.newInfo.image.url = infoStore.newInfo.image.file != undefined ? URL.createObjectURL(infoStore.newInfo.image.file) : '';
            infoStore.newInfo.image.isChanged = true
        }
    }
);

async function createInfo() {

    if (!infoStore.newInfo.title) {
        toast.error("Укажите заголовок статьи")
        return
    }

    // if (!articleStore.newInfo.cover.file) {
    //     toast.error("Добавьте изображение статьи")
    //     return
    // }

    if (!infoStore.newInfo.body) {
        toast.error("Укажите текст статьи")
        return
    }




    // UPADTE ARTICLE
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await infoStore.createNewInfo()
    if (response.status == 200) {

        progressShow.value = true
        const coverComplete = ref(false)
        if (infoStore.newInfo?.image?.isChanged) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const coverResponse: any = await infoStore.updateInfoCover(response.data.data.id, infoStore.newInfo?.image?.file)
            if (coverResponse.status == 200) {
                coverComplete.value = true
            }
        } else {
            coverComplete.value = true
        }

        if (!coverComplete.value) {
            toast.error('Не удалось добавить обложку статьи')
            progressShow.value = false
            return
        } else {
            toast.success('Статья успешно создана')
            progressShow.value = false
            show.value = false
        }


    } else {
        toast.error('Не удалось создать статью')
        progressShow.value = false
    }
}

const deleteArticle = async () => {
    progressShow.value = true
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await infoStore.deleteInfo(infoStore.selectEditInfo.id)
    if (response.status == 200) {
        toast.success('Статья успешно удалена')
        progressShow.value = false
        show.value = false
    } else {
        toast.error('Не удалось удалить статью')
        progressShow.value = true
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
    border: 3px solid white;
}

.select_image {
    border-radius: 8px;
    border: 3px solid black;
}
</style>
