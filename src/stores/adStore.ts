import { defineStore } from 'pinia'
// import type { NewStore } from '@/types/NewStore'
import api from '@/stores/api'
import { ref, reactive } from 'vue'
import type { Ad } from '@/types/Ad'
import { getUnixTime } from '@/plugins/unixTime'
import clientApi from './clientApi'

export const useAdsStore = defineStore(
  'ads',
  () => {
    const newAd = reactive({
      title: null,
      body: null,
      address: '',
      deadline: null,
      profit: null,
      lat: null,
      lon: null,
      type: null,
      category: null,
      isAutoRecreate: false,
      subcategoryId: null,
      images: <Blob[]>[],
      imagesUrls: <string[]>[]
    })

    const selectAd = ref()
    const selectEditAd = ref()
    const selectFeedbackAd = ref()
    const selectAdFeedbacks = ref()
    const selectAdFeedbacksPage = ref(1)

    const ads = ref<Ad[]>([])
    const adsPage = ref(1)
    const adsPaginator = ref()
    const adsList = ref<Ad[]>([])



    //MARK: GET ADS
    const getAds = async () => {
      try {
        const response = await api.get(`/ads/?page=${adsPage.value}`)
        if (response.status == 200) ads.value = response.data.data
        adsPaginator.value = response.data.meta.paginator
        return response
      } catch (error) {
        return error
      }
    }

    //MARK: GET ONE ADS
    const getOneAd = async (id: number) => {
      try {
        const response = await api.get(
          `/ads/${id}/`,
        )
        return response
      } catch (error) {
        return error
      }
    }

    //MARK: GET AD FEEDBACKS
    const getAdFeedbacks = async (id: number) => {
      try {
        const response = await api.get(
          `/ads/${id}/reviews/`,
        )
        if (selectAdFeedbacksPage.value == 1) {
          selectAdFeedbacks.value = response.data.data
        } else {
          selectAdFeedbacks.value.push(...response.data.data)
        }
        return response
      } catch (error) {
        return error
      }
    }

    //MARK: DELETE AD FEEDBACK
    const deleteAdFeedback = async (feedbackId: number) => {
      try {
        const response = await api.delete(
          `/ads/feedbacks/${feedbackId}/`,
        )

        selectAdFeedbacks.value = selectAdFeedbacks.value.filter(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (removedFeedback: any) => removedFeedback.id != feedbackId,
        )

        return response
      } catch (error) {
        return error
      }
    }

    //MARK: CREATE NEW AD
    const createNewAd = async () => {
      try {
        console.log(newAd)
        const response = await clientApi.post(
          `/ads/`,
          {
            title: newAd.title,
            body: newAd.body,
            address: newAd.address,
            deadline: getUnixTime(newAd.deadline),
            profit: newAd.profit,
            lat: newAd.lat,
            lon: newAd.lon,
            type: newAd.type,
            is_auto_recreate: newAd.isAutoRecreate,
            subcategory_id: newAd.subcategoryId
          },
        )
        if (response.status === 200) {
          newAd.title = null
          newAd.body = null
          newAd.address = ''
          newAd.deadline = null
          newAd.profit = null
          newAd.lat = null
          newAd.lon = null
          newAd.type = null
          newAd.isAutoRecreate = false
          newAd.subcategoryId = null

          getAds()

          let imageCounter = 0
          for (const image of newAd.images) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const imageResponse: any = updateAdImage(
              response.data.data.id,
              image,
              imageCounter
            )

            if ((imageResponse.status = 200)) {
              imageCounter++
              if (imageCounter == newAd.imagesUrls.length) {
                newAd.imagesUrls = []
                newAd.images = []
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

    //MARK: UPDATE AD
    const updateAd = async (id: number) => {
      try {
        const response = await clientApi.put(
          `/ads/${id}/`,
          {
            title: selectEditAd.value.title,
            body: selectEditAd.value.body,
            address: selectEditAd.value.address,
            deadline: getUnixTime(selectEditAd.value.deadline),
            profit: selectEditAd.value.profit,
            lat: selectEditAd.value.lat,
            lon: selectEditAd.value.lon,
            type: selectEditAd.value.type,
            is_auto_recreate: selectEditAd.value.isAutoRecreate,
            subcategory_id: selectEditAd.value.subcategory.id
          },
        )
        if (response.status === 200) {
          getAds()

          let imageCounter = 0
          for (const image of selectEditAd.value.images) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const imageResponse: any = updateAdImage(
              response.data.data.id,
              image,
              imageCounter
            )

            if ((imageResponse.status = 200)) {
              imageCounter++
              if (imageCounter == selectEditAd.value.imagesUrls.length) {
                selectEditAd.value.imagesUrls = []
                selectEditAd.value.images = []
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


    //MARK: UPDATE AD IMAGE
    const updateAdImage = async (
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
          `/ads/${id}/images/`,
          formData,
        )
        if (response.status === 200) {
        }

        getAds()

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
          `/ads/images/${id}/`,
        )

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    //MARK: DELETE AD
    const deleteAd = async (id: number) => {
      try {
        const response = await api.delete(
          `/ads/${id}/`,
        )
        if (response.status == 200) {
          if (selectAd?.value?.id == id) {
            selectAd.value = null
          }
          getAds()
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    return {
      newAd,
      selectAd,
      selectEditAd,
      selectFeedbackAd,
      selectAdFeedbacks,
      selectAdFeedbacksPage,
      ads,
      adsPage,
      adsPaginator,
      adsList,
      getAds,
      getOneAd,
      getAdFeedbacks,
      deleteAdFeedback,
      createNewAd,
      updateAd,
      updateAdImage,
      deleteImage,
      deleteAd,
    }
  },
  // { persist: true },
)
