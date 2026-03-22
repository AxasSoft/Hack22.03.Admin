import { defineStore } from 'pinia'
// import type { NewStore } from '@/types/NewStore'
import api from '@/stores/api'
import { ref, reactive } from 'vue'
import type { Excursion, ExcursionGroup } from '@/types/Excursion'
import type { ExcursionCategory } from '@/types/ExcursionCategory'
import { getUnixTime } from '@/plugins/unixTime'

export const useExcursionsStore = defineStore(
  'excursions',
  () => {
    const newExcursion = reactive({
      name: null,
      description: null,
      duration: null,
      tips: null,
      price: false,
      currentPrice: null,
      maxHeight: null,
      minHeight: null,
      address: '',
      latitude: null,
      longitude: null,
      routeLength: null,
      maxGroupSize: null,
      categoryId: <ExcursionCategory | null>null,
      priority: 0,
      images: <Blob[]>[],
      imagesUrls: <string[]>[]
    })

    const selectExcursion = ref()
    const selectEditExcursion = ref()
    const selectFeedbackExcursion = ref()
    const selectExcursionFeedbacks = ref()
    const selectExcursionFeedbacksPage = ref(1)

    const excursions = ref<Excursion[]>([])
    const excursionsPage = ref(1)
    const excursionsPaginator = ref()
    const excursionsGroups = ref<ExcursionGroup[]>([])
    const excursionsGroupsPage = ref(1)
    const excursionsGroupsPaginator = ref()
    const excursionsList = ref<Excursion[]>([])

    const excursionGroupStatus = ref([{id: "available" ,name: "Доступна для бронирования"},{id: "completed", name:"Группа набрана"},{ id: "finished" , name:  "Завершена"} ])


    //MARK: GET EXCURSIONS
    const getExcursions = async () => {
      try {
        const response = await api.get(`/excursions/?page=${excursionsPage.value}`)
        if (response.status == 200)
           if (excursionsPage.value == 1) {
            excursions.value = response.data.data
          } else {
            excursions.value.push(...response.data.data)
          }
          excursionsGroupsPaginator.value = response.data.meta.paginator
        return response
      } catch (error) {
        return error
      }
    }

    //MARK: GET ONE EXCURSIONS 
    const getOneExcursion = async (id: number) => {
      try {
        const response = await api.get(
          `/excursions/${id}/`,
        )
        excursions.value = response.data.data
        return response
      } catch (error) {
        return error
      }
    }

    //MARK: GET EXCURSION FEEDBACKS
    const getExcursionFeedbacks = async (id: number) => {
      try {
        const response = await api.get(
          `/excursions/${id}/reviews/`,
        )
        if (selectExcursionFeedbacksPage.value == 1) {
          selectExcursionFeedbacks.value = response.data.data
        } else {
          selectExcursionFeedbacks.value.push(...response.data.data)
        }
        return response
      } catch (error) {
        return error
      }
    }

    //MARK: DELETE EXCURSION FEEDBACK
    const deleteExcursionFeedback = async (feedbackId: number) => {
      try {
        const response = await api.delete(
          `/excursions/feedbacks/${feedbackId}/`,
        )

        selectExcursionFeedbacks.value = selectExcursionFeedbacks.value.filter(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (removedFeedback: any) => removedFeedback.id != feedbackId,
        )

        return response
      } catch (error) {
        return error
      }
    }

    //MARK: CREATE NEW EXCURSION
    const createNewExcursion = async () => {
      try {
        const response = await api.post(
          `/excursions/`,
          {
            name: newExcursion.name,
            description: newExcursion.description,
            duration: newExcursion.duration,
            tips: newExcursion.tips,
            price: newExcursion.price,
            current_price: newExcursion.currentPrice,
            max_height: newExcursion.maxHeight,
            min_height: newExcursion.minHeight,
            address: newExcursion.address,
            latitude: newExcursion.latitude,
            longitude: newExcursion.longitude,
            route_length: newExcursion.routeLength,
            max_group_size: newExcursion.maxGroupSize,
            category_id: newExcursion.categoryId?.id,
            priority: newExcursion.priority,
          },
        )
        if (response.status === 200) {
          newExcursion.name = null
          newExcursion.description = null
          newExcursion.duration = null
          newExcursion.tips = null
          newExcursion.price = false
          newExcursion.currentPrice = null
          newExcursion.maxHeight = null
          newExcursion.minHeight = null
          newExcursion.address = ''
          newExcursion.latitude = null
          newExcursion.longitude = null
          newExcursion.routeLength = null
          newExcursion.maxGroupSize = null
          newExcursion.categoryId = null
          newExcursion.priority = 0

          getExcursions()

          let imageCounter = 0
          for (const image of newExcursion.images) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const imageResponse: any = updateExcursionImage(
              response.data.data.id,
              image,
              imageCounter
            )

            if ((imageResponse.status = 200)) {
              imageCounter++
              if (imageCounter == newExcursion.imagesUrls.length) {
                newExcursion.imagesUrls = []
                newExcursion.images = []
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

    //MARK: UPDATE EXCURSION
    const updateExcursion = async (id: number) => {
      try {
        const response = await api.put(
          `/excursions/${id}/`,
          {

            name: selectEditExcursion.value.name,
            description: selectEditExcursion.value.description,
            duration: selectEditExcursion.value.duration,
            tips: selectEditExcursion.value.tips,
            price: selectEditExcursion.value.price,
            current_price: selectEditExcursion.value.currentPrice,
            max_height: selectEditExcursion.value.maxHeight,
            min_height: selectEditExcursion.value.minHeight,
            address: selectEditExcursion.value.address,
            latitude: selectEditExcursion.value.latitude,
            longitude: selectEditExcursion.value.longitude,
            route_length: selectEditExcursion.value.routeLength,
            max_group_size: selectEditExcursion.value.maxGroupSize,
            category_id: selectEditExcursion.value.category?.id,
            priority: selectEditExcursion.value.priority,
          },
        )
        if (response.status === 200) {
          getExcursions()

          let imageCounter = 0
          for (const image of selectEditExcursion.value.images) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const imageResponse: any = updateExcursionImage(
              response.data.data.id,
              image,
              imageCounter
            )

            if ((imageResponse.status = 200)) {
              imageCounter++
              if (imageCounter == selectEditExcursion.value.imagesUrls.length) {
                selectEditExcursion.value.imagesUrls = []
                selectEditExcursion.value.images = []
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


    //MARK: UPDATE EXCURSION IMAGE
    const updateExcursionImage = async (
      id: number,
      newImage: File | Blob | null,
      num: number
    ) => {
      try {
        const formData = new FormData()

        let image: Blob
        if (newImage != undefined) {
          image = newImage
          formData.append('image', image)
          formData.append('num', num.toString())
        }

        const response = await api.post(
          `/excursions/${id}/images/`,
          formData,
        )
        if (response.status === 200) {
        }

        getExcursions()

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
          `/excursions/images/${id}/`,
        )

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    //MARK: DELETE EXCURSION
    const deleteExcursion = async (id: number) => {
      try {
        const response = await api.delete(
          `/excursions/${id}/`,
        )
        if (response.status == 200) {
          if (selectExcursion?.value?.id == id) {
            selectExcursion.value = null
          }
          getExcursions()
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }


        //MARK: GET EXCURSIONS GROUPS
    const getExcursionsGroups = async (id: number) => {
        try {
        const response = await api.get(`/excursions/${id}/groups/?page=${excursionsGroupsPage.value}`)
        if (response.status == 200)
          if (excursionsGroupsPage.value == 1) {
            excursionsGroups.value = response.data.data
          } else {
            excursionsGroups.value.push(...response.data.data)
          }
        excursionsGroupsPaginator.value = response.data.meta.paginator
        return response
      } catch (error) {
        return error
      }
    }

           //MARK: CREATE EXCURSIONS GROUP 
    const createExcursionGroup = async (started: string, ended: string) => {
        try {
        const response = await api.post(`/excursions/${selectEditExcursion.value.id}/groups/`, {
          started: getUnixTime(started),
          ended: getUnixTime(ended)
        })
        if (response.status == 200)
        return response
      } catch (error) {
        return error
      }
    }

            //MARK: UPDATE EXCURSIONS GROUP STATUS
    const updateExcursionsGroupStatus = async (id: number, status: string) => {
        try {
        const response = await api.put(`/excursions/groups/${id}/status/`, {
          status: status
        })
        if (response.status == 200)
        return response
      } catch (error) {
        return error
      }
    }

        //MARK: DELETE EXCURSION GROUP
    const deleteExcursionGroup = async (id: number) => {
      try {
        const response = await api.delete(
          `/excursions/groups/${id}/`,
        )
        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }


    return {
      newExcursion,
      selectExcursion,
      selectEditExcursion,
      selectFeedbackExcursion,
      selectExcursionFeedbacks,
      selectExcursionFeedbacksPage,
      excursions,
      excursionsPage,
      excursionsPaginator,
      excursionsList,
      excursionsGroups,
      excursionsGroupsPage,
      excursionsGroupsPaginator,
      excursionGroupStatus,
      getExcursions,
      getOneExcursion,
      getExcursionFeedbacks,
      deleteExcursionFeedback,
      getExcursionsGroups,
      createNewExcursion,
      updateExcursion,
      updateExcursionImage,
      deleteImage,
      deleteExcursion,
      createExcursionGroup,
      updateExcursionsGroupStatus,
      deleteExcursionGroup
    }
  },
  // { persist: true },
)
