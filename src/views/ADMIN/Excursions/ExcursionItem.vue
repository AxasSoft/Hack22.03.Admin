<script setup lang="ts">
import moneyMask from '@/plugins/moneyMask';
import placeholder from '@/assets/images/Placeholder.png'

defineProps({
    excursion: Object
});

const emit = defineEmits(["editExcursion", "showFeedbacks"]);
</script>

<template>
    <tr class="table-row" @click.stop="emit('editExcursion', excursion);">
        <td width="10%">
            <VImg width="80px" height="80px" class="ma-2 rounded"
                :src="excursion?.images?.length > 0 ? excursion?.images[0].link : placeholder">
            </VImg>
        </td>
        <td width="130px" class="d-flex flex-column align-center justify-center">

            <VTooltip location="bottom">
                <template v-slot:activator="{ props }">
                    <div class="d-flex mt-6 mx-auto">
                        <VIcon icon="mdi-star" style="margin-top: 3px;" size="20" color="orange" v-bind="props" />
                        <b>
                            <p style="color: orange; font-size: 17px;">{{
                                excursion?.avgRating ?
                                    excursion?.avgRating : '0.0'
                            }}</p>
                        </b>
                    </div>

                </template>
                <p class="text-center">Рейтинг</p>
            </VTooltip>
            <div v-if="excursion?.totalReviews > 0" class="d-flex mt-2 cursor-pointer"
                @click.stop="emit('showFeedbacks', excursion);">
                <b style="color: var(--main-color);"> {{ excursion?.totalReviews }} отзывов </b>
            </div>

        </td>
        <td>
            <h3>{{ excursion?.name }} </h3>
        </td>
        <td>
            {{ excursion?.description.slice(0, 150) }} {{
                excursion?.description.length
                    > 150 ? "..." : ""
            }}
        </td>
        <td>
            {{ excursion?.category?.name }}
        </td>
        <td width="100px">
            <b> {{ moneyMask(excursion?.price * 100) }} ₽</b>
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