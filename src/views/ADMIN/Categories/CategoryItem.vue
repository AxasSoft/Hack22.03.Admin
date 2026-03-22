<script setup lang="ts">
import { ref } from 'vue';

defineProps({
    category: Object
});

const emit = defineEmits(["editCategory"]);

const isExpanded = ref(false)
</script>

<template>
    <!-- <tr class="table-row" @click="handleEdit"> -->
    <tr>
        <td colspan="7" class="px-0">
            <VTable>
                <tbody>
                    <tr class="table-row" @click.stop="emit('editCategory', category);"
                        :class="{ subtr: category?.parentId }">
                        <td>
                            <h3>{{ category?.name }} </h3>
                        </td>
                        <!-- <td width="15%"> {{ category?.banner }}</td> -->
                        <td width="15%">
                            <div v-if="category?.subcategories?.length > 0">
                                <b>{{ category?.subcategories?.length }}</b><span class="ml-2 px-2 py-1 rounded-xl"
                                    style="background-color: var(--back-color); cursor: pointer; border: 2px solid white;"
                                    @click.stop="isExpanded = !isExpanded">
                                    <span v-if="!isExpanded">Показать</span>
                                    <span v-else>Скрыть</span>
                                    <VIcon :icon="(isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down')" />
                                </span>
                            </div>
                            <span v-else> - </span>

                        </td>
                    </tr>

                    <template v-if="(category!.subcategories?.length == 0 ? false : isExpanded)">
                        <tr>
                            <td colspan="7" class="pa-0 pl-8">
                                <VTable class="h-100 w-100 pb-10">
                                    <thead class="table-subhead">
                                        <tr>
                                            <td width="60px"></td>
                                            <td>Название</td>
                                            <!-- <td width="15%">Баннер</td> -->
                                            <td width="15%">Подкатегории
                                            </td>
                                        </tr>
                                    </thead>
                                    <CategoryItem v-for="(category) in category?.subcategories" :key="category.id"
                                        :category style="background-color: var(--back-color);"
                                        @editCategory="emit('editCategory', $event);" />
                                </VTable>
                            </td>
                        </tr>
                    </template>
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