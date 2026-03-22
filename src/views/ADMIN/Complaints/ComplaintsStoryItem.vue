<script setup lang="ts">
import { getDateFromUnix } from '@/plugins/unixTime';
import { useComplaintStore } from '@/stores/complaintStore';
import { onMounted, ref } from 'vue';

const complaintStore = useComplaintStore()
const category = ref()
onMounted(async () => {
    category.value = complaintStore.complaintCategories.filter(obj =>
        obj.value === props?.complaint?.reason
    )
    console.log(category)
})
const props = defineProps({
    complaint: Object,
    selected: Boolean
});
const emit = defineEmits(["editComplaint"]);
</script>

<template>
    <tr class="table-row" @click.stop="emit('editComplaint', complaint);">
        <td>
            <h4>{{ complaint?.subject?.firstName + " " + complaint?.subject?.lastName }}</h4>
        </td>
        <td>
            <h4>{{ complaint?.object?.user?.firstName + " " + complaint?.object?.user?.lastName }}</h4>
        </td>
        <td>
            <h4 v-if="category?.length > 0">{{ category[0]?.title }}</h4>
            <h4 v-else>-</h4>
        </td>
        <td>
            <h4>{{ complaint?.additionalText }}</h4>
        </td>
        <td>
            <h4>{{ getDateFromUnix(complaint?.created, 'date') }}</h4>
        </td>
        <td>
            <span v-if="complaint?.isSatisfy == null" class="new">Новая</span>
            <span v-else-if="complaint?.isSatisfy == true" class="active">Принята</span>
            <span v-else class="inactive">Отклонена</span>
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


.new {
    background-color: rgb(238, 238, 238);
    color: black;
    padding: 4px 8px;
    border-radius: 8px;
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