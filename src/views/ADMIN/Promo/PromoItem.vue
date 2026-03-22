<script setup lang="ts">
import placeholder from '@/assets/images/Placeholder.png'
import { getDateFromUnix } from '@/plugins/unixTime';
import { onMounted } from 'vue';

const props = defineProps({
    promo: Object
});

onMounted(async () => {
    console.log(props.promo);

})

const emit = defineEmits(["editPromo"]);
</script>

<template>
    <tr class="table-row" @click.stop="emit('editPromo', promo);">
        <td width="180px">
            <VImg width="160px" height="80px" class="ma-2 rounded" cover
                :src="promo?.cover ? promo?.cover : placeholder" />
        </td>
        <td width="220px">

            <div v-if="promo?.order">
                <span class="text-body-2" style="color: var(--gray-text)">Объявление:</span><br />
                <h4><b>{{ promo?.order?.title }}</b></h4>

            </div>

            <div v-if="promo?.subcategory">
                <span class="text-body-2" style="color: var(--gray-text)">Категория:</span><br />
                <h4><b>{{ promo?.subcategory?.name }}</b></h4>
            </div>


            <div v-if="promo?.info">
                <span class="text-body-2" style="color: var(--gray-text)">Статья:</span><br />
                <h4><b>{{ promo?.info?.title }}</b></h4>
            </div>


        </td>
        <td width="160px">
            <p>{{ getDateFromUnix(promo?.created ? promo?.created : '', 'date') }}</p>
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