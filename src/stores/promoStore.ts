import { defineStore } from 'pinia'
// import type { NewStore } from '@/types/NewStore'
import api from '@/stores/api'
import { ref, reactive, computed } from 'vue'
import { useAppStore } from './appStore'
import type { Promo } from '@/types/Promo'
import type { Ad } from '@/types/Ad'
import type { Category } from '@/types/Category'
import type { Info } from '@/types/Info'

export const usePromosStore = defineStore(
  'promos',
  () => {
    const appStore = useAppStore()
    const newPromo = reactive({
      name: null,
      cover: {
        url: '',
        file: <Blob | null>null,
        isChanged: false,
      },
      startDate: <number | null>null,
      endDate: <number | null>null,
      ad: <Ad | null>null,
      info: <Info | null>null,
      category: <Category | null>null,
      isActive: true,
    })

    const selectEditPromo = ref()

    const promos = ref<Promo[]>([])
    const promosPage = ref(1)
    const search = ref('')
    const promosPaginator = ref()
    const onlyActivePromos = ref<boolean | null>()

    //MARK: FILTERS
    const filters = reactive({
      name: null,
      tab: 'all',
    })

    const promosFiltered = computed(() => {
      let promosList = promos.value

      if (filters.name) {
        promosList = promosList.filter(
          promo =>
            (promo.name ? promo.name : '')
              .toLowerCase()
              .indexOf((filters.name ? filters.name : '').toLowerCase()) > -1,
        )
      } else {
        if (filters.tab == 'all') {
          promosList = promos.value
        }
      }

      return promosList
    })

    //MARK: GET PROMOS
    const getPromos = async () => {
      try {
        const response = await api.get(`/ads/promo/all/?page=${promosPage.value}`)
        if (response.status == 200) promos.value = response.data.data
        promosPaginator.value = response.data.meta.paginator
        return response
      } catch (error) {
        return error
      }
    }

    //MARK: GET PROMOS COUNTER
    const getPromosCounter = async () => {
      try {
        const response = await api.get(
          `/stores/${appStore.selectApp?.id}/promos/counter/`,
        )
        return response
      } catch (error) {
        return error
      }
    }

    //MARK: GET ONE PROMO
    const getOnePromo = async (id: number) => {
      try {
        const response = await api.get(
          `/ads/promo/${id}/`,
        )
        return response
      } catch (error) {
        return error
      }
    }

    //MARK: CREATE NEW PROMO
    const createNewPromo = async () => {
      try {
        const response = await api.post(
          `/ads/promo/`,
          {
            order_id: newPromo.ad?.id,
            subcategory_id: newPromo.category?.id,
            info_id: newPromo.info?.id,
          },
        )
        if (response.status === 200) {
          newPromo.name = null
          newPromo.ad = null
          newPromo.category = null
          newPromo.info = null

          getPromos()

          updatePromoCover(
            response.data.data.id,
            (newPromo.cover.file =
              (response.data.data.id, newPromo.cover.file)),
          )
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    //MARK: UPDATE PROMO
    const updatePromo = async (id: number) => {
      try {
        const response = await api.put(
          `/ads/promo/${id}`,
          {
            order_id: selectEditPromo.value.ad?.id,
            subcategory_id: selectEditPromo.value.subcategory?.id,
            info_id: selectEditPromo.value.info?.id,
          },
        )
        if (response.status === 200) {

          getPromos()


          updatePromoCover(
            response.data.data.id,
            (selectEditPromo.value.cover.file =
              (response.data.data.id, selectEditPromo.value.cover.file)),
          )
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    // MARK: UPDATE PROMO COVER
    const updatePromoCover = async (id: number, file: File | Blob | null) => {
      try {
        const formData = new FormData()

        // let image: File
        if (file != undefined) {
          // image = file
          formData.append('new_cover', file)
        }

        const response = await api.post(
          `/ads/promo/${id}/cover/`,
          formData,
        )
        if (response.status === 200) {
          newPromo.cover.file = null
          newPromo.cover.url = ''
          newPromo.cover.isChanged = false
        }

        getPromos()

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    //MARK: DELETE PROMO
    const deletePromo = async (id: number) => {
      try {
        const response = await api.delete(
          `/ads/promo/${id}`,
        )
        if (response.status == 200) {
          if (selectEditPromo?.value?.id == id) {
            selectEditPromo.value = null
          }
          getPromos()
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    return {
      newPromo,
      selectEditPromo,
      promos,
      promosPage,
      search,
      promosPaginator,
      onlyActivePromos,
      filters,
      promosFiltered,
      getPromos,
      getPromosCounter,
      getOnePromo,
      createNewPromo,
      updatePromo,
      updatePromoCover,
      deletePromo,
    }
  },
  // { persist: true },
)
