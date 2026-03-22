<script setup lang="ts">
import placeholder from '@/assets/images/Placeholder.png'
import { getDateFromUnix } from '@/plugins/unixTime';

defineProps({
    event: Object
});

const emit = defineEmits(["editEvent", "showFeedbacks"]);
</script>

<template>
    <tr class="table-row" @click.stop="emit('editEvent', event);">
        <td width="10%">
            <VImg width="80px" height="80px" class="ma-2 rounded"
                :src="event?.images?.length > 0 ? event?.images[0]?.link : placeholder">
            </VImg>
        </td>
        <td width="130px" class="d-flex flex-column align-center justify-center">

            <VTooltip location="bottom">
                <template v-slot:activator="{ props }">
                    <div class="d-flex mt-6 mx-auto">
                        <VIcon icon="mdi-star" style="margin-top: 3px;" size="20" color="orange" v-bind="props" />
                        <b>
                            <p style="color: orange; font-size: 17px;">{{
                                event?.rating ?
                                    event?.rating : '0.0'
                            }}</p>
                        </b>
                    </div>

                </template>
                <p class="text-center">Рейтинг</p>
            </VTooltip>
            <div v-if="event?.totalReviews > 0" class="d-flex mt-2 cursor-pointer"
                @click.stop="emit('showFeedbacks', event);">
                <b style="color: var(--main-color);"> {{ event?.totalReviews }} отзывов </b>
            </div>

        </td>
        <td>
            <h3>{{ event?.name }} </h3>
        </td>
        <td>
            {{ event?.place }}
        </td>
        <td>
            {{ getDateFromUnix(event?.started, 'datehour') }}
        </td>
        <td>
            {{ getDateFromUnix(event?.ended, 'datehour') }}
        </td>
        <td width="100px">
            <b> {{ event?.members ? event?.members?.length : 0 }} / {{ event?.maxEventMembers }}</b>
        </td>
        <td width="100px">
            <b v-if="event?.price"> {{ event?.price }} ₽</b>
            <b v-else> Бесплатно </b>
        </td>
        <td width="160px">
            <span v-if="event?.isOpen == true" class="active">Открытое</span>
            <span v-else class="inactive">Закрытое</span>
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