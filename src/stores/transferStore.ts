import { defineStore } from 'pinia'
// import type { NewStore } from '@/types/NewStore'
import api from '@/stores/api'
import { ref, reactive } from 'vue'
import type { Transfer } from '@/types/Transfer'

export const useTransferStore = defineStore(
  'transfer',
  () => {
    const newTransfer = reactive({
      id: 0,
      title: null,
      body: null,
      category: {
        title: "",
        value: 0,
      },
      important: false,
      isHidden: false,
      source: null,
      image: {
        url: '',
        file: <Blob | null>null,
        isChanged: false,
      },
    })

    const transfers = ref<Transfer[]>([])
    const selectEditTransfer = ref()
    const transferPage = ref(1)
    const transferPaginator = ref()

    //MARK: GET TRANSFER
    const getTransfers = async () => {
      const requestUrl = `/transfers/?page=${transferPage.value}`
      try {
        const response = await api.get(requestUrl)
        if (response.status == 200) transfers.value = response.data.data
        transferPaginator.value = response.data.meta.paginator
        return response
      } catch (error) {
        return error
      }
    }

    return {
      newTransfer,
      selectEditTransfer,
      transfers,
      transferPage,
      transferPaginator,
      getTransfers,
    }
  },
  // { persist: true },
)
