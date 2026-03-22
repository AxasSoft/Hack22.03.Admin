import { defineStore } from 'pinia'
import api from '@/stores/api'
import { ref } from 'vue'
import { useAppStore } from './appStore'
import type { Coupon } from '@/types/Coupon'
import clientApi from './clientApi'

export const useCouponStore = defineStore(
  'coupons',
  () => {
    const appStore = useAppStore()
    const newCoupon = ref({
      name: null,
      money: <number | null>null,
      percent: null,
      start: <number | null>null,
      stop: <number | null>null,
    })

    const coupons = ref<Coupon[]>([])
    const selectEditCoupon = ref<Coupon>()
    const couponsPage = ref(1)
    const couponsPaginator = ref()
    const onlyActiveCoupons = ref<boolean | null>()
    const search = ref()
    const selectToDelete = ref<number[]>([])

    //MARK: GET COUPONS
    const getCoupons = async () => {
      let requestUrl = `/stores/${appStore.selectApp?.id}/coupon/?page=${couponsPage.value}`
      if (onlyActiveCoupons.value != null) {
        requestUrl += `&used=${onlyActiveCoupons.value}`
      }
      try {
        const response = await api.get(requestUrl)
        if (response.status == 200) coupons.value = response.data.data
        couponsPaginator.value = response.data.meta.paginator
        return response
      } catch (error) {
        return error
      }
    }

    //MARK: GET COUPONS COUNTER
    const getCouponsCounter = async () => {
      try {
        const response = await api.get(
          `/stores/${appStore.selectApp?.id}/coupon/counter/`,
        )
        return response
      } catch (error) {
        return error
      }
    }

    //MARK: GET ONE COUPON
    const getOneCoupon = async (id: number) => {
      try {
        const response = await api.get(
          `/stores/${appStore.selectApp?.id}/coupon/${id}/`,
        )
        return response
      } catch (error) {
        return error
      }
    }

    //MARK: GET COUPON BY NAME
    const getCouponByName = async (name: string) => {
      try {
        const response = await clientApi.get(
          `/stores/${appStore.selectApp?.id}/coupon/?name=${name}`,
        )
        return response
      } catch (error) {
        return error
      }
    }

    //MARK: CREATE NEW DATE COUPON
    const createNewDateCoupon = async () => {
      try {
        const response = await api.post(
          `/stores/${appStore.selectApp?.id}/coupon/date/`,
          {
            percent: newCoupon.value.percent,
            money: newCoupon.value.money,
            name: newCoupon.value.name,
            start: newCoupon.value.start,
            stop: newCoupon.value.stop,
          },
        )
        if (response.status === 200) {
          newCoupon.value.name = null
          newCoupon.value.percent = null
          newCoupon.value.money = null
          newCoupon.value.start = null
          newCoupon.value.stop = null

          getCoupons()
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    //MARK: CREATE NEW ONE OFF COUPON
    const createNewOneOffCoupon = async () => {
      console.log(newCoupon)
      try {
        const response = await api.post(
          `/stores/${appStore.selectApp?.id}/coupon/oneoff/`,
          {
            percent: newCoupon.value.percent,
            money: newCoupon.value.money,
          },
        )
        if (response.status === 200) {
          newCoupon.value.name = null
          newCoupon.value.percent = null
          newCoupon.value.money = null
          newCoupon.value.start = null
          newCoupon.value.stop = null

          getCoupons()
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    //MARK: DELETE COUPON
    const deleteCoupon = async (ids: number[]) => {
      let requestUrl = `/stores/${appStore.selectApp?.id}/coupon/?`
      for (const id of ids) {
        requestUrl = requestUrl + `ids=${id}&`
      }
      try {
        const response = await api.delete(requestUrl)
        if (response.status == 200) {
          getCoupons()
          selectToDelete.value = []
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    return {
      newCoupon,
      coupons,
      selectEditCoupon,
      couponsPage,
      couponsPaginator,
      onlyActiveCoupons,
      search,
      selectToDelete,
      getCoupons,
      getCouponsCounter,
      getOneCoupon,
      getCouponByName,
      createNewDateCoupon,
      createNewOneOffCoupon,
      deleteCoupon,
    }
  },
  // { persist: true },
)
