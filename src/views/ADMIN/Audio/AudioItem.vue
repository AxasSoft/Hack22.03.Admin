<script setup lang="ts">
import placeholder from '@/assets/images/Placeholder.png'
import { getDateFromUnix } from '@/plugins/unixTime';

defineProps({
    audio: Object
});

const emit = defineEmits(["editAudio", "showFeedbacks"]);
</script>

<template>
    <tr class="table-row" @click.stop="emit('editAudio', audio);">
        <td width="10%">
            <VImg width="80px" height="80px" class="ma-2 rounded" :src="audio?.image ? audio?.image : placeholder">
            </VImg>
        </td>
        <td class="d-flex flex-column align-center justify-center">
            <audio controls :src="audio?.audio ? audio?.audio.link : null" class="w-100 mt-6"></audio>
        </td>
        <td>
            <h4>{{ audio?.title }} </h4>
        </td>
        <td>
            <h4>{{ audio?.description.slice(0, 150) }} {{
                audio?.description.length
                    > 150 ? "..." : ""
            }}</h4>
        </td>
        <td>
            {{ getDateFromUnix(audio?.created, 'datehour') }}
        </td>
    </tr>

</template>



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
}

.header {
    border-bottom: 1px solid #00000016;
}

.black-button {
    text-transform: none;
}

.table-subhead {
    /* background-color: var(--back-color); */
    color: var(--light-gray-text);
    font-weight: 500;
    border-bottom: 1px solid #00000016;
}


.active {
    background-color: var(--active-back-color);
    color: var(--active-color);
    padding: 4px 8px;
    border-radius: 8px;
}


.inactive {
    background-color: var(--alert-back-color);
    color: var(--alert-color);
    padding: 4px 8px;
    border-radius: 8px;
}

.table-row:hover {
    background-color: var(--back-color-50);
}

td {
    padding: 0 16px;
}
</style>