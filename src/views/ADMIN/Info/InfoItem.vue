<script setup lang="ts">
import { getDateFromUnix } from '@/plugins/unixTime';
import { useInfoStore } from '@/stores/infoStore';
import { onMounted, ref } from 'vue';

const infoStore = useInfoStore()
const category = ref()
onMounted(async () => {
    category.value = infoStore.infoCategories.filter(obj =>
        obj.value === props?.info?.category
    )
})
const props = defineProps({
    info: Object,
    selected: Boolean
});
const emit = defineEmits(["editInfo"]);
</script>

<template>
    <tr class="table-row" @click.stop="emit('editInfo', info);">
        <td width="180px">
            <VImg width="160px" height="80px" class="ma-2 rounded" cover :src="info?.image ? info?.image : info" />
        </td>
        <td>
            <h4>{{ info?.title }}</h4>
        </td>
        <td>
            <h4>{{ info?.body.slice(0, 150) }} {{
                info?.body.length
                    > 150 ? "..." : ""
            }}</h4>

        </td>
        <td>
            <h4 v-if="category?.length > 0">{{ category[0]?.title }}</h4>
            <h4 v-else>-</h4>
        </td>
        <td>
            <h4>{{ getDateFromUnix(info?.created, 'date') }}</h4>
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
    padding: 16px;
    min-height: 64px;
    height: 64px;
}
</style>