import { defineStore } from 'pinia'
// import type { NewStore } from '@/types/NewStore'
import api from '@/stores/api'
import { ref, reactive, computed } from 'vue'
import { useAppStore } from './appStore'
import type { Client, Order, Position } from '@/types/Order'
import type { Category } from '@/types/Info'
import type { PickupPoint } from '@/types/PickupPoint'
import type { Profile } from '@/types/Profile'

export const useOrdersStore = defineStore(
  'orders',
  () => {
    const appStore = useAppStore()
    const newOrder = reactive({
      id: null,
      created: null,
      deliveryAddress: null,
      deliveryEntrance: null,
      deliveryStage: null,
      deliveryIntercom: null,
      deliveryRoom: null,
      customerComment: null,
      pickupPoint: <PickupPoint | null>null,
      deliveryMethod: null,
      positions: <Position[] | null>null,
      status: null,
      status_date: null,
      deliveryAmount: null,
      deliveryTime: null,
      payed: null,
      payType: null,
      outId: null,
      payLink: null,
      isFire: null,
      client: <Client | null>null,
      os: null,
      ofdUrl: null,
      feedback: null,
      rate: null,
      images: [
        {
          url: '',
          file: <Blob | null>null,
          isChanged: false,
        },
      ],
      cancelComment: null,
      managerComment: null,
      customer: <Profile | null>null,
      manager: <Profile | null>null,
    })

    const orderStatus = ref([
      { id: 0, name: 'Новый' },
      { id: 1, name: 'В работе' },
      { id: 2, name: 'Собирается' },
      { id: 3, name: 'Доставляется' },
      { id: 4, name: 'Доставлен' },
      { id: 5, name: 'Завершён' },
      { id: 6, name: 'Отменён' },
      { id: 7, name: 'Отменён админом' },
    ])

    const selectOrder = ref()
    const selectEditOrder = ref()

    const orders = ref<Order[]>([])
    const specialOrders = ref<Order[]>([])
    const ordersPage = ref(1)
    const search = ref('')
    const ordersFromCategory = ref<Category | null>(null) // only for request
    const searchOrderStatus = ref() // only for request
    const startDate = ref() // only for request
    const endDate = ref() // only for request
    const onlyPromotionalOrders = ref(false) // only for request
    const onlyActiveOrders = ref<boolean | null>(null) // only for request active - true ; inactive - false
    const onlyOutOfStockOrders = ref(false) // only for request
    const ordersPaginator = ref()
    const activeOrders = ref<Order[]>([])
    const inactiveOrders = ref<Order[]>([])
    const ordersList = ref<Order[]>([])

    //MARK: FILTERS
    const filters = reactive({
      name: null,
      tab: 'all',
    })

    const ordersFiltered = computed(() => {
      let ordersList = orders.value

      if (filters.name) {
        ordersList = ordersList.filter(
          order =>
            (order.client?.name ? order.client?.name : '')
              .toLowerCase()
              .indexOf((filters.name ? filters.name : '').toLowerCase()) > -1,
        )
      } else {
        if (filters.tab == 'all') {
          ordersList = orders.value
        }
      }

      return ordersList
    })

    //MARK: GET ORDERS
    const getOrders = async () => {
      let requestUrl = `/stores/${appStore.selectApp?.id}/orders/?page=${ordersPage.value}`
      if (searchOrderStatus.value != null) {
        requestUrl = requestUrl + `&statuses=${searchOrderStatus.value}`
      }

      if (onlyPromotionalOrders.value) {
        requestUrl =
          requestUrl + `&only_promotional=${onlyPromotionalOrders.value}`
      }

      if (onlyActiveOrders.value != null) {
        requestUrl = requestUrl + `&is_active=${onlyActiveOrders.value}`
      }

      if (onlyOutOfStockOrders.value) {
        requestUrl = requestUrl + `&out_of_stock=${onlyOutOfStockOrders.value}`
      }

      if (ordersFromCategory.value) {
        requestUrl = requestUrl + `&category_id=${ordersFromCategory.value.id}`
      }

      if (startDate.value) {
        requestUrl = requestUrl + `&created_from=${startDate.value}`
      }

      if (endDate.value) {
        requestUrl = requestUrl + `&created_to=${endDate.value}`
      }

      try {
        const response = await api.get(requestUrl)
        if (response.status == 200) orders.value = response.data.data
        ordersPaginator.value = response.data.meta.paginator
        return response
      } catch (error) {
        return error
      }
    }

    //MARK: GET ONLY SPECIAL ORDERS
    const getSpecialOrders = async () => {
      try {
        const response = await api.get(
          `/stores/${appStore.selectApp?.id}/orders/?page=1&is_special=true`,
        )
        if (response.status == 200) specialOrders.value = response.data.data
        return response
      } catch (error) {
        return error
      }
    }

    //MARK: GET ORDERS COUNTER
    const getOrdersCounter = async () => {
      try {
        const response = await api.get(
          `/stores/${appStore.selectApp?.id}/orders/counter/`,
        )
        return response
      } catch (error) {
        return error
      }
    }

    //MARK: GET ONE ORDER
    const getOneOrder = async (id: number) => {
      try {
        const response = await api.get(
          `/stores/${appStore.selectApp?.id}/orders/${id}/`,
        )
        return response
      } catch (error) {
        return error
      }
    }

    //MARK: UPDATE ORDER
    const updateOrder = async (id: number) => {
      try {
        const response = await api.put(
          `/stores/${appStore.selectApp?.id}/orders/${id}/`,
          {
            status: selectEditOrder.value.status,
            manager_comment: selectEditOrder.value.managerComment,
            delivery_amount: selectEditOrder.value.deliveryAmount * 100
          },
        )
        if (response.status === 200) {
          getOrders()
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    //MARK: UPDATE ORDER STATUS
    const updateOrderStatus = async (id: number) => {
      try {
        const response = await api.put(
          `/stores/${appStore.selectApp?.id}/orders/${id}/`,
          {
            status: selectEditOrder.value.status,
          },
        )
        if (response.status === 200) {
          getOrders()
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    //MARK: UPDATE POSITION
    const updatePosition = async (id: number, status: number, qty: number) => {
      try {
        const response = await api.put(`/stores/orders/positions/${id}/`, {
          status: status,
          qty: qty,
        })
        if (response.status === 200) {
          getOrders()
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    //MARK: DELETE ORDER
    const deleteOrder = async (id: number, cancelComment: string) => {
      try {
        const response = await api.delete(
          `/stores/orders/${id}/?cancel_comment=${cancelComment}`,
        )
        if (response.status == 200) {
          if (selectOrder?.value?.id == id) {
            selectOrder.value = null
          }
          getOrders()
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    return {
      newOrder,
      orderStatus,
      selectOrder,
      selectEditOrder,
      orders,
      specialOrders,
      ordersPage,
      search,
      ordersFromCategory,
      searchOrderStatus,
      onlyPromotionalOrders,
      onlyActiveOrders,
      startDate,
      endDate,
      onlyOutOfStockOrders,
      ordersPaginator,
      activeOrders,
      inactiveOrders,
      ordersList,
      filters,
      ordersFiltered,
      getOrders,
      getSpecialOrders,
      getOrdersCounter,
      getOneOrder,
      updateOrder,
      updateOrderStatus,
      updatePosition,
      deleteOrder,
    }
  },
  // { persist: true },
)
