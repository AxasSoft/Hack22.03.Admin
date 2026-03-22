<script setup lang="ts">
import { getDateFromUnix } from '@/plugins/unixTime';

defineProps({
    snowmobile: Object
});
const emit = defineEmits(["editSnowmobile"]);
</script>

<template>
    <tr class="table-row" @click.stop="emit('editSnowmobile', snowmobile);">

        <td>
            <h4>{{ snowmobile?.firstName + " " + snowmobile?.lastName }}</h4>
        </td>
        <td> <a :href="'tel:' + snowmobile?.tel" class="text-body" style="color: black;">+{{ snowmobile?.tel }} </a>
        </td>
        <td>
            <h4>{{ getDateFromUnix(snowmobile?.created, 'date') }}</h4>
        </td>
        <td>
            <h4>{{ getDateFromUnix(snowmobile?.started, 'date') }}</h4>
        </td>
        <td>
            <h4>{{ getDateFromUnix(snowmobile?.ended, 'date') }}</h4>
        </td>
        <td>{{ snowmobile?.snowmobileQuantity }}</td>
        <td>{{ snowmobile?.comment }}</td>

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