<template>

    <AudioSidebar v-if="audioStore.selectEditAudio" v-model="showSidebar" />
    <AddAudioSidebar v-model="showAddSidebar" />
    <AudioFeedbacksSidebar v-model="showFeedbackSidebar" />

    <VCard class="ma-5 container d-flex flex-column">
        <VProgressLinear v-show="progressShow" style="position: absolute; left: 0; width: 100%;  z-index: 99999;"
            color="var(--main-color)" indeterminate />
        <div class="header d-flex align-center justify-center v-align-center">
            <h2 class="ma-4">Аудио-гид</h2>

            <VBtn class="ml-auto mt-2 mr-4 mb-4 black-button" width="auto" append-icon="mdi-plus" @click="addAudio">
                Создать
            </VBtn>
        </div>


        <!-- HINT -->
        <div v-if="audioStore.audios.length <= 0 && showHint" class="hint">
            <VImg :src="hint" width="240px" height="240px" />
            <h2>Здесь пока пусто</h2>
            <p>Добавьте новое мероприятие</p>
            <VBtn class="black-button mt-8" @click="addAudio">Создать</VBtn>
        </div>

        <!-- MARK: TABLE -->
        <div v-else>


            <VTable class="pb-12 mb-5" fixed-header style="height:calc(100vh - 224px) !important">
                <thead class="table-head">
                    <tr>
                        <td width="10%">Обложка</td>
                        <td>Аудио</td>
                        <td width="200px">Название</td>
                        <td width="300px">Описание</td>
                        <td width="150px">Создано</td>
                    </tr>
                </thead>
                <AudioItem v-for="(audio) in audioStore.audios" :key="audio.id" :audio
                    @editAudio="showAudioSidebar($event)" />

            </VTable>
            <div class="d-flex position-absolute bottom-0 w-100 flex-end table-head">
                <VPagination class="bg-white ml-auto table-head" v-model="audioStore.audiosPage" :total-visible="7"
                    :length="audioStore?.audiosPaginator?.total" @update:modelValue=" audioStore.getAudios()" />
            </div>
        </div>
    </VCard>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AudioSidebar from './AudioSidebar.vue';
import AddAudioSidebar from './AddAudioSidebar.vue';
import AudioItem from './AudioItem.vue';
import hint from '@/assets/images/CatalogHint@3x.png'
import { useAudiosStore } from '@/stores/audioStore';
import AudioFeedbacksSidebar from './AudioFeedbacksSidebar.vue';
import type { Audio } from '@/types/Audio';

const audioStore = useAudiosStore()

const showSidebar = ref(false)
const showAddSidebar = ref(false)
const showFeedbackSidebar = ref(false)
const progressShow = ref(false)
const showHint = ref(false)

onMounted(async () => {

    audioStore.audiosPage = 1
    await audioStore.getAudios()
    showHint.value = false
});

const addAudio = () => {
    showAddSidebar.value = true
}

const showAudioSidebar = async (audio: Audio) => {
    audioStore.selectEditAudio = JSON.parse(JSON.stringify(audio)) as typeof audio;
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