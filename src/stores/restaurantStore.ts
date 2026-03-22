import { defineStore } from 'pinia'
// import type { NewStore } from '@/types/NewStore'
import api from '@/stores/api'
import { ref, reactive } from 'vue'
import type { Restaurant } from '@/types/Restaurant'

export const useRestaurantsStore = defineStore(
  'restaurants',
  () => {
    const newRestaurant = reactive({
      name: null,
      description: null,
      address: '',
      twoGisUrl: null,
      loyaltyProgram: false,
      maxPrice: null,
      minPrice: null,
      avgCheck: null,
      latitude: null,
      longitude: null,
      workHoursWeekdays: null,
      workHoursWeekends: null,
      delivery: false,
      type: "restaurant",
      priority: 0,
      images: <Blob[]>[],
      imagesUrls: <string[]>[]
    })

    const selectRestaurant = ref()
    const selectEditRestaurant = ref()
    const selectFeedbackRestaurant = ref()
    const selectRestaurantFeedbacks = ref()
    const selectRestaurantFeedbacksPage = ref(1)

    const restaurants = ref<Restaurant[]>([])
    const restaurantsPage = ref(1)
    const restaurantsPaginator = ref()
    const restaurantsList = ref<Restaurant[]>([])



    //MARK: GET RESTAURANTS
    const getRestaurants = async () => {
      try {
        const response = await api.get(`/restaurants/?page=${restaurantsPage.value}`)
        if (response.status == 200) restaurants.value = response.data.data
        restaurantsPaginator.value = response.data.meta.paginator
        return response
      } catch (error) {
        return error
      }
    }


    //MARK: GET ONE RESTAURANTS
    const getOneRestaurant = async (id: number) => {
      try {
        const response = await api.get(
          `/restaurants/${id}/`,
        )
        return response
      } catch (error) {
        return error
      }
    }

    //MARK: GET RESTAURANT FEEDBACKS
    const getRestaurantFeedbacks = async (id: number) => {
      try {
        const response = await api.get(
          `/restaurants/${id}/reviews/`,
        )
        if (selectRestaurantFeedbacksPage.value == 1) {
          selectRestaurantFeedbacks.value = response.data.data
        } else {
          selectRestaurantFeedbacks.value.push(...response.data.data)
        }
        return response
      } catch (error) {
        return error
      }
    }

    //MARK: DELETE RESTAURANT FEEDBACK
    const deleteRestaurantFeedback = async (feedbackId: number) => {
      try {
        const response = await api.delete(
          `/restaurants/feedbacks/${feedbackId}/`,
        )

        selectRestaurantFeedbacks.value = selectRestaurantFeedbacks.value.filter(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (removedFeedback: any) => removedFeedback.id != feedbackId,
        )

        return response
      } catch (error) {
        return error
      }
    }

    //MARK: CREATE NEW RESTAURANT
    const createNewRestaurant = async () => {
      try {
        const response = await api.post(
          `/restaurants/`,
          {
            name: newRestaurant.name,
            description: newRestaurant.description,
            address: newRestaurant.address,
            two_gis_url: newRestaurant.twoGisUrl,
            loyalty_program: newRestaurant.loyaltyProgram,
            max_price: newRestaurant.maxPrice,
            min_price: newRestaurant.minPrice,
            avg_check: newRestaurant.avgCheck,
            latitude: newRestaurant.latitude,
            longitude: newRestaurant.longitude,
            work_hours_weekdays: newRestaurant.workHoursWeekdays,
            work_hours_weekends: newRestaurant.workHoursWeekends,
            delivery: newRestaurant.delivery,
            type: newRestaurant.type,
            priority: newRestaurant.priority,
          },
        )
        if (response.status === 200) {
          newRestaurant.name = null
          newRestaurant.description = null
          newRestaurant.address = ''
          newRestaurant.twoGisUrl = null
          newRestaurant.loyaltyProgram = false
          newRestaurant.maxPrice = null
          newRestaurant.minPrice = null
          newRestaurant.avgCheck = null
          newRestaurant.latitude = null
          newRestaurant.longitude = null
          newRestaurant.workHoursWeekdays = null
          newRestaurant.workHoursWeekends = null
          newRestaurant.delivery = false
          newRestaurant.type = "restaurant"
          newRestaurant.priority = 0

          getRestaurants()

          let imageCounter = 0
          for (const image of newRestaurant.images) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const imageResponse: any = updateRestaurantImage(
              response.data.data.id,
              image,
            )

            if ((imageResponse.status = 200)) {
              imageCounter++
              if (imageCounter == newRestaurant.imagesUrls.length) {
                newRestaurant.imagesUrls = []
                newRestaurant.images = []
              }
            }
          }
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    //MARK: UPDATE RESTAURANT
    const updateRestaurant = async (id: number) => {
      try {
        const response = await api.put(
          `/restaurants/${id}/`,
          {
            name: selectEditRestaurant.value.name,
            description: selectEditRestaurant.value.description,
            address: selectEditRestaurant.value.address,
            two_gis_url: selectEditRestaurant.value.twoGisUrl,
            loyalty_program: selectEditRestaurant.value.loyaltyProgram,
            max_price: selectEditRestaurant.value.maxPrice,
            min_price: selectEditRestaurant.value.minPrice,
            avg_check: selectEditRestaurant.value.avgCheck,
            latitude: selectEditRestaurant.value.latitude,
            longitude: selectEditRestaurant.value.longitude,
            work_hours_weekdays: selectEditRestaurant.value.workHoursWeekdays,
            work_hours_weekends: selectEditRestaurant.value.workHoursWeekends,
            delivery: selectEditRestaurant.value.delivery,
            type: selectEditRestaurant.value.type,
            priority: selectEditRestaurant.value.priority,
          },
        )
        if (response.status === 200) {
          getRestaurants()

          let imageCounter = 0
          for (const image of selectEditRestaurant.value.images) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const imageResponse: any = updateRestaurantImage(
              response.data.data.id,
              image,
            )

            if ((imageResponse.status = 200)) {
              imageCounter++
              if (imageCounter == selectEditRestaurant.value.imagesUrls.length) {
                selectEditRestaurant.value.imagesUrls = []
                selectEditRestaurant.value.images = []
              }
            }
          }
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }


    //MARK: UPDATE RESTAURANT IMAGE
    const updateRestaurantImage = async (
      id: number,
      newImage: File | Blob | null,
    ) => {
      try {
        const formData = new FormData()

        let image: Blob
        if (newImage != undefined) {
          image = newImage
          formData.append('image', image)
        }

        const response = await api.post(
          `/restaurants/${id}/images/`,
          formData,
        )
        if (response.status === 200) {
        }

        getRestaurants()

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    //MARK: DELETE IMAGE
    const deleteImage = async (id: number) => {
      try {
        const response = await api.delete(
          `/restaurants/images/${id}/`,
        )

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    //MARK: DELETE RESTAURANT
    const deleteRestaurant = async (id: number) => {
      try {
        const response = await api.delete(
          `/restaurants/${id}/`,
        )
        if (response.status == 200) {
          if (selectRestaurant?.value?.id == id) {
            selectRestaurant.value = null
          }
          getRestaurants()
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    return {
      newRestaurant,
      selectRestaurant,
      selectEditRestaurant,
      selectFeedbackRestaurant,
      selectRestaurantFeedbacks,
      selectRestaurantFeedbacksPage,
      restaurants,
      restaurantsPage,
      restaurantsPaginator,
      restaurantsList,
      getRestaurants,
      getOneRestaurant,
      getRestaurantFeedbacks,
      deleteRestaurantFeedback,
      createNewRestaurant,
      updateRestaurant,
      updateRestaurantImage,
      deleteImage,
      deleteRestaurant,
    }
  },
  // { persist: true },
)
