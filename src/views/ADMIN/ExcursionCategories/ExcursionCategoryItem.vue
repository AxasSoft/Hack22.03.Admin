<script setup lang="ts">
defineProps({
    category: Object
});

const emit = defineEmits(["editCategory"]);

</script>

<template>
    <tr>
        <td colspan="7" class="px-0">
            <VTable>
                <tbody>
                    <tr class="table-row" @click.stop="emit('editCategory', category);"
                        :class="{ subtr: category?.parentId }">
                        <td width="10%">
                            <VImg width="80px" height="80px" class="ma-2 rounded" :src="category?.backgroundImage" />
                        </td>
                        <td width="300px">
                            <h3>{{ category?.name }} </h3>
                        </td>
                        <td><b>{{ category?.description }}</b></td>
                    </tr>
                </tbody>
            </VTable>
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

.subtr {
    background-color: var(--back-color);
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
</style>