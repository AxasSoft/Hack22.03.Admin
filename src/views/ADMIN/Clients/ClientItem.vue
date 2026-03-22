<script setup lang="ts">
import placeholder from '@/assets/images/Placeholder.png'

defineProps({
    client: Object
});

const emit = defineEmits(["editClient"]);
</script>

<template>
    <tr class="table-row" @click.stop="emit('editClient', client);">
        <td width="10%">
            <VImg width="60px" height="60px" class="ma-2 rounded-circle" cover
                :src="client?.avatar ? client?.avatar : placeholder" />
        </td>
        <td>
            <b><span v-if="client?.lastName">{{ client?.lastName }}</span><span v-if="client?.firstName">{{ ' ' +
                client?.firstName }}</span></b>
        </td>
        <td>
            <a :href="'tel:' + client?.tel" class="text-body" style="color: black;">{{ client?.tel }} </a>
        </td>
        <td>
            <a :href="'email:' + client?.email" class="text-body" style="color: black;">{{ client?.email }} </a>
        </td>
        <td>
            <p>{{ client?.location }} </p>
        </td>
        <td>
            <p>{{ client?.lastVisitedHuman
                }}</p>
        </td>
        <td width="160px">
            <span>{{ client?.category?.name }}</span>
        </td>
        <td width="160px">
            <span v-if="client?.isActive == true" class="active">Активный</span>
            <span v-else class="inactive">Заблокирован</span>
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