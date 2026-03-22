import { defineStore } from 'pinia'
import api from '@/stores/api'
import { reactive, ref } from 'vue'
import { useAppStore } from './appStore'
import type { PickupPoint } from '@/types/PickupPoint'

export const usePickupPointsStore = defineStore(
  'pickupPoints',
  () => {
    const appStore = useAppStore()
    const newPickupPoint: PickupPoint = reactive({
      id: 0,
      address: null,
      entrance: null,
      stage: null,
      room: null,
      lat: null,
      lon: null,
      comment: null,
      schedule: null,
      expiring: null,
    })

    const pickupPoints = ref<PickupPoint[]>([])
    const selectEditPickupPoint = ref()
    const pickupPointsPage = ref(1)
    const pickupPointsPaginator = ref()
    const search = ref()

    //MARK: GET PICKUP POINTS
    const getPickupPoints = async () => {
      const requestUrl = `/stores/${appStore.selectApp?.id}/pickup-points/?page=${pickupPointsPage.value}`
      try {
        const response = await api.get(requestUrl)
        if (response.status == 200) pickupPoints.value = response.data.data
        pickupPointsPaginator.value = response.data.meta.paginator
        return response
      } catch (error) {
        return error
      }
    }

    //MARK: CREATE NEW PICKUP POINT
    const createNewPickupPoint = async () => {
      try {
        const response = await api.post(
          `/stores/${appStore.selectApp?.id}/pickup-points/`,
          {
            address: newPickupPoint.address,
            entrance: newPickupPoint.entrance,
            stage: newPickupPoint.stage,
            room: newPickupPoint.room,
            comment: newPickupPoint.comment,
            expiring: newPickupPoint.expiring,
            schedule: newPickupPoint.schedule,
            lat: newPickupPoint.lat,
            lon: newPickupPoint.lon,
          },
        )
        if (response.status === 200) {
          newPickupPoint.id = 0
          newPickupPoint.address = null
          newPickupPoint.stage = null
          newPickupPoint.entrance = null
          newPickupPoint.room = null
          newPickupPoint.comment = null
          newPickupPoint.schedule = null
          newPickupPoint.expiring = null
          newPickupPoint.lat = null
          newPickupPoint.lon = null

          getPickupPoints()
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    //MARK: UPDATE PICKUP POINT
    const updatePickupPoint = async () => {
      try {
        const response = await api.put(
          `/stores/${appStore.selectApp?.id}/pickup-points/${selectEditPickupPoint.value.id}/`,
          {
            address: selectEditPickupPoint.value.address,
            entrance: selectEditPickupPoint.value.entrance,
            stage: selectEditPickupPoint.value.stage,
            room: selectEditPickupPoint.value.room,
            comment: selectEditPickupPoint.value.comment,
            expiring: selectEditPickupPoint.value.expiring,
            schedule: selectEditPickupPoint.value.schedule,
            lat: selectEditPickupPoint.value.lat,
            lon: selectEditPickupPoint.value.lon,
          },
        )
        if (response.status === 200) {
          selectEditPickupPoint.value = null
          getPickupPoints()
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    //MARK: DELETE PICKUP POINT
    const deletePickupPoint = async (id: number) => {
      try {
        const response = await api.delete(
          `/stores/${appStore.selectApp?.id}/pickup-points/${id}/`,
        )
        if (response.status == 200) {
          if (selectEditPickupPoint?.value?.id == id) {
            selectEditPickupPoint.value = null
          }
          getPickupPoints()
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    return {
      newPickupPoint,
      selectEditPickupPoint,
      pickupPoints,
      pickupPointsPage,
      pickupPointsPaginator,
      search,
      getPickupPoints,
      createNewPickupPoint,
      updatePickupPoint,
      deletePickupPoint,
    }
  },
  // { persist: true },
)
