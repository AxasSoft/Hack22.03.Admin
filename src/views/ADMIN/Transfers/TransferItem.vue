<script setup lang="ts">
import { getDateFromUnix } from '@/plugins/unixTime';

defineProps({
    transfer: Object
});
const emit = defineEmits(["editTransfer"]);
</script>

<template>
    <tr class="table-row" @click.stop="emit('editTransfer', transfer);">

        <td>
            <h4>{{ transfer?.firstName + " " + transfer?.lastName }}</h4>
        </td>
        <td> <a :href="'tel:' + transfer?.tel" class="text-body" style="color: black;">+{{ transfer?.tel }} </a></td>
        <td>
            <h4>{{ getDateFromUnix(transfer?.created, 'date') }}</h4>
        </td>
        <td>
            <h4 v-if="transfer?.type == 'economy'">Эконом</h4>
            <h4 v-else-if="transfer?.type == 'comfort'">Эконом</h4>
            <h4 v-else-if="transfer?.type == 'business'">Бизнес</h4>
            <h4 v-else-if="transfer?.type == 'vip'">VIP</h4>
            <h4 v-else-if="transfer?.type == 'minivan'">Минивэн</h4>
        </td>

        <td>{{ transfer?.passengersQuantity }}</td>
        <td>
            <h4 v-if="transfer?.childSeat">Детское кресло<br /></h4>
            <h4 v-if="transfer?.animal">Перевоз животных<br /></h4>
            <h4 v-if="transfer?.skiSupplies">Перевоз горнолыжного инвентаря</h4>
        </td>
        <td>{{ transfer?.comment }}</td>

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