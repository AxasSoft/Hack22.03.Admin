<template>

    <RestaurantSidebar v-if="restaurantStore.selectEditRestaurant" v-model="showSidebar" />
    <AddRestaurantSidebar v-model="showAddSidebar" />
    <RestaurantFeedbacksSidebar v-model="showFeedbackSidebar" />

    <VCard class="ma-5 container d-flex flex-column">
        <VProgressLinear v-show="progressShow" style="position: absolute; left: 0; width: 100%;  z-index: 99999;"
            color="var(--main-color)" indeterminate />
        <div class="header d-flex align-center justify-center v-align-center">
            <h2 class="ma-4">Рестораны</h2>

            <VBtn class="ml-auto mt-2 mr-4 mb-4 black-button" width="auto" append-icon="mdi-plus"
                @click="addRestaurant">
                Создать
            </VBtn>
        </div>


        <!-- HINT -->
        <div v-if="restaurantStore.restaurants.length <= 0 && showHint" class="hint">
            <VImg :src="hint" width="240px" height="240px" />
            <h2>Здесь пока пусто</h2>
            <p>Добавьте новый ресторан</p>
            <VBtn class="black-button mt-8" @click="addRestaurant">Создать</VBtn>
        </div>

        <!-- MARK: TABLE -->
        <div v-else>


            <VTable class="pb-12 mb-5" fixed-header style="height:calc(100vh - 224px) !important">
                <thead class="table-head">
                    <tr>
                        <td width="10%">Обложка</td>
                        <td width="130px">Инфо</td>
                        <td width="200px">Название</td>
                        <td>Описание</td>
                        <td>Адрес</td>
                        <td width="100px"> Ср. чек </td>
                    </tr>
                </thead>
                <RestaurantItem v-for="(restaurant) in restaurantStore.restaurants" :key="restaurant.id" :restaurant
                    @editRestaurant="showRestaurantSidebar($event)" @showFeedbacks="showRestaurantFeedbacks($event)" />

            </VTable>
            <div class="d-flex position-absolute bottom-0 w-100 flex-end table-head">
                <VPagination class="bg-white ml-auto table-head" v-model="restaurantStore.restaurantsPage"
                    :total-visible="7" :length="restaurantStore?.restaurantsPaginator?.total"
                    @update:modelValue=" restaurantStore.getRestaurants()" />
            </div>
        </div>
    </VCard>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import RestaurantSidebar from './RestaurantSidebar.vue';
import AddRestaurantSidebar from './AddRestaurantSidebar.vue';
import RestaurantItem from './RestaurantItem.vue';
import hint from '@/assets/images/CatalogHint@3x.png'
import { useRestaurantsStore } from '@/stores/restaurantStore';
import RestaurantFeedbacksSidebar from './RestaurantFeedbacksSidebar.vue';
import type { Restaurant } from '@/types/Restaurant';

const restaurantStore = useRestaurantsStore()

const showSidebar = ref(false)
const showAddSidebar = ref(false)
const showFeedbackSidebar = ref(false)
const progressShow = ref(false)
const showHint = ref(false)

onMounted(async () => {

    restaurantStore.restaurantsPage = 1
    await restaurantStore.getRestaurants()
    showHint.value = false
});

const addRestaurant = () => {
    showAddSidebar.value = true
}

const showRestaurantSidebar = async (restaurant: Restaurant) => {
    // restaurantStore.selectEditRestaurant = JSON.parse(JSON.stringify(restaurant)) as typeof restaurant;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await restaurantStore.getOneRestaurant(restaurant.id)
    if (response.status == 200) {
        restaurantStore.selectEditRestaurant = response.data.data
        showSidebar.value = true
    } else {
        // toast.error("Не удалось отредактировать категорию")
    }

}

const showRestaurantFeedbacks = async (restaurant: Restaurant) => {
    restaurantStore.selectFeedbackRestaurant = restaurant
    showFeedbackSidebar.value = true
}

</script>

<style scoped>
.main-container {
    background: var(--color-background-soft);
    height: 100vh;
    margin: 0;
    padding: 0;
}

.container {
    width: calc(100% - 40px);
    height: calc(100% - 40x);
    max-width: calc(100% - 40px);
}

.header {
    border-bottom: 1px solid var(--border-color);
}

.create-app-link {
    text-decoration: none;
    color: rgba(0, 0, 0, 0.627);
    margin: 5px 0;
}
</style>