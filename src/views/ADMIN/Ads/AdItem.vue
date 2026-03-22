<script setup lang="ts">
import placeholder from '@/assets/images/Placeholder.png'
import moneyMask from '@/plugins/moneyMask';
import { getDateFromUnix } from '@/plugins/unixTime';

defineProps({
    ad: Object
});

const emit = defineEmits(["editAd", "showFeedbacks"]);
</script>

<template>
    <tr class="table-row" @click.stop="emit('editAd', ad);">
        <td width="10%">
            <VImg width="80px" height="80px" class="ma-2 rounded"
                :src="ad?.images?.length > 0 ? ad?.images[0]?.link : placeholder">
            </VImg>
        </td>
        <td width="200px">{{ ad?.user?.firstName + ' ' + ad?.user?.lastName }}</td>
        <td width="200px">{{ ad?.title }}</td>
        <td>
            <h4>{{ moneyMask(ad?.profit * 100) }} ₽</h4>
        </td>
        <td>{{ ad?.category?.name }}</td>
        <td>{{ ad?.address }}</td>
        <td>{{ getDateFromUnix(ad?.created, 'date') }}</td>
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